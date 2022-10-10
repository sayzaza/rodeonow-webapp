<template>
    <v-form ref="form" @submit.prevent v-model="valid" class="d-flex flex-column mx-auto my-6 " style="max-width: 700px">
        <div class="d-flex justify-space-between mb-6">
            <span class="text-subtitle-1 font-weight-bold">Share</span>
        </div>
        <div class="mb-6">
            <!-- <span class="text-subtitle">Location</span> -->
            <div class="d-flex">
                <v-select
                :items="[]"
                label="Championship"
                variant="underlined"
                ></v-select>
            </div>

            <div class="d-flex">
                <v-text-field
                v-model="radioEvent" density="compact"
                label="Radio Event"
                variant="underlined"
                hide-no-data hide-selected
                class="py-0"
                >
                </v-text-field>
            </div>

            <div class="d-flex">
                <v-text-field
                v-model="location" density="compact"
                label="Location"
                hide-no-data hide-selected
                variant="underlined"
                class="py-0"
                >
                </v-text-field>
            </div>

            <div class="d-flex align-center" style="width: 100%">
                <v-text-field
                v-model="date" density="compact"
                label="Event Date"
                hide-no-data hide-selected
                type="date"
                variant="underlined"
                class="py-0 flex-grow-1 flex-shrink-0 mr-3"
                >
                </v-text-field>
                <div class="d-flex ml-auto align-center">
                    <span class="text-caption ">Today</span>
                    <v-checkbox color="primary"  hide-details v-model="today" :key="today"></v-checkbox>
                </div>
            </div>

            <div class="d-flex align-center" style="width: 100%">
                <v-select
                :items="[]"
                label="Animal in Video"
                variant="underlined"
                ></v-select>
                <div class="d-flex ml-auto align-center">
                   <v-btn
                        icon
                        size="small"
                        variant="text"
                        class="d-flex items-center justify-center mr-2 ml-auto"
                        @click="addAnimal"
                    >
                        <img
                        width="32"
                        :src="require('@/assets/icons/glyph/glyphs/plus.circle.red.png')"
                        />
                    </v-btn>
                </div>
            </div>

            

            <div class="d-flex">
                <v-select
                :items="[]"
                label="Select event"
                variant="underlined"
                ></v-select>
            </div>

            <div class="d-flex">
                <v-select
                :items="[]"
                label="Contestant"
                append-inner-icon="fas fa-search"
                variant="underlined"
                ></v-select>
            </div>

            <div class="d-flex align-center" style="width: 100%">
                <div class="d-flex ml-auto align-center">
                   <v-btn-toggle
                        v-model="scoreTime"
                        tile
                        color="primary"
                        group
                        mandatory
                        class="mr-3"
                    >
                        <v-btn 
                        size="small"
                        value="score">
                        Score
                        </v-btn>

                        <v-btn 
                        size="small"
                        value="time">
                        Time
                        </v-btn>
                    </v-btn-toggle>
                </div>

                <v-text-field
                    v-if="scoreTime == 'score'"
                    v-model="score" density="compact"
                    hide-no-data hide-selected
                    variant="underlined"
                    class="py-0"
                    >
                    </v-text-field>

                 <v-text-field
                    v-else
                    v-model="score" density="compact"
                    hide-no-data hide-selected
                    variant="underlined"
                    class="py-0"
                    >
                    </v-text-field>   
            </div>

            <div class="d-flex">
                <v-textarea
                v-model="notes" density="compact"
                label="Notes"
                variant="underlined"
                hide-no-data hide-selected
                class="py-0"
                >
                </v-textarea>
            </div>
            
        </div>

        <Button 
        class="mx-auto mt-auto"
        :text="'Save'" />
    </v-form>
</template>

<script setup>
import { getAuth, updatePassword, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import store from '@/store/index.js';
import { ref, reactive, computed, watch, onMounted } from 'vue'
import Button from "@/components/utilities/button.vue";
import { useRoute, useRouter } from "vue-router";

const currentPassword = ref('')
const radioEvent = ref('')
const location = ref('')
const form = ref(null)
const showNewPassword = ref(false)
const scoreTime = ref('score')
const score = ref('')
const today = ref(false)
const auth = getAuth()
const valid = ref(false)
const userProfile = computed(() => {
    return store.state.userProfile
})
const router = useRouter()
function addAnimal() {
    console.log("create a new animal")
    router.push({
        path: "/animals/new"
    })
}
</script>


<style>
</style>