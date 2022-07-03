import { createStore } from "vuex";

import { SpinnerGetters } from "./spinner/getters";
import { SpinnerMutations } from "./spinner/mutations";
import { SpinnerActions } from "./spinner/actions";

import { AlertGetters } from "./alert/getters";
import {AlertMutations } from "./alert/mutations";
import { AlertActions } from "./alert/actions";

import { onSnapshot } from 'firebase/firestore'

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
    subscribers: {},
    switchUserModal: false,
    modalVideo: null,
    videoPlayerModal: false,
    videos: []
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
    SET_ACCESSIBLE_PROFILES(state, profiles) {
      state.accessibleProfiles = profiles
    },
    SET_SUBSCRIBER(state, { key, subscriber }) {
      try {
        state.subscribers[key]();
      } catch (error) {}
      state.subscribers[key] = subscriber
    },
    SET_FIRESTORE_VALUE(state, { key, doc}) {
      state[key] = doc
    },
    VIDEO_PLAYER_MODAL(state, value) {
      state.videoPlayerModal = value
    },
    SET_MODAL_VIDEO(state, video) {
      state.modalVideo = video
    },
    SWITCH_USER_MODAL(state, value) {
      state.switchUserModal = value
    }
  },
  actions: {
    ...SpinnerActions,
    ...AlertActions,
    bindRef({ commit }, { key, ref, callback }) {
      let subscriber = onSnapshot(ref, async (snapDoc) => {
        let doc = {
          ...snapDoc.data(),
          id: snapDoc.id
        };
        if(callback) doc = await callback(doc)
        commit("SET_FIRESTORE_VALUE", { key, doc });
      });
      commit('SET_SUBSCRIBER', { key, subscriber })
    },
    bindCollectionRef({ commit }, { key, ref, callback }) {
      let subscriber = onSnapshot(ref, async (snapDocs) => {
        let docs = snapDocs.docs.map(snapDoc => ({
            ...snapDoc.data(),
            id: snapDoc.id
        }))
        if(callback) docs = await callback(docs)
        commit("SET_FIRESTORE_VALUE", { key, doc: docs });
      });
      commit('SET_SUBSCRIBER', { key, subscriber })
    },
    clearSubscribers({commit, state}) {
      Object.keys(state.subscribers).forEach(key => {
        try {
          state.subscribers[key]()
        } catch (error) {}
        commit('SET_SUBSCRIBER', { key, subscriber: null })
        commit('SET_FIRESTORE_VALUE', { key, doc: null })
      })
      commit('SET_ACCESSIBLE_PROFILES', [])
    }
  },
});

export default store;

