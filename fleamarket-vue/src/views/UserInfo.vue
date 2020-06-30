<template>
    <div>
        <el-container>
            <el-main v-loading="loading">
                <div style="margin-top: 30px">
                    <span class="info-title">用户ID :  </span>
                    <span>{{userInfo.id}}</span>
                </div>
                <div style="margin-top: 30px">
                    <span class="info-title">账户余额 :  </span>
                    <span>{{userInfo.balance}}</span>
                </div>
                <div style="margin-top: 30px">
                    <span class="info-title">账户信息 :  </span>
                    <span>{{userInfo.info}}</span>
                </div>
                <div style="margin-top: 30px">
                    <span class="info-title">账户状态 :  </span>
                    <span>{{userState[userInfo.state]}}</span>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "UserInfo",
        created() {
            let userId = this.$cookies.get('account');
            const _this = this;
            if (userId) {
                let form = new FormData();
                form.append('user_id', userId);
                this.loading = true;
                axios.post('/user/info/', form).then(function (response) {
                    if (response.data.code === 0) {
                        _this.userInfo = response.data.user;
                    } else {
                        _this.$message.error('获取用户信息失败！')
                    }
                    _this.loading = false;
                }).catch(function (error) {
                    _this.loading = false;
                })
            } else {
                _this.$message.error('账号错误！')
                this.$cookies.remove('account');
                this.$cookies.remove('password');
                window.reload()
            }
        },
        data() {
            return {
                loading: false,
                userInfo: {
                    id: '',
                    balance: '',
                    info: '',
                    state: ''
                },
                // 由于有 -1 所有状态码 + 1
                userState: [
                    '用户不存在',
                    '注销',
                    '在线'
                ]
            }
        }
    }
</script>

<style scoped>
    .info-title {
        font-size: 14px;
        color: #909399;
    }
</style>
