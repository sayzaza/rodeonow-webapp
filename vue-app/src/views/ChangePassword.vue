
<template>
    <v-form @submit.prevent  class="d-flex flex-column mx-auto my-6 " style="max-width: 700px">
        <div class="d-flex justify-space-between mb-6">
            <v-btn variant="text"
                @click="$router.go(-1)"
                class="d-flex align-center justify-center mr-2 pl-0">
                <img 
                class="mr-3"
                :src="require('@/assets/icons/glyph/glyphs/chevron.left.png')" />
                <span>Back</span>
            </v-btn>
        </div>
        
        <PulseLoader
        v-if="loading"
        class="spinner mx-auto"
        :loading="loading"
        color="#2c3346"
        ></PulseLoader>

        <div class="mb-6">
            <span class="text-subtitle">Current Password</span>
            <div class="d-flex">
                <v-text-field
                :rules="[
                    v => !!v || 'Current Password is required'
                ]"
                v-model="currentPassword" density="compact"
                        variant="outlined"
                        hide-no-data hide-selected
                        :type="showCurrentPassword ? 'text' : 'password'"
                        class="py-0"
                        
                >
                </v-text-field>
                <v-btn 
                tile
                icon="fas fa-eye"
                variant="icon"
                color="success" @click="showPass('currentPassword')">
                </v-btn>
            </div>
            
        </div>


        <div class="mb-6">
            <span class="text-subtitle">New Password</span>
            <div class="d-flex">
                <v-text-field
                :rules="[
                    v => !!v || 'New Password is required'
                ]"
                v-model="newPassword" density="compact"
                        hide-no-data hide-selected
                        variant="outlined"
                        :type="showNewPassword ? 'text' : 'password'"
                        class="py-0"
                >
                </v-text-field>
                <v-btn 
                tile
                icon="fas fa-eye"

                variant="icon"
                color="success" 
                @click.prevent="showPass('newPassword')">
                </v-btn>
            </div>
        </div>

        <div class="mb-6">
            <span class="text-subtitle">Confirm Password</span>
            <div class="d-flex">
                <v-text-field
                :rules="[
                    v => !!v || 'Confirm Password is required',
                    v => v == newPassword || 'Password does not match',
                ]"
                v-model="confirmPassword" density="compact"
                variant="outlined"
                hide-no-data hide-selected
                :type="showConfirmPassword ? 'text' : 'password'"
                class="py-0"
                >
                </v-text-field>
                <v-btn 
                tile
                icon="fas fa-eye"
                variant="icon"
                color="success" @click="showPass('confirmPassword')">
                </v-btn>
            </div>
        </div>

        <Button 
        class="mx-auto mt-auto"
        :text="'change Password'" @buttonClicked="changePassword" />
        
        
    </v-form>
</template>

<script setup>
import { getAuth, updatePassword, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import store from '@/store/index.js';
import { ref, reactive, computed, watch, onMounted } from 'vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import Button from "@/components/utilities/button.vue";

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showConfirmPassword = ref(false)
const showNewPassword = ref(false)
const showCurrentPassword = ref(false)
const loading = ref(false)
const auth = getAuth()
const userProfile = computed(() => {
    return store.state.userProfile
})


function showPass(key) {
    if(key == 'currentPassword') {
        showCurrentPassword.value = !showCurrentPassword.value 
    } 
    else if (key == 'newPassword') {
        showNewPassword.value = !showNewPassword.value 
    }
    else if (key == 'confirmPassword') {
        showConfirmPassword.value = !showConfirmPassword.value 
    }
}

async function changePassword() {
    return signInWithEmailAndPassword(auth, userProfile.value.email, currentPassword.value)
        .then(({ user }) => {
           return updatePassword(user, newPassword.value).then(() => {
               console.log('password has been successfully changed!')
               loading.value = false
               signOut(auth)
           }) 
        }).catch((error) => {
            console.log('Current password is not correct!')
            console.error(error)
            loading.value = false
            throw error
        })
}



</script>


<style>
</style>