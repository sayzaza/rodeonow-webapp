import { computed, ref } from "vue";
import { createGlobalState } from "@vueuse/core";

export const useSelectedAnimal = createGlobalState(() => {
  const selected = ref("all");

  // const getSelected = computed(() => selected.value);

  return {
    selected,
    // getSelected,
  };
});
