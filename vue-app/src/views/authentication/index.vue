<script>
import LoginComponent from "@/components/authentication/loginComponent.vue";
import SignupComponent from "@/components/authentication/signupComponent.vue";
import { computed, ref } from "vue";

export default {
  name: "LoginUser",
  components: {
    LoginComponent,
    SignupComponent,
  },

  setup() {
    const type = ref("signin");
    const indicatorClass = ref("signin-indicator");
    const switchTab = (data) => {
      type.value = data;
      indicatorClass.value =
        indicatorClass.value == "signin-indicator"
          ? "signup-indicator"
          : "signin-indicator";
    };

    const signinActive = computed(() =>
      type.value == "signin" ? "active" : "none"
    );
    const signupActive = computed(() =>
      type.value == "signup" ? "active" : "none"
    );

    return {
      switchTab,
      type,
      signupActive,
      signinActive,
      indicatorClass,
    };
  },
};
</script>

<template>
  <div id="container">
    <div class="row">
      <div style="width: 50%" class="d-flex justify-center align-center">
        <img src="assets/images/rodeo-logo.png" width="512" height="512" />
      </div>
      <div class="col-form">
        <div class="tabs">
          <div
            :class="'tab-signin tab-button ' + signinActive"
            @click="switchTab('signin')"
          >
            SIGN IN
          </div>
          <div
            :class="'tab-signup tab-button ' + signupActive"
            @click="switchTab('signup')"
          >
            SIGN UP
          </div>
          <span :class="indicatorClass"></span>
        </div>
        <div class="content">
          <keep-alive>
            <login-component v-if="type == 'signin'" />
          </keep-alive>
          <keep-alive>
            <signup-component
              @go-to-login="type = 'signin'"
              v-if="type == 'signup'"
            />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  /* color: #141414; */
  background-color: #cccccc;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  flex-direction: row;
  height: 100%;
}

/* .col-image {
  background-color: #cccccc;
  background-image: url("../../assets/images/rodeo-logo.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  width: 50%;
} */

.col-form {
  padding: 8%;
  background-color: #cccccc;
  width: 55%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.tabs {
  display: flex;
  width: 100%;
  position: relative;
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
  background: var(--RODEONOW_RED);
  color: #fff;
}
.tab-signup {
  padding: 10px;
  width: 50%;
  text-align: center;
}
.signin-indicator {
  position: absolute;
  width: 40px;
  height: 28px;
  left: 50px;
  margin: auto;
  z-index: 999;
  bottom: -33px;
  border-bottom: solid 30px rgb(255, 255, 255);
  border-left: solid 30px transparent;
  border-right: solid 30px transparent;
}
.signup-indicator {
  position: absolute;
  width: 40px;
  height: 28px;
  right: 50px;
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
  max-height: 400px;
}
</style>
