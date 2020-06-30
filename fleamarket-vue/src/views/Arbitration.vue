<template>
    <div>
        <el-container style="margin-top: 20px;padding: 0">
            <el-aside width="200px">
                <el-menu style="height: 100%" @select="selectNav" default-active="1">
                    <el-menu-item index="1">
                        <i class="el-icon-s-finance"/>
                        <span>购买记录</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <i class="el-icon-s-shop"/>
                        <span>卖出记录</span>
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
                            <el-table-column prop="id" label="交易ID" width="180">
                            </el-table-column>
                            <el-table-column prop="commodity_id" label="商品ID" width="180">
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
                                    <el-button type="primary" plain size="small" @click="apply(scope.row.id, scope.row.user_id_buy)">申请仲裁</el-button>
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
        name: "Arbitration",
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
                title: '申请仲裁',
                pageSize: 50,
                transactionTotalNum: 0,
                transactionInfoVisible: false,
                url: ['/user/transaction/buy/', '/user/transaction/sell/'],
                currentURLIndex: 1,
                // 因为-1不要显示，全部+2
                tabType: {2: '', 3: 'info', 1: 'success', 0: 'danger'},
                tabText: {2: '正在仲裁', 3: '交易已完成', 1: '仲裁成功', 0: '仲裁失败'},
                loading: false
            }
        },
        created() {
            let account = this.$cookies.get('account');
            if (account) {
                const _this = this;
                let form = new FormData();
                form.append('user_id', account)
                form.append('page_max_items', this.pageSize);
                form.append('page_id', 0);

                this.loading = true;

                axios.post('/user/transaction/buy/', form).then(function (response) {
                    _this.transactionInfo = response.data.transaction_list;
                    _this.loading = false;
                })
            } else {
                this.$message.error('请先登录！')
            }
        },
        methods: {
            apply(id, user_id) {
                if (this.$cookies.get('account')) {
                    this.$prompt('请输入申请原因', '申请仲裁', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        const _this = this;
                        // 发起仲裁请求
                        let form = new FormData();
                        form.append('user_id', user_id);
                        form.append('transaction_id', id);
                        form.append('arbitration_reason', value);
                        this.loading = true;
                        axios.post('/arbitration/initiate/', form).then(function (response) {
                            let code = response.data.code;
                            if (code === 0) {
                                _this.$message({showClose: true, message: '申请成功'
                                    , type: 'success'});
                                window.location.reload();
                            } else if (code === -1) {
                                _this.$message.error('用户状态错误');
                            } else if (code === -2) {
                                _this.$message.error('此交易不存在');
                            } else if (code === -3) {
                                _this.$message.error('无法改变状态');
                            } else if (code === -4) {
                                _this.$message.error('仲裁超时');
                            } else if (code === -5) {
                                _this.$message.error('未知错误');
                            }
                            _this.loading = false
                        }).catch(function (error) {
                            _this.loading = false
                        })
                    }).catch(function (err) {
                        this.$message.error(err);
                    })
                }
            },
            changePage(index) {
                this.getTransactionList(this.url[this.currentURLIndex], index - 1);
            },
            selectNav(index) {
                if (index === '1') {
                    this.getTransactionList('/user/transaction/buy/', 0);
                } else {
                    this.getTransactionList('/user/transaction/sell/', 0);
                }
            },
            getTransactionList(url, pageNo) {
                let account = this.$cookies.get('account');
                if (account) {
                    const _this = this;
                    let form = new FormData();
                    form.append('user_id', account);
                    form.append('page_max_items', this.pageSize);
                    form.append('page_id', pageNo);

                    this.loading = true;

                    axios.post(url, form).then(function (response) {
                        _this.transactionInfo = response.data.transaction_list;
                        _this.loading = false;
                    }).catch(function (error) {
                        this.$message.error(error)
                        _this.loading = false;
                    })
                } else {
                    this.$message.error('请先登录！')
                }
            },
            // init() {
            //     // this.$cookies.set('account', 'YUXIN');
            //     // this.$cookies.set('password', '123456');
            //     this.$message.error(this.$cookies.keys())
            // }
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
