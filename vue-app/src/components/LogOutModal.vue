<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable width="400px">
      <v-card width="400px">
        <v-card-text class="padding: 20x 0"> 
          <div v-if="!loading" style="height: 20px"></div>
          <span v-if="!loading" class="">Are you sure you want to logout?</span>
          <div  v-if="!loading" style="height: 20px"></div>

          <PulseLoader
            v-if="loading"
            class="spinner"
            :loading="loading"
            color="#2c3346"
            ></PulseLoader>

            <div v-if="!loading" class="d-flex" style="width: 100%;">
              
              <v-btn autofocus color="primary" style="margin-right: 3px; width: 50%" @click="() => {$emit('logout'); close()}">Yes</v-btn>

              <v-btn variant="outlined" color="black" style="width: 50%" @click="close">No</v-btn>
            </div>
          <div v-if="!loading" style="height: 20px"></div>

        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { computed, ref, onMounted, watch, onUnmounted } from "vue";
import { useStore } from "vuex";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import Button from "@/components/utilities/button.vue";

const store = useStore();
const loading = ref(false);
const dialog = computed({
  get: () => {
    return store.state.logOutModel;
  },
  set: (value) => {
    store.commit("LOGOUT_MODAL", value);
  },
});
const close = function () {
  dialog.value = false;
  loading.value = false;
};
onUnmounted(() => {
  close();
});

</script>

<style scoped>
* {
  text-align: center;
}
</style>
