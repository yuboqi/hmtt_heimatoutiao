<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()"/>
      <!-- 搜索组件 -->
      <van-search v-model.trim="kw" @input="inputFn" v-focus placeholder="请输入搜索关键词" background="#007BFF" shape="round" @search="enterFn"/>
    </div>

    <!-- 搜索建议列表 -->
    <div class="sugg-list">
      <div class="sugg-item" v-for="(item,index) in imgList" :key="index" @click="clickFn(item)">
          <div v-if="kw.length !== 0" v-html="lightFn(item,kw)"></div>
      </div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-if="kw.length === 0">
        <!-- 标题 -->
        <van-cell title="搜索历史">
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="delFn"/>
            </template>
        </van-cell>

        <!-- 历史列表 -->
        <div class="history-list">
            <span class="history-item" v-for="(str,index) in history" :key="index" @click="hisClickFn(str)">{{ str }}</span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchView',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null,
      imgList: [],
      history: JSON.parse(localStorage.getItem('history')) || []
    }
  },
  methods: {
    inputFn () {
      clearTimeout(this.timer)
      this.timer = setTimeout(async() => {
        if (this.kw.length === 0) {
          this.imgList = []
        } else {
          try {
            const res = await this.$API.searchImageAPI({
              words: this.kw
            })
            this.imgList = res.data.data.options
          } catch (error) {
            throw new Error('联想错误', error)
          }
        }
      }, 500)
    },
    lightFn (orhgStr, targetStr) {
      // orhgStr 原字符串  targetStr 关键字
      const reg = new RegExp(targetStr, 'ig')
      return orhgStr.replace(reg, (match) => {
        return `<span style="color: red;">${match}</span>`
      })
    },
    enterFn() {
      if (this.kw.trim().length !== 0) {
        setTimeout(() => {
          this.$router.push({
            path: `/search/${this.kw}`
          })
        }, 0)
        this.history.unshift(this.kw)
      }
    },
    clickFn(item) {
      this.history.unshift(item)
      setTimeout(() => {
        this.$router.push({
          path: `/search/${item}`
        })
      }, 0)
    },
    hisClickFn(str) {
      this.$router.push({
        path: `/search/${str}`
      })
    },
    delFn() {
      this.history = []
    }
  },
  watch: {
    history: {
      deep: true,
      handler () {
        // set方法会生成一个set对象，需要用数组方法变为数组
        const thsSet = new Set(this.history)
        const arr = [...thsSet]
        localStorage.setItem('history', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    float: left;
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
</style>
