<template>
  <div class="form">
    <div class="backBtn">
      <img
        src="assets/icons/back.png"
        width="50"
        @click="$emit('prevSlide')"
        alt=""
      />
    </div>
    <Input
      :placeholder="'First Name'"
      :type="'text'"
      :error="isError(rodeoFan.first_name) ? true : false"
      @getInputValue="rodeoFan.first_name = $event"
    />

    <Input
      :placeholder="'Last Name'"
      :type="'text'"
      :error="isError(rodeoFan.last_name) ? true : false"
      @getInputValue="rodeoFan.last_name = $event"
    />

    <Input
      :placeholder="'Email Address'"
      :type="'email'"
      @changes="changeStatus"
      :isExist="existError"
      :error="isError(rodeoFan.email) ? true : false"
      @getInputValue="rodeoFan.email = $event"
    />

    <Input
      :placeholder="'Password'"
      :error="isError(rodeoFan.password) ? true : false"
      :strength="passwordStrength(rodeoFan.password) ? false : true"
      @getInputValue="rodeoFan.password = $event"
      :type="'password'"
    />

    <Input
      :placeholder="'Confirm Password'"
      :error="isError(rodeoFan.confirmPassword) ? true : false"
      :perror="passwordMatch(rodeoFan.confirmPassword) ? false : true"
      @getInputValue="rodeoFan.confirmPassword = $event"
      :type="'password'"
    />

    <Button :text="'Next'" @buttonClicked="nextPage" />
  </div>
</template>

<script>
import { ref } from "vue";
import Input from "@/components/utilities/input.vue";
import Button from "@/components/utilities/button.vue";
import { validate } from "@/services/validation";
import { checkEmailExist } from "../../../services/authentication.service";
import { useStore } from "vuex";
export default {
  name: "FanComponent",
  emits: ["nextSlide", "prevSlide"],
  components: {
    Input,
    Button,
  },

  setup(props, context) {
    const dirty = ref(false);
    const store = useStore();
    const existError = ref(false);
    const rodeoFan = ref({
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      confirmPassword: null,
    });

    const changeStatus = () => {
      existError.value = false;
    };

    const nextPage = async () => {
      store.commit("setSpinner");
      const check = await checkEmailExist(rodeoFan.value.email);

      check.onSnapshot(async (query) => {
        dirty.value = true;
        const status = await validate(rodeoFan.value);
        if (status.error) {
          console.log(status.msg);
          alert;
        } else if (query.size > 0) {
          existError.value = true;
        } else {
          console.log("status==>", status);
          context.emit("nextSlide", rodeoFan.value);
        }
      });
    };

    const passwordMatch = (value) => {
      if (value !== rodeoFan.value.password) {
        return false;
      } else {
        return true;
      }
    };

    const passwordStrength = (value) => {
      if (!value) return;
      if (value.length > 5) {
        return true;
      } else {
        return false;
      }
    };

    const isError = (value) => {
      if (dirty.value && (value == null || value == "")) {
        return true;
      } else {
        return false;
      }
    };
    return {
      passwordMatch,
      existError,
      changeStatus,
      passwordStrength,
      rodeoFan,
      isError,
      nextPage,
    };
  },
};
</script>

<style scoped>
.form {
  height: 100%;
  /* background: red; */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.backBtn {
  width: 80%;
  display: flex;
}
.backBtn > img:hover {
  cursor: pointer;
}
</style>
