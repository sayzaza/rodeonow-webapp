export const AlertActions = {
  async alert({ commit }) {
    commit("setAlert", false);
  },
  async alertType({ commit }) {
    commit("setAlertType", false);
  },
  async alertText({ commit }) {
    commit("setAlertText", false);
  },
};
