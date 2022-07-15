<script setup>
import { collection, getFirestore, orderBy, query, where } from '@firebase/firestore';
import { ref } from '@firebase/storage';
import { watch, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import store from '@/store'
import { getProfileImageById } from '@/services/profiles';
const router = useRouter()
const route = useRoute()
const db = getFirestore()
const categories = ref([
    {
        title: 'Contractors',
        image: require("@/assets/images/contractors.jpg")
    },
    {
        title: 'Contestants',
        image: require("@/assets/images/contestants.jpg")
    },
    {
        title: 'Bareback Riding',
        image: require('@/assets/images/bareback.jpg')
    },
    {
        title: 'Saddle Bronc',
        image: require('@/assets/images/saddle-bronc.jpg')
    },
    {
        title: 'Bull Riding',
        image: require('@/assets/images/bull-riding.jpg')
    },
    {
        title: 'Barrell Racing',
        image: require('@/assets/images/barrel-racing.jpg')
    },
    {
        title: 'Team Ropling',
        image: require('@/assets/images/team-roping.jpg')
    },
    {
        title: 'Tie Down Roping',
        image: require('@/assets/images/tie-down-roping.jpg')
    },
    {
        title: 'Steer Wrestling',
        image: require('@/assets/images/steer-wrestling.jpg')
    },
    {
        title: 'Breakaway Roping',
        image: require('@/assets/images/breakaway.jpg')
    }
])
const search = ref(null)

const categoryQuery = computed(() => {
    return route.query.category
})

watch(categoryQuery, (cq) => {
    initialSetup(cq)
})
onMounted(() => {
    if (route.query.category) initialSetup(route.query.category)
})
onUnmounted(() => {
    try {
        store.state.search_ = []
        store.state.subscribers.search_()
    } catch (error) {}
})
function initialSetup(cq) {
    try {
        store.state.search_ = []
        store.state.subscribers.search_()
    } catch (error) { }
    let ref
    if (cq) switch (cq.toLowerCase()) {
        case 'contractors':
            ref = query(
                collection(db, 'users'),
                where('account_type', '==', 1),
                orderBy('first_name', 'asc')
            )
            break;

        case 'contestants':
            ref = query(
                collection(db, 'users'),
                where('account_type', '==', 2),
                orderBy('first_name', 'asc')
            )
            break

        default:
            ref = null;
    }

    if (ref) store.dispatch('bindCollectionRef',
        {
            key: 'search_',
            ref,
            callback: (docs) => {
                let promises = docs.map(async doc => {
                    doc.photo_url = await getProfileImageById(doc)
                    return doc
                })
                return Promise.allSettled(promises).then(results => {
                    return results.map(res => res.value || '')
                }).catch(console.error)
            } 
        }
    )
}

function goTo(category) {
    if (category) router.push({
        path: 'search',
        query: {
            category: category.title
        }
    })
    else {
        router.push({
            path: 'search',
            query: {}
        })
    }
}
</script>

<template>
    <div v-if="!categoryQuery" class="d-flex flex-wrap mx-auto my-6 justify-center" style="max-width: 900px">
        <div class="text-h6 mb-6" style="width: 100%; display: block">
            Browse Categories
        </div>
        <div v-for="(category, index) in categories" class="d-flex justify-center mb-6" :key="index"
            style="width: 50%; display: block">
            <v-card @click="goTo(category)" class="rounded-lg " width="90%">
                <v-img class="d-flex align-end" :src="category.image" cover aspect-ratio="1.7">
                    <span style="position: absolute; bottom: 12px; left: 12px;" class="text-h6 text-white">{{
                        category.title }}</span>
                </v-img>
            </v-card>
        </div>
        <div style="width: 50%" v-if="categories.length % 3 !== 0" class="rounded-xl mb-6"></div>
        <div style="width: 50%" v-if="(categories.length+1) % 3 !== 0" class="rounded-xl mb-6"></div>
    </div>

    <div class="d-flex flex-wrap mx-auto my-6" style="max-width: 900px" v-else>
        <!-- this is the content for: {{ $route.query.category }} -->
        <div style="width: 100%" class="d-flex align-center mb-6">
            <v-btn @click="goTo(null)" icon color="error" variant="text" class="mx-1">
                <img style="width: 30px;" class="mt-1" :src="require('@/assets/icons/glyph/glyphs/arrow.left.png')" />
            </v-btn>
            <v-text-field v-model="search" density="compact" prepend-inner-icon="fas fa-search" color="white"
                hide-no-data hide-selected hide-details variant="outlined" :placeholder="$route.query.category"
                return-object class="py-0"></v-text-field>
            <v-btn color="error" variant="text" class="ml-1">cancel</v-btn>
        </div>

        <div class="d-flex flex-column py-3" style="width: 100%">
            <div v-for="item in store.state.search_" class="d-flex flex-column">
                <div v-if="item" class="d-flex py-3">
                    <v-avatar color="grey lighten-3" size="100" class="mr-3" cover tile style="border-radius: 5%">
                        <v-img :src="item.photo_url" contain />
                    </v-avatar>

                    <div class="d-flex flex-column">
                        <span class="text-h6 font-weight-bold">{{ item.first_name }} {{ item.last_name }}</span>
                        <span class="text-caption">{{ item.location }}</span>
                    </div>
                </div>
                <v-divider class="flex-none" style="width: 100%; display: block"></v-divider>
            </div>
        </div>
    </div>
</template>