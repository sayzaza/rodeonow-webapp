<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      scrollable
      width="400px"
    >
      <v-card width="400px">
        <v-card-title v-if="!showConfirmation">Account Type</v-card-title>
        <span v-if="!showConfirmation" class="mb-2" style="color:grey;">Change account type</span>
        <!-- <v-btn
        v-if="!loading && !showConfirmation"
        @click="close"
        color="error" variant="icon" class="close-icon" icon>
          <v-icon>fas fa-close</v-icon>
        </v-btn> -->
          <v-card-text class="px-0 py-3" v-if="!showConfirmation">
            <v-divider v-if="!showConfirmation"></v-divider>
            <v-btn variant="flat" :disabled="store.state.selectedProfile.account_type == 1" :color="store.state.selectedProfile.account_type == 1 ? 'darkgrey':''" width="100%" size="large" block @click="changeType('contractor')">Contractor</v-btn>
            <v-divider></v-divider>
            <v-btn
            variant="flat"
            block size="large" :disabled="store.state.selectedProfile.account_type == 2" :color="store.state.selectedProfile.account_type == 2 ? 'darkgrey':''" @click="changeType('contestant')">Contestant</v-btn>
            <v-divider></v-divider>
            <v-btn size="large" variant="flat" :disabled="store.state.selectedProfile.account_type == 3" :color="store.state.selectedProfile.account_type == 3 ? 'darkgrey':''"
            block @click="changeType('rodeo fan')">Rodeo Fan</v-btn>
            <v-divider></v-divider>
            <div
            class="d-flex flex-column mt-4"
            style="width: 100%; height: 100%;"
            >
            <Button
              style="width:30%;"
              class="mx-auto mt-auto"
              :text="'Cancel'" @buttonClicked="close" />
            </div>
          </v-card-text>
          <v-card-text class="px-0 pt-6 " v-else>
            <span v-if="!loading" class="pb-3 text-subtitle-2">Changing this account type may alter your account but can be reverted. Are you sure you want to proceed?</span>
            <PulseLoader
            v-if="loading"
            class="spinner"
            :loading="loading"
            color="#2c3346"
            ></PulseLoader>
            <div v-if="!loading" class="d-flex" style="width: 100%">
              <v-btn variant="flat" style="width: 50%" @click="backToChangeType">No</v-btn>
              <v-btn variant="flat" style="width: 50%" @click="actuallyChangeType">Yes</v-btn>
            </div>
          </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
 import { computed, ref, onMounted, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import Button from "@/components/utilities/button.vue";

const store = useStore()
const loading = ref(false)
const showConfirmation = ref(false)
const dialog = computed({
    get: () => {
        return store.state.changeAccTypeModel
    },
    set: (value) => {
        store.commit('CHANGE_ACC_TYPE_MODAL', value)
    }
})
const accountType = ref('')
const close = function () {
  dialog.value = false
  accountType.value = ''
  loading.value = false
  setTimeout(() => {
    showConfirmation.value = false
  }, 300);
}
const actuallyChangeType = function() {
  loading.value = true
  const db = getFirestore()
  return setDoc(doc(db, 'users', store.state.user.uid), {
      account_type: ['contractor', 'contestant', 'rodeo fan'].indexOf(accountType.value) + 1
  }, {merge: true})
  .then(close)
  .catch(console.error)
}
onUnmounted(() => {
  close()
})
const changeType = function (type) {
  accountType.value = type
  showConfirmation.value = true
}

const backToChangeType = function(){
  accountType.value = ''
  showConfirmation.value = false
}
</script>

<style scoped>
* {
  text-align: center;
}

/* .close-icon {
  position: absolute;
  top: 2px;
  right: 2px;
} */
</style>
