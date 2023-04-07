import { computed, ref } from "vue";
import { createGlobalState } from "@vueuse/core";

export const useStepState = createGlobalState(() => {
  const step = ref(0);

  const getStep = computed(() => (step.value == 0 ? 50 : 100));

  return {
    step,
    getStep,
  };
});
