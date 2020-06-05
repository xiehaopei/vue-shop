import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入全局css
import './assets/css/global.css'
/* 导入字体图标 */
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'

import NProgress from 'nprogress'

//设置默认url，之后的请求可省略该部分
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//添加请求拦截器
axios.interceptors.request.use(config => {
  //展示进度条
  NProgress.start()
  //在请求头中加入token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须ruturn config
  return config
})
//response拦截器
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

//在vue属性中定义$http，如果更换请求方式只要修改这个地方即可
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

Vue.filter('dataFormat', function(originVal) {
  const dateTime = new Date(originVal)
  const year = dateTime.getFullYear()
  const month = (dateTime.getMonth() + 1 + '').padStart(2, '0')
  const day = (dateTime.getDate() + '').padStart(2, '0')
  const hh = (dateTime.getHours() + '').padStart(2, '0')
  const mm = (dateTime.getMinutes() + '').padStart(2, '0')
  const ss = (dateTime.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hh}-${mm}-${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
