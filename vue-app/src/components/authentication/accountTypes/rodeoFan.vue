<template>
  <div class="form">
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
      :error="isError(rodeoFan.email) ? true : false"
      @getInputValue="rodeoFan.email = $event"
    />

    <Input
      :placeholder="'Password'"
      :error="isError(rodeoFan.password) ? true : false"
      @getInputValue="rodeoFan.password = $event"
      :type="'password'"
    />

    <Input
      :placeholder="'Confirm Password'"
      :error="isError(rodeoFan.confirmPassword) ? true : false"
      @getInputValue="rodeoFan.confirmPassword = $event"
      :type="'password'"
    />

    <Button :text="'Next'" @buttonClicked="nextPage" />

    <span @click="$emit('prevSlide')">Back</span>
  </div>
</template>

<script>
import { ref } from "vue";
import Input from "@/components/utilities/input.vue";
import Button from "@/components/utilities/button.vue";
import { validate } from "@/services/validation";
export default {
  name: "FanComponent",
  emits: ["nextSlide", "prevSlide"],
  components: {
    Input,
    Button,
  },

  setup(props, context) {
    const dirty = ref(false);
    const rodeoFan = ref({
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      confirmPassword: null,
    });

    const nextPage = async () => {
      dirty.value = true;
      const status = await validate(rodeoFan.value);
      if (status.error) {
        console.log(status.msg);
        alert;
      } else {
        console.log("status==>", status);
        context.emit("nextSlide", rodeoFan.value);
      }
    };

    const isError = (value) => {
      if (dirty.value && (value == null || value == "")) {
        return true;
      } else {
        return false;
      }
    };
    return { rodeoFan, isError, nextPage };
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
</style>
