<template>
  <div id="content">
    <div class="form" v-if="!loading">
      <Input
        :placeholder="'Email Address'"
        :type="'email'"
        @getInputValue="email = $event"
      />

      <Input
        v-if="!recoverPassword"
        :placeholder="'password'"
        @getInputValue="password = $event"
        :type="'password'"
      />

      <Button v-if="!recoverPassword" :text="'Login'" @buttonClicked="login" />
      <Button v-else :text="'Recover'" @buttonClicked="recover" />
      <span class="mt-10 link" @click="forgetPassword">Forget Password</span>
    </div>
    <PulseLoader
      v-else
      class="spinner"
      :loading="loading"
      color="#2c3346"
    ></PulseLoader>
  </div>
</template>

<script>
import { ref } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useRouter } from "vue-router";
import Input from "../utilities/input.vue";
import Button from "../utilities/button.vue";
import { useStore } from "vuex";
import {
  loginUser,
  recoverUserPassword,
} from "@/services/authentication.service";

export default {
  name: "LoginComponent",
  components: { Input, Button, PulseLoader },
  setup() {
    const loading = ref(false);
    const router = useRouter();
    const store = useStore();
    const recoverPassword = ref(false);
    const email = ref(null);
    const password = ref(null);

    const forgetPassword = () => {
      recoverPassword.value = true;
    };

    const recover = async () => {
      // recoverPassword.value = true;
      loading.value = true;
      const response = await recoverUserPassword(email.value);
      console.log(response);
      recoverPassword.value = false;
      loading.value = false;
      if (!response.error) {
        store.commit("setAlert");
        store.commit("setAlertType", "success");
        store.commit("setAlertText", "check your email for reset instructions");
      } else {
        store.commit("setAlert");
        store.commit("setAlertType", "error");
        store.commit("setAlertText", response.error.message);
      }
    };
    const login = async () => {
      if (email.value !== null && password.value !== null) {
        loading.value = true;
        const response = await loginUser({
          email: email.value,
          password: password.value,
        });
        loading.value = false;
        if (response.result) {
          console.log(response);

          store.commit("setAlert");
          store.commit("setAlertType", "success");
          store.commit("setAlertText", "Login successful");
          router.replace("/portal");
        } else {
          store.commit("setAlert");
          store.commit("setAlertType", "error");
          store.commit("setAlertText", response.error.message);
        }
      } else {
        store.commit("setAlert");
        store.commit("setAlertType", "warning");
        store.commit("setAlertText", "All field are required");
      }
    };
    return {
      email,
      password,
      loading,
      recoverPassword,
      forgetPassword,
      login,
      recover,
    };
  },
};
</script>

<style scoped>
#content {
  height: 100%;
  position: relative;
}
.form {
  height: 100%;
  /* background: red; */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
Button {
  margin-top: 20px;
}
.v-spinner {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  height: fit-content;
  width: fit-content;
}
.mt-10 {
  margin-top: 10px;
}
.link {
  cursor: pointer;
}
</style>
