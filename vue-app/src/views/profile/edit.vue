<template>
    <div class="d-flex flex-column mx-auto my-6" style="max-width: 900px">

        <div class="d-flex justify-space-between mb-6">
            <v-btn variant="text"
                @click="$router.go(-1)"
                class="d-flex align-center justify-center mr-2 pl-0">
                <img 
                class="mr-3"
                :src="require('@/assets/icons/glyph/glyphs/chevron.left.png')" />
                <span>Back</span>
            </v-btn>

            <v-btn color="primary"
                class="d-flex align-center justify-center mr-2">
                <span>Save</span>
            </v-btn>
        </div>

        <h2 class="mb-6 text-h6">Profile Picture</h2>
        <v-card
        @click="fileInput.click()"
        class="d-flex pa-3 mb-6 align-center"
        >
            <v-avatar size="120" class="mr-3" style="border-radius: 5%;" color="gray" tile >
                <img style="height: 100%; width: auto;" :src="profile ? profile.photo_url : ''" alt="" />
            </v-avatar>

            <div class="caption">
                Choose profile image from library
            </div>
        </v-card>

        <input type="file" style="display: none;" ref="fileInput">

        <h2 class="mb-6 text-h6" style="margin-top: 20px">About</h2>
        <div v-if="profile && profile.account_type == 1" class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Name:</span>
            <v-text-field
            v-model="form.name" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Name" return-object class="py-0"
            >
            </v-text-field>
        </div>

        <div v-if="profile && profile.account_type == 2" class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">First Name:</span>
            <v-text-field
            v-model="form.first_name" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="First Name" return-object class="py-0"
            >
            </v-text-field>
        </div>
        
        <div v-if="profile && profile.account_type == 2" class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Last Name:</span>
            <v-text-field
            v-model="form.last_name" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Last Name" return-object class="py-0"
            >
            </v-text-field>
        </div>


        <div :key="ComponentKey" class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Favorite Events:</span>

            <v-autocomplete
            v-model="form.favEvents"
            :items="events"
            outlined
            dense
            hide-details
            chips
            small-chips
            label="Favorite Events"
            multiple
            :close-on-click="false"
            ></v-autocomplete>
        </div>

        <div 
        v-if="profile && profile.account_type == 2"
        :key="ComponentKey" class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Participating Events:</span>

            <v-autocomplete
            v-model="form.participatingEvents"
            :items="events"
            outlined
            dense
            hide-details
            chips
            small-chips
            label="participating Events"
            multiple
            :close-on-click="false"
            ></v-autocomplete>
        </div>

        <div class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Location:</span>
            <v-text-field
            v-model="form.location" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Location" return-object class="py-0"
            >
            </v-text-field>
        </div>

        <div class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Email:</span>
            <v-text-field
            v-model="form.email" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Email" return-object class="py-0"
            >
            </v-text-field>
        </div>

        <h2 class="mb-6 text-h6" style="margin-top: 20px">Links</h2>
        <div class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Facebook:</span>
            <v-text-field
            v-model="form.facebook" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Facebook" return-object class="py-0"
            >
            </v-text-field>
        </div>
        <div class="d-flex align-start mb-6">
            <span style="min-width: 10%" class="mr-2 mt-4">Instagram:</span>
            <v-text-field
            v-model="form.instagram" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Instagram" return-object class="py-0"
            >
            </v-text-field>
        </div>

        <div class="d-flex align-start mb-6">
            <span style="min-width: 10%" class="mr-2 mt-4">Twitter:</span>
            <v-text-field
            v-model="form.twitter" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Twitter" return-object class="py-0"
            >
            </v-text-field>
        </div>

        <div class="d-flex align-start mb-6">
            <span style="min-width: 10%" class="mr-2 mt-4">Youtube:</span>
            <v-text-field
            v-model="form.youtube" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Youtube" return-object class="py-0"
            >
            </v-text-field>
        </div>

        <div class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Tiktok:</span>
            <v-text-field
            v-model="form.tiktok" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Tiktok" return-object class="py-0"
            >
            </v-text-field>
        </div>
        <div class="d-flex align-start mb-6">
            <span style="min-width: 10%" class="mr-2 mt-4">Website:</span>
            <v-text-field
            v-model="form.website" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Website" return-object class="py-0"
            >
            </v-text-field>
        </div>


        <h2 class="my-6 text-h6" style="margin-top: 20px">Bio (Optional)</h2>

        <v-textarea
        v-model="form.bio"
        placeholder="About the animal"
        ></v-textarea>
    </div>
</template>

<script setup>
import { getFirestore } from '@firebase/firestore';
import { useRoute } from 'vue-router'
import store from '@/store/index.js';
import { ref, reactive, computed, watch } from 'vue'

const ComponentKey = ref(0)
const animalImage = ref('')

const fileInput = ref(null)
const form = reactive({
    type: 0,
    events: ['Bareback']
})
const route = useRoute()
const db = getFirestore()

const events = [
    'Bull Riding',
    'Bareback Riding',
    'Saddle Bronc',
    'Team Roping',
    'Barrell Racing',
    'Steer Wrestling',
    'Tie Down Roping',
    'Breakaway Roping',
]

const profile = computed(() => store.state.selectedProfile)
watch(profile, (profileValue) => {
    if(!profileValue) return 
    form.name = profileValue.first_name
    form.first_name = profileValue.first_name
    form.last_name = profileValue.last_name
    form.location = profileValue.location
    form.email = profileValue.email
    form.bio = profileValue.bio
    form.facebook = profileValue.facebook_url
    form.instagram = profileValue.instagram_url
    form.twitter = profileValue.twitter_url
    form.youtube = profileValue.youtube_url
    form.tiktok = profileValue.tiktok_url
    form.website = profileValue.website_url
    form.favEvents = Object.values(profileValue.favorite_events)
        .map((event) => events[event-1])
    ComponentKey.value = ComponentKey.value++  
})
</script>


<style>
.v-btn__overlay {
    background-color: #bd2a24;
}

.v-btn-toggle {
    border: 1px solid #e3e3e3;
}

.v-list-item:not(.title) {
    color: black !important;
}
</style>