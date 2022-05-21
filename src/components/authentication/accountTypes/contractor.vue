<template>
  <div class="form">
    <Input
      :placeholder="'Contractor Name'"
      :type="'text'"
      @getInputValue="contractor.name = $event"
    />

    <Input
      :placeholder="'Email Address'"
      :type="'email'"
      @getInputValue="contractor.email = $event"
    />

    <Input
      :placeholder="'Password'"
      @getInputValue="contractor.password = $event"
      :type="'password'"
    />

    <Input
      :placeholder="'Confirm Password'"
      @getInputValue="contractor.confirmPassword = $event"
      :type="'password'"
    />

    <Button :text="'Next'" @buttonClicked="$emit('nextSlide', contractor)" />
  </div>
</template>

<script>
import { ref } from "vue";
import Input from "@/components/utilities/input.vue";
import Button from "@/components/utilities/button.vue";

export default {
  name: "ContractorComponent",
  emits: ["nextSlide"],
  components: {
    Input,
    Button,
  },

  setup() {
    const contractor = ref({
      name: null,
      email: null,
      password: null,
      confirmPassword: null,
    });
    return { contractor };
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
