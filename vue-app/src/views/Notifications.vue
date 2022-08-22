<template>
    <div class="d-flex flex-column mx-auto my-6 " style="max-width: 900px">
        <div class="d-flex justify-space-between mb-6">
            <v-btn variant="text"
                @click="$router.go(-1)"
                class="d-flex align-center justify-center mr-2 pl-0">
                <img 
                class="mr-3"
                :src="require('@/assets/icons/glyph/glyphs/chevron.left.png')" />
                <span>Back</span>
            </v-btn>

            <v-btn  
            variant="icon"
            icon
            class="d-flex align-center justify-center mr-2">
                <img 
                :src="require('@/assets/icons/glyph/glyphs/trash.png')" />
                <!-- <span>Save</span> -->
            </v-btn>
        </div>
        
        <PulseLoader
        v-if="loading"
        class="spinner mx-auto"
        :loading="loading"
        color="#2c3346"
        ></PulseLoader>

        <template
        v-for="(notification, index) in notifications" :key="notification.id"
        >
            <v-card
            flat
            class="d-flex flex-column px-3"
            >
                <span class="mb-4">{{ notification.message_string  }}</span>
                <span class="text--disabled text-caption">{{ notification.timeAgo  }}</span>
            </v-card>
            <v-divider :key="notification.id" v-if="index !== notifications.length - 1" style="margin: 20px 0"></v-divider>
        </template>
        
        
    </div>
</template>

<script setup>
import { query, where, getFirestore, collection, orderBy } from '@firebase/firestore';
import store from '@/store/index.js';
import { ref, reactive, computed, watch, onMounted } from 'vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

const db = getFirestore()
const loading = ref(true)
const notifications = computed(() => {
    let notis = store.state.notifications || []
    return notis.map(notification => {
        return {
            ...notification,
            timeAgo: timeAgo(notification.timestamp.toDate())
        }
    })
})

function timeAgo(input) {
  const date = (input instanceof Date) ? input : new Date(input);
  const formatter = new Intl.RelativeTimeFormat('en');
  const ranges = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1
  };
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;
  for (let key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];
      return formatter.format(Math.round(delta), key);
    }
  }
}

watch(notifications, (v) => {
    if(!v) return
    loading.value = false
})

function getNotifications() {
    try {
        store.commit('SET_FIRESTORE_VALUE', { key: 'notifications', doc: [] })
        store.state.subscribers['notifications']()
    } catch { }
    let ref = query(
        collection(db, 'notifications'), 
        where('notified_user_id', '==', store.state.selectedProfile.id),
        // orderBy('timestamp', 'desc')
    )    
    store.dispatch('bindCollectionRef', { 
        ref, 
        key: 'notifications', 
        callback: (docs) => {
            return docs.sort((a, b) => b.timestamp - a.timestamp)
        }
    })
}

watch(() => store.state.selectedProfile, (value) => {
    if(value) getNotifications()
})

</script>


<style>
</style>