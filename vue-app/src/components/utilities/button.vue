<template>
  <button 
  :style="variant == 'secondary' ? 'background: #afafaf' : ''"
  @click="$emit('buttonClicked')">{{ text }}</button>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  variant: String
})
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
