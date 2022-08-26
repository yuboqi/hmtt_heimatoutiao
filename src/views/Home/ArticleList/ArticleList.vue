<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh"  success-text="刷新成功">
        <van-list v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              :immediate-check="false"
              offset="50"
              @load="onLoad">
    <!-- 文章列表 -->
    <ArticleItem v-for="obj in list" :key="obj.art_id" :artObj="obj" @click.native="itemClickFn(obj.art_id)"></ArticleItem>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem/ArticleItem.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      preTime: new Date().getTime(),
      isLoading: false
    }
  },
  methods: {
    async getArticleList() {
    // 获取文章列表
      const res2 = await this.$API.getAllArticleList({
        channel_id: this.channelId,
        timestamp: this.preTime
      })
      this.list = [...this.list, ...res2.data.data.results]
      this.preTime = res2.data.data.pre_timestamp
      this.loading = false
      if (res2.data.data.pre_timestamp === null) {
        this.finished = true
      }
      this.isLoading = false
    },
    itemClickFn(id) {
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    },
    // 底部加载
    onLoad() {
      if (this.list.length === 0) {
        this.loading = false
        return
      }
      this.getArticleList()
    },
    onRefresh() {
      this.list = []
      this.preTime = new Date().getTime()
      this.getArticleList()
    }
  },
  props: {
    // list: Array// 文章列表
    channelId: Number
  },
  created() {
    // 获取文章列表
    this.getArticleList()
  }
}
</script>
