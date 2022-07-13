import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth";

import PortalHome from "../views/portal/PortalHome.vue";
const auth = getAuth();


const routes = [
    // login/register pages
    {
        path: "/",
        name: "authentication",
        component: require("../views/authentication/index.vue").default,
        meta: {
            sideBar: false
        }
    },
    {
        path: "/login",
        name: "login",
        component: require("../views/authentication/LoginUser.vue").default
    },
    {
        path: "/search",
        name: "search",
        component: require("../views/portal/Search.vue").default,
        meta: {
            sideBar: true,
            requiresAuth: true
        }
    },
    {
        path: "/feed",
        name: "feed",
        component: require("../views/portal/Feed.vue").default,
        meta: {
            sideBar: true,
            requiresAuth: true
        }
    },
    {
        path: "/portal",
        name: "portal",
        component: require("../views/home/portal.vue").default,
        meta: {
            sideBar: true,
            requiresAuth: true
        }
    },
    {
        path: "/my-rodeo",
        name: "myrodeo",
        component: require("../views/portal/MyRodeo").default,
        meta: {
            sideBar: true,
            requiresAuth: true
        }
    },

    {
        path: "/register",
        name: "register",
        component: require("../views/authentication/RegisterUser.vue").default
    },
    {
        path: "/verify",
        name: "verify",
        component: require("../views/authentication/VerifyUser.vue").default
    },
    {
        path: "/logout",
        name: "Logout",
        component: require("../views/authentication/LogoutUser.vue").default
    },

    // portal pages
    {
        path: "/portal/home",
        name: "PortalHome",
        component: PortalHome,
        props: true
    },

    {
        path: "/news",
        name: "news",
        component: require("../views/news/news").default,
        meta: {
            sideBar: true,
            requiresAuth: true
        }
    },
    
    {
      path: "/schedules",
      name: "schedules",
      component: require("../views/schedules/schedules").default,
      meta: {
          sideBar: true,
          requiresAuth: true
      }
    },



    //{ path: '*', redirect: '/login' }
    // { path: '', redirect: '/portal/home' }
];

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
    routes
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

router.beforeEach(async(to, from, next) => {
    const user = auth.currentUser
    console.log("!!!")
    if (!user && to.path !== '/') {
        return next('/')
    }
    next()
})

export default router;