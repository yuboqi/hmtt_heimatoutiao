<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list" :class="{ 'art-cmt-container-1': show, 'art-cmt-container-2': !show }">
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="(obj, index) in commentsList.results" :key="index">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon name="like" size="16" color="red" v-if="obj.is_liking" @click="likeFn(true, obj)" />
              <van-icon name="like-o" size="16" color="gray" v-else @click="likeFn(false, obj)" />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ obj.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ formatTime(obj.pubdate) }}</div>
        </div>
    </div>
    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isShow">
      <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="pubCom()">发表评论</div>
      <div class="icon-box">
        <van-badge :content="commentsList.total_count === 0 ? '' : commentsList.total_count" max="99">
          <van-icon name="comment-o" size="0.53333334rem" @click="commentsFn()" />
        </van-badge>
        <van-icon name="star" size="0.53333334rem" v-if="shoucang" @click="star(true)"/>
        <van-icon name="star-o" size="0.53333334rem" v-else @click="star(false)"/>
        <van-icon name="share-o" size="0.53333334rem" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea placeholder="友善评论、理性发言、阳光心灵" v-focus @blur="pubComY()" v-model.trim="conText"></textarea>
      <van-button type="default" :disabled="conText.length === 0" @click="sendFn()">发布</van-button>
    </div>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
import { Notify } from 'vant'
export default {
  name: 'CommentList',
  props: ['commentsList', 'isShow', 'id'],
  data() {
    return {
      show: true,
      conText: '',
      shoucang: true
    }
  },
  methods: {
    formatTime: timeAgo,
    star(bool) {
      if (bool === true) {
        this.shoucang = false
      } else {
        this.shoucang = true
      }
    },
    async likeFn(bool, obj) {
      try {
        if (bool === true) {
          // 取消点赞
          await this.$API.commentsUnLike({
            target: obj.com_id
          })
          obj.is_liking = false
        } else {
          // 点赞
          const res = await this.$API.commentsLike({
            aut_id: obj.com_id
          })
          console.log(res)
          obj.is_liking = true
        }
      } catch (error) {
        Notify({ type: 'danger', message: '操作失败' })
        throw new Error(error)
      }
    },
    pubCom() {
      this.$emit('isShowno')
      this.show = false
    },
    pubComY() {
      setTimeout(() => {
        this.show = true
        this.$emit('isShowY')
      }, 0)
    },
    commentsFn() {
      this.$emit('CommentMove')
    },
    async sendFn() {
      try {
        await this.$API.pubComments({
          id: this.id,
          content: this.conText
        })
        this.conText = ''
        this.$emit('countAdd')
        Notify({ type: 'success', message: '评论成功' })
        setTimeout(() => {
          location.reload()
        }, 500)
      } catch (error) {
        Notify({ type: 'danger', message: '评论失败' })
        throw new Error(error)
      }
    }
  }
}
</script>

<style scoped lang="less">
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
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
  // padding: 10px;
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
      font-size: 14px;
      line-height: 28px;
      text-align: left;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
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
