<template>
  <div>
  <!-- 二级路由页面 div为了防止内容被底部挡住-->
  <div class="home_containe">
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
  </div>
  <!-- 下面为底部导航 -->
  <div>
    <van-tabbar v-model="active" route>
      <van-tabbar-item  to="/layout/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item  to="/layout/user" icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutViews',
  data() {
    return {
      active: 0
    }
  }

}
</script>

<style scoped lang="less">
  .home_container {
    padding-bottom: 50px;
  }
  .van-tabbar {
    border-top: 1px solid #f8f8f8;
  }
</style>
