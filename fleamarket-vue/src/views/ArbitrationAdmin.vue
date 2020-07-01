<template>
    <div>
        <el-container style="margin-top: 20px;padding: 0">
            <el-aside width="200px">
                <el-menu style="height: 100%" default-active="1">
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
                            <el-table-column prop="id" label="交易ID" width="80">
                            </el-table-column>
                            <el-table-column prop="commodity_id" label="商品ID" width="80">
                            </el-table-column>
                            <el-table-column prop="user_id_sell" label="卖方用户">
                            </el-table-column>
                            <el-table-column prop="user_id_buy" label="买方用户"/>
                            <el-table-column prop="desc" label="交易描述"/>
                            <el-table-column prop="price" label="价格" width="120"/>
                            <el-table-column prop="reason" label="仲裁理由"/>
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
                        state: '',
                        reason: ''
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
                let transactionList = response.data.transaction_list;
                var index;
                for (index in transactionList) {
                    transactionList[index].reason = '无理由';
                }
                _this.transactionInfo = transactionList;
                _this.getReason();
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
                    let transactionList = response.data.transaction_list;
                    var index;
                    for (index in transactionList) {
                        transactionList[index].reason = '...';
                    }
                    _this.transactionInfo = transactionList;
                    _this.loading = false;
                    _this.getReason();
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
            },
            getReason() {
                var item;
                const _this = this;

                for (item in this.transactionInfo) {
                    let form = new FormData();
                    form.append('transaction_id', this.transactionInfo[item].id);
                    this.loading = true;

                    axios.post('/arbitration/reason/', form).then(function (response) {
                        if (response.data.code === 0) {
                            _this.transactionInfo[item].reason = response.data.arbitration_reason;

                        } else {
                            _this.transactionInfo[item].reason = '无理由';
                        }
                        _this.loading = false;
                    })
                }
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
