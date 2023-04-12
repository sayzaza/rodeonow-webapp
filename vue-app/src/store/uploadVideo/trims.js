import { reactive, computed } from "vue";

export const trims = reactive({
  startTime: null,
  endTime: null,
});

export const duration = computed(() =>
  Math.abs(trims.endTime - trims.startTime)
);

export const resetTrims = () => {
  Object.assign(trims, {
    startTime: null,
    endTime: null,
  });
};
