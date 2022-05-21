<template>
  <div id="container">
    <div class="row">
      <div class="col-image"></div>
      <div class="col-form">
        <div class="tabs">
          <div
            :class="'tab-signin tab-button ' + signinActive"
            @click="switchTab('signin')"
          >
            SIGNIN
          </div>
          <div
            :class="'tab-signup tab-button ' + signupActive"
            @click="switchTab('signup')"
          >
            SIGNUP
          </div>
        </div>
        <div class="content">
          <login-component v-if="type == 'signin'" />
          <signup-component v-if="type == 'signup'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginComponent from "@/components/authentication/loginComponent.vue";
import SignupComponent from "@/components/authentication/signupComponent.vue";
import { ref } from "vue";

export default {
  name: "LoginUser",
  components: {
    LoginComponent,
    SignupComponent,
  },

  setup() {
    const type = ref("signin");
    const signupActive = ref("none");
    const signinActive = ref("active");
    const switchTab = (data) => {
      signinActive.value = data == "signin" ? "active" : "none";
      signupActive.value = data == "signup" ? "active" : "none";
      type.value = data;
    };

    return {
      switchTab,
      type,
      signupActive,
      signinActive,
    };
  },
};
</script>

<style scoped>
#container {
  /* color: #141414; */
  background-color: yellow;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.col-image {
  background-color: #000;
  background-image: url("../../assets/images/bg.jpg");
  background-position: 50%;
  background-repeat: no-repeat;
  object-fit: cover;

  width: 50%;
}

.col-form {
  padding: 8%;
  background-color: #cccccc;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.tabs {
  display: flex;
  width: 100%;

  justify-content: space-between;
}
.tab-button:hover {
  cursor: pointer;
}
.tab-button {
  position: relative;
  font-weight: 600;
}
.tab-signin {
  padding: 10px;
  width: 50%;
  text-align: center;
}

.none {
  color: #000;
  background: #fff;
}
.active {
  background: rgb(204, 26, 26);
  color: #fff;
}
.tab-signup {
  padding: 10px;
  width: 50%;
  text-align: center;
}
.tab-signin::after {
  position: absolute;
  content: "";
  width: 40px;
  height: 28px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 999;
  bottom: -33px;
  border-bottom: solid 30px rgb(255, 255, 255);
  border-left: solid 30px transparent;
  border-right: solid 30px transparent;
}
.content {
  margin-top: 20px;
  background: #fff;
  width: 100%;
  height: 100%;
}
</style>
