<template>
  <button @click="$emit('buttonClicked')">{{ text }}</button>
</template>

<script>
export default {
  name: "ButtonComponent",
  emits: ["buttonClicked"],
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped lang="scss">
button {
  outline: 0;
  border: 0;
  background: var(--RODEONOW_RED);
  color: #fff;
  padding: 10px;
  width: 60%;
  border-radius: 25px;
}

button:hover {
  background: rgb(124, 2, 2);
}
</style>
