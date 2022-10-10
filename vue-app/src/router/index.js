import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth";
import PortalHome from "../views/portal/PortalHome.vue";

const auth = getAuth();
const routes = [{
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
        path: "/upload",
        name: "Upload",
        component: require("../views/UploadVideo.vue").default,
        meta: {
            sideBar: true,
            requiresAuth: true
        }
    },
    {
        path: "/profile",
        name: "profile",
        component: require("../views/profile/index.vue").default,
        meta: {
            sideBar: true,
            requiresAuth: true
        },
        children: [{
                path: "edit",
                name: "editProfile",
                component: require("../views/profile/edit.vue").default,
                meta: {
                    sideBar: true,
                    requiresAuth: true
                }
            },
            {
                path: "change-password",
                name: "changePassowrd",
                component: require("../views/ChangePassword.vue").default,
                meta: {
                    sideBar: true,
                    requiresAuth: true
                }
            },
            {
                path: "grant-access",
                name: "grantAccess",
                component: require("../views/grantAccess.vue").default,
                meta: {
                    sideBar: true,
                    requiresAuth: true
                }
            }
        ]
    },
    {
        path: "/animals",
        name: "animals",
        component: require("../views/animals/index.vue").default,
        meta: {
            sideBar: true,
            requiresAuth: true
        },
        children: [{
                path: "",
                name: "animals-animals",
                component: require("../views/animals/animals.vue").default,
                meta: {
                    sideBar: true,
                    requiresAuth: true
                }
            },
            {
                path: "edit",
                name: "editAnimal",
                component: require("../views/animals/edit.vue").default,
                meta: {
                    sideBar: true,
                    requiresAuth: true
                }
            },
            {
                path: "new",
                name: "newAnimal",
                component: require("../views/animals/edit.vue").default,
                meta: {
                    sideBar: true,
                    requiresAuth: true
                }
            },
        ]
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
    {
        path: "/notifications",
        name: "Notifications",
        component: require("../views/Notifications").default,
        meta: {
            sideBar: true,
            requiresAuth: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
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