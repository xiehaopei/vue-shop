import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
//导入全局css
import './assets/css/global.css'
/* 导入字体图标 */
import './assets/fonts/iconfont.css'
import axios from 'axios'

//设置默认url，之后的请求可省略该部分
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//添加请求拦截器
axios.interceptors.request.use(config => {
  //在请求头中加入token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config)
  //在最后必须ruturn config
  return config
})

//在vue属性中定义$http，如果更换请求方式只要修改这个地方即可
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
