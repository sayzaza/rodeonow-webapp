<template>
  <div v-for="(item, index) in users"
  :key="item.id"
  @click="
        !received ? $router.push({
          path: '/my-rodeo',
          query: {
            id: item.id,
          }
        }) : null
      "
  class="d-flex flex-column my-4">
    <v-card
      v-if="item"
      class="d-flex pa-3 align-center"
      :ripple="!received"
      :style="!received ? 'cursor: pointer' : ''"
    >
      <v-avatar
        color="grey lighten-3"
        size="70"
        class="mr-3"
        cover
      >
        <v-img :key="imageKey" :src="userImages.length > index ? userImages[index] : ''" contain />
      </v-avatar>

      <div
      v-if="!received"
      class="d-flex flex-column">
        <span class="text-h6 font-weight-bold"
          >{{ item.first_name }} {{ item.last_name }}</span
        >
        <span class="text-caption">{{ item.email }}</span>
      </div>

      <div v-else>
         <span class="text-subtitle-1 mb-4 ">You have an invitation from {{ item.first_name }} {{ item.last_name }}.
         </span> <br/>
        <span class="text-subtitle-1 mb-4 p-5 ">{{ item.email }} </span>
        <div class="d-flex justify-left">
          <Button class="mr-2" style="width: 25% !important;" :text="'Accept'" @buttonClicked="accept(item)" />
          <Button variant="secondary" style="width: 25% !important;" :text="'Deny'" @buttonClicked="deny(item)" />
        </div>
      </div>

      <div class="ml-auto">
        <v-btn
          @click.stop="showDeleteConfirmation(item)" color="grey" variant="text" class="ml-1" icon>
              <v-icon>fas fa-close</v-icon>
          </v-btn>
      </div>
    </v-card>
    <v-divider class="flex-none" style="width: 100%; display: block"></v-divider>

    <v-dialog
      v-model="deleteNotificationModal"
    min-width="500px"
    >
      <v-card>
        <v-card-text>
            <span>Are you sure you want to remove {{ tab !== 'users' ?
    tab !== 'accounts' ?
    tab !== 'invites' ?
    "requests" : "invites" : "account access" :
    "user access" }}? </span>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn variant="flat" color="grey" @click="deleteNotification">Delete</v-btn>
          <v-btn color="primary" @click="deleteNotificationModal = false">Cancel</v-btn>
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
  writeBatch,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "@firebase/firestore"
import { computed, onMounted, ref, watch, inject  } from "vue"
import {getProfileImageById} from '@/services/profiles'
import Button from "@/components/utilities/button.vue"
import store from '@/store'

const props = defineProps(['users', 'received', 'type'])
const userImages = ref([])
const imageKey = ref(false)
const db = getFirestore()
const userProfile = computed(() => {
  return store.state.userProfile
})
const deleteNotificationModal = ref(false)
const deletingNotification = ref(null)
const tab = inject('tab')

async function accept(user) {
  const batch = writeBatch(db);
  let data = {
    ...userProfile.value
  }
  let key = props.type == 'invites' ? "received_invites" : "received_requests"
  data = _removeUserKeysFromObject(key, data, userProfile.value)
  batch.update(doc(db, "users", userProfile.value.id), data)
  if (props.type == 'invites') {
    data["account_access"][user.id] = true
  } else {
    data["user_access"][user.id] = true
  }
  batch.update(doc(db, "users", userProfile.value.id), data)
  return batch.commit()
    .then(console.log)
    .catch(console.error)
}

function deny() {
  let data = {
    ...userProfile.value,
  }
  let key = props.type == 'invites' ? "received_invites" : "received_requests"
  data = _removeUserKeysFromObject(key, data, userProfile.value)
  return updateDoc(doc(db, "users", userProfile.value.id), data)
    .then(console.log)
    .catch(console.error)
}

function _removeUserKeysFromObject(dataKey, data, user) {
  data[dataKey] = Object.keys(user[dataKey]).filter(key => {
    return key !== user.id &&
    user[dataKey][user.id]
  }).reduce((total) => {
    let newTotal = {
      ...total
    }
    newTotal[key] = user[dataKey][key]
    return newTotal
  }, {})
  return data
}

function showDeleteConfirmation(item) {
  deleteNotificationModal.value = true
  deletingNotification.value = null
}

function initialSetup(){
  let promises = props.users.map(user => {
    return getProfileImageById(user)
  })
  Promise.allSettled(promises).then(results => {
    userImages.value = results.map(res => res.value)
    imageKey.value++
    console.log("userImages.value", userImages.value)
  })
}

function deleteNotification() {
  if(props.received) return deny()
  let data = {
    ...userProfile.value,
  }
  let key = tab.value !== 'users' ?
    tab.value !== 'accounts' ?
    tab.value !== 'invites' ?
    "sent_requests" : "sent_invites" : "account_access" :
    "user_access"
  data = _removeUserKeysFromObject(key, data, userProfile.value)
  return updateDoc(doc(db, "users", userProfile.value.id), data)
    .then(() => {
      deleteNotificationModal.value = false
    })
    .catch((e) => {
      console.error(e)
      deleteNotificationModal.value = false
    })
}

watch(() => props.users, () => {
  deleteNotificationModal.value = false
  initialSetup()
})

onMounted(() => {
  deleteNotificationModal.value = false
  initialSetup()
})
</script>
