<template>
    <v-form v-model="valid" ref="formComp" class="d-flex flex-column mx-auto my-6 " style="max-width: 900px">

        <div class="d-flex justify-space-between mb-6">
            <v-btn variant="text"
                @click="$router.go(-1)"
                class="d-flex align-center justify-center mr-2 pl-0">
                <img
                class="mr-3"
                :src="require('@/assets/icons/glyph/glyphs/chevron.left.png')" />
                <span>Back</span>
            </v-btn>

            <v-btn color="primary" @click="save"
            :loading="saving"
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
                <img style="height: 100%; width: auto;" :src="profile ? profileImage : ''" alt="" />
            </v-avatar>

            <div class="caption">
                Choose profile image from library
            </div>
        </v-card>

        <input
        type="file"
        @change="uploadImage"
        style="display: none;"
        ref="fileInput">

        <h2 class="mb-6 text-h6" style="margin-top: 20px">About</h2>
        <div v-if="profile && profile.account_type == 1" class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Name:</span>
            <v-text-field
            :rules="[
                v => !!v || 'Name is required'
            ]"
            v-model="form.name" density="compact"
                    hide-no-data hide-selected
                    placeholder="Name" return-object class="py-0"
            >
            </v-text-field>
        </div>

        <div v-if="profile && profile.account_type == 2" class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">First Name:</span>
            <v-text-field
            :rules="[
                v => !!v || 'First name is required'
            ]"
            v-model="form.first_name" density="compact"
                    hide-no-data hide-selected
                    placeholder="First Name" return-object class="py-0"
            >
            </v-text-field>
        </div>

        <div v-if="profile && profile.account_type == 2" class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Last Name:</span>
            <v-text-field
            :rules="[
                v => !!v || 'Last Name is required'
            ]"
            v-model="form.last_name" density="compact"
                    hide-no-data hide-selected
                    placeholder="Last Name" return-object class="py-0"
            >
            </v-text-field>
        </div>


        <div class="d-flex align-center mb-6 edit_profile">
            <span style="min-width: 10%" class="mr-2">Favorite Events:</span>

            <v-autocomplete
            v-model="form.favEvents"
            :items="events"
            outlined
            dense
            hide-details
            chips
            small-chips
            multiple
            :close-on-click="false"
            ></v-autocomplete>
        </div>

        <div
        v-if="profile && profile.account_type == 2" class="d-flex align-center mb-6 edit_profile">
            <span style="min-width: 10%" class="mr-2">Participating Events:</span>

            <v-autocomplete
            v-model="form.participating_events"
            :items="events"
            outlined
            dense
            :rules="[
                v => !!v || 'Participating events are required',
                v => v.length > 0 || 'You have to choose an event ',
            ]"
            chips
            small-chips
            label="Participating Events"
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
            <span style="min-width: 10%" class="mr-2">Sponsors:</span>
            <v-text-field
            v-model="form.sponsors" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Sponsors" return-object class="py-0"
            >
            </v-text-field>
        </div>

        <div class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Email:</span>
            <v-text-field
            :rules="[
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ]"
            v-model="form.email" density="compact"
                    hide-no-data hide-selected
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
        placeholder="About"
        ></v-textarea>

    </v-form>
</template>

<script setup>
import { doc, getDoc, getFirestore, updateDoc } from '@firebase/firestore';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { useRoute } from 'vue-router'
import { ref, reactive, watch, onMounted } from 'vue'
import { getProfileImageById } from '@/services/profiles';

const ComponentKey = ref(0)
const profileImage = ref('')
const saving = ref(false)
const valid = ref(false)
const fileInput = ref(null)
const formComp = ref(null)
const form = reactive({
    type: 0,
    events: ['Bareback']
})
const route = useRoute()
const db = getFirestore()
const storage = getStorage()
const profile = ref(null)
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

function uploadImage(event) {
    const image = event.target.files[0]
    const fileRef = storageRef(storage, `users/${route.query.id}/profile.jpg`)
    let uploadTask = uploadBytesResumable(fileRef, image)

    uploadTask.on('state_changed',
        console.log,
        console.error,
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                profileImage.value = downloadURL
            });
        }
    );
}

// const profile = computed(() => store.state.selectedProfile)
watch(profile, (profileValue) => {
    if(!profileValue) return
    getProfileImageById(profileValue).then(url => profileImage.value = url)
    form.name = profileValue.first_name
    form.first_name = profileValue.first_name
    form.last_name = profileValue.last_name
    form.location = profileValue.location
    form.sponsors = profileValue.sponsors
    form.email = profileValue.email
    form.bio = profileValue.bio
    form.facebook = profileValue.facebook_url
    form.instagram = profileValue.instagram_url
    form.twitter = profileValue.twitter_url
    form.youtube = profileValue.youtube_url
    form.tiktok = profileValue.tiktok_url
    form.website = profileValue.website_url
    form.participating_events = Object.values(profileValue.events)
        .map((event) => events[event-1])
    form.favEvents = Object.values(profileValue.favorite_events)
        .map((event) => events[event-1])
    ComponentKey.value++
})

async function save() {
    saving.value = true
    console.log(await formComp.value.validate())
    if(!valid.value) {
        saving.value = false
        return
    }
    let data = {
        location: form.location || '',
        sponsors: form.sponsors || '',
        email: form.email || '',
        bio: form.bio || '',
        facebook_url: form.facebook ||  '',
        instagram_url: form.instagram || '',
        twitter_url: form.twitter || '',
        youtube_url: form.youtube  || '',
        tiktok_url: form.tiktok  || '',
        website_url: form.website || '',
        events: form.participating_events.map(x => events.indexOf(x) + 1)  || profile.value.events || [],
        favorite_events: form.favEvents.map(x => events.indexOf(x) + 1)  || profile.value.favorite_events || []
    }

    if (profile.value.account_type == 1) {
        data.first_name = form.first_name || profile.value.first_name || ''
        data.last_name = form.last_name || profile.value.last_name || ''
    }
    else {
        data.name = form.name || profile.value.name || ''
    }

    let docRef = doc(db, 'users', route.query.id)

    const result = await updateDoc(docRef, data).then(console.log).catch(console.error)
    saving.value = false;
    return result
}

onMounted(async () => {
    profile.value = await getDoc(doc(db, 'users', route.query.id)).then((doc) => {
        return {
            ...doc.data(),
            id: doc.id
        }
    })
})
</script>


<style scoped>
.v-btn__overlay {
    background-color: #bd2a24;
}

.v-btn-toggle {
    border: 1px solid #e3e3e3;
}

.v-list-item:not(.title) {
    color: black !important;
}

.edit_profile svg.svg-inline--fa.fa-square-check,
.edit_profile svg.svg-inline--fa.fa-square,
.edit_profile svg:not(:root).svg-inline--fa,
.edit_profile svg:not(:host).svg-inline--fa {
    display: none;
}
</style>
