<template>
    <div class="d-flex flex-column mx-auto my-6 " style="max-width: 900px; position: relative">
        <v-card flat class="d-flex justify-space-between mb-6 align-center py-3" style="position: sticky; top: 0; left: 0; z-index: 9; width: 100%">
            <!-- <v-btn variant="text"
                @click="$router.go(-1)"
                class="d-flex align-center justify-center mr-2 pl-0">
                <img 
                class="mr-3"
                :src="require('@/assets/icons/glyph/glyphs/chevron.left.png')" />
                <span>Back</span>
            </v-btn> -->
            <span>Notifications</span>

            <v-btn
            @click="clearAll()"  
            flat
            class="d-flex align-center justify-center mr-2 ml-auto mb-1">
                <img
                width="24"
                style="filter: opacity(.9)" 
                :src="require('@/assets/icons/glyph/glyphs/trash.png')" />
            </v-btn>
        </v-card>
        
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
            class="d-flex px-3"
            :ripple="false"
            >
                <div 
                @click="notificationClicked(notification)"
                style="cursor: pointer"
                class="d-flex flex-column">
                    <span class="mb-4">{{ notification.message_string  }}</span>
                    <span class="text--disabled text-caption">{{ notification.timeAgo  }}</span>
                </div>
                <div class="ml-auto my-auto">
                    <v-btn  
                    variant="outlined"
                    @click="deleteNotification(notification.id)"
                    flat
                    class="d-flex align-center justify-center mr-2 ml-auto mb-1">
                        <img
                        width="24"
                        style="filter: opacity(.9)" 
                        :src="require('@/assets/icons/glyph/glyphs/trash.png')" />
                    </v-btn>
                </div>
            </v-card>
            <v-divider :key="notification.id" v-if="index !== notifications.length - 1" style="margin: 5px 0 30px"></v-divider>
        </template>
        
        
    </div>
</template>

<script setup>
import { query, where, getFirestore, collection, orderBy, getDoc, doc, getDocs, deleteDoc } from '@firebase/firestore';
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


function notificationClicked(notification) {
    if (notification.video_id != undefined) {
        getDocs(query(collection(db, 'videos'), where('video_id', '==', notification.video_id)))
            .then(snapshot => {
                try {
                    let video = snapshot.docs.map((doc) => doc.data())[0]
                    store.commit('SET_MODAL_VIDEO', video)
                    store.commit('VIDEO_PLAYER_MODAL', true)
                } catch (error) {
                    console.error(error)
                }
            })
    }
}

function deleteNotification(notification) {
    deleteDoc(doc(db,"notifications",notification))    
}
function clearAll() {
    if(confirm("Are you sure you want to Clear all notifications?")){
        this.notifications.forEach( notification => {
        deleteDoc(doc(db,"notifications",notification.id))    
    });
    }

}

watch(notifications, (v) => {
    if(!v) return
    loading.value = false
})

function getNotifications() {
    loading.value = true
    try {
        store.commit('SET_FIRESTORE_VALUE', { key: 'notifications', doc: [] })
        store.state.subscribers['notifications']()
    } catch { }
    let ref = query(
        collection(db, 'notifications'), 
        where('notified_user_id', '==', store.state.user.uid),
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

onMounted(() => {
    if(store.state.selectedProfile) getNotifications()
})
</script>


<style>
</style>