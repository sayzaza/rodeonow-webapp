<template>

    <div :v-if="!r_userIsLoggedIn">
        <header>
            <LargeLogo/>
        </header>
        <section>
            <div class="login">
                  <div style="color: white; margin-bottom: 20px">We've send you a verification email. If you didn't receive any, press the following button to resend it. If you already have verified your email, you might want to reload the page.</div>
                <button @click="resend" type="submit" name="credentials" class="btn btn-secondary" style="margin-bottom: 10px">Resend Verfication Mail</button>
                <button @click="logout" type="submit" name="credentials" class="btn btn-secondary">Logout</button>
                <div style="display: flex; justify-content: center; margin-top: 15px">
                </div>
            </div>
        </section>
    </div>

</template>



<script>

import LargeLogo from '../../common/components/app/LargeLogo.vue'

// import { getAuth, signOut } from "firebase/auth";
import { getAuth } from 'firebase/auth'
// import router from '../../router/router.js';

import { mapMutations } from 'vuex'

export default {
    name: 'VerifyUser',
    components: {
        LargeLogo
    },
    data(){
        return{
            r_userIsLoggedIn: false,
            r_client: null,
            mail: '',
            password: '',
        }
    },
    mounted(){
    },
    beforeDestroyed(){
        this.r_client = null;
    },
    methods:{
        ...mapMutations([
            'updateFullName',
            'updateOrganizationName',
        ]),

      async resend(){
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            await user.sendEmailVerification();
        } else {
            //this.showWarnPopup('Resend error occured. Please try again.');
        }
      },

      async logout(){
        const auth = getAuth();
        signOut(auth).then(() => {
             this.$router.push('/login');
        }).catch(() => {
            //this.showWarnPopup('Could not logout. Please try again.');
        });
      }

      /*
        async checkCredentials(){
            let emailInput = this.$refs.email_input.value;
            let passInput = this.$refs.pass_input.value;

            if(emailInput == "" || passInput == ""){
                alert("Email and password cannot be empty.");
                event.preventDefault();
                return;

            } else{
                let response = await login.sendRequest(emailInput, passInput);

                if (response == false)
                    alert("An error occured. Please check connection status and try again.");
                else if(response.ErrorCode == errors.code.FIRST_EVER_LOGIN)
                    this.firstEverLogin(response.Response);
                else if(response.ErrorCode != errors.code.SUCCESS)
                    alert("Email and password combination did not match.");
                else
                    this.loginUser(response.Response);
            }
        },

        loginUser(response){
            this.r_userIsLoggedIn = true;

            const userData = JSON.parse(response);
            this.updateFullName(userData.FullName);
            this.updateOrganizationName(userData.OrganizationName);

            this.$router.push({
                // path: '/optimization/view/results',
                path: '/health/view/all',
                params: {
                    name: userData.FullName,
                    organizationName: userData.OrganizationName
                }
            });
        },


         firstEverLogin(){
             this.$router.push({
                 path: '/init/rodeonow',
             });
         }
      */
    }
}

</script>


<style scoped>

/*body {
    background-color: #f1f2f3;
}*/

</style>
