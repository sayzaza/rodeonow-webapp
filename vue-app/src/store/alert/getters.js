export const AlertGetters = {
  alert(state) {
    return state.showAlert;
  },
  alertText(state) {
    return state.alertText;
  },

  alertType(state) {
    return state.alertType;
  },
};
