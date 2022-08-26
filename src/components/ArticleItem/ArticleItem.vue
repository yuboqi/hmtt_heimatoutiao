<template>
  <div>
    <!-- 一条文章单元格 -->
  <van-cell>
    <!-- 标题区域的插槽 -->
    <template #title>
      <div class="title-box">
        <!-- 标题 -->
        <span>{{ artObj.title }}</span>
        <!-- 单图 -->
        <img v-if="artObj.cover.type === 1" class="thumb" v-lazy="artObj.cover.images[0]">
      </div>
      <!-- 三图 -->
      <div class="thumb-box" v-if="artObj.cover.type > 1">
        <img v-for="(imgUrl,index) in artObj.cover.images" :key="index" class="thumb" v-lazy="imgUrl" />
      </div>
    </template>
    <!-- label 区域的插槽 -->
    <template #label>
      <div class="label-box">
        <div>
          <span>{{ artObj.aut_name }}</span>
          <span>{{ artObj.comm_count }}评论</span>
          <span>{{formatTime(artObj.pubdate)}}</span>
        </div>
        <!-- 反馈按钮 -->
            <van-icon name="cross" @click.stop="show = true" v-if="isShow"/>
      </div>
    </template>
  </van-cell>

  <van-action-sheet
  get-container="body"
  v-model="show"
  :actions="actions"
  :cancel-text="bottomText"
  @cancel="onCancel"
  @open="onOpen"
  @select="onSelect" />
  </div>

</template>

<script>
import { firstActions, secondActions } from '@/api/report'
import { timeAgo } from '@/utils/date'
import { Toast } from 'vant'
export default {
  name: 'ArticleItem',
  props: {
    artObj: Object,
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      actions: firstActions,
      bottomText: '取消'
    }
  },
  methods: {
    formatTime: timeAgo,
    async onSelect(action, index) {
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (action.name === '不感兴趣') {
        try {
          await this.$API.disLikeArticle(this.artObj.art_id)
          Toast.success('不感兴趣')
        } catch (error) {
          throw new Error('不感兴趣失败')
        }
        this.show = false
      } else { // 二级反馈选项
        try {
          await this.$API.reportArticle({
            artId: this.artObj.art_id,
            type: action.value
          })
          Toast.success('反馈成功')
        } catch (error) {
          throw new Error('反馈失败')
        }
        this.show = false
      }
    },
    onCancel() {
      if (this.bottomText === '返回') {
        this.actions = firstActions
        this.bottomText = '取消'
        this.show = true
      }
    },
    onOpen() {
      this.actions = firstActions
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
