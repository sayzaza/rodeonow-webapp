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
         <span class="text-subtitle-1 mb-4 "
          >You have received an access request from {{ item.first_name }} {{ item.last_name }}</span
        > 
        <div class="d-flex justify-center">
          <Button class="mr-2" :text="'Accept'" @buttonClicked="accept(item)" />
          <Button variant="secondary" :text="'Deny'" @buttonClicked="deny(item)" />
        </div>
      </div>
    </v-card>
    <v-divider class="flex-none" style="width: 100%; display: block"></v-divider>
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
} from "@firebase/firestore"
import { computed, onMounted, ref, watch } from "vue"
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
async function accept(user) {
  await _removeReceivedInviteRequestFromUser()
  let data = {
    ...userProfile.value
  }
  if (props.type == 'invites') {
    data["account_access"][user.id] = true
  }
  return updateDoc(doc(db, "users", userProfile.value.id), data)
    .then(console.log)
    .catch(console.error)
}

function deny() {
  _removeReceivedInviteRequestFromUser()
}

function _removeReceivedInviteRequestFromUser() {
  let data = {
    ...userProfile.value,
  }
  if (props.type == 'invites') {
    data = _removeUserKeysFromObject("received_invites", data, userProfile.value)
  } else {
    data = _removeUserKeysFromObject("received_requests", data, userProfile.value)
  }
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

watch(() => props.users, () => {
  initialSetup()
})

onMounted(() => {
  initialSetup()
})
</script>
