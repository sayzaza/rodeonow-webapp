<template>
  <div class="form">
    <Input
      :placeholder="'Contractor Firstname'"
      :type="'text'"
      :error="isError(contractor.first_name) ? true : false"
      @getInputValue="contractor.first_name = $event"
    />

    <Input
      :placeholder="'Contractor Lastname'"
      :type="'text'"
      :error="isError(contractor.last_name) ? true : false"
      @getInputValue="contractor.last_name = $event"
    />

    <Input
      :placeholder="'Email Address'"
      :type="'email'"
      :error="isError(contractor.email) ? true : false"
      @getInputValue="contractor.email = $event"
    />

    <Input
      :placeholder="'Password'"
      :error="isError(contractor.password) ? true : false"
      @getInputValue="contractor.password = $event"
      :type="'password'"
    />

    <Input
      :placeholder="'Confirm Password'"
      :error="isError(contractor.confirmPassword) ? true : false"
      @getInputValue="contractor.confirmPassword = $event"
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
  name: "ContractorComponent",
  emits: ["nextSlide", "prevSlide"],
  components: {
    Input,
    Button,
  },

  setup(props, context) {
    const dirty = ref(false);
    const contractor = ref({
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      confirmPassword: null,
    });

    const nextPage = async () => {
      console.log("next page");
      dirty.value = true;
      const status = await validate(contractor.value);
      if (status.error) {
        console.log(status.msg);
        alert;
      } else {
        console.log("status==>", status);
        context.emit("nextSlide", contractor.value);
      }
    };
    const isError = (value) => {
      if (dirty.value && (value == null || value == "")) {
        return true;
      } else {
        return false;
      }
    };
    return { nextPage, contractor, isError };
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
