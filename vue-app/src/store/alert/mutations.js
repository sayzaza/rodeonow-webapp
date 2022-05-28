export const AlertMutations = {
  setAlert(state) {
    // console.log(clubs);
    state.showAlert = !state.showAlert;

    setTimeout(() => {
      state.showAlert = !state.showAlert;
      state.alertText = "";
    }, 2000);
    // console.log(state.clubs);
  },
  setAlertType(state,value) {
    // console.log(clubs);
    state.alertType = value;

  },
  setAlertText(state,value) {
    // console.log(clubs);
    state.alertText = value;

  },
};
