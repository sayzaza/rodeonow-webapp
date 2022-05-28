<template>
  <v-alert dense :type="type">
    {{ text }}
  </v-alert>
</template>

<script>
import { onMounted, watch } from "vue";

export default {
  name: "AlertComponent",
  props: {
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    show: Boolean,
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.v-alert {
  position: absolute;
  top: 0;
}
</style>
