<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center @click="$refs.iptFile.click()">
        <template #default>
          <van-image round class="avatar" :src="list.photo"/>
           <input
               type="file"
               ref="iptFile"
               v-show="false"
               accept="image/*"
               @change="onFileChange"
               />
        </template>
      </van-cell>
      <van-cell title="名称" is-link  :value="list.name" @click="showNameDialogFn"/>
      <!-- 修改用户名称的对话框 -->
      <van-dialog
            v-model="isShowNameDialog"
            title="修改名称"
            show-cancel-button
            :before-close="onNameDialogBeforeClose">
            <!-- 输入框 -->
            <van-field
              v-model.trim="userName"
              input-align="center"
              maxlength="7"
              placeholder="请输入名称"
              v-focus
            />
      </van-dialog>
      <van-cell title="生日" is-link  :value="list.birthday" @click="isShowBirth = true"/>
    </van-cell-group>
    <!-- 修改时间 -->
    <van-popup v-model="isShowBirth" position="bottom" style="height: 50%" round>
          <!-- 日期选择控件 -->
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择出生日期"
            :min-date="minDate"
            :max-date="maxDate"
            :show-toolbar="true"
            @cancel="isShowBirth = false"
            @confirm="confirmFn"
          />
    </van-popup>
  </div>
</template>

<script>
import { Notify, Toast } from 'vant'
import moment from 'moment'
export default {
  name: 'UserEdit',
  data() {
    return {
      list: {},
      isShowNameDialog: false, // 是否显示姓名弹出框
      userName: '', // 编辑用户名
      currentDate: new Date(),
      isShowBirth: false,
      minDate: new Date(1900, 0, 1), // 最小的可选的日期
      maxDate: new Date() // 最大的可选日期
    }
  },
  async created() {
    const res = await this.$API.userProfile()
    this.list = res.data.data
  },
  methods: {
    async onFileChange(ev) {
      if (ev.target.files.length === 0) return // 防止未选
      const fd = new FormData()
      fd.append('photo', ev.target.files[0])// photo在表单里参数名携带
      const res = await this.$API.updatePhotoAPI(fd)
      this.list.photo = res.data.data.photo // 更新最新头像
      Notify({ type: 'success', message: '更新成功' })
    },
    showNameDialogFn() {
      this.isShowNameDialog = true
      this.userName = this.list.name
    },
    async onNameDialogBeforeClose(action, done) {
      if (action === 'confirm') {
        // 校验输入的文字
        if (/^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/.test(this.userName)) {
          // 调接口
          try {
            await this.$API.updataUserInfo({
              birthday: this.list.birthday,
              userName: this.userName
            })
            this.list.name = this.userName
            Toast.success('修改成功')
          } catch (error) {
            Notify({ type: 'warning', message: '修改失败' })
            done()
            throw new Error(error)
          }
          done()
        } else {
          Notify({ type: 'warning', message: '用户名中英文和数字1-7位' })
          done()
        }
      } else if (action === 'cancel') {
        done()
      }
    },
    async confirmFn() {
      const dateStr = moment(this.currentDate).format('YYYY-MM-DD')
      try {
        await this.$API.updataUserInfo({
          birthday: dateStr
        })
        this.list.birthday = dateStr
        this.isShowBirth = false
        Toast.success('修改成功')
      } catch (error) {
        Notify({ type: 'warning', message: '修改失败' })
        throw new Error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
  .action-card {
    margin-left: -3em;
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
