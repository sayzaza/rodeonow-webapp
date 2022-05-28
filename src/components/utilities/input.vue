<template>
  <div class="input-wrap">
    <input
      :type="type"
      :placeholder="placeholder"
      v-model="inputValue"
      @input.prevent="emitValue($event)"
    />
    <span class="error" v-if="error">{{ placeholder }} is required</span>
    <span class="error" v-if="type == 'password' && perror"
      >Password not match</span
    >
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "ButtonComponent",
  emits: ["getInputValue"],
  props: {
    type: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    error: {
      type: Boolean,
      required: false,
    },
    perror: {
      type: Boolean,
      required: false,
    },
  },

  setup(props, context) {
    const inputValue = ref(null);
    const router = useRouter();
    const emitValue = () => {
      context.emit("getInputValue", inputValue.value);
    };
    // console.log("---------===", router.currentRoute.value);
    return {
      emitValue,
      inputValue,
    };
  },
};
</script>

<style scoped>
input {
  display: block;
  width: 100%;
  border: none;
  outline: 0;
  font-size: 14px;
  border-bottom: 1px solid #000;
}

.input-wrap {
  width: 80%;
  padding: 15px 20px;
  text-align: left;
}
label {
  font-size: 14px;
  text-align: left;
  width: 100%;
}

.error {
  color: red;
  font-size: 12px;
  width: 100%;
}
</style>
