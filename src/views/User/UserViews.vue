<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userInfo.photo" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{userInfo.name}}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{userInfo.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item" @click="clickList(1)">
          <span>{{userInfo.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item" @click="clickList(2)">
          <span>{{userInfo.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_editor" />
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat"/>
      <van-cell icon="warning-o" title="退出登录" is-link @click="outLogin"/>
    </van-cell-group>

    <!-- 弹出层 -->
    <van-popup v-model="show" class="Pop">
      <UserPop @closeP="closeP" :follow="clickinfo" :viewlist="viewlist"></UserPop>
    </van-popup>
  </div>
</template>

<script>
import { removeToken } from '@/utils/token'
import UserPop from '@/views/User/UserPop.vue'
import { Dialog } from 'vant'
export default {
  name: 'UserViews',
  data() {
    return {
      userInfo: {},
      show: false,
      clickinfo: '',
      page: 1,
      per_page: 20,
      viewlist: {}
    }
  },
  components: {
    UserPop
  },
  async activated() {
    const res = await this.$API.userInfo()
    this.userInfo = res.data.data
    this.$store.commit('SET_USERPHOTO', this.userInfo.photo)
  },
  methods: {
    outLogin() {
      Dialog.confirm({
        title: '退出登录',
        message: '是否确认退出登录'
      })
        .then(() => {
          removeToken()
          this.$router.replace('/login')
          // on confirm
        })
        .catch(() => {
          // on cancel
        })
    },
    closeP() {
      this.show = false
    },
    async clickList(bool) {
      if (bool === 1) {
        this.clickinfo = '关注列表'
        const res = await this.$API.userFollows({
          page: this.page,
          per_page: this.per_page
        })
        this.viewlist = res.data.data.results
      } else {
        this.clickinfo = '粉丝列表'
        const res = await this.$API.userFans({
          page: this.page,
          per_page: this.per_page
        })
        this.viewlist = res.data.data.results
      }
      this.show = true
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
  .Pop{
    width: 100vw;
    height: 100vh;
  }
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
