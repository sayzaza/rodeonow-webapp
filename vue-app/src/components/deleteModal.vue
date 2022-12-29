<script setup>
import { ref } from 'vue'
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const props = defineProps(['animal', 'have_videos'])

const show_delete = ref(false)

const db = getFirestore()


const on_delete = async () => {
    const docRef = doc(db, 'animals', props.animal.id)

    await deleteDoc(docRef)
        .then(() => {
            console.log(`Animal deleted`)
        })
        .catch((error) => {
            console.log(error)
        })
}

</script>

<template>
    <v-dialog v-model="show_delete" max-width="750" persistent>
        <template v-slot:activator="{ props }">
            <v-btn variant="text" block class="text-red" v-bind="props">
                Delete Animal
            </v-btn>
        </template>
        <v-card rounded="lg">
            <!-- <v-card-title class="d-flex justify-content">
                <span class="text-h5">
                    Send Message to RodeoNow
                </span>
                <v-spacer />
                <v-btn variant="text" @click="show_delete = false">
                    <v-icon icon="fas fa-x" />
                </v-btn>
            </v-card-title> -->
            <template v-if="have_videos">
                <v-card-text>
                    <v-container class="d-flex justify-center text-center">
                        <div>
                            You must delete this animal's videos before you can remove the animal.
                        </div>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="show_delete = false">
                        Close
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </template>
            <template v-else>
                <v-card-text>
                    <v-container class="d-flex justify-center text-center">
                        <div>
                            Are you sure you want to delete the animal <b>{{ animal.name }}</b>?<br />This action cannot
                            be undone.
                        </div>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="show_delete = false">
                        Cancel
                    </v-btn>
                    <v-btn color="red-darken-1" variant="text" @click="on_delete">
                        Delete
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </template>
        </v-card>
    </v-dialog>
</template>