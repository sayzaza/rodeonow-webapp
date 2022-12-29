<template>
    <div class="d-flex flex-column">
        <v-img cover height="250px" class="d-flex align-end" :src="coverPhoto">
        </v-img>
        <div v-if="idUserProfile"
            style="position: relative; bottom: 60px; margin-bottom: -60px; width: 100%; max-width: 900px;"
            class="d-flex flex-column align-center mx-auto">
            <v-avatar cover color="transparent" aspect-ratio="1" size="180" style="border-radius: 5%" tile>
                <v-img cover aspect-ratio="1" style="width: 100%" :src="idUserProfile.photo_url">
                </v-img>
            </v-avatar>
            <div class="d-flex flex-column text-center">
                <h3 class="h4">{{ idUserProfile.first_name }} {{ idUserProfile.last_name
}}</h3>
                <span class="text--disabled">{{ idUserProfile.location }}</span>
            </div>
        </div>

        <div v-if="idUserProfile" style="width: 100%; max-width: 900px;" class="mx-auto my-6">
            <span class="subtitle-1 font-italic text-gray text--disabled">
                {{ idUserProfile.bio }}
            </span>
        </div>

        <div v-if="idUserProfile" style="width: 100%; max-width: 900px;" class="mx-auto my-6">
            <span class="subtitle-1 text-gray text--disabled">
                Sponsors: {{ idUserProfile.sponsors }}
            </span>
        </div>

        <div v-if="idUserProfile && idUserProfile.account_type == 1 && !showVideo"
            style="width: 100%; max-width: 900px;" class="d-flex flex-column mx-auto">

            <div class="d-flex align-center mb-6">
                <v-btn @click="showVideo = !showVideo" icon variant="text"
                    class="d-flex items-center justify-center mr-1">
                    <img style="width: 30px;" class="mt-1"
                        :src="require('@/assets/icons/glyph/glyphs/rectangle.grid.2x2.png')" />
                </v-btn>
                <v-text-field v-model="search" density="compact" prepend-inner-icon="fas fa-search" color="white"
                    hide-no-data hide-selected hide-details variant="outlined"
                    placeholder="Start typing to Search Animals" return-object class="py-0 mr-3"
                    style="max-width: 440px;"></v-text-field>
                <div class="ml-auto d-flex align-center">
                    <v-btn @click="$router.push({ path: '/animals/new' })" v-if="idUserProfile.account_type == 1" icon
                        size="small" variant="text" class="d-flex items-center justify-center mr-2">
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

            <AnimalCard v-for="animal in filteredAnimals" :animal="animal" :videos="videos" :key="animal.id" />
            <!-- <v-card flat class="d-flex pa-2" v-for="animal in filteredAnimals" :key="animal.animalID">
                <span class="mr-3 text--disabled" style="min-width: 100px">{{ animal.brand }}</span>
                <span v-if="animal.name && animal.name.length > 0">{{ animal.name }}</span>
                <span v-else class="text--disabled">Unnamed</span>
                <v-menu v-model="animal_menu" :close-on-content-click="false" location="end">
                    <template v-slot:activator="{ props }">
                        <v-btn fab icon size="small" variant="text" class="ml-auto" v-bind="props">
                            <v-icon>fas fa-ellipsis</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-btn @click="$router.push({ path: '/animals/edit', params: { id: animal.id } })" variant="text" block class="text-black">
                            Edit
                        </v-btn>
                        <v-divider></v-divider>
                        <v-btn variant="text" block class="text-black">
                            Delete
                        </v-btn>
                    </v-list>
                </v-menu>
            </v-card> -->
            <span v-if="!animals || animals.length == 0" class="font-italic">No animals to show</span>
        </div>

        <div v-if="idUserProfile && showVideo" style="width: 100%; max-width: 900px;"
            class="d-flex flex-wrap mx-auto justify-space-between">
            <div style="width: 100%" class="d-flex align-center mb-6">
                <v-btn v-if="idUserProfile.account_type == 1" @click="showVideo = !showVideo" icon variant="text"
                    class="d-flex items-center justify-center mr-1">
                    <img style="width: 30px;" class="mt-1"
                        :src="require('@/assets/icons/glyph/glyphs/list.dash.png')" />
                </v-btn>
                <v-text-field v-model="search" density="compact" prepend-inner-icon="fas fa-search" color="white"
                    hide-no-data hide-selected hide-details variant="outlined"
                    placeholder="Start typing to Search Videos" return-object class="py-0"></v-text-field>
            </div>
            <span v-if="!videos || videos.length == 0" class="font-italic">No videos to show</span>
            <VideoVue style="width: 100%" :class="(index + 1) % 1 !== 0 ? 'ml-auto' : ''" class="mb-5"
                v-for="(video, index) in videos" :videoUser="videoUsers[index] ? videoUsers[index] : null"
                :video="video" :key="index" />

            <!-- <div style="width: 32%" v-if="videos.length % 3 !== 0"></div> -->
            <!-- <div style="width: 32%" v-if="(videos.length+1) % 3 !== 0"></div> -->

        </div>
    </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { getFirestore, collection, query, where, doc, getDoc } from 'firebase/firestore'
import VideoVue from '@/components/utilities/Video.vue'
import store from '@/store'
import { useRoute } from 'vue-router'
import { getProfileImageById } from '@/services/profiles'
import AnimalCard from '@/components/utilities/animalCard.vue'
const db = getFirestore()
export default {
    components: { VideoVue, AnimalCard },
    setup() {
        const route = useRoute()
        const search = ref('')
        const select_animal = ref(2)
        const videoUsers = ref([])
        const animal_menu = ref(false)
        const videos = computed(() => {
            let localVideos = store.state.videos || []
            localVideos.sort((a, b) => {
                return b.created.toDate() - a.created.toDate()
            })
            try {
                localVideos = localVideos.filter((video) => {
                    return video.title && video.title.toLowerCase().includes(search.value.toLowerCase())
                        || video.location && video.location.toLowerCase().includes(search.value.toLowerCase())
                        || video.animal_brand && video.animal_brand.toLowerCase().includes(search.value.toLowerCase())
                        || video.animal_name && video.animal_name.toLowerCase().includes(search.value.toLowerCase())
                })
            } catch (error) { console.error(error) }
            return localVideos || []
        })
        watch(videos, async (newVs) => {
            let promises = newVs.map(video => {
                return getDoc(doc(db, 'users', video.user_id)).then(async (doc) => {
                    return {
                        ...doc.data(),
                        id: doc.id,
                        photo_url: await getProfileImageById(doc.data())
                    }
                })
            })
            videoUsers.value = await Promise.allSettled(promises).then((results) => results.map(res => res.value))
        })
        const userProfile = computed(() => {
            return store.state.userProfile
        })
        watch(userProfile, (v) => {
            if (v) initialSetup()
        })
        const showVideo = ref(false)
        const animals = computed(() => {
            let localAnimals = store.state.animals
            try {
                localAnimals = localAnimals.filter((animal) => {
                    return animal.name.toLowerCase().includes(search.value.toLowerCase())
                        || animal.brand.toLowerCase().includes(search.value.toLowerCase())
                        || animal.contractor_name.toLowerCase().includes(search.value.toLowerCase())
                        || animal.contractor_name.toLowerCase().includes(search.value.toLowerCase())
                })
            } catch (error) { }
            localAnimals.sort((a, b) => {
                if (a.name < b.name) { return 1; }
                if (a.name > b.name) { return -1; }
                return 0;
            })
            localAnimals.sort((a, b) => {
                if (!!a.name) return -1
                return 1
            })
            return localAnimals
        })
        const coverPhoto = computed(() => {
            if (!idUserProfile.value) return
            return idUserProfile.value.account_type !== 2 ?
                idUserProfile.value.account_type !== 3 ? require('@/assets/images/contractors.jpg') : require('@/assets/images/bareback.jpg')
                : require('@/assets/images/contestants.jpg')
        })
        const filteredAnimals = computed(() => {
            let localAnimals = animals.value
            if (select_animal.value !== 2) localAnimals = localAnimals.filter(animal => animal.animal_type == select_animal.value + 1)
            return localAnimals
        })
        const idUserProfile = ref(null)
        async function initialSetup() {
            if (!route.query.id || route.query.id == '') return
            try {
                store.commit('SET_FIRESTORE_VALUE', { key: 'animals', doc: [] })
                store.state.subscribers['animals']()
            } catch { }
            try {
                store.commit('SET_FIRESTORE_VALUE', { key: 'videos', doc: [] })
                store.state.subscribers['videos']()
            } catch { }
            return getDoc(doc(db, 'users', route.query.id)).then(async (doc) => {
                idUserProfile.value = {
                    ...doc.data(),
                    id: doc.id,
                    photo_url: await getProfileImageById(doc.data())
                }
                showVideo.value = idUserProfile.value.account_type == 2
                console.log("doc.data", doc.data())
                let key = idUserProfile.value.account_type == 2 ? 'user_id' : 'contractor_id'
                let docRef = query(collection(db, 'videos'), where(key, '==', idUserProfile.value.id))
                store.dispatch('bindCollectionRef', { key: 'videos', ref: docRef })

                if (idUserProfile.value.account_type == 1) {
                    docRef = query(collection(db, 'animals'), where('contractor', '==', idUserProfile.value.id))
                    store.dispatch('bindCollectionRef', { key: 'animals', ref: docRef })
                }
            })
        }
        onMounted(() => {
            initialSetup()
        })
        return {
            search,
            coverPhoto,
            select_animal,
            filteredAnimals,
            videos,
            animals,
            showVideo,
            idUserProfile,
            animal_menu,
            videoUsers,
            initialSetup
        }
    }
}
</script>

<style>

</style>