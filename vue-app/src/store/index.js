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
    alertType:"",
    user: null,
    userProfile: null,
    selectedProfile: null,
    accessibleProfiles: [],
  },
  getters: {
    ...SpinnerGetters,
    ...AlertGetters,
  },
  mutations: {
    ...SpinnerMutations,
    ...AlertMutations,
    SET_USER(state, user) {
      state.user = user
    }, 
    SET_PROFILE(state, profile) {
      state.userProfile = profile
    },
    SET_SELECTED_PROFILE(state, profile) {
      state.selectedProfile = profile
    },
    SET_ACCESSIBLE_PROFILE(state, profiles) {
      state.accessibleProfiles = profiles
    },
  },
  actions: {
    ...SpinnerActions,
    ...AlertActions,
  },
});

export default store;

