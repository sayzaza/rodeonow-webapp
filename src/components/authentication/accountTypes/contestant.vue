<template>
  <div class="form">
    <Input
      :placeholder="'First Name'"
      :type="'text'"
      @getInputValue="userData.firstName = $event"
    />

    <Input
      :placeholder="'Last Name'"
      :type="'text'"
      @getInputValue="userData.lastName = $event"
    />

    <Input
      :placeholder="'Email Address'"
      :type="'email'"
      @getInputValue="userData.email = $event"
    />

    <Input
      :placeholder="'Password'"
      @getInputValue="userData.password = $event"
      :type="'password'"
    />

    <Input
      :placeholder="'Confirm Password'"
      @getInputValue="userData.confirmPassword = $event"
      :type="'password'"
    />

    <select v-model="userData.participatingEvent">
      <option>option1</option>
      <option>option2</option>
      <option>option3</option>
      <option>option4</option>
    </select>

    <Button :text="'Next'" @buttonClicked="$emit('nextSlide', userData)" />

    <span>Back</span>
  </div>
</template>

<script>
import Input from "@/components/utilities/input.vue";
import Button from "@/components/utilities/button.vue";
import { ref } from "vue";
export default {
  name: "ContestantComponent",
  emits: ["nextSlide"],
  setup() {
    const userData = ref({
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      confirmPassword: null,
    });
    return {
      userData,
    };
  },
  components: { Input, Button },
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
Button {
  margin-top: 10px;
}

select {
  width: 70%;
  border: none;
  border-bottom: 1px solid #000;
  padding: 5px 20px;
  outline: none;
}
</style>
