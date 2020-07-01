<template>
    <div>
        <div style="text-align: center">
            <el-input v-model.trim="input" placeholder="请输入内容" class="search-input" clearable></el-input>
            <el-button type="primary" class="search-button" @click="onSearch">搜索</el-button>
        </div>
        <el-container style="margin-top: 20px; border-top: 2px solid #DCDFE6">
            <el-aside width="200px" style="padding: 0;">
                <el-menu>
                    <el-menu-item v-for="(item, index) in commodityClass" :key="index" :index="index + ''"
                        @click="onFilterByClass(index)" :class="index === classIndex?'is-active':''">
                        <el-image class="class-icon" :src="item.url"/>
                        <span>{{item.name}}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <el-tabs v-model="activeTab" type="border-card" style="margin-top: 10px" @tab-click="onChangeTab">
                        <el-tab-pane label="综合排序" name="default">
                            <i class="el-icon-shopping-cart-full" style="color: #ff441a"/>
                            <span style="font-size: 14px; margin-left: 15px; ">欢迎来到跳蚤市场！</span>
                        </el-tab-pane>
                        <el-tab-pane label="按价格排序" name="price">
                            <el-radio-group v-model="priceOrder" @change="onClickRadio">
                                <el-radio label="1">由低到高</el-radio>
                                <el-radio label="2">由高到低</el-radio>
                            </el-radio-group>
                        </el-tab-pane>
<!--                        <el-tab-pane label="按时间排序">-->
<!--                            <el-radio v-model="timeOrder" label="1">显示最新</el-radio>-->
<!--                            <el-radio v-model="timeOrder" label="2">显示最早</el-radio>-->
<!--                        </el-tab-pane>-->
                    </el-tabs>
                </el-header>
                <el-main style="text-align: left; margin-top: 30px">
                    <el-row style="margin-bottom: 20px" :gutter="20"  v-loading="loading">
                        <el-col :span="4" v-for="(commodity, index) in commodityList" :key="commodity.id">
                            <div style="margin-top: 10px">
                                <el-card style="padding: 0" shadow="hover" body-style="cursor: pointer"
                                    @click.native="getCommodityInfo(index)">
                                    <el-image class="commodity-image" :src="'http://market.yuxinzhao.top:9000' + commodity.image"/>
                                    <div class="price-number">
                                        <span>¥{{commodity.price}}</span>
                                    </div>
                                    <div class="price-name">
                                        <span>{{commodity.name}}</span>
                                    </div>
                                    <div class="commodity-owner">
                                        <span>{{commodity.owner}}</span>
                                    </div>
                                </el-card>
                            </div>
                        </el-col>
                    </el-row>
                    <el-pagination
                            background
                            layout="prev, pager, next"
                            :total=commodityTotalNum
                            :page-size="commodityPageNum"
                            @current-change="page">
                    </el-pagination>
                </el-main>
            </el-container>
        </el-container>
        <!-- 显示商品具体信息及购买的对话框 -->
        <el-dialog title="商品信息" :visible.sync="commodityInfoVisible" width="40%" v-loading="loadingBuy">
            <el-row type="flex" justify="space-between">
                <el-col :span="11">
                    <el-image class="commodity-info-image" :src="'http://market.yuxinzhao.top:9000' + commodityChosen.image"/>
                </el-col>
                <el-col :span="11">
                    <div class="commodity-info-name">
                        <span>{{commodityChosen.name}}</span>
                    </div>
                    <div class="commodity-info-price">
                        <span>¥{{commodityChosen.price}}</span>
                    </div>
                    <div style="margin-top: 10px">
                        <span style="font-size: 12px; color: #909399">卖家: </span>
                        <span style="font-size: 14px; color: black">{{commodityChosen.owner}}</span>
                    </div>
                    <div style="margin-top: 10px">
                        <span style="font-size: 12px; color: #909399">商品描述: </span>
                        <span>{{commodityChosen.desc}}</span>
                    </div>
                    <el-button type="primary" style="width: 120px; margin-top: 50px" @click="buy(commodityChosen.id)">购买</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
    import Common from "../components/Common";

    export default {
        name: "Market",
        data() {
            return {
                input: "",
                commodityList: [
                    {
                        owner: "YUXIN",
                        name: "COM_E",
                        image: require('../assets/fleamarket-1.png'),
                        desc: "A good Commodity",
                        price: 30,
                        state: 1,
                        id: 3,
                        type: 1
                    }
                ],
                commodityClass: Common.commodityClass,
                // 1 表示价格由低到高
                priceOrder: '1',
                // 1 表示显示最新
                timeOrder: '1',
                classIndex: '',
                commodityTotalNum: 0,
                commodityPageNum: 50,
                activeTab: 'default',
                commodityInfoVisible: false,
                commodityChosen: '',
                loading: false,
                loadingBuy: false
            }
        },
        methods: {
            onFilterByClass(index) {
                this.classIndex = index;
                this.getCommodityList(0)
            },
            onSearch() {
                this.getCommodityList(0);
            },
            page(currentPage) {
                this.getCommodityList(currentPage - 1);
            },
            onChangeTab(tab) {
                this.activeTab = tab.name;
                this.getCommodityList(0);
            },
            onClickRadio(radio) {
                this.priceOrder = radio;
                this.getCommodityList(0);
            },
            getCommodityList(pageId) {
                const _this = this;
                let url = '';
                let form = new FormData();
                if (this.classIndex || this.classIndex === 0) {
                    form.append('commodity_type', this.classIndex + 1);
                }
                if (this.input) {
                    // 进行商品搜索
                    url = '/commodity/search/';
                    form.append('keywords', this.input);
                } else {
                    // 不进行搜索
                    url = '/commodity/market/';
                }
                if (this.activeTab === 'price') {
                    url += 'price/';
                    form.append('reverse', this.priceOrder - 1 + '');
                }
                form.append('page_max_items', this.commodityPageNum);
                form.append('page_id', pageId + '');
                // 发起请求
                this.loading = true;
                axios.post(url, form).then(function (response) {
                    _this.commodityList = response.data.commodity_list;
                    _this.commodityTotalNum = response.data.page_num * _this.commodityPageNum;
                    _this.loading = false;
                }).catch(function (error) {
                    _this.$message.error(error);
                    _this.loading = false;
                })
            },
            getCommodityInfo(id) {
                this.commodityChosen = this.commodityList[id];
                this.commodityInfoVisible = true;
            },
            buy(id) {
                let user_id = this.$cookies.get('account');
                if (user_id) {
                    const _this = this;
                    // 存在账户
                    this.$prompt('请输入备注', '备注', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({value}) => {
                        let form = new FormData();
                        form.append('user_id', user_id);
                        form.append('commodity_id', id);
                        form.append('transaction_desc', value);
                        this.loadingBuy = true;
                        axios.post('/commodity/buy/', form).then(function (response) {
                            if (response.data.code === 0) {
                                _this.$message({showClose: true, message: '购买成功'
                                    , type: 'success'});
                                _this.loadingBuy = false;
                            } else {
                                _this.error(response.data.code);
                                _this.loadingBuy = false;
                            }
                        })
                    })
                } else {
                    // 不存在显示对话框提示登录
                    this.$message.error('请先登录！')
                }
            },
            error(code) {
                if (code === -1) {
                    this.$message.error('用户状态错误');
                } else if (code === -2) {
                    this.$message.error('商品状态错误');
                } else if (code === -3) {
                    this.$message.error('余额不足');
                } else if (code === -4) {
                    this.$message.error('商品状态变更失败');
                } else if (code === -5) {
                    this.$message.error('交易无法成交');
                } else {
                    this.$message.error('位置错误');
                }
            }
        },
        created() {
            const _this = this;
            this.classIndex = this.$route.params.classIndex;
            this.input = this.$route.params.searchInput;
            this.loading = true;
            let url = 'commodity/market/';
            let form = new FormData();

            if (this.classIndex) {
                form.append('commodity_type', this.classIndex);
            }
            if (this.input) {
                url = '/commodity/search/';
                form.append('keywords', this.input)
            }
            form.append('page_max_items', this.commodityPageNum);
            form.append('page_id', 0);
            axios.post(url, form).then(function (response) {
                _this.commodityList = response.data.commodity_list;
                _this.commodityTotalNum = response.data.page_num * _this.commodityPageNum;
                _this.loading = false;
            }).catch(function (error) {
                _this.$message.error(error);
                _this.loading = false;
            })
        }
    }
</script>

<style scoped>
    .search-input {
        margin-top: 20px;
        width: 550px;
    }
    .search-button {
        width: 100px;
        margin-left: 10px;
    }
    .commodity-image {
        height: 180px;
    }
    .price-number {
        color: #ff441a;
        text-align:left;
        padding-top: 14px;
        font-size: 20px;
        font-weight: 700;
    }
    .price-name {
        color: black;
        text-align: left;
        padding-top: 5px;
        font-size: 13px;
    }
    .commodity-owner {
        color: #909399;
        text-align: left;
        margin-top: 13px;
        font-size: 13px;
        text-decoration: underline;
    }
    .class-icon {
        width: 30px;
        height: 30px;
    }
    .commodity-info-image {
        width: 250px;
        height: 250px;
    }
    .commodity-info-name {
        font-size: 16px;
        font-weight: 700;
        margin-top: 10px;
    }
    .commodity-info-price {
        font-size: 20px;
        color: #ff441a;
        font-weight: 700;
        margin-top: 10px;
    }
</style>
