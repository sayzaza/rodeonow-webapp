import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth";
const auth = getAuth();
import PortalHome from "../views/portal/PortalHome.vue";
import { currentUser } from "@/services/authentication.service";

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
        path: "/portal",
        name: "portal",
        component: require("../views/home/portal.vue").default,
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
    }

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
    const user = auth.currentUser;
    if (!user && to.meta.requiredAuth) {
        next("/");
    } else {
        next();
    }

    // console.log("current usser==>",user)
    // if (user) {
    //   if (!user.emailVerified) {
    //     if (to.path != '/verify') next('/verify')
    //     else next()
    //   } else if (loggedOutPath(to.path) || to.path == '/verify')
    //     next('/portal/orders/list')
    //   else next()
    // } else {
    //   console.log(firebase.auth().currentUser)
    //   if (!loggedOutPath(to.path)) next('/authentication')
    //   else next()
    // }
});

export default router;