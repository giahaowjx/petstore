<template>
    <div>
        <el-container style="margin-top: 20px">
            <el-aside width="200px">
                <el-menu default-active="1" @select="onMenuChange">
                    <el-menu-item index="1">
                        <i class="el-icon-user-solid"/>
                        <span>个人信息</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <i class="el-icon-s-goods"/>
                        <span>持有商品</span>
                    </el-menu-item>
                    <el-menu-item index="3"  @click="logout">
                        <i class="el-icon-error"/>
                        <span style="color: red">退出登录</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "User",
        methods: {
            onMenuChange(index) {
                if (index === '1') {
                    this.$router.push('/user/info')
                } else if (index === '2') {
                    this.$router.push('/user/commodity')
                } else {

                }
            },
            logout() {
                this.$confirm('是否退出当前账户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '退出成功!'
                    });
                    this.$cookies.remove('account');
                    this.$cookies.remove('password');
                    this.$router.push({name: 'Home'});
                    window.location.reload();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消退出'
                    });
                });
            }
        },
        created() {
            this.$router.push('/user/info');
        }
    }
</script>

<style scoped>

</style>
