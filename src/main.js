import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'// 移动端适配
import './VueComponent'
import * as API from '@/api'
import 'highlight.js/styles/default.css' // 代码高亮的样式
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$API = API
  }
}).$mount('#app')
