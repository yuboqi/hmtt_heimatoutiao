<template>
  <div>
    <div>
    <van-nav-bar fixed>
      <template v-slot:left>
        <img class="logo" src="@/assets/toutiao_logo.png" alt="">
      </template>
      <template #right>
        <router-link to="/search">
          <van-icon name="search" size="0.48rem" />
        </router-link>
      </template>
    </van-nav-bar>
    </div>
    <div class="main">
      <van-tabs v-model="channelId" sticky offset-top="1.226667rem" animated @change="channelChangeFn">
            <van-tab :title="obj.name" v-for="obj in userChannelList" :key="obj.id" :name="obj.id">
              <ArticleList :channelId="channelId"></ArticleList>
            </van-tab>
      </van-tabs>

      <!-- 编辑频道图标 -->
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="showPopup"/>
    </div>
      <!-- 频道弹出层 -->
      <van-popup v-model="show" class="Pop">
        <ChannelEdit @closeP="closeP" :userList="userChannelList" :unCheckList="unCheckChannelList" @addArticel="addArt" @removeArticel="removeArt" @enterArticel="enterArt"></ChannelEdit>
      </van-popup>

  </div>
</template>

<script>
import ArticleList from '@/views/Home/ArticleList/ArticleList.vue'
import ChannelEdit from '@/views/Home/ChannelEdit/ChannelEdit.vue'
export default {
  name: 'HomeViews',
  data() {
    return {
      channelId: 0,
      userChannelList: [],
      allChannelList: [],
      show: false,
      channelScrollTObj: {}
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  async created() {
    const reslut = await this.$API.getUserChangeIsAPI()
    this.userChannelList = reslut.data.data.channels

    const reslut2 = await this.$API.getAllChannelsAPI()
    this.allChannelList = reslut2.data.data.channels
  },
  computed: {
    unCheckChannelList () {
      // 计算出用户未选的频道
      const newArr = this.allChannelList.filter(obj => {
        const index = this.userChannelList.findIndex(smallObj => {
          return smallObj.id === obj.id
        })

        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  },
  methods: {
    showPopup() {
      this.show = true
    },
    closeP() {
      this.show = false
    },
    enterArt(obj) {
      this.channelId = obj.id
      this.show = false
    },
    async updataArticle() {
      try {
        await this.$API.updataArticle({
          channels: this.userChannelList
        })
      } catch (error) {
        throw new Error('添加失败', error)
      }
    },
    async addArt(unobj) {
      this.userChannelList.push(unobj)
      this.updataArticle()
    },
    async removeArt(obj) {
      const index = this.userChannelList.findIndex(obj2 => obj2.id === obj.id)
      this.userChannelList.splice(index, 1)
      this.updataArticle()
    },
    scrollFn() {
      this.$route.meta.screenT = document.documentElement.scrollTop || document.body.scrollTop
      this.channelScrollTObj[this.channelId] = document.documentElement.scrollTop || document.body.scrollTop
    },
    channelChangeFn() {
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScrollTObj[this.channelId]
        document.body.scrollTop = this.channelScrollTObj[this.channelId]
      })
    }
  },
  deactivated() {
    window.removeEventListener('scroll', this.scrollFn)
  },
  activated() {
    window.addEventListener('scroll', this.scrollFn)
    document.documentElement.scrollTop = this.$route.meta.screenT
    document.body.scrollTop = this.$route.meta.screenT
  }
}
</script>

<style scoped lang="less">
  .logo {
    width: 100px;
    height: 30px;
  }
  .main{
    padding-top: 46px;
  }
  /deep/ .van-tabs__wrap {
    padding-right: 30px;
    background-color: #fff;
  }

  .moreChannels {
    position: fixed;
    top: 62px;
    right: 8px;
    z-index: 999;
  }
  .Pop{
    width: 100vw;
    height: 100vh;
  }
</style>
