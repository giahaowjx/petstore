<template>
  <div style="text-align: center; margin-top: 30px">
    <el-image class="avator" :src="require('../assets/webank_logo.jpg')"/>
    <el-input class="search-input" v-model="input" placeholder="请输入内容"></el-input>
    <el-button class="search-button" type="primary">搜索</el-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data() {
    return {
      input: ""
    }
  }
}
</script>

<style>
  .search-input {
    margin: 50px auto;
    width: 550px;
  }
  .search-button {
    width: 100px;
    margin-left: 10px;
  }
  .avator {
    height: 200px;
    width: 300px;
  }
</style>
