import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { dom } from "@fortawesome/fontawesome-svg-core";
import { createApp } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createMetaManager } from "vue-meta"; // html header & meta info
import { mapMutations, useStore } from "vuex";
import "./plugins/firebase";
import router from "./router";
import store from "./store";
import App from "./App.vue";
import "vuetify/styles"; // Global CSS has to be imported
import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa";
import "@fortawesome/fontawesome-free/css/all.css";

import "bootstrap-icons/bootstrap-icons.svg";
import { doc, getDoc, getFirestore } from "firebase/firestore";
library.add(fas);
library.add(fab);
library.add(far);
dom.watch();

let app;
const metaManager = createMetaManager();
const auth = getAuth();
const vuetify = createVuetify({
    icons: {
        defaultSet: "fa",
        aliases,
        sets: {
            fa
        }
    }
});

function _getUserProfile(user) {
    const db = getFirestore();
    return getDoc(doc(db, "users", user.uid)).then((doc) => ({
        ...doc.data(),
        id: doc.id
    }));
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        store.commit("SET_USER", user);
        _getUserProfile(user).then((profile) => {
            store.commit("SET_PROFILE", profile);
            if (profile.current_accessed_account) {
                _getUserProfile({ uid: profile.current_accessed_account }).then((other) => {
                    store.commit("SET_SELECTED_PROFILE", other);
                });
            }
        });

    }
    if (app) return;

    app = createApp(App);
    app.config.productionTip = false;
    app.use(router);
    app.use(store);
    app.use(metaManager);
    app.use(vuetify);
    app.component("font-awesome-icon", FontAwesomeIcon);
    app.mixin({
        methods: {
            ...mapMutations(["updateLoadingState"]),

            /* changes state of loading symbol */
            changeLoadingState(loading) {
                this.updateLoadingState(loading, loading);
            },

            /* handles what to display for empty text */
            getDisplayText(text) {
                if (text === "" || text === undefined) return "N/A";
                else return text;
            },
            getBoolText(bool) {
                if (bool === true) return "Yes";
                else if (bool === false) return "No";
                else bool; // if not a bool
            }
        }
    });
    app.mount("#app");
});