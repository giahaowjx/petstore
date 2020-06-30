<template>
    <div>
        <el-container style="margin-top: 20px;padding: 0">
            <el-aside width="200px">
                <el-menu style="height: 100%" @select="selectNav" default-active="1">
                    <el-menu-item index="1">
                        <i class="el-icon-s-finance"/>
                        <span>待仲裁记录</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <div class="arbitration-title">
                    <span>{{title}}</span>
                </div>
                <el-row type="flex" justify="center">
                    <el-col :span="22">
                        <el-table v-loading="loading" :data="transactionInfo" stripe border
                                  style="width: 100%; margin-top: 20px">
                            <el-table-column prop="id" label="交易ID" width="120">
                            </el-table-column>
                            <el-table-column prop="commodity_id" label="商品ID" width="120">
                            </el-table-column>
                            <el-table-column prop="user_id_sell" label="卖方用户">
                            </el-table-column>
                            <el-table-column prop="user_id_buy" label="买方用户"/>
                            <el-table-column prop="desc" label="交易描述"/>
                            <el-table-column prop="price" label="价格"/>
                            <el-table-column prop="state" label="交易状态">
                                <template slot-scope="scope">
                                    <el-tag :type="tabType[scope.row.state + 2]" disable-transitions>{{tabText[scope.row.state + 2]}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" plain size="small"
                                               @click="manage(1, scope.row.id)">同意</el-button>
                                    <el-button type="danger" plain size="small"
                                               @click="manage(0, scope.row.id)">拒绝</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <div style="text-align: center; margin-top: 15px">
                    <el-pagination background layout="prev, pager, next" :total=transactionTotalNum
                                   :page-size="pageSize" @current-change="changePage">
                    </el-pagination>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "ArbitrationAdmin",
        data() {
            return {
                transactionInfo: [
                    {
                        id: '',
                        commodity_id: '',
                        user_id_sell: '',
                        user_id_buy: '',
                        desc: '',
                        price: '',
                        state: ''
                    }
                ],
                title: '处理仲裁申请',
                pageSize: 50,
                transactionTotalNum: 0,
                // 因为-1不要显示，全部+2
                tabType: {2: '', 3: 'info', 1: 'success', 0: 'danger'},
                tabText: {2: '正在仲裁', 3: '交易已完成', 1: '仲裁成功', 0: '仲裁失败'},
                loading: false
            }
        },
        created() {
            const _this = this;
            let form = new FormData();
            form.append('page_max_items', this.pageSize);
            form.append('page_id', 0);

            this.loading = true;

            axios.post('/arbitration/list/', form).then(function (response) {
                _this.transactionInfo = response.data.transaction_list;
                _this.loading = false;
            })
        },
        methods: {
            changePage(index) {
                this.getTransactionList(this.url[this.currentURLIndex], index - 1);
            },
            getTransactionList(pageNo) {
                const _this = this;
                let form = new FormData();
                form.append('page_max_items', this.pageSize);
                form.append('page_id', pageNo);

                this.loading = true;

                axios.post('/arbitration/list/', form).then(function (response) {
                    _this.transactionInfo = response.data.transaction_list;
                    _this.loading = false;
                }).catch(function (error) {
                    this.$message.error(error)
                    _this.loading = false;
                })
            },
            manage(valid, id) {
                const _this = this;
                let form = new FormData();
                form.append('transaction_id', id);
                form.append('arbitration_valid', valid);
                this.loading = true;

                axios.post('/arbitration/deal/', form).then(function (response) {
                    let code = response.data.code;
                    if (code === 0) {
                        _this.$message({showClose: true, message: '处理成功'
                            , type: 'success'});
                        _this.loading = false;
                        window.location.reload();
                    } else {
                        _this.$message.error('处理失败')
                    }
                    _this.loading = false;
                })
            }
        }
    }
</script>

<style scoped>
    .arbitration-title {
        font-size: 22px;
        text-align: center;
        font-weight: 700;
    }
</style>
