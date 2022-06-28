<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" max-width="350px">
            <vue3-video-player :src="videoUrl">
                <template #cusControls></template>
            </vue3-video-player>
            <!-- </v-responsive> -->
        </v-dialog>
    </v-row>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue'
import Button from "@/components/utilities/button.vue";
import { useStore } from 'vuex'
import { getStorage, getDownloadURL, ref as storageRef } from 'firebase/storage'
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
export default {
    components: { Button, PulseLoader },
    setup() {
        const store = useStore()
        const storage = getStorage()
        const loading = ref(false)
        const videoUrl = ref('')
        const dialog = computed({
            get: () => {
                return store.state.videoPlayerModal
            },
            set: (value) => {
                store.commit('VIDEO_PLAYER_MODAL', value)
            }
        })

        const videoMeta = computed(() => {
            return store.state.modalVideo
        })

        watch(videoMeta, async ({ video_id }) => {
            initialSetup(video_id)
        })

        onMounted(() => {
            initialSetup(videoMeta.value.video_id)
        })

        async function initialSetup(video_id) { 
            console.log(">>", video_id)
            videoUrl.value = await getDownloadURL(storageRef(storage, `videos/${video_id}.mov`)).catch((error) => {
                console.error(error)
                return ''
            })
            console.log(">>>", videoUrl.value)
        }

        return {
            dialog,
            loading,
            videoUrl,
            videoMeta
        }
    }
}

</script>

<style>






video {
    /* override other styles to make responsive */
    width: 100% !important;
    height: auto !important;
}

.vcp-dashboard {
    width: calc(100%) !important;
    margin-left: 0px !important;
}

.setting-control .vue-core-video-player-control:not(:first-child) {
    display: none;
}
</style>