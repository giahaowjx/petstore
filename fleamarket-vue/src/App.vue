<template>
  <div id="app">
    <el-container>
        <el-header>
          <el-row type="flex" justify="space-between">
            <el-col :span="6">
              <el-image style="height: 50px; width: 100px" :src="require('./assets/webank_logo.jpg')"/>
            </el-col>
            <el-col :span="5">
              <el-menu :default-active="activeIndex"  mode="horizontal" router>
                  <el-menu-item v-for="(item, index) in $router.options.routes" v-if="index != hideIndex && index !== 5"
                                :index="item.path" :class="$route.path === item.path? 'is-active' : ''" :key="index">
                      {{item.title}}</el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-header>
        <el-main style="padding-top: 0">
          <router-view/>
        </el-main>
    </el-container>
  </div>
</template>

<style>
  .el-header {
    border-bottom: 1px solid #DCDFE6;
  }
  #app {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .el-menu {

  }
</style>

<script>
  export default {
    data() {
      return {
        activeIndex: '/',
        hideIndex: 3
      }
    },
    created() {
        if (this.$cookies.get('account')) {
            this.hideIndex = 4;
        }
    }
  };
</script>
