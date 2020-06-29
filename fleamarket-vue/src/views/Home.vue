<template>
  <div style="text-align: center; margin-top: 30px">
    <el-image class="avator" :src="require('../assets/webank_logo.jpg')"/>
    <el-row type="flex" justify="center" :gutter="20" style="margin-top: 50px">
      <el-col :span="8">
        <el-input class="search-input" v-model.trim="input" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button class="search-button" type="primary" @click="onSearch">搜索</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" :gutter="20">
      <el-col :span="10" class="class-box">
        <el-row :gutter="20">
          <!-- 下标从0开始 -->
          <el-col :span="6" v-for="(item, index) in commodityClass" :key="index">
            <div style="cursor: pointer;" @click="onFilterByClass(index)">
              <el-image class="class-icon" :src="item.url"/>
              <div style="text-align: center">
                <span class="class-name">{{item.name}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src
import Common from "../components/Common";

export default {
  name: 'Home',
  data() {
    return {
      input: "",
      commodityClass: Common.commodityClass
    }
  },
  methods: {
    onSearch() {
      if (this.input !== "") {
        this.$router.push({name: 'Market', params: {searchInput: this.input}})
      }
    },
    onFilterByClass(index) {
      console.log(index)
      this.$router.push({name: 'Market', params:  {classIndex: index}});
    }
  }
}
</script>

<style>
  .search-input {
    width: 550px;
  }
  .search-button {
    width: 100px;
  }
  .avator {
    height: 200px;
    width: 300px;
  }
  .class-box {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    height: 200px;
    padding: 10px;
  }
  .class-icon {
    height: 60px;
    width: 60px;
    margin-top: 3px;
  }
  .class-name {
    font-size: 12px;
    color: #909399;
  }
</style>
