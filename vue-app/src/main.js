import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { dom } from "@fortawesome/fontawesome-svg-core";
import { createApp } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { createMetaManager } from 'vue-meta' // html header & meta info
import { mapMutations, useStore } from 'vuex'
import "./plugins/firebase";
import router from './router'
import store from "./store";
import App from "./App.vue";
import 'vuetify/styles' // Global CSS has to be imported
import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'
import '@fortawesome/fontawesome-free/css/all.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/bootstrap-icons.svg"
import { doc, getDoc, getFirestore } from "firebase/firestore";
library.add(fas);
library.add(fab);
library.add(far);
dom.watch();

const metaManager = createMetaManager();
const auth = getAuth()
const vuetify = createVuetify({
  icons: {
    defaultSet: "fa",
    aliases,
    sets: {
      fa
    }
  }
});




})


// Initialize Firebase
// firebase.initializeApp(config.firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);
// this.auth = auth;


// new Vue({
//     store,
//     render: h => h(App)
// }).$mount("#app");
app.mount('#app')
