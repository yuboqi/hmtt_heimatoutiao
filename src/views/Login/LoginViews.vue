<template>
  <div>
    <van-nav-bar title="黑马头条-登录" />
    <div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.mobile"
          name="mobile"
          label="手机号"
          placeholder="输入手机号"
          type="tel"
          required
          :rules="[
            {
              required: true,
              message: '请填写正确的手机号格式',
              pattern: /^1[3-9]\d{9}$/,
            },
          ]"
        />
        <van-field
          v-model="user.code"
          type="password"
          name="code"
          label="密码"
          placeholder="密码"
          required
          :rules="[
            {
              required: true,
              message: '请填写6位密码(246810)',
              pattern: /^\d{6}$/,
            },
          ]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit" :disabled="isLoading" :loading="isLoading" loading-text="正在登录ing">登录</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { Notify } from 'vant'
import { setToken } from '@/utils/token'
export default {
  name: 'LoginViews',
  data() {
    return {
      user: {
        mobile: '18773611140',
        code: '246810' // 必须是246810
      },
      isLoading: false // 是否为加载状态
    }
  },
  methods: {
    async onSubmit(values) {
      try {
        this.isLoading = true
        const result = await this.$API.loginAPI(this.user)
        Notify({ type: 'success', message: '登录成功' })
        setToken(result.data.data.token)
        this.$router.replace({
          path: this.$route.query.path || '/layout'
        })
      } catch (result) {
        Notify({ type: 'danger', message: '用户名或密码错误' })
      }
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang="less">
// .van-nav-bar{
//   background-color: #007bff;
// }
// // 要修改组件内的样式,比如title,需要使用/deep/,而且要用less
// //因为scoped的本质是使用会将标签名变为hash值,上面的组件标签不受影响
// //是因为scoped会在组件标签的后面加上那个hash值,但是组件内的样式找不到
// //所以使用/deep/会把hash值放到标签前面,这样就能找到该组件内的
// /deep/ .van-nav-bar__title{
//   color: white;
// }
</style>
