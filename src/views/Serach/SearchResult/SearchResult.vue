<template>
    <div>
      <!-- 搜索结果页-头部导航 -->
      <div class="search-result-container">
        <!-- 点击实现后退效果 -->
        <van-nav-bar
          title="搜索结果"
          left-arrow
          @click-left="$router.go(-1)"
          fixed
        />
      </div>
      <div>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
          offset="50"
        >
        <ArticleItem v-for="(obj, index) in artList" :key="index" :artObj="obj" :isShow="false" @click.native="itemClickFn(obj.art_id)"></ArticleItem>
        </van-list>
      </div>
    </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem/ArticleItem.vue'
export default {
  name: 'SearchResult',
  components: {
    ArticleItem
  },
  data() {
    return {
      page: 1,
      perPage: 10,
      artList: [],
      loading: false,
      finished: false
    }
  },
  async created () {
    const res = await this.$API.searchResultAPI({
      page: this.page,
      words: this.$route.params.keywords
    })
    this.artList = res.data.data.results
  },
  methods: {
    async onLoad() {
      if (this.artList.length > 0) {
        try {
          this.page++
          const res = await this.$API.searchResultAPI({
            page: this.page,
            words: this.$route.params.keywords
          })
          if (res.data.data.results.length === 0) {
            this.finished = true
            return
          }
          this.artList = [...this.artList, ...res.data.data.results]
        } catch (error) {
          throw new Error(error)
        }
        this.loading = false
      }
    },
    itemClickFn(id) {
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    },
    scrollFn() {
      this.$route.meta.screenY = document.documentElement.scrollTop
    }
  },
  deactivated() {
    window.removeEventListener('scroll', this.scrollFn)
  },
  activated() {
    console.log(this.$route.meta)
    window.addEventListener('scroll', this.scrollFn)
    document.documentElement.scrollTop = this.$route.meta.screenY
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
