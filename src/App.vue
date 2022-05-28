<template>
  <v-app>
    <v-alert v-if="alertShow" dense :type="alertType">
      {{ alertText }}
    </v-alert>

    <div class="spinner-wrapper" v-if="submitting">
      <PulseLoader
        class="spinner"
        :loading="submitting"
        color="#ffffff"
      ></PulseLoader>
    </div>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { computed, ref } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useStore } from "vuex";
// import Alert from "./components/utilities/alert.vue";

export default {
  name: "App",
  components: { PulseLoader },
  setup() {
    const store = useStore();
    console.log(store);
    const submitting = computed(() => {
      return store.getters.spinner;
    });
    const alertText = computed(() => {
      return store.getters.alertText;
    });
    const alertShow = computed(() => {
      return store.getters.alert;
    });
    const alertType = computed(() => {
      return store.getters.alertType;
    });
    return {
      submitting,
      alertText,
      alertShow,
      alertType,
    };
  },
};
</script>

<style scoped>
.spinner-wrapper {
  height: 100vh;
  width: 100vw;
  position: absolute;
  background: #00000085;
  /* top: 0; */
  z-index: 99999999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.v-alert {
  position: absolute;
  z-index: 99;
  width: 100%;
  height: 80px;
  font-size: 20px;
  font-weight: 600;
}
</style>
