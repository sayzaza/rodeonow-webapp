<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      scrollable
      width="400px"
    >
      <v-card width="400px">
        <v-card-title>User Account</v-card-title>
        <v-btn
          v-if="!loading"
          @click="close"
          color="error" variant="icon" class="close-icon" icon>
            <v-icon>fas fa-close</v-icon>
        </v-btn>
        <v-divider></v-divider>
          <v-card-text class="px-0 py-3">
              <div
            class="d-flex flex-column"
            style="width: 100%; height: 100%;"
            >
            <div
            v-show="!loading"
            v-for="(acc, index) in accessible_accounts"
            @click="selectedAccountIndex = index"
            :key="acc.email"
            :style="selectedAccountIndex == index ? 'background-color: rgb(216, 216, 216)' : ''"
            style="width: 100%;"
            class="d-flex align-center py-3 account">
                <div class="px-3">
                <v-avatar
                    color="transparent"
                    size="56"
                >
                <img
                style="height: 56px; width: auto;"
                v-if="acc.photo_url && acc.photo_url.length > 0"
                :src="acc.photo_url"/>
                <!-- <span>{{ `${acc.first_name.charAt(0)}${acc.last_name.charAt(0)}` }}</span> -->
                </v-avatar>
                </div>
                <div class="d-flex flex-column align-start">
                <div class="subtitle-1">{{ acc.name ? acc.name : `${acc.first_name} ${acc.last_name}` }}</div>
                <div class="text-caption">{{ acc.email }}</div>
                </div>
                <div class="ml-auto pr-2">
                <svg xmlns="http://www.w3.org/2000/svg"
                v-if="selectedAccountIndex == index"
                style="width: 2rem" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                </div>
            </div>

            <div class="pt-6"></div>

            <PulseLoader
            v-if="loading"
            class="spinner"
            :loading="loading"
            color="#2c3346"
            ></PulseLoader>

            <Button
            v-if="accessible_accounts.length > 0"
            class="mx-auto mt-auto"
            :text="'Continue'" @buttonClicked="chooseUser" />
            </div>
          </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue'
import Button from "@/components/utilities/button.vue";
import { getUserAccessibleProfiles } from '@/services/profiles'
import { useStore } from 'vuex'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default {
  components: { Button, PulseLoader },
  setup() {
    const store = useStore()
    const selectedAccountIndex = ref(0)
    const loading = ref(false)
    const accessible_accounts = computed({
        get: () => {
            return store.state.accessibleProfiles
        },
    })
    const dialog = computed({
        get: () => {
            return store.state.switchUserModal
        },
        set: (value) => {
            store.commit('SWITCH_USER_MODAL', value)
        }
    })

    const close = function () {
      loading.value = false
      dialog.value = false
    }
    const userProfile = computed(() => {
        return store.state.userProfile
    })

    const chooseUser = () => {
        loading.value = true
        const db = getFirestore()
        const current_accessed_account = accessible_accounts.value[selectedAccountIndex.value]
        return setDoc(doc(db, 'users', store.state.user.uid), {
            current_accessed_account: current_accessed_account.id
        }, {merge: true})
        .then(() => {
            loading.value = false
            dialog.value = false
        })
        .catch(console.error)
    }

    watch(userProfile, () => {
        getUserAccessibleProfiles(userProfile.value)
    })

    const initialSetup = () => {
        getUserAccessibleProfiles(userProfile.value).then(() => {
            selectedAccountIndex.value = accessible_accounts.value.map(x => x.id).indexOf(store.state.selectedProfile.id)
        })
    }

    onMounted(() => {
        initialSetup()
    })

    return {
        dialog,
        close,
        accessible_accounts,
        chooseUser,
        selectedAccountIndex,
        loading
    }
  }
}

</script>

<style scoped>
.account {
  cursor: pointer;
  transition: .25s ease-in-out;
}
.account:hover {
  background-color: rgb(243, 243, 243);
}
.spinner {
  z-index: 99
}
.v-spinner {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  height: fit-content;
  width: fit-content;
}

.close-icon {
  position: absolute;
  top: 2px;
  right: 2px;
}
</style>
