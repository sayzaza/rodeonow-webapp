<template>
  <div class="form">
    <Input
      :placeholder="'First Name'"
      :type="'text'"
      @getInputValue="rodeoFan.firstName = $event"
    />

    <Input
      :placeholder="'Last Name'"
      :type="'text'"
      @getInputValue="rodeoFan.lastName = $event"
    />

    <Input
      :placeholder="'Email Address'"
      :type="'email'"
      @getInputValue="rodeoFan.email = $event"
    />

    <Input
      :placeholder="'Password'"
      @getInputValue="rodeoFan.password = $event"
      :type="'password'"
    />

    <Input
      :placeholder="'Confirm Password'"
      @getInputValue="rodeoFan.confirmPassword = $event"
      :type="'password'"
    />

    <Button :text="'Next'" @buttonClicked="$emit('nextSlide', rodeoFan)" />
  </div>
</template>

<script>
import { ref } from "vue";
import Input from "@/components/utilities/input.vue";
import Button from "@/components/utilities/button.vue";

export default {
  name: "FanComponent",
  emits: ["nextSlide"],
  components: {
    Input,
    Button,
  },

  setup() {
    const rodeoFan = ref({
      fristName: null,
      lastName: null,
      email: null,
      password: null,
      confirmPassword: null,
    });
    return { rodeoFan };
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
