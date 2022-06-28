<template>
    <div class="d-flex flex-column">
        <v-img cover height="250px" class="d-flex align-end" :src="coverPhoto">
        </v-img>
        <div v-if="$store.state.selectedProfile"
            style="position: relative; bottom: 30px; margin-bottom: -30px; width: 100%; max-width: 900px;"
            class="d-flex align-end mx-auto">
            <v-avatar cover color="grey" aspect-ratio="1" size="90" style="border-radius: 5%" tile>
                <v-img cover aspect-ratio="1" style="width: 100%" :src="$store.state.selectedProfile.photo_url">
                </v-img>
            </v-avatar>
            <div class="d-flex flex-column ml-3">
                <h3 class="h4">{{ $store.state.selectedProfile.first_name }} {{ $store.state.selectedProfile.last_name
                    }}</h3>
                <span class="caption text--disabled">{{ $store.state.selectedProfile.location }}</span>
            </div>
        </div>

        <div v-if="$store.state.selectedProfile" style="width: 100%; max-width: 900px;" class="mx-auto my-6">
            <span class="subtitle-1 font-italic text-gray text--disabled">
                {{ $store.state.selectedProfile.bio }}
            </span>
        </div>

        <div v-if="$store.state.selectedProfile && $store.state.selectedProfile.account_type == 1"
            style="width: 100%; max-width: 900px;" class="d-flex flex-column mx-auto">
            <div class="d-flex align-center">
                <h2 class="my-6">Animals</h2>
                <div class="ml-auto">
                    <v-btn color="error" icon="fas fa-plus" size="small" variant="text">
                    </v-btn>

                    <v-btn-toggle v-if="animals" dense mandatory class="ml-1" v-model="select_animal">
                        <v-btn>
                            Bulls ({{ animals.filter(animal => animal.animal_type == 1).length }})
                        </v-btn>

                        <v-btn>
                            Horses ({{ animals.filter(animal => animal.animal_type == 2).length }})
                        </v-btn>

                        <v-btn>
                            All ({{ animals.length }})
                        </v-btn>
                    </v-btn-toggle>
                </div>
            </div>

            <div class="d-flex py-2" v-for="animal in filteredAnimals" :key="animal.animalID">
                <span class="mr-3 text--disabled" style="min-width: 100px">{{ animal.brand }}</span>
                <span>{{ animal.name }}</span>
                <span class="ml-auto">
                    <v-icon size="13">fas fa-ellipsis</v-icon>
                </span>
            </div>
            <span v-if="!animals || animals.length == 0" class="text-caption font-italic">No animals to show</span>
        </div>

        <div style="width: 100%; max-width: 900px;" class="d-flex flex-wrap mx-auto">
            <h2 class="my-6" style="width: 100%">Videos</h2>
            <VideoVue style="width: 30%" class="mr-5 mb-5" v-for="(video, index) in videos" :video="video"
                :key="index" />

            <span v-if="!videos || videos.length == 0" class="text-caption font-italic">No videos to show</span>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { getFirestore, collection, query, where } from 'firebase/firestore'
import VideoVue from '@/components/utilities/Video.vue'
import store from '@/store'

const db = getFirestore()
export default {
    components: { VideoVue },
    setup() {
        const select_animal = ref(2)
        const videos = computed(() => {
            return store.state.videos
        })
        const animals = computed(() => {
            return store.state.animals
        })
        const coverPhoto = computed(() => {
            if (!store.state.selectedProfile) return 
            return store.state.selectedProfile.account_type !== 2 ? 
                store.state.selectedProfile.account_type !== 3 ? require('@/assets/images/contractors.jpg') : require('@/assets/images/bareback.jpg')
            : require('@/assets/images/contestants.jpg')
        })
        const filteredAnimals = computed(() => {
            let localAnimals = animals.value
            if (select_animal.value !== 2) localAnimals = localAnimals.filter(animal => animal.animal_type == select_animal.value+1)
            return localAnimals
        })
    
        watch(computed(() => store.state.selectedProfile), () => {
            if (!store.state.selectedProfile) return
            console.log("", store.state.selectedProfile.account_type)
            try{
                store.commit('SET_FIRESTORE_VALUE', { key: 'animals', doc: null })
                store.state.subscribers['animals']()
            } catch {}
            try {
                store.commit('SET_FIRESTORE_VALUE', { key: 'videos', doc: null })
                store.state.subscribers['videos']()
            } catch { }
            if(store.state.selectedProfile.account_type == 1) {
                let ref = query(collection(db, 'animals'), where('contractor', '==', store.state.selectedProfile.id))
                store.dispatch('bindCollectionRef', { key: 'animals', ref })
            }
            const key = store.state.selectedProfile.account_type == 2 ? 'user_id' : 'contractor_id'
            let ref = query(collection(db, 'videos'), where(key, '==', store.state.selectedProfile.id))
            store.dispatch('bindCollectionRef', { key: 'videos', ref })
        })
        
        return {
            coverPhoto,
            select_animal,
            filteredAnimals,
            videos,
            coverPhoto,
            animals
        }
    }
}
</script>

<style>


</style>