<template>
    <div class="d-flex flex-wrap mx-auto my-6" style="max-width: 900px">
        <template v-for="(video, index) in videos" :key="video.firestoreID">
            <VideoVue style="width: 100%" :video="video"
                :videoUser="videoUsers[index] ? videoUsers[index] : null" />
            <v-divider v-if="index !== videos.length - 1" style="margin: 40px 0"></v-divider>
        </template>
        <v-card v-intersect="debouncedSetup" :key="videos.length" style="width: 100%"></v-card>
        <div class="d-flex justify-center" style="width: 100%">
            <v-progress-circular class="mx-auto" indeterminate v-if="loading"></v-progress-circular>
        </div>
    </div>
</template>

<script>
import store from '@/store'
import { computed, onMounted, watch, ref, onUnmounted } from 'vue'
import { getFirestore, query, collection, where, orderBy, limit, startAfter, doc, getDoc } from 'firebase/firestore'
import VideoVue from '@/components/utilities/Video.vue'
import { getProfileImageById } from '@/services/profiles'
export default {
    components: { VideoVue },
    setup() {
        let loading = ref(true)
        let videoUsers = ref([])
        let videos = computed(() => {
            return store.state.videos || []
        })
        // let lastDocumentSnapshot = ref(null)

        function debouncedSetup() {
            if (!loading.value) initialSetup()
        }
        function initialSetup() {
            if (!store.state.selectedProfile) return
            loading.value = true
            setTimeout(() => {
                loading.value = false
            }, 30000);
            const db = getFirestore()
            const events = store.state.selectedProfile.favouriteEvents
            let newVideos = store.state.videos
            let ref;
            if (events && events.length > 0) {
                if (newVideos.length == 0) {
                    ref = query(
                        collection(db, 'videos'),
                        orderBy('event_date', 'desc'),
                        where('event_type', 'in', events),
                        limit(6)
                    )
                } else {
                    ref = query(
                        collection(db, 'videos'),
                        orderBy('event_date', 'desc'),
                        where('event_type', 'in', events),
                        limit(4)
                    )
                }
            } else {
                if (newVideos.length == 0) {
                    ref = query(
                        collection(db, 'videos'),
                        orderBy('event_date', 'desc'),
                        limit(6)
                    )
                } else {
                    ref = query(
                        collection(db, 'videos'),
                        orderBy('event_date', 'desc'),
                        startAfter(videos.value[videos.value.length-1].preserved),
                        limit(4)
                    )
                }
            }
            store.dispatch('bindCollectionRef', { key: 'videos', ref, append: true, preserve: true, callback: (docs) => {
                // lastDocumentSnapshot.value = docs[docs.length-1]
                return docs
            } })
        }

        watch(computed(() => store.state.selectedProfile), () => {
            store.commit('SET_FIRESTORE_VALUE', { key: 'videos', doc: [] })
            initialSetup()
        })

        onUnmounted(() => {
            store.commit('SET_FIRESTORE_VALUE', { key: 'videos', doc: [] })
        })
        
        watch(videos, (newVideos) => {
            const db = getFirestore()
            let promises = newVideos.map((video) => {
                const id = video.user_id && video.user_id.length > 0 ? video.user_id : video.contractor_id
                return getDoc(doc(db, 'users', id))
            })
            return Promise.allSettled(promises).then(results => {
                promises = results.map(async res => {
                    return {
                        ...res.value.data(),
                        id: res.value.id,
                        photo_url: await getProfileImageById(res.value.data())
                    }
                })
                return Promise.allSettled(promises).then((results) => {
                    videoUsers.value = results.map(res => res.value)
                }).catch(console.error)
                loading.value = false
            }).catch(console.error)
        })

        onMounted(() => {
            try {
                initialSetup()
            } catch (error) {
                
            }
        })

        return {
            videos,
            loading,
            videoUsers, 
            initialSetup,
            debouncedSetup        }
    }
}
</script>

<style>
</style>
