<template>
  <div>
    <!--<router-view></router-view>-->
    <div v-if="loading">
      <!-- <LargeLogo/> -->
      <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        ">
        <PulseLoader :loading="true" color="#2c3346"></PulseLoader>
      </div>
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>


<script>
import { mapMutations } from "vuex";

// import LargeLogo from './common/components/app/LargeLogo.vue'
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

// import router from "./router/router.js";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from "firebase";
import { useRouter } from 'vue-router';

export default {
  name: "App",
  components: {
    // LargeLogo,
    PulseLoader,
  },
  data() {
    return {
      loading: true,
      subscriber: null,
    };
  },
   router :useRouter(),
  created() {
      console.log("i came here")
    // const auth = firebase.auth().getAuth();
    this.subscriber = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("user",user)
        this.onAuthStateChanged()
      }else{
      console.log("user",user)
      this.loading = false;
      }
    });
  },
  beforeUnmount() {
    this.subscriber(); //unsubscribe from event-listener
  },
  methods: {
    ...mapMutations([]),

    loggedOutPath() {
      let route = this.$route.path;
      if (route == "/login") return true;
      if (route == "/register") return true;
      return false;
    },

    onAuthStateChanged(user) {
      let route = this.$route.path;
      if (user) {
        if (!user.emailVerified) router.push("/verify");
        else if (this.loggedOutPath() || route == "/verified") router.go(-1);
        // add additional code for logged in users here
      } else {
        if (!this.loggedOutPath())  this.$router.push("/login");
        // add additional code for logged out users here
      }
      this.loading = false;
    },
  },
  metaInfo: {
    title: "RodeoNow",
    htmlAttrs: {
      lang: "en",
      amp: true,
    },
    meta: [
      { charset: "utf-8" },
      { name: "description", content: "RodeoNow" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { "http-equiv": "Content-Type", content: "text/html" },
      {
        //'http-equiv':'Content-Security-Policy',
        // content:"default-src 'self'; script-src 'self' 'unsafe-eval'; img-src 'self' data:; connect-src * "
      },
    ],
  },
};
</script>

<!-- <style src="vue3-multiselect/dist/vue3-multiselect.css"></style> -->


<style>
/* #app {
    font: menu;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
} */

@import "./assets/css/global.css";
@import "./assets/css/login.css";
/* @import "./assets/css/multiselect.css"; */
</style>
