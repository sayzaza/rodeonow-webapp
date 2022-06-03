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
      @changes="changeStatus"
      :isExist="existError"
      :error="isError(userData.email) ? true : false"
      @getInputValue="userData.email = $event"
    />

    <Input
      :placeholder="'Password'"
      :error="isError(userData.password) ? true : false"
      @getInputValue="userData.password = $event"
      :strength="passwordStrength(userData.password) ? false : true"
      :type="'password'"
    />

    <Input
      :placeholder="'Confirm Password'"
      :perror="passwordMatch(userData.confirmPassword) ? false : true"
      :error="isError(userData.confirmPassword) ? true : false"
      @getInputValue="userData.confirmPassword = $event"
      :type="'password'"
    />

    <div class="select-wrap">
      <v-combobox
        v-model="userData.participating_events"
        :items="items"
        label="Participating Event"
        hint="You can select more than one"
        attach
        chips
        :multiple="true"
      ></v-combobox>
    </div>

    <Button :text="'Next'" @buttonClicked="next('good')" />
  </div>
</template>

<script>
import Input from "@/components/utilities/input.vue";
import Button from "@/components/utilities/button.vue";
import { ref } from "vue";
import { validate } from "@/services/validation";
import { checkEmailExist } from "../../../services/authentication.service";
import { useStore } from "vuex";

export default {
  name: "ContestantComponent",
  emits: ["nextSlide", "prevSlide", "alert"],
  components: { Input, Button },
  setup(props, context) {
    const store = useStore();
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
    const existError = ref(false);
    const perror = ref(false);
    const userData = ref({
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      confirmPassword: null,
      participating_events: [],
    });

    const changeStatus = () => {
      existError.value = false;
    };
    const next = async (dat_url) => {
      store.commit("setSpinner");
      const check = await checkEmailExist(userData.value.email);

      check.onSnapshot(async (query) => {
        console.log(query.size);

        dirty.value = true;

        const status = await validate(userData.value);
        console.log(status);
        store.commit("setSpinner");
        if (status.error) {
          if (status.type == "mismatch") {
            perror.value = true;
          }
        } else if (query.size > 0) {
          console.log("greater");
          existError.value = true;
        } else {
          console.log("status==>", userData.value);
          context.emit("nextSlide", userData.value);
        }
      });
    };

    const isError = (value) => {
      if (dirty.value && (value == null || value == "")) {
        return true;
      } else {
        return false;
      }
    };
    const passwordMatch = (value) => {
      if (value !== userData.value.password) {
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

    return {
      userData,
      next,
      items,
      dirty,
      existError,
      isError,
      changeStatus,
      passwordMatch,
      passwordStrength,
      perror,
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
.backBtn {
  width: 80%;
  display: flex;
}
.backBtn > img:hover {
  cursor: pointer;
}
</style>
