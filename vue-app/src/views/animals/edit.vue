<template>
    <v-form v-model="valid" ref="formComp" class="d-flex flex-column mx-auto my-6" style="max-width: 900px">

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
            @click="save"
            :loading="saving"
                class="d-flex align-center justify-center mr-2">
                <span>Save</span>
            </v-btn>
        </div>

        <h2 class="mb-6 text-h6">About (Required)</h2>
        <div class="d-flex align-end mb-6">
            <span style="min-width: 7%" class="mr-2">Name:</span>
            <v-text-field
            v-model="form.name" density="compact"
                    hide-no-data hide-selected hide-details
                    placeholder="Animal's Name" return-object class="py-0"
            >
            </v-text-field>
        </div>
        <div class="d-flex align-center mb-6">
            <span style="min-width: 7%" class="mr-2">Brand:</span>
            <v-text-field
            required
            :rules="[
                v => !!v || 'Brand is required'
            ]"
            v-model="form.brand" density="compact"
                    hide-no-data hide-selected
                    placeholder="Animal's Brand" return-object class="py-0"
            >
            </v-text-field>
        </div>
        <div class="d-flex align-center mb-6">
            <span style="min-width: 7%" class="mr-2">Type:</span>
            <div>
                <v-btn-toggle
                v-model="form.type"
                group
            >
                <v-btn>
                    <span>Bull</span>
                </v-btn>

                <v-btn>
                    <span>Horse</span>
                </v-btn>

                <v-btn>
                    <span>Steer</span>
                </v-btn>

                <v-btn>
                    <span>Calf</span>
                </v-btn>
            </v-btn-toggle>
            </div>
        </div>
        <div class="d-flex align-start mb-6">
            <span style="min-width: 7%" class="mr-2 mt-4">Events:</span>
            <div class="d-flex flex-column">
                <v-checkbox
                v-if="form.type == 0"
                v-model="form.events"
                label="Bull Riding"
                value="Bull"
                :key="formKey"
                dense
                :rules="[
                     form.events.length > 0 || 'At least one event has to be selected'
                ]"
                color="primary"
                ></v-checkbox>
                <v-checkbox
                v-if="form.type == 1"
                v-model="form.events"
                label="Bareback Riding"
                value="Bareback"
                :key="formKey"
                hide-details
                dense
                :rules="[
                     form.events.length > 0 || 'At least one event has to be selected'
                ]"
                color="primary"
                ></v-checkbox>
                <v-checkbox
                v-if="form.type == 1"
                v-model="form.events"
                :key="formKey"
                dense
                :rules="[
                     form.events.length > 0 || 'At least one event has to be selected',
                ]"
                color="primary"
                label="Saddle Bronc"
                value="SaddleBronc"
                ></v-checkbox>

                <v-checkbox
                v-if="form.type == 2"
                v-model="form.events"
                label="Steer Wrestling"
                value="steerWrestling"
                :key="formKey"
                dense
                :rules="[
                     form.events.length > 0 || 'At least one event has to be selected',
                ]"
                hide-details
                color="primary"
                ></v-checkbox>

                <v-checkbox
                v-if="form.type == 2"
                v-model="form.events"
                label="Team Roping"
                value="teamRoping"
                :key="formKey"
                dense
                :rules="[
                     form.events.length > 0 || 'At least one event has to be selected',
                ]"
                color="primary"
                ></v-checkbox>

                <v-checkbox
                v-if="form.type == 3"
                v-model="form.events"
                label="Tie Down Roping"
                value="tieDownRoping"
                :key="formKey"
                dense
                :rules="[
                     v => form.events.length > 0 || 'At least one event has to be selected',
                ]"
                color="primary"
                ></v-checkbox>
            </div>
        </div>
        <h2 class="mb-6 text-h6">Animal image (Optional)</h2>

        <v-card
        @click="$refs.fileInput.click()"
        class="d-flex pa-3 mb-6 align-center"
        >
            <v-avatar size="120" class="mr-3" style="border-radius: 5%;" color="gray" tile >
                <img style="height: 100%; width: auto;" :src="animalImage" alt="" />
            </v-avatar>

            <div class="caption">
                Choose animal image from library
            </div>
        </v-card>

        <input
        type="file"
        style="display: none;"
        @change="uploadImage"
        ref="fileInput">

        <h2 class="my-6 text-h6">Bio (Optional)</h2>

        <v-textarea
        v-model="form.bio"
        placeholder="About the animal"
        ></v-textarea>
    </v-form>
</template>

<script setup>
import { doc, getFirestore, updateDoc } from '@firebase/firestore';
import { useRoute, useRouter } from 'vue-router'
import store from '@/store/index.js';
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { getProfileImageById } from '@/services/profiles'
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from '@firebase/storage';

const storage = getStorage()
const formKey = ref(0)
const animalImage = ref('')
const saving = ref(false)
const valid = ref(false)
const form = reactive({
    type: 0,
    events: ['Bareback']
})

const events = [
    'Bull',
    'Bareback',
    'SaddleBronc',
    'TeamRoping',
    'BarrellRacing',
    'SteerWrestling',
    'TieDownRoping',
    'BreakawayRoping',
]

watch(() => form.events, (newValue, oldValue) => {
    formKey.value++
})

function uploadImage(event) {
    const image = event.target.files[0]
    const fileRef = storageRef(storage, `animals/${route.query.id}/profile.jpg`)
    let uploadTask = uploadBytesResumable(fileRef, image)

    uploadTask.on('state_changed',
        console.log,
        console.error,
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                animalImage.value = downloadURL
            });
        }
    );
}

watch(() => form.type, (newValue, oldValue) => {
    console.log(newValue, oldValue)
    if(newValue == undefined) {
        form.type = oldValue
    }
    // form.events && form.events.length != 0 ? form.events = [] : null
    const condition = oldValue !== newValue && !animal.value
    if(newValue == 0 && condition) {
        form.events = [
            'Bull'
        ]
    }
    else if(newValue == 1 && condition) {
        form.events = [
            'Bareback'
        ]
    }
    else if(newValue == 2 && condition) {
        form.events = [
            'steerWrestling'
        ]
    }
    else if(newValue == 3 && condition) {
        form.events = [
            'tieDownRoping'
        ]
    }
    formKey.value++
})

const route = useRoute()
const router = useRouter()
const db = getFirestore()
const fileInput = ref(null)
const formComp = ref(null)
async function getAnimal() {
    if(!route.query.id) return
    try {
        store.commit('SET_FIRESTORE_VALUE', { key: 'animal', doc: null })
        store.state.subscribers['animal']()
    } catch { }

    let docRef = doc(db, 'animals', route.query.id)
    store.dispatch('bindRef', { key: 'animal', ref: docRef })
}
async function getImage() {
    let image = ''
    if (animal.value.picture_url) {
        image = animal.value.picture_url
    }
    else if (animal.value.contractor && animal.value.contractor.length > 0) {
        image = await getProfileImageById({ id: animal.value.contractor, account_type: 1 })
    }
    if (image.length == 0) {
        image = iconImage
    }
    animalImage.value = image
}

const animal = computed(() => store.state.animal)
watch(animal, (animalValue) => {
    if(!animalValue) return
    getImage()
    console.log("animalValue", animalValue)
    form.name = animalValue.name
    form.brand = animalValue.brand
    form.type = animalValue.animal_type-1
    form.bio = animalValue.bio
    form.events = animalValue.events.map((event) => events[event-1])
})
async function initialSetup() {
    getAnimal()
}

async function save() {
    saving.value = true
    console.log(await formComp.value.validate())
    if(!valid.value) {
        saving.value = false
        return
    }
    let data = {
        name: form.name || '',
        bio: form.bio || '',
        brand: form.brand || '',
        animal_type: form.type+1 || 1,
        picture_url: animalImage.value,
        events: form.events.map(x => events.indexOf(x) + 1)  || profile.value.events || [],
    }
    console.log(">>>", data)
    let docRef = doc(db, 'animals', route.query.id)
    const result = await updateDoc(docRef, data).then(res => {
        router.go(-1);
        return res;
    }).catch(console.error)
    saving.value = false
    return result
}

onMounted(() => {
    initialSetup()
})
</script>


<style scoped>
.v-btn__overlay {
    background-color: #bd2a24;
}

.v-btn-toggle {
    border: 1px solid #e3e3e3;
}
</style>
