<template>

    <!-- <div v-if="!r_userIsLoggedIn">
        <header>
            <LargeLogo/>
        </header>
        <section>
            <div class="login">
                <div class="form-group">
                    <div id="login-input"></div>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        v-model="mail"
                        autocomplete="off">
                </div>
                <div class="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        autocomplete="off"
                        name="pass"
                        v-model="password"
                        maxlength="40">
                </div>
                <div class="form-group" v-if="waitingForCode">
                    <div id="login-input"></div>
                    <input
                        type="number"
                        placeholder="Enter Code"
                        v-model="code"
                        autocomplete="off">
                </div>
                <button @click="clickLogin" type="submit" name="credentials" class="btn btn-secondary">Login</button>
                <div style="display: flex; justifyContent: center; alignItems: center">
                  <div ref="recaptcha" id="recaptcha-container" style="z-index: 100000"/>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; margin-top: 15px">
                  <router-link to="/register" style="color: #2c3346">No account yet? Register now!</router-link>
                  <a href="#" style="margin-top: 10px; color: #2c3346; cursor: pointer" @click="switch_reset_pw">Forgot Password? Reset Password!</a>
                </div>
            </div>
            <div v-if="show_reset_pw" class="login">
                <div class="form-group">
                    <div id="login-input"></div>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        v-model="reset_mail"
                        autocomplete="off">
                </div>
                <button @click="reset_pw" type="submit" name="credentials" class="btn btn-secondary">Reset Password</button>
            </div>
        </section>
    </div> -->

<div id="container">
<div class="row">
  <div class="col-image">Image here</div>
  <div class="col-form">Form here</div>
</div>
</div>
</template>



<script>

// import LargeLogo from '../../common/components/app/LargeLogo.vue'


// const login = require('@/modules/login');
// const errors = require('@/modules/errors');

// import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import {  getAuth, signInWithEmailAndPassword, sendPasswordResetEmail }  from 'firebase/auth'
// import router from '@/router/router.js';

import { mapMutations } from 'vuex'
import { useRouter } from 'vue-router';
const  router = useRouter()
export default {
    name: 'LoginUser',
    components: {
        // LargeLogo
    },
    data(){
     
        return{
            r_userIsLoggedIn: false,
            r_client: null,
            mail: '',
            password: '',
            show_reset_pw: false,
            reset_mail: '',
            code: "",
            waitingForCode: false,
            resolver: undefined

        }
    },
    mounted(){
        document.body.style.backgroundColor = "#f1f2f3";
    },
    beforeDestroyed(){
        this.r_client = null;
    },
    methods:{
        ...mapMutations([
            'updateFullName',
            'updateOrganizationName',
        ]),

      async clickLogin(){
        if(this.waitingForCode) this.submitCode();
        else this.login();
      },

      async login(){
        const auth = getAuth();
        signInWithEmailAndPassword(auth, this.mail, this.password)
            .then(({ user }) => {
                if (user.emailVerified) {
                  console.log("Verified")
                  this.$router.push({name:'PortalHome'});}
                else {this.$router.push({name:'verify'});}
            })
            .catch((err) => {
                if (err.code == 'auth/multi-factor-auth-required') {
                    this.resolver = err.resolver;
                    return this.twofactor();
                }
                // alert(err.message);
                //this.showWarnPopup(err.message);
                alert(err.message)
            });
      },

      async twofactor(){
        /*try {
          var recaptchaVerifier = new firebase.auth.RecaptchaVerifier(this.$refs.recaptcha);
          var phoneInfoOptions = {
            multiFactorHint: this.resolver.hints[this.resolver.hints.length-1],
            session: this.resolver.session
          };
          var phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
          return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
            .then((verificationId) => {
              recaptchaVerifier.clear();
              this.verificationId = verificationId
              this.waitingForCode = true;
              // Ask user for the SMS verification code.
            });

        } catch (err) {
          recaptchaVerifier.clear();
          alert(err.message);
        }*/

      },

      async submitCode(){
        /*try {
          var cred = firebase.auth.PhoneAuthProvider.credential(
            this.verificationId, this.code);
          var multiFactorAssertion =
            firebase.auth.PhoneMultiFactorGenerator.assertion(cred);
          await this.resolver.resolveSignIn(multiFactorAssertion)
        } catch (err) {
          this.code = "";
          alert(err.message);
        }*/
      },

      async switch_reset_pw(){
          this.show_reset_pw = !this.show_reset_pw;
          //console.log("todo");
      },

      async reset_pw(){
        const auth = getAuth();
        sendPasswordResetEmail(auth, this.reset_mail)
        .then(async () => {
            this.show_reset_pw = false;
            alert("A mail with instructions for resetting the password was sent to you.");
        })
        .catch((err) => {
            alert(err.message);
        });
      }

    }
}

</script>


<style scoped>

#container {
    /* color: #141414; */
    background-color: yellow;
}

ion-grid {
  background: green;
  width: 100%;
}

.row{
  display: flex;
  flex-direction: row;
}

.col-image{
  background-color: red;
  width: 50%;
}

.col-form{
  background-color: blue;
  width: 50%;
}

</style>
