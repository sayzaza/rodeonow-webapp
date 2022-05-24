// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";
import store from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas);
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fab);
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(far);
import { dom } from "@fortawesome/fontawesome-svg-core";
dom.watch();
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta' // html header & meta info
import { mapMutations } from 'vuex'
// import VueRouter from "vue-router";
import router from './router'
// import store from './store'
// import { getAuth } from "firebase/auth";
import firebase from 'firebase/app'
import { initializeApp } from "firebase/app";
// import VModal from 'vue-js-modal'
import App from "./App.vue";
import config from './assets/config.js' // config initialization
// import store from './store/store.js' // maintains vuex states

// import { MOPopup } from './plugins/MOPopup.js' // popup

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/bootstrap-icons.svg"
const app = createApp(App)
const metaManager = createMetaManager()
app.config.productionTip = false;
//Vue.config.performance = false;
//Vue.config.devtools = process.env.NODE_ENV !== 'production';
app.component("font-awesome-icon", FontAwesomeIcon);
// Vue.use(VModal)
// app.use(MOPopup);
app.use(router)
app.use(store)
app.use(metaManager)
// app.use(VueRouter);
// app.use(VueMeta, {
//     refreshOnceOnNavigation: true // optional pluginOptions
// })

app.mixin({
  methods: {
      ...mapMutations([
          'updateLoadingState',
      ]),

      /* changes state of loading symbol */
      changeLoadingState(loading){
          this.updateLoadingState(loading, loading);
      },

      /* gets current user */
      getCurrentUser(){
        // const auth = getAuth();
        const user = firebase.auth().currentUser;

        if (user) {
          return user;
        } else {
          return false
        }
      },
      /* creates new firebase token for each request */
      getFirebaseToken(){
          const user = this.getCurrentUser();
          user.getIdToken(true);
          return user.Aa;
      },
      /* gets currently signed in firebase user */
      getFirebaseUser(){
          return this.getCurrentUser()
      },
    //   showInfoPopup(message, timeout) {
    //       if(timeout === undefined){
    //           timeout = 5000;
    //       }
    //       this.$moPopup.showMOPopup({
    //           bgColor: '#0047AB',
    //           textColor: '#FFF',
    //           closeDelay: timeout, // in ms
    //           messageText: message
    //       })
    //   },

    //   showWarnPopup(message, timeout) {
    //       if(timeout === undefined){
    //           timeout = 5000;
    //       }
    //       this.$moPopup.showMOPopup({
    //           bgColor: '#D70040',
    //           textColor: '#FFF',
    //           type: 'warn',
    //           closeDelay: timeout, // in ms
    //           messageText: message
    //       })
    //   },

    //   showSuccessPopup(message, timeout) {
    //       if(timeout === undefined){
    //           timeout = 5000;
    //       }
    //       this.$moPopup.showMOPopup({
    //           bgColor: '#50C878',
    //           type: 'success',
    //           closeDelay: timeout, // in ms
    //           messageText: message
    //       })
    //   },

      /* handles what to display for empty text */
      getDisplayText(text){
          if(text === '' || text === undefined) return 'N/A';
          else return text;
      },
      getBoolText(bool){
          if(bool === true) return 'Yes';
          else if(bool === false) return "No";
          else bool; // if not a bool
      },
  }
})


// Initialize Firebase
firebase.initializeApp(config.firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);
// this.auth = auth;


// new Vue({
//     store,
//     render: h => h(App)
// }).$mount("#app");
app.mount('#app')
