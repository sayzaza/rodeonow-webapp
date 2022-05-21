<template>
  <div id="content">
    <div class="form" v-if="!loading">
      <Input
        :placeholder="'Email Address'"
        :type="'email'"
        @getInputValue="email = $event"
      />

      <Input
        :placeholder="'password'"
        @getInputValue="password = $event"
        :type="'password'"
      />

      <Button :text="'Login'" @buttonClicked="login" />
      <span>Forget Password</span>
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

export default {
  name: "LoginComponent",
  components: { Input, Button, PulseLoader },
  setup() {
    const loading = ref(false);
    const router = useRouter();
    const email = ref(null);
    const password = ref(null);

    const login = () => {
      if (email.value !== null && password.value !== null) {
        loading.value = true;
        console.log(email.value, password.value);
        setTimeout(() => {
          loading.value = false;
        }, 2000);
      } else {
        alert("All fields required");
      }
    };
    return {
      email,
      password,
      loading,
      login,
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
</style>
