import { reactive } from "vue";

export const trims = reactive({
  startTime: null,
  endTime: null,
});

export const resetTrims = () => {
  Object.assign(trims, {
    startTime: null,
    endTime: null,
  });
};
