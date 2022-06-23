<template>

    <div>
        <header>
            <LargeLogo/>
        </header>
        <section>
            <div class="login">
                <div class="form-group">
                    <input
                        type="name"
                        placeholder="First Name"
                        autocomplete="off"
                        v-model="firstname">
                </div>
                <div class="form-group">
                    <input
                        type="name"
                        placeholder="Last Name"
                        autocomplete="off"
                        v-model="lastname">
                </div>
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
                        type="name"
                        placeholder="Phone Number"
                        autocomplete="off"
                        v-model="phone">
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
                <div class="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        autocomplete="off"
                        v-model="password_confirm"
                        maxlength="40">
                </div>
                <div style="height: 30px" />
                <button @click="register" type="submit" name="credentials" class="btn btn-secondary">Register</button>
                <div style="display: flex; justify-content: center; margin-top: 15px">
                  <router-link to="/login" style="color: #2c3346">Already have an account? Login now!</router-link>
                </div>
            </div>
        </section>
    </div>

</template>



<script>

import LargeLogo from '../../common/components/app/LargeLogo.vue'

// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import router from '../../router/router.js';
import { getAuth } from 'firebase/auth'
import email from '../../modules/utils/validate';

export default {
    name: 'RegisterUser',
    components: {
        LargeLogo
    },
    data(){
        return{
            mail: '',
            password: '',
            password_confirm: '',
            firstname: '',
            lastname: '',
            phone: '',
        }
    },
    mounted(){
    },
    beforeDestroyed(){
        this.r_client = null;
    },
    methods:{

      validate() {
          if (this.password != this.password_confirm) return "Passwords don't match";

          if(this.firstname.length == 0) return "Please enter a first name";
          if(this.lastname.length == 0) return "Please enter a last name";

          let name_regex = /^[A-Za-z]*$/;
          if (!name_regex.test(this.firstname)) return "First name must only consist of alphanumeric characters";
          if (!name_regex.test(this.lastname)) return "Last name must only consist of alphanumeric characters";

          // validate email
          if(!email.emailIsValid(this.mail)) return "Please enter a valid email.";

          // validate phone number

          return false;
      },

      async register() {
        let validation_error = this.validate();
        if (validation_error) throw new Error(validation_error);

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, this.mail, this.password)
          .then(async ({ user }) => {
            await user.sendEmailVerification();
            const fullname = this.firstname + " " + this.lastname;
            await user.updateProfile({ displayName: fullname, phoneNumber: this.phone });
             this.$router.push('/verify');
          })
          .catch((error) => {
            alert(error.message);
          });
      }

    }
}

</script>


<style scoped>

/*body {
    background-color: #f1f2f3;
}*/

.rodeonow-header-nav--primary{
    text-align:center;
	width:100%;
}

.rodeonow-header-nav{
    display:-ms-flexbox;
    display:flex;
    -ms-flex-flow:row nowrap;
    flex-flow:row nowrap;
    -ms-flex-align:stretch;
    align-items:stretch;
    -ms-flex-pack:justify;
    justify-content:space-between;
    -ms-flex-line-pack:center;
    align-content:center;
    width:calc(100% - 40px);
    position:absolute;
    left:20px;
    top:0;
}

.rodeonow-img{
    width: 25%;
    height: 40%;
}

.section {
    padding: 250px 0;
}

.login {
  width: 400px;
  margin: 16px auto;
  font-size: 16px;
}

.login input, .login button, .login .login-btn {
  box-sizing: border-box;
  display: block;
  width: 100%;
  border-width: 1px;
  border-style: solid;
  padding: 16px;
  outline: 0;
  font-family: inherit;
  font-size: 0.95em;
}

.login input[type="email"],
.login input[type="name"],
.login input[type="phone"],
.login input[type="password"] {
  background: #f1f2f3;
  border-color: #bbb;
  color: #141414;
}

.login input[type="email"]:focus,
.login input[type="name"]:focus,
.login input[type="phone"]:focus,
.login input[type="password"]:focus {
  border-color: #888;
}

.login button[type="submit"], .login .login-btn {
  background: #2c3346;
  border-color: transparent;
  color: #fff;
  cursor: pointer;
}

.login button[type="submit"]:hover, .login .login-btn:hover {
  background: #141414;
}

/* Buttons' focus effect */
.login button[type="submit"]:focus, .login .login-btn:focus {
  border-color: #05a;
}

/*
// makes input white
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700);

.login input[type="email"],
.login input[type="password"] {
  background: #fff;
  border-color: #bbb;
  color: #555;
}


.login button[type="submit"]:hover, .login .login-btn:hover {
  background: #141414;
}


.login button[type="submit"]:focus, .login .login-btn:focus {
  border-color: #05a;
}
*/


</style>
