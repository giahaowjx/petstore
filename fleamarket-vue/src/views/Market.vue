<template>
    <div>
        <div style="text-align: center">
            <el-input v-model.trim="input" placeholder="请输入内容" class="search-input" clearable></el-input>
            <el-button type="primary" class="search-button" @click="onSearch">搜索</el-button>
        </div>
        <el-container style="margin-top: 20px; border-top: 2px solid #DCDFE6">
            <el-aside width="200px" style="padding: 0;">
                <el-menu>
                    <el-menu-item v-for="(item, index) in commodityClass" :key="index" :index="index + ''"
                        @click="onFilterByClass(index)" :class="index === classIndex?'is-active':''">
                        <el-image class="class-icon" :src="item.url"/>
                        <span>{{item.name}}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <el-tabs v-model="activeTab" type="border-card" style="margin-top: 10px" @tab-click="onChangeTab">
                        <el-tab-pane label="综合排序" name="default">
                            <i class="el-icon-shopping-cart-full" style="color: #ff441a"/>
                            <span style="font-size: 14px; margin-left: 15px; ">欢迎来到跳蚤市场！</span>
                        </el-tab-pane>
                        <el-tab-pane label="按价格排序" name="price">
                            <el-radio v-model="priceOrder" label="1">由低到高</el-radio>
                            <el-radio v-model="priceOrder" label="2">由高到低</el-radio>
                        </el-tab-pane>
<!--                        <el-tab-pane label="按时间排序">-->
<!--                            <el-radio v-model="timeOrder" label="1">显示最新</el-radio>-->
<!--                            <el-radio v-model="timeOrder" label="2">显示最早</el-radio>-->
<!--                        </el-tab-pane>-->
                    </el-tabs>
                </el-header>
                <el-main style="text-align: left; margin-top: 20px">
                    <el-row style="margin-bottom: 20px" :gutter="20">
                        <el-col :span="4" v-for="commodity in commodityList" :key="commodity.id">
                            <div style="margin-top: 10px">
                                <el-card style="padding: 0" shadow="hover" body-style="cursor: pointer">
                                    <el-image :src="commodity.image"/>
                                    <div class="price-number">
                                        <span>¥{{commodity.price}}</span>
                                    </div>
                                    <div class="price-name">
                                        <span>{{commodity.name}}</span>
                                    </div>
                                    <div class="commodity-owner">
                                        <span>{{commodity.owner}}</span>
                                    </div>
                                </el-card>
                            </div>
                        </el-col>
                    </el-row>
                    <el-pagination
                            background
                            layout="prev, pager, next"
                            :total=commodityTotalNum
                            :page-size="commodityPageNum"
                            @current-change="page">
                    </el-pagination>
                </el-main>
            </el-container>
        </el-container>
        <!-- 显示商品具体信息及购买的对话框 -->
        <el-dialog title="商品信息" :visible.sync="commodityInfoVisible">
            <el-form :model="form">
                <el-row type="flex" justify=""
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import Common from "../components/Common";

    export default {
        name: "Market",
        data() {
            return {
                input: "",
                commodityList: null,
                commodityClass: Common.commodityClass,
                // 1 表示价格由低到高
                priceOrder: '1',
                // 1 表示显示最新
                timeOrder: '1',
                classIndex: '',
                commodityTotalNum: 0,
                commodityPageNum: 50,
                activeTab: 'default',
                commodityInfoVisible: false
            }
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab);
            },
            onFilterByClass(index) {
                this.classIndex = index;
            },
            onSearch() {
                this.getCommodityList(1);
            },
            page(currentPage) {
                this.getCommodityList(currentPage);
            },
            onChangeTab() {
                this.getCommodityList(1);
            },
            getCommodityList(pageId) {
                let url = '';
                let form = new FormData();
                if (this.input !== '') {
                    // 进行商品搜索
                    url = '/commodity/search/';
                    form.append('keywords', this.input);
                } else {
                    // 不进行搜索
                    url = '/commodity/market/';
                }
                if (this.activeTab === 'price') {
                    url += 'price/';
                    form.append('reverse', this.priceOrder);
                }
                if (this.classIndex !== '') {
                    form.append('commodity_type', this.classIndex);
                }
                form.append('page_max_items', this.commodityPageNum);
                form.append('page_id', pageId + '');
                // 发起请求
                axios.post(url, form).then(function (response) {
                    _this.commodityList = response.data.commodity_list;
                    _this.commodityTotalNum = response.data.page_num * _this.commodityPageNum;
                })
            }
        },
        created() {
            const _this = this;
            this.classIndex = this.$route.params.classIndex + 1
            if (this.classIndex) {
                axios.post('commodity/market/', {commodity_type: this.classIndex})
                    .then(function (response) {
                        _this.commodityList = response.data.commodity_list;
                        // console.log(response.data.commodity_list)
                        _this.commodityTotalNum = response.data.page_num * _this.commodityPageNum;
                })
            } else {
                axios.post('commodity/market/')
                    .then(function (response) {
                        _this.commodityList = response.data.commodity_list;
                        // console.log(response.data.commodity_list)
                        _this.commodityTotalNum = response.data.page_num * _this.commodityPageNum;
                    })
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
    .commodity-image {

    }
    .price-number {
        color: #ff441a;
        text-align:left;
        padding-top: 14px;
        font-size: 20px;
        font-weight: 700;
    }
    .price-name {
        color: black;
        text-align: left;
        padding-top: 5px;
        font-size: 14px;
    }
    .commodity-owner {
        color: #909399;
        text-align: left;
        margin-top: 13px;
        font-size: 13px;
        text-decoration: underline;
    }
    .class-icon {
        width: 30px;
        height: 30px;
    }
</style>
