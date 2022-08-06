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

            <v-btn variant="text"
                class="d-flex align-center justify-center mr-2">
                <span>Save</span>
            </v-btn>
        </div>

        <h2 class="mb-6 text-h6">Profile Picture</h2>
        <v-card
        @click="() => {}"
        class="d-flex pa-3 mb-6 align-center"
        >
            <v-avatar size="120" class="mr-3" style="border-radius: 5%;" color="gray" tile >
                <img style="height: 100%; width: auto;" :src="$store.state.selectedProfile.photo_url" alt="" />
            </v-avatar>

            <div class="caption">
                Choose profile image from library
            </div>
        </v-card>

        <h2 class="mb-6 text-h6" style="margin-top: 20px">About</h2>
        <div class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Name:</span>
            <v-text-field
            v-model="form.name" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Name" return-object class="py-0"
            >
            </v-text-field>
        </div>

        <div class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Favourite Events:</span>
            <v-text-field
            v-model="form.favEvents" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Favourite Events" return-object class="py-0"
            >
            </v-text-field>
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
import { getProfileImageById } from '@/services/profiles'

const animalImage = ref('')
const form = reactive({
    type: 0,
    events: ['Bareback']
})
const route = useRoute()
const db = getFirestore()

const profile = computed(() => store.state.selectedProfile)
watch(profile, (profileValue) => {
    if(!profileValue) return 
    form.name = profileValue.name
    form.brand = profileValue.brand
    form.type = profileValue.animal_type-1
    form.bio = profileValue.bio
    form.events = profileValue.events.map((event) => {
        if(event == 1) return 'Bareback'
        if(event == 2) return 'SaddleBronc'
    })
})
</script>


<style>
.v-btn__overlay {
    background-color: #bd2a24;
}

.v-btn-toggle {
    border: 1px solid #e3e3e3;
}
</style>