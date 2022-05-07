import { createRouter, createWebHistory } from "vue-router";




import firebase from 'firebase/app'

import PortalHome from '../views/portal/PortalHome.vue'
import OrdersList from '../views/portal/OrdersList.vue'
import OrderPage from '../views/portal/OrderPage.vue'

import BillingPage from '../views/billing/BillingPage.vue'

import ViewUsers from '../views/settings/users/View'
import EditPassword from '../views/settings/account/EditPassword'

const routes = [
  // login/register pages
  { path: '/', redirect: '/portal/home' },
  {
    path: '/login',
    name: 'login',
    component: require('../views/login/LoginUser.vue').default
  },
  {
    path: '/register',
    name: 'register',
    component: require('../views/login/RegisterUser.vue').default
  },
  {
    path: '/verify',
    name: 'verify',
    component: require('../views/login/VerifyUser.vue').default
  },
  {
    path: '/logout',
    name: 'Logout',
    component: require('../views/login/LogoutUser.vue').default
  },

  // portal pages
  {
    path: '/portal/home',
    name: 'PortalHome',
    component: PortalHome,
    props: true
  },
  {
    path: '/portal/orders/list',
    name: 'OrdersList',
    component: OrdersList,
    props: true
  },
  {
    path: '/portal/order/view',
    name: 'OrderPage',
    component: OrderPage,
    props: true
  },

  // billing
  {
    path: '/portal/billing',
    name: 'BillingPage',
    component: BillingPage,
    props: true
  },

  // user settings
  { path: '/settings/users/view', name: 'ViewUsers', component: ViewUsers },
  {
    path: '/settings/account/edit',
    name: 'EditAccount',
    component: EditPassword,
    props: true
  }, // edit your account

  //{ path: '*', redirect: '/login' }
  // { path: '', redirect: '/portal/home' }
]

// var router = new VueRouter({
//   linkActiveClass: 'text-blue font-bold',
//   mode: 'hash',
//   routes: routes,
//   scrollBehavior: to => {
//     if (to.hash) {
//       return {
//         selector: to.hash,
//         offset: { x: 0, y: 70 },
//         behavior: 'smooth',
//       }
//     }
//   }
// })

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // linkActiveClass: 'text-blue font-bold',
  // mode: 'hash',
  // scrollBehavior: to => {
  //   if (to.hash) {
  //     return {
  //       selector: to.hash,
  //       offset: { x: 0, y: 70 },
  //       behavior: 'smooth',
  //     }
  //   }
  // }
});

function loggedOutPath (to) {
  return to === '/login' || to === '/register'
}

router.beforeEach((to, from, next) => {
  const user = firebase.auth().currentUser
  if (user) {
    if (!user.emailVerified) {
      if (to.path != '/verify') next('/verify')
      else next()
    } else if (loggedOutPath(to.path) || to.path == '/verify')
      next('/portal/orders/list')
    else next()
  } else {
    console.log(firebase.auth().currentUser)
    if (!loggedOutPath(to.path)) next('/login')
    else next()
  }
})

export default router
