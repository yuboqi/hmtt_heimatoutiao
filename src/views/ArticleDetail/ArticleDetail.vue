<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <div>
         <!-- 文章信息区域 -->
    <div class="article-container" @click="commentShow()">
      <!-- 文章标题 -->
      <h1 class="art-title">{{articleInfo.title}}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="articleInfo.aut_name" :label="formatDate(articleInfo.pubdate)">
        <template #icon>
          <img :src="articleInfo.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <van-button type="info" size="mini" v-if="articleInfo.is_followed" @click="followFn(true)">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else @click="followFn(false)">关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="articleInfo.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small" v-if="articleInfo.attitude === 1" @click="likeFn(true)">已点赞</van-button>
        <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="likeFn(false)">点赞</van-button>
      </div>
    </div>
    <CommentList :commentsList="commentsList" :isShow="isShow" @isShowno="isShowno"  @isShowY="commentShow" @CommentMove="commentMove" :id="this.$route.query.art_id" :countAdd="countAdd"></CommentList>
    </div>
    <div  v-if="Object.keys(articleInfo).length === 0"><van-loading size="24px" color="#1989fa" >加载中...</van-loading></div>
  </div>
</template>

<script>
import CommentList from '@/views/ArticleDetail/CommentList/CommentList.vue'
import { timeAgo } from '@/utils/date'
import { Notify } from 'vant'
export default {
  name: 'ArticleDetail',
  data() {
    return {
      articleInfo: {},
      limit: 10,
      offset: null,
      commentsList: {},
      isShow: true
    }
  },
  components: {
    CommentList
  },
  async created() {
    const res = await this.$API.articleInfoAPI({
      article_id: this.$route.query.art_id
    })
    this.articleInfo = res.data.data

    const res2 = await this.$API.commentsAPI({
      source: this.$route.query.art_id
    })
    this.commentsList = res2.data.data
  },
  methods: {
    formatDate: timeAgo,
    async followFn (bool) {
      if (bool === true) {
        this.articleInfo.is_followed = false
        try {
          await this.$API.unfollowAutor({
            target: this.articleInfo.aut_id
          })
          Notify({ type: 'success', message: '取关成功' })
        } catch (error) {
          Notify({ type: 'danger', message: '取关失败' })
          throw new Error(error)
        }
      } else {
        this.articleInfo.is_followed = true
        try {
          await this.$API.followAutor({
            aut_id: this.articleInfo.aut_id
          })
          Notify({ type: 'success', message: '关注成功' })
        } catch (error) {
          Notify({ type: 'danger', message: '关注失败' })
          throw new Error(error)
        }
      }
    },
    async likeFn(bool) {
      if (bool === false) {
        this.articleInfo.attitude = 1
        try {
          await this.$API.likeArticle({
            artId: this.articleInfo.art_id
          })
          Notify({ type: 'success', message: '点赞成功' })
        } catch (error) {
          Notify({ type: 'danger', message: '点赞失败' })
          throw new Error(error)
        }
      } else {
        this.articleInfo.attitude = 0
        try {
          await this.$API.unlikeArticle({
            target: this.articleInfo.art_id
          })
          Notify({ type: 'success', message: '取消成功' })
        } catch (error) {
          Notify({ type: 'danger', message: '取消失败' })
          throw new Error(error)
        }
      }
    },
    commentShow() {
      this.isShow = true
    },
    isShowno() {
      this.isShow = false
    },
    commentMove() {
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    countAdd() {
      this.commentsList.total_count++
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
    /deep/ img{
  width: 100%;
}
    /deep/ pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
