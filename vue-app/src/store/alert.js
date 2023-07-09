import { ref, reactive, watch } from "vue";
import { createGlobalState, useToggle, useTimeout } from "@vueuse/core";

export const useAlertState = createGlobalState(() => {
  const activeAlert = ref(false);

  const toggleAlert = useToggle(activeAlert);

  const alertProps = reactive({
    text: "",
    title: "",
    type: "",
  });

  const closeAlert = () => {
    Object.assign(alertProps, {
      text: "",
      title: "",
      type: "",
    });
    toggleAlert(false);
  };

  const setAlert = (type, text, title = "", duration = 7000) => {
    Object.assign(alertProps, {
      text,
      title,
      type,
    });
    toggleAlert(true);

    const { stop } = useTimeout(duration, {
      controls: true,
      callback() {
        closeAlert();
      },
    });

    watch(activeAlert, (n_v, o_v) => {
      if (n_v === false && o_v === true) {
        stop();
      }
    });
  };

  return {
    activeAlert,
    alertProps,
    toggleAlert,
    setAlert,
  };
});
