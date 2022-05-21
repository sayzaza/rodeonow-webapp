<template>

    <div>
        <header>
            <LargeLogo/>
        </header>
        <section class="section">
            <div class="login loginForm1">
                <div class="login-container">
                    <label> You have successfully logged out.</label>
                    <p>To log back in, click the button below.</p>

                    <router-link :to="{ path: '/login' }" class="btn btn-secondary login-btn no-underline">Login</router-link>>
                </div>
            </div>
        </section>
    </div>

</template>


<script>

const request = require('../../modules/request/http_request.js');

import LargeLogo from '../../common/components/app/LargeLogo.vue'

export default {
    name: 'LogoutUser',
    components: {
        LargeLogo,
    },
    mounted(){
        this.logUserOut();
    },
    methods: {
        async logUserOut(){
            // log user out and delete cookie
            await request.post("/logout", null);
            document.cookie = 'session-name' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        },
    }
}

</script>


<style scoped>

body {
  background-color: #000;
}

.section {
  padding: 197px 0;
}

.login-container {
  padding: 12px;
  text-align: center;
}


.login p {
  padding: 12px;
  color: #fff;
}

.login label {
  font-size: 20px;
  color: #fff;
}


</style>
