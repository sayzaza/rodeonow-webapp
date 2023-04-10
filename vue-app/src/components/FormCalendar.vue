<script setup>
import { computed, ref, watch, onMounted } from "vue";

// eslint-disable-next-line no-undef
const props = defineProps(["modelValue"]);
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:modelValue"]);

const calendar = ref();

const today = ref(false);

const todayDate = computed(() => {
  let date = new Date();
  return date.toISOString().split("T").at(0);
});

watch(today, () => {
  if (today.value) {
    emit("update:modelValue", todayDate.value);
  }
});

watch(
  () => props.modelValue,
  // eslint-disable-next-line no-unused-vars
  (newV, _oldV) => {
    if (newV != todayDate.value) {
      today.value = false;
    } else {
      today.value = true;
    }
  }
);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

onMounted(() => {
  if (props.modelValue === todayDate.value) {
    today.value = true;
  }
});
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<template>
  <div class="d-flex" style="width: 100%; position: relative">
    <v-text-field
      type="date"
      ref="calendar"
      v-model="value"
      v-bind="$attrs"
      @focus="(_$event) => calendar.showPicker()"
    />
    <div
      class="d-flex align-center"
      style="position: absolute; bottom: 9px; right: 0"
    >
      <span class="text-caption">TODAY</span>
      <v-checkbox
        color="primary"
        hide-details
        v-model="today"
        :disabled="today"
        :key="today"
      />
    </div>
  </div>
</template>

<style>
input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}
</style>
