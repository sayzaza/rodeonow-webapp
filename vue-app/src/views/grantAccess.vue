<template>
  <div
    class="d-flex flex-column mx-auto my-6"
    style="max-width: 900px; position: relative"
  >
    <v-card
      flat
      class="d-flex justify-space-between mb-3 align-center py-3"
      style="position: sticky; top: 0; left: 0; z-index: 9; width: 100%"
    >
      <span class="text-subtitle-1 font-weight-bold">Grant Account Access</span>

      <v-btn
        icon
        @click="popInviteModal"
        size="small"
        variant="text"
        class="d-flex items-center justify-center mr-2 ml-auto"
      >
        <img
        width="32"
          :src="require('@/assets/icons/glyph/glyphs/plus.circle.red.png')"
        />
      </v-btn>
    </v-card>

    <div class="d-flex flex-col">
      <v-btn-toggle v-model="toggle" rounded mandatory>
        <v-btn value="users"> Users </v-btn>
        <v-btn value="accounts"> Accounts </v-btn>
        <v-btn value="invites"> Invites </v-btn>
        <v-btn value="requests"> Requests </v-btn>
      </v-btn-toggle>

      <v-btn 
      @click="initialSetup" color="error" variant="text" class="ml-2" icon>
          <img style="width: 30px;" :src="require('@/assets/icons/glyph/glyphs/gobackward.png')" />
      </v-btn>
    </div>

    <span class="my-3"></span>

    <div v-if="['accounts', 'users'].includes(toggle)">
      <span v-if="toggle == 'users'" class="text-body-1 text--disabled">These users have access to your account.</span>
      <span v-if="toggle == 'accounts'" class="text-body-1 text--disabled">These accounts you have access to.</span>
      
      <div class="d-flex justify-center">
        <PulseLoader
          v-if="loading"
          class="spinner mx-auto"
          :loading="loading"
          color="#2c3346"
        ></PulseLoader>
      </div>

      <usersComp :users="users" />
    </div>

    <div class="d-flex flex-column" v-if="['invites', 'requests'].includes(toggle)">
      <span v-if="toggle == 'invites'" class="text-body-1 text--disabled"
        >These are requests you've sent to gain access to someone else's account or received for account access to your account.</span
      >
      <div class="d-flex justify-center">
        <PulseLoader
          v-if="loading && toggle == 'invites'"
          class="spinner mx-auto"
          :loading="loading"
          color="#2c3346"
        ></PulseLoader>
      </div>
      <usersComp type="invites" :users="sentReceivedUsers" v-if="toggle == 'invites'" :received="true" />
      <usersComp :users="users" v-if="toggle == 'invites'" />

      <span v-if="toggle == 'requests'" class="text-body-1 text--disabled">These are invitations you've sent for someone else to gain access to your account or received for access to someone else's account.</span>

      <div class="d-flex justify-center">
        <PulseLoader
          v-if="loading && toggle == 'requests'"
          class="spinner mx-auto"
          :loading="loading"
          color="#2c3346"
        ></PulseLoader>
      </div>

      <usersComp type="requests" :users="sentReceivedUsers" v-if="toggle == 'requests'" :received="true" />
      <usersComp :users="users" v-if="toggle == 'requests'" />
    </div>
    
    <v-dialog
      v-model="inviteModal"
    max-width="500px"    
    >
      <v-card>
          <v-card-title class="text-center text--disabled text-subtitle-1">
              <!-- <span>Invite</span> -->
          </v-card-title>
        <v-card-text>
          <v-btn variant="flat" width="100%" block @click="inviteUserByEmail">Invite user By Email</v-btn>
          <v-divider class="my-2"></v-divider>
          <v-btn variant="flat" 
          block @click="requestAccountAccess">Request Account Access</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="inviteModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="inviteByEmail"
    min-width="500px"    
    >
      <v-card>
          <v-card-title class="text-center text--disabled text-subtitle-1">
              <span>Invite User By Email</span>
          </v-card-title>
        <v-card-text>
            <v-form v-if="inviteByEmail" ref="autoForm" v-model="validEmail">
                <v-text-field v-model="autoCompEmail" density="compact" append-inner-icon="fas fa-search" color="white"
                hide-no-data hide-selected variant="outlined"
                type="email"
                :rules="[
                    v => !!v || 'E-mail is required',
                    v => v !== store.state.user.email || 'E-mail cannot be yours',
                    v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
                ]"
                style="width: 250px"
                placeholder="Send To Email" return-object class="py-0"></v-text-field>
            </v-form>

           <span 
           v-if="emailNoExist"
           class="text-red text-caption">E-mail does not exist</span>

            <v-btn
            :loading="loadingModal" 
            :disabled="emailNoExist || !validEmail || loadingModal"
            variant="flat" width="100%" block @click="sendInvitation">Send Invitation</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="inviteByEmail = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="requestAccess"
    min-width="500px"    
    >
      <v-card>
          <v-card-title class="text-center text--disabled text-subtitle-1">
              <span>Request Account Access</span>
          </v-card-title>
        <v-card-text>
            <v-form v-if="requestAccess" ref="autoForm" v-model="validEmail">
                <v-text-field v-model="autoCompEmail" density="compact" append-inner-icon="fas fa-search" color="white"
                hide-no-data hide-selected variant="outlined"
                type="email"
                :rules="[
                    v => !!v || 'E-mail is required',
                    v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
                ]"
                style="width: 250px"
                placeholder="Search Users by Email" return-object class="py-0"></v-text-field>
            </v-form>

           <span 
           v-if="emailNoExist"
           class="text-red text-caption">E-mail does not exist</span>

            <v-btn 
            :loading="loadingModal" 
            :disabled="emailNoExist || !validEmail || loadingModal"
            variant="flat" width="100%" block @click="sendRequest">Request Access</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="requestAccess = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import {
  query,
  where,
  getFirestore,
  collection,
  orderBy,
  getDoc,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "@firebase/firestore";
import store from "@/store/index.js";
import { ref, computed, onMounted, watch, provide } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import usersComp from "@/components/usersComp.vue";


const inviteModal = ref(false)
const inviteByEmail = ref(false)
const requestAccess = ref(false)
const autoUsers = ref([])
const autoCompEmail = ref('')
const toggle = ref("users");
const loading = ref(false);
const autoForm = ref(null)
const emailNoExist = ref(false)
const loadingModal = ref(false)
const selectedProfile = computed(() => {
  return store.state.selectedProfile;
});
const userProfile = computed(() => {
  return store.state.userProfile;
});
const users = ref([]);
const sentReceivedUsers = ref([]);
const db = getFirestore();
const validEmail = ref(false)
const emailDoc = ref(null)
provide('tab', toggle)

onMounted(() => {
  try {
    autoForm.value.validate()
  } catch (error) { }
  initialSetup();
});
watch(toggle, (v) => {
  console.log("++ this went toggle")
  if (v) initialSetup();
});

watch(userProfile, (v) => {
  console.log("++ this went userProfile", v)
  if(v) initialSetup()
})

function inviteUserByEmail() {
  inviteModal.value = false; 
  inviteByEmail.value = true; 
  autoForm.value.validate() 
}

function requestAccountAccess() {
  inviteModal.value = false; 
  requestAccess.value = true; 
  autoForm.value.validate() 
}

watch(autoCompEmail, async () => {
    emailNoExist.value = false
    await autoForm.value.validate()
    emailDoc.value = null
    if (!validEmail.value) return
    let usersRef = query(collection(db, 'users'),
        where('email', '==', autoCompEmail.value))
    getDocs(usersRef).then(snapshot => {
        emailNoExist.value = snapshot.size == 0
        if(!emailNoExist.value) {
            emailDoc.value = {
                ...snapshot.docs[0].data(),
                id: snapshot.docs[0].id
            }
        }
    })
})

function popInviteModal() {
    inviteModal.value = true
}

function sendInvitation() {
    loadingModal.value = true
    let sent_invites = userProfile.value.sent_invites
    if(!sent_invites) sent_invites = {}  
    sent_invites[emailDoc.value.id] = true
    console.log("+++", sent_invites, emailDoc.value.id)
    return updateDoc(doc(db, "users", userProfile.value.id), {sent_invites})
        .then(() => {
            loadingModal.value = false
            inviteByEmail.value = false
        })
        .catch((e) => {
          try {
            loadingModal.value = false
            inviteByEmail.value = false
            console.error(e)
          } catch (error) {
          }
            
        })
}

function sendRequest() {
    loadingModal.value = true
    let sent_requests = userProfile.value.sent_requests
    if(!sent_requests) sent_requests = {}  
    sent_requests[emailDoc.value.id] = true
    console.log("+++", sent_requests, emailDoc.value.id)
    return updateDoc(doc(db, "users", userProfile.value.id), {sent_requests})
        .then(() => {
            loadingModal.value = false
            requestAccess.value = false
        })
        .catch((e) => {
            loadingModal.value = false
            requestAccess.value = false
            console.error(e)
        })
}

watch(requestAccess, (v) => {
    autoCompEmail.value = ''
    emailNoExist.value = false
})

watch(inviteByEmail, (v) => {
    autoCompEmail.value = ''
    emailNoExist.value = false
})

function getPromises(accessor) {
  try {
    userProfile.value[accessor]
  } catch (error) {
    return []
  }
  return Object.keys(userProfile.value[accessor])
    .filter((key) => {
      return userProfile.value[accessor][key];
    })
    .map((key) => {
      return getDoc(doc(db, "users", key))
        .then((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        })
        .catch(console.error);
    });
}

async function initialSetup() {
  let promises;
  let promises2 = null;
  loading.value = true;
  let accessor = "";
  let accessor2 = null;
  users.value = [];
  if (!toggle.value) return 
    switch (toggle.value) {
      case "accounts":
        accessor = "account_access";
        break;
      case "requests":
        accessor = "sent_requests";
        accessor2 = "received_requests";
        break;
      case "invites":
        accessor = "sent_invites";
        accessor2 = "received_invites";
        break;
      default:
        accessor = "user_access";
    }
  promises = getPromises(accessor);
  if (accessor2) promises2 = getPromises(accessor2);
  Promise.allSettled(promises).then(async (results) => {
    users.value = results.map((res) => res.value)
    if (!accessor2) loading.value = false;
  });
  if (accessor2) {
    sentReceivedUsers.value = [];
    Promise.allSettled(promises2).then((results) => {
        sentReceivedUsers.value = results.map((res) => res.value)
        console.log("received", sentReceivedUsers.value)
        loading.value = false;  
    });
  }
}
</script>

<style>
</style>
