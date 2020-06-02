import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: () => import('../components/home.vue'),
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: () => import('../components/Welcome.vue')
      },
      {
        path: '/users',
        component: () => import('../components/user/Users.vue')
      },
      {
        path: '/rights',
        component: () => import('../components/power/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import('../components/power/Roles.vue')
      },
      {
        path: '/categories',
        component: () => import('../components/goods/Cate.vue')
      },
      {
        path: '/params',
        component: () => import('../components/goods/Params.vue')
      },
      {
        path: '/goods',
        component: () => import('../components/goods/List.vue')
      },
      {
        path: '/goods/add',
        component: () => import('../components/goods/Add.vue')
      },
      {
        path: '/orders',
        component: () => import('../components/order/Order.vue')
      },
      {
        path: '/reports',
        component: () => import('../components/report/Report.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to表示将要访问页面
  //from表示从哪个路径跳转过来
  //next是个函数，代表放行。 next()直接使用或next('/url')强制跳转
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router