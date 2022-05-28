<template>
  <div class="form">
    <Input
      :placeholder="'First Name'"
      :type="'text'"
      :error="isError(userData.first_name) ? true : false"
      @getInputValue="userData.first_name = $event"
    />

    <Input
      :placeholder="'Last Name'"
      :type="'text'"
      :error="isError(userData.last_name) ? true : false"
      @getInputValue="userData.last_name = $event"
    />

    <Input
      :placeholder="'Email Address'"
      :type="'email'"
      :error="isError(userData.email) ? true : false"
      @getInputValue="userData.email = $event"
    />

    <Input
      :placeholder="'Password'"
      :error="isError(userData.password) ? true : false"
      @getInputValue="userData.password = $event"
      :type="'password'"
    />

    <Input
      :placeholder="'Confirm Password'"
      :error="isError(userData.confirmPassword) ? true : false"
      @getInputValue="userData.confirmPassword = $event"
      :type="'password'"
    />

    <div class="select-wrap">
      <v-combobox
        v-model="userData.participating_events"
        :items="items"
        hide-selected
        label="Participating Event"
        multiple
        persistent-hint
        small-chips
      ></v-combobox>
    </div>

    <Button :text="'Next'" @buttonClicked="next('good')" />

    <span @click="$emit('prevSlide')">Back</span>
  </div>
</template>

<script>
import Input from "@/components/utilities/input.vue";
import Button from "@/components/utilities/button.vue";
import { ref } from "vue";
import { validate } from "@/services/validation";

export default {
  name: "ContestantComponent",
  emits: ["nextSlide", "prevSlide", "alert"],
  components: { Input, Button },
  setup(props, context) {
    const items = [
      "Bull Riding",
      "Bareback Riding",
      "Saddle Bronc",
      "Team Roping",
      "Barrel Racing",
      "Steer Wrestling",
      "Tie Down Roping",
      "Breakaway Roping",
    ];
    // const alertType = ref(null);
    // const alertText = ref(null);
    // const alertShow = ref(null);
    const dirty = ref(false);
    const userData = ref({
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      confirmPassword: null,
      participating_events: [],
    });

    const next = async (dat_url) => {
      dirty.value = true;
      const status = await validate(userData.value);
      if (status.error) {
        console.log(status.msg);
      } else {
        console.log("status==>", userData.value);
        context.emit("nextSlide", userData.value);
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
      userData,
      next,
      items,
      dirty,
      isError,
      // alertType,
      // alertText,
      // alertShow,
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
.select-wrap {
  width: 80%;
  padding: 15px 20px;
}

.alert {
  position: absolute;
  top: 0;
}
</style>
