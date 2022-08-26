<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar :title="follow">
      <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" @click="closePop"/>
      </template>
    </van-nav-bar>
        <!-- 评论列表 -->
    <div class="cmt-list">
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in viewlist" :key="obj.id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.photo" alt="" class="avatar" />
              <span class="uname">{{obj.name}}</span>
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            粉丝数：{{obj.fans_count}}
          </div>
        </div>
        <div class="cmt-item" v-if="viewlist.length === 0">
          <div class="cmt-body">
            <h2>空空如也~</h2>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChannelEdit',
  data () {
    return {
    }
  },
  props: ['follow', 'viewlist'],
  methods: {
    closePop() {
      this.$emit('closeP')
    }
  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}
.art-cmt-container-1 {
  padding: 10px;
  padding-bottom: 1rem;
}
.art-cmt-container-2 {
  padding: 10px;
  padding-bottom: 2rem;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    // padding-left: 15px;
    // margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      position: relative;
      font-size: 14px;
      line-height: 28px;
      text-align: left;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;

      h2{
        text-align: center;
        opacity: 0.5;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        padding-top: 100%;
        margin: auto;
      }
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      text-align: left;
      margin-top: 10px;
    }
  }
}
</style>
