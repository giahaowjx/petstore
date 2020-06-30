<template>
    <div id="login">
        <el-container style="border: 1px solid #eee; padding: 0; height: 100%">
            <el-main v-loading="loading">
                <el-form :model="loginForm" label-width="50px" class="login-box">
                    <h3 class="login-title">请登录</h3>
                    <el-form-item label="账号">
                        <el-input v-model="loginForm.account" type="text" placeholder="请输入账号"/>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="width: 90px" type="primary" v-on:click="login">登录</el-button>
                        <el-button style="width: 90px; margin-left: 20px" @click="registerVisible=true">注册</el-button>
                    </el-form-item>
                </el-form>
            </el-main>

            <el-dialog title="注册" :visible.sync="registerVisible" v-loading="loadingRegister" width="50%">
                <el-form :model="userForm">
                    <el-form-item label="账户ID" :label-width="formLabelWidth">
                        <el-input v-model="userForm.account" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="账户密码" :label-width="formLabelWidth">
                        <el-input v-model="userForm.password" autocomplete="off" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="密码确认" :label-width="formLabelWidth" >
                        <el-input v-model="userForm.password2" autocomplete="off" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="账户余额" :label-width="formLabelWidth">
                        <el-input v-model="userForm.balance" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="账户信息" :label-width="formLabelWidth">
                        <el-input v-model="userForm.info" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="registerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="register">确 定</el-button>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                loginForm: {
                    account: '',
                    password: ''
                },
                registerVisible: false,
                loadingRegister: false,
                userForm: {
                    account: '',
                    password: '',
                    password2: '',
                    balance: '',
                    info: ''
                },
                formLabelWidth: '120px',
                loading: false
            }
        },
        methods: {
            register() {
                if (this.password !== this.password2) {
                    this.$message.error('两次密码不同！')
                } else {
                    const _this = this;
                    let form = new FormData();
                    form.append('user_id', this.userForm.account);
                    form.append('user_password', this.userForm.password);
                    form.append('balance', this.userForm.balance);
                    form.append('info', this.userForm.info);
                    this.loadingRegister = true;

                    axios.post('/user/create/', form).then(function (response) {
                        if (response.data.code === 0) {
                            _this.$message({showClose: true, message: '注册成功'
                                , type: 'success'});
                            _this.registerVisible = false;
                        } else if (response.data.code === -1) {
                            _this.$message.error('用户已存在！请登录');
                            _this.registerVisible = false;
                        } else {
                            _this.$message.error('未知错误');
                        }
                        _this.loadingRegister = false;
                    }).catch(function (error) {
                        _this.$message.error('未知错误');
                        _this.loadingRegister = false;
                    })
                }
            },
            login() {
                if (this.loginForm.account !== '' && this.loginForm.password !== '') {
                    const _this = this;
                    let form = new FormData();
                    form.append('user_id', this.loginForm.account);
                    form.append('user_password', this.loginForm.password)
                    this.loading = true;

                    axios.post('/user/auth/', form).then(function (response) {
                        if (response.data.code === 0) {
                            _this.$message({showClose: true, message: '登录成功'
                                , type: 'success'});
                            _this.$cookies.set('account', _this.loginForm.account);
                            _this.$cookies.set('password', _this.loginForm.password);
                            _this.loading = false;
                            _this.$router.push({name: 'Home'});
                            window.location.reload()
                        } else if(response.data.code === -1) {
                            _this.$message.error('用户不存在！');
                            _this.loading = false;
                        } else {
                            _this.$message.error('未知错误！');
                            _this.loading = false;
                        }
                    }).catch(function (error) {
                        _this.loading = false;
                    })
                } else {
                    this.$message.error('请填写账号/密码')
                }
            },
        }
    };
</script>
<style scoped>
    .login-title {
        text-align: center;
        margin: 0 auto 30px auto;
        color: black;
    }
    .login-box {
        border: 1px solid #DCDFE6;
        width: 300px;
        margin: 180px auto;
        padding: 25px 25px 10px 25px;
        border-radius: 5px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        box-shadow: 0 0 25px #909399;
    }
</style>
