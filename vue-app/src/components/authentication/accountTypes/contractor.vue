<template>
  <div class="form">
    <Input
      :placeholder="'Contractor Name'"
      :type="'text'"
      :error="isError(contractor.name) ? true : false"
      @getInputValue="contractor.name = $event"
    />

    <Input
      :placeholder="'Email Address'"
      :type="'email'"
      @changes="changeStatus"
      :isExist="existError"
      :error="isError(contractor.email) ? true : false"
      @getInputValue="contractor.email = $event"
    />

    <Input
      :placeholder="'Password'"
      :error="isError(contractor.password) ? true : false"
      @getInputValue="contractor.password = $event"
      :strength="passwordStrength(contractor.password) ? false : true"
      :type="'password'"
    />

    <Input
      :placeholder="'Confirm Password'"
      :error="isError(contractor.confirmPassword) ? true : false"
      :perror="passwordMatch(contractor.confirmPassword) ? false : true"
      @getInputValue="contractor.confirmPassword = $event"
      :type="'password'"
    />

    <Button :text="'Next'" @buttonClicked="nextPage" />

    <span class="rbtn" @click="$emit('prevSlide')">Back</span>
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
  name: "ContractorComponent",
  emits: ["nextSlide", "prevSlide"],
  components: {
    Input,
    Button,
  },

  setup(props, context) {
    const dirty = ref(false);
    const existError = ref(false);
    const perror = ref(false);
    const store = useStore();
    const contractor = ref({
      name: null,
      email: null,
      password: null,
      confirmPassword: null,
    });

    const changeStatus = () => {
      existError.value = false;
    };
    const nextPage = async () => {
      store.commit("setSpinner");
      const check = await checkEmailExist(contractor.value.email);

      check.onSnapshot(async (query) => {
        console.log(query.size);
        console.log("next page");
        dirty.value = true;
        store.commit("setSpinner");
        const status = await validate(contractor.value);
        if (status.error) {
          console.log(status.msg);
          if (status.type == "mismatch") {
            perror.value = true;
          }
        } else if (query.size > 0) {
          existError.value = true;
        } else {
          console.log("status==>", status);
          context.emit("nextSlide", contractor.value);
        }
      });
    };
    const passwordMatch = (value) => {
      if (value !== contractor.value.password) {
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
      nextPage,
      perror,
      passwordStrength,
      passwordMatch,
      changeStatus,
      existError,
      contractor,
      isError,
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
</style>
