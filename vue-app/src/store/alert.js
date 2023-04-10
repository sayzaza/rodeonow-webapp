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

  const setAlert = (type, text, title = "") => {
    Object.assign(alertProps, {
      text,
      title,
      type,
    });
    toggleAlert(true);

    if (type === "success") {
      const { stop } = useTimeout(5000, {
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
    }
  };

  return {
    activeAlert,
    alertProps,
    toggleAlert,
    setAlert,
  };
});
