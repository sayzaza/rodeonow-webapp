<template>
    <div class="d-flex flex-column">
        <v-img cover height="250px" class="d-flex align-end" :src="coverPhoto">
        </v-img>
        <div v-if="$store.state.selectedProfile"
            style="position: relative; bottom: 60px; margin-bottom: -60px; width: 100%; max-width: 900px;"
            class="d-flex flex-column align-center mx-auto">
            <v-avatar cover color="grey" aspect-ratio="1" size="180" style="border-radius: 5%" tile>
                <v-img cover aspect-ratio="1" style="width: 100%" :src="$store.state.selectedProfile.photo_url">
                </v-img>
            </v-avatar>
            <div class="d-flex flex-column text-center">
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

        <div v-if="$store.state.selectedProfile && $store.state.selectedProfile.account_type == 1 && !showVideo"
            style="width: 100%; max-width: 900px;" class="d-flex flex-column mx-auto">

            <div class="d-flex align-center mb-6">
                <v-btn @click="showVideo = !showVideo" icon variant="text"
                    class="d-flex items-center justify-center mr-1">
                    <img style="width: 30px;" class="mt-1"
                        :src="require('@/assets/icons/glyph/glyphs/rectangle.grid.2x2.png')" />
                </v-btn>
                <v-text-field density="compact" prepend-inner-icon="fas fa-search" color="white" hide-no-data
                    hide-selected hide-details variant="outlined" placeholder="Start typing to Search Animals"
                    return-object class="py-0 mr-3" style="max-width: 440px;"></v-text-field>
                <div class="ml-auto d-flex align-center">
                    <v-btn v-if="$store.state.selectedProfile.account_type == 1" icon size="small" variant="text"
                        class="d-flex items-center justify-center mr-2">
                        <img class="mt-1" :src="require('@/assets/icons/glyph/glyphs/plus.circle.png')" />
                    </v-btn>

                    <v-btn-toggle v-if="animals" class="ml-1">
                        <v-btn size="small" :active="select_animal == 2" @click="select_animal = 2">
                            All ({{ animals.length }})
                        </v-btn>

                        <v-btn size="small" :active="select_animal == 0" @click="select_animal = 0">
                            Bulls ({{ animals.filter(animal => animal.animal_type == 1).length }})
                        </v-btn>

                        <v-btn size="small" :active="select_animal == 1" @click="select_animal = 1">
                            Horses ({{ animals.filter(animal => animal.animal_type == 2).length }})
                        </v-btn>
                    </v-btn-toggle>
                </div>
            </div>

            <div class="d-flex py-2" v-for="animal in filteredAnimals" :key="animal.animalID">
                <span class="mr-3 text--disabled" style="min-width: 100px">{{ animal.brand }}</span>
                <span v-if="animal.name && animal.name.length > 0">{{ animal.name }}</span>
                <span v-else class="text--disabled">Unnamed</span>
                <span class="ml-auto">
                    <v-icon size="13">fas fa-ellipsis</v-icon>
                </span>
            </div>
            <span v-if="!animals || animals.length == 0" class="text-caption font-italic">No animals to show</span>
        </div>

        <div v-if="$store.state.selectedProfile && showVideo" style="width: 100%; max-width: 900px;"
            class="d-flex flex-wrap mx-auto justify-space-between">
            <div style="width: 100%" class="d-flex align-center mb-6">
                <v-btn v-if="$store.state.selectedProfile.account_type == 1" @click="showVideo = !showVideo" icon
                    variant="text" class="d-flex items-center justify-center mr-1">
                    <img style="width: 30px;" class="mt-1"
                        :src="require('@/assets/icons/glyph/glyphs/list.dash.png')" />
                </v-btn>
                <v-text-field density="compact" prepend-inner-icon="fas fa-search" color="white" hide-no-data
                    hide-selected hide-details variant="outlined" placeholder="Start typing to Search Videos"
                    return-object class="py-0"></v-text-field>
            </div>
            <VideoVue style="width: 32%" :class="(index + 1) % 1 !== 0 ? 'ml-auto' : ''" class="mb-5"
                v-for="(video, index) in videos" :video="video" :key="index" />

            <div style="width: 32%" v-if="videos.length % 3 !== 0"></div>
            <div style="width: 32%" v-if="(videos.length+1) % 3 !== 0"></div>

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
        const showVideo = ref(true)
        const animals = computed(() => {
            let localAnimals = store.state.animals
            localAnimals = localAnimals.sort((a, b) => {
                if (!!a.name) return -1
                if (a.name > b.name) return -1;
                if (a.name == b.name) return 0;
                if (a.name < b.name) return 1;
            })
            return localAnimals
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
            showVideo.value = true
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
            animals,
            showVideo
        }
    }
}
</script>

<style>


</style>