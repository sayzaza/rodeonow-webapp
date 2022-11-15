<template>
    <v-dialog
        v-model="dialog"
        width="800"
    >
        <template v-slot:activator="{ props }">
            <v-btn
                block
                class="text-black"
                variant="text"
                v-bind="props"
            >
                Embed in my Page
            </v-btn>
        </template>
        <v-card width="700">
            <v-card-title class="text-h5 grey lighten-2">
                <span>
                    Embed video
                </span>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    icon
                    @click="dialog = false"
                    variant="plain"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24"><path fill="#000000" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>
                </v-btn>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
                <v-textarea @click="copy(EmbedHTML)" :model-value="EmbedHTML" label="Code" auto-grow></v-textarea>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="copy(EmbedHTML)"
            >
                Copy
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useClipboard } from '@vueuse/core'

const props = defineProps(['video'])
const Route = useRoute()

const EmbedHTML = ref(`<iframe width="560" height="315" src="${window.location.origin}/embed/${props.video.video_id}" title="RodeoNow VideoPlayer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)

const { copy } = useClipboard()

const dialog = ref(false)
</script>