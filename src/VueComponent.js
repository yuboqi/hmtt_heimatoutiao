import Vue from 'vue'
import { directiveObj } from '@/utils/directiveFocus'
import lazyImg from '@/assets/lazy.gif'
import lazyError from '@/assets/404.webp'
import {
  NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell,
  Lazyload, List, PullRefresh, ActionSheet, Toast, Popup, Row, Col, Badge,
  Search, Divider, Image as VanImage, Notify, Tag, CellGroup, Dialog, DatetimePicker,
  Loading
} from 'vant'

// 或者自定义配置插件
Vue.use(Lazyload, {
  loading: lazyImg,
  error: lazyError
})

Vue.use(Loading)
Vue.use(CellGroup)
Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(directiveObj)
Vue.use(VanImage)
Vue.use(Notify)
Vue.use(Divider)
Vue.use(NavBar)
Vue.use(Search)
Vue.use(Row)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Popup)
Vue.use(Toast)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Form)
Vue.use(Field)
Vue.use(Button)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Icon)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Cell)
