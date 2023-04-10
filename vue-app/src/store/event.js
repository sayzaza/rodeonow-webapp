import { createGlobalState, useStorage } from "@vueuse/core";

export const useEventState = createGlobalState(() =>
  useStorage("event", {
    event: "",
    eventType: "",
    location: "",
    date: "",
  })
);
