<template>
    <div style="text-align: center">
        <el-input v-model="input" placeholder="请输入内容" class="search-input"></el-input>
        <el-button type="primary" class="search-button">搜索</el-button>
    </div>
</template>
<script>
    export default {
        name: "Market",
        data() {
            return {
                input: ""
            }
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
</style>
