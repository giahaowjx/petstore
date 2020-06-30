<template>
    <div>
        <el-container>
            <el-header>
                <el-button type="primary" @click="addCommodity">新增商品</el-button>
            </el-header>
            <el-main>
                <el-table v-loading="loading" :data="commodityList" stripe border style="width: 100%; margin-top: 20px">
                    <el-table-column prop="id" label="商品" width="180">
                    </el-table-column>
                    <el-table-column prop="owner" label="所有者" width="180">
                    </el-table-column>
                    <el-table-column prop="name" label="商品名称">
                    </el-table-column>
                    <el-table-column prop="desc" label="商品描述"/>
                    <el-table-column prop="price" label="商品价格"/>
                    <el-table-column prop="type" label="商品类型">
                        <template slot-scope="typescope">
                            <el-image v-if="typescope.row.type !== -1" class="class-icon" :src="commodityClass[typescope.row.type - 1].url"/>
                            <span v-if="typescope.row.type !== -1" style="margin-left: 10px">{{commodityClass[typescope.row.type - 1].name}}</span>
                            <span v-if="typescope.row.type === -1" style="margin-left: 10px">未定</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" plain size="small" :disabled="scope.row.state === -1"
                                       @click="editCommodity(scope.row.id, scope.row.owner, scope.row.state)">
                                <span v-if="scope.row.state === 0">上架</span>
                                <span v-if="scope.row.state === 1">下架</span>
                                <span v-if="scope.row.state === -1">已删除</span>
                            </el-button>
                            <el-button type="danger" plain size="small" v-if="scope.row.state !== -1"
                                       @click="deleteCommodity(scope.row.id, scope.row.owner)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="text-align: center; margin-top: 15px">
                    <el-pagination
                            background
                            layout="prev, pager, next"
                            :total=pageTotal
                            :page-size="pageSize"
                            @current-change="pageChange">
                    </el-pagination>
                </div>

                <el-dialog title="上架商品" :visible.sync="commodityUpVisible" v-loading="loadingDialog" width="50%">
                    <el-form :model="currentCommodity">
                        <el-form-item label="商品价格" :label-width="formLabelWidth">
                            <el-input v-model="currentCommodity.price" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="商品类型" :label-width="formLabelWidth">
                            <el-select v-model="currentCommodity.type" placeholder="请选择商品类型">
                                <el-option v-for="(item, index) in commodityClass" :label="item.name" :value="index + 1"
                                           :key="index + 1"></el-option>
                                <el-option label="其他" value="-1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="commodityUpVisible = false">取 消</el-button>
                        <el-button type="primary" @click="upCommodity">确 定</el-button>
                    </div>
                </el-dialog>

                <el-dialog title="新增商品" :visible.sync="commodityAddVisible" v-loading="loadingAddDialog">
                    <el-form :model="currentCommodity">
                        <el-form-item label="商品名称" :label-width="formLabelWidth">
                            <el-input v-model="currentCommodity.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="商品描述" :label-width="formLabelWidth">
                            <el-input v-model="currentCommodity.desc" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="商品图片" :label-width="formLabelWidth">
                            <el-upload class="upload-demo" drag action="/" :multiple="false"
                                       :http-request="selectImg">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="commodityAddVisible = false">取 消</el-button>
                        <el-button type="primary" @click="uploadCommodityInfo">确 定</el-button>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import Common from "../components/Common";

    export default {
        name: "CommodityManage",
        data() {
            return {
                commodityList: [
                    {
                        owner: "YUXIN",
                        name: "COM_E",
                        image: "https://example.com/e.jpg",
                        desc: "A good Commodity",
                        price: 30,
                        state: 1,
                        id: 3,
                        type: 1
                    }
                ],
                currentCommodity: {
                    id: '',
                    owner: '',
                    name: '',
                    image: '',
                    desc: '',
                    price: '',
                    state: 0,
                    type: 1
                },
                commodityClass: Common.commodityClass,
                commodityUpVisible: false,
                loadingDialog: false,
                loading: false,
                formLabelWidth: '120px',
                pageSize: 50,
                pageTotal: 0,
                commodityAddVisible: false,
                loadingAddDialog: false,
                pageNo: 0
            }
        },
        methods: {
            addCommodity() {
                this.commodityAddVisible = true;
                this.currentCommodity = {
                    id: '',
                    owner: this.$cookies.get('account'),
                    name: '',
                    image: '',
                    desc: '',
                    price: '',
                    state: '',
                    type: ''
                };

            },
            deleteCommodity(id, owner) {
                if (this.$cookies.get('account') === owner) {
                    this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let form = new FormData();
                        form.append('user_id', owner);
                        form.append('commodity_id', id);
                        const _this = this;

                        axios.post('/commodity/delete/', form).then(function (response) {
                            if (response.data.code === 0) {
                                _this.$message({showClose: true, message: '删除成功'
                                    , type: 'success'});
                                _this.getCommodity()
                            } else {
                                _this.$message.error('删除失败！');
                            }
                        }).catch(function (error) {
                            _this.$message.error('删除失败！');
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.$message.error('账户状态异常！');
                }
            },
            editCommodity(id, owner, state) {
                if (this.$cookies.get('account') === owner) {
                    const _this = this;
                    if (state === 1) {
                        // 需要下架
                        this.$confirm('此操作将下架商品, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            let form = new FormData();
                            form.append('user_id', owner);
                            form.append('commodity_id', id);
                            axios.post('/commodity/down/', form).then(function (response) {
                                if (response.data.code === 0) {
                                    _this.$message({showClose: true, message: '下架成功'
                                        , type: 'success'});
                                    _this.getCommodity()
                                }
                            })
                        }).catch(() => {
                            _this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        });
                    } else if (state === 0) {
                        // 需要上架
                        this.commodityUpVisible = true;
                        this.loadingDialog = true;
                        let form = new FormData();
                        form.append('commodity_id', id);

                        axios.post('/commodity/info/', form).then(function (response) {
                            if (response.data.code === 0) {
                                _this.loadingDialog = false;
                                _this.currentCommodity = response.data.commodity;
                            } else {
                                _this.loadingDialog = false;
                                _this.$message.error('获取商品信息失败！');
                                _this.commodityInfoVisible = false;
                            }
                        }).catch(function (error) {
                            _this.loadingDialog = false;
                            _this.$message.error('获取商品信息失败！');
                            _this.commodityInfoVisible = false;
                        })
                    }
                } else {
                    this.$message.error('账户状态异常！');
                }
            },
            upCommodity() {
                const _this = this;
                let form = new FormData();
                form.append('user_id', this.currentCommodity.owner);
                form.append('commodity_id', this.currentCommodity.id);
                form.append('price', this.currentCommodity.price);
                form.append('commodity_type', this.currentCommodity.type);

                this.loadingDialog = true;
                axios.post('/commodity/up/', form).then(function (response) {
                    _this.loadingDialog = false;
                    if (response.data.code === 0) {
                        _this.$message({showClose: true, message: '上架成功'
                            , type: 'success'});
                        _this.commodityUpVisible = false;
                        _this.getCommodity()
                    } else {
                        _this.$message.error('上架失败！');
                        _this.commodityUpVisible = false;
                    }
                }).catch(function (error) {
                    _this.$message.error('上架失败！');
                    _this.commodityUpVisible = false;
                })
            },
            pageChange(index) {
                this.pageNo = index - 1;
                this.getCommodity();
            },
            getCommodity() {
                if (this.$cookies.get('account')) {
                    const _this = this;
                    let form = new FormData();
                    form.append('user_id', this.$cookies.get('account'));
                    form.append('page_max_items', this.pageSize);
                    form.append('page_id', this.pageNo);
                    this.loading = true;

                    axios.post('/user/commodity/', form).then(function (response) {
                        _this.commodityList = response.data.commodity_list;
                        _this.pageTotal = response.data.page_num * _this.pageSize;
                        _this.loading = false;
                    }).catch(function (error) {
                        _this.loading = false;
                    })
                }
            },
            selectImg(file) {
                this.currentCommodity.image = file.file;
            },
            uploadCommodityInfo() {
                const _this = this;

                let form = new FormData();
                form.append('user_id', this.currentCommodity.owner);
                form.append('commodity_name', this.currentCommodity.name);
                form.append('commodity_desc', this.currentCommodity.desc);
                form.append('commodity_image', this.currentCommodity.image);

                this.loadingAddDialog = true;
                axios.post('/commodity/create/', form).then(function (response) {
                    if (response.data.code === 0) {
                        _this.$message({showClose: true, message: '新增商品成功'
                            , type: 'success'});
                        _this.commodityAddVisible = false;
                        _this.getCommodity()
                    } else {
                        _this.$message.error('创建失败！')
                        _this.commodityAddVisible = false;
                    }
                    _this.loadingAddDialog = false;
                }).catch(function (error) {
                    _this.$message.error('创建失败！')
                    _this.commodityAddVisible = false;
                    _this.loadingAddDialog = false;
                })
            }
        },
        created() {
            const _this = this;
            let form = new FormData();
            form.append('user_id', this.$cookies.get('account'));
            form.append('page_max_items', this.pageSize);
            form.append('page_id', 0);
            this.loading = true;
            axios.post('/user/commodity/', form).then(function (response) {
                _this.commodityList = response.data.commodity_list;
                console.log(_this.commodityList)
                _this.pageTotal = response.data.page_num * _this.pageSize;
                _this.loading = false;
            }).catch(function (error) {
                _this.loading = false;
            })
        },
    }
</script>

<style scoped>
    .class-icon {
        height: 30px;
        width: 30px;
    }
</style>
