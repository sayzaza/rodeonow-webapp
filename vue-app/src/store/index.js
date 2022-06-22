import { createStore } from "vuex";

import { SpinnerGetters } from "./spinner/getters";
import { SpinnerMutations } from "./spinner/mutations";
import { SpinnerActions } from "./spinner/actions";

import { AlertGetters } from "./alert/getters";
import {AlertMutations } from "./alert/mutations";
import { AlertActions } from "./alert/actions";

const store = createStore({
  state: {
    showSpinner:false,
    showAlert:false,
    alertText:"",
    alertType:""
  },
  getters: {
    ...SpinnerGetters,
    ...AlertGetters,
  },
  mutations: {
    ...SpinnerMutations,
    ...AlertMutations,
  },
  actions: {
    ...SpinnerActions,
    ...AlertActions,
  },
});

export default store;

