<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" fullscreen max-height="100vh">
            <!-- <vue3-video-player :src="videoUrl">
                <template #cusControls></template>
            </vue3-video-player> -->
            <!-- </v-responsive> -->
            <figure id="videoContainer" data-fullscreen="false" style="max-height: 100vh;">

                <div @click.prevent="dialog = false" class="video-wrapper" style="max-height: 100vh; overflow: hidden;">

                    <div class="vid-navigator prev-vdeo d-flex align-center justify-center">
                        <v-btn @click.stop="prevVideo" variant="flat" :rounded="0" icon color="rgb(0,0,0,0.5)">
                            <v-icon color="white" variant="large">fas fa-chevron-left</v-icon>
                        </v-btn>
                    </div>
                    <div class="vid-navigator next-vdeo d-flex align-center justify-center">
                        <v-btn @click.stop="nextVideo" :rounded="0" variant="flat" icon color="rgb(0,0,0,0.5)">
                            <v-icon color="white" variant="large">fas fa-chevron-right</v-icon>
                        </v-btn>
                    </div>
                    <div class="d-flex justify-center">
                        <div class="mx-auto" style="position: relative">
                            <div v-show="displayControls" @mouseover="displayControlsEvent(true)"
                                @mouseout="displayControlsEvent(false)" class="top-overlay-wrapper" @click.stop>
                                <div class=" top-overlay justify-space-between pa-3 pt-1 text-white">
                                    <div class="d-flex flex-column">
                                        <span>{{ getDate() }}</span>
                                        <span>{{ videoMeta.title }}</span>
                                        <span v-if="videoMeta.animal_name">
                                            <span>{{ videoMeta.animal_name }}</span> <span
                                                v-if="videoMeta.animal_brand">
                                                ({{ videoMeta.animal_brand }})
                                            </span>
                                        </span>
                                    </div>
                                    <div class="d-flex flex-column ml-auto mr-1 text-end">
                                        <span v-if="videoMeta.score">Score: {{ videoMeta.score
                                            }}</span>
                                        <span>{{ videoMeta.location }}</span>
                                    </div>
                                    <!-- <div class="my-auto">
                                        <v-btn variant="text" size="x-small" @click="dialog = false" color="white">
                                            <v-icon :size="18">fas fa-close</v-icon>
                                        </v-btn>
                                    </div> -->
                                </div>
                            </div>
                            <div @mouseover="displayControlsEvent(true)" @click.stop
                                @mouseout="displayControlsEvent(false)" v-show="displayControls" :max="100"
                                class="speed-slider">
                                <v-slider @click.stop color="white" v-model="speed" @click.prevent direction="vertical">
                                    <!-- <template v-slot:thumb-label="{ modelValue }">
                                {{ thumbs[modelValue] }}
                            </template> -->
                                    <template v-slot:append>
                                        <span class="text-white">1x</span>
                                    </template>

                                    <template v-slot:prepend>
                                        <span class="text-white">.1x</span>
                                    </template>
                                </v-slider>
                            </div>
                            <video @pause="displayControlsEvent(true)" @ended="displayControlsEvent(true)"
                                @click.prevent.stop="playPause" @mouseover="displayControlsEvent(true)"
                                @mouseout="displayControlsEvent(false)" @mousemove="displayControlsEvent(true)"
                                :key="videoKey" id="video" autoplay class="mx-auto" controls
                                :poster="videoMeta.thumbnail_url">
                                <source :src="videoUrl" type="video/mp4">
                                <!-- Flash fallback -->
                                <object type="application/x-shockwave-flash"
                                    :data="`flash-player.swf?videoUrl=${videoUrl}`" width="1024" height="576">
                                    <param name="movie" :value="`flash-player.swf?videoUrl=${videoUrl}`" />
                                    <param name="allowfullscreen" value="true" />
                                    <param name="wmode" value="transparent" />
                                    <param name="flashvars"
                                        :value="`controlbar=over&amp;image=${videoMeta.thumbnail_url}&amp;file=flash-player.swf?videoUrl=${videoUrl}`" />
                                    <img :src="videoMeta.thumbnail_url" width="1024" height="428" />
                                </object>
                                <!-- Offer download -->
                                <!-- <a :href="videoUrl">Download MP4</a> -->
                            </video>
                        </div>
                    </div>


                </div>

            </figure>

        </v-dialog>
    </v-row>
</template>

<script>
import { computed, ref, onMounted, watch, onUnmounted } from 'vue'
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
        const videoPlayer = ref(null)
        const speed = ref(100)
        const videoKey = ref(69420)
        const displayControlsInterval = ref(null)
        const displayControls = ref(true)
        const thumbs = ref({
            0: '2x',
            1: '1.75x',
            2: '1.5x',
            3: '1.25x',
            4: '1x',
            5: '0.75x',
            6: '0.5x',
            7: '0.25x',
        })
        const dialog = computed({
            get: () => {
                return store.state.videoPlayerModal
            },
            set: (value) => {
                store.commit('VIDEO_PLAYER_MODAL', value)
            }
        })

        watch(speed, (value) => {
            let newSpeed = value / 100
            newSpeed = newSpeed > 0.1 ? newSpeed : 0.1
            document.querySelector('video').muted = newSpeed < 0.5
            document.querySelector('video').playbackRate = newSpeed;
        })

        const getDate = () => {
            let d = new Date(videoMeta.value.event_date * 1000)
            const pieces = d.toDateString().split(' ').slice(1, 4)
            return `${pieces[0]} ${pieces[1]}, ${pieces[2]}`
        }

        const prevVideo = () => {
            displayControlsEvent(true)
            let videoIndex = store.state.videos
                .map(vid => vid.video_id)
                .indexOf(videoMeta.value.video_id)
            if (videoIndex > 0) videoMeta.value = store.state.videos[videoIndex - 1]
        }

        const nextVideo = () => {
            displayControlsEvent(true)
            let videoIndex = store.state.videos
                .map(vid => vid.video_id)
                .indexOf(videoMeta.value.video_id)
            if (videoIndex < store.state.videos.length-1) videoMeta.value = store.state.videos[videoIndex + 1]
        }

        const videoMeta = computed({
            get: () => {
                return store.state.modalVideo
            },
            set: (v) => {
                store.commit('SET_MODAL_VIDEO', v)
            }
        })

        watch(videoMeta, async ({ video_id }) => {
            if (video_id) initialSetup(video_id)
        })

        onUnmounted(() => {
            videoMeta.value = null
        })

        onMounted(() => {
            if (videoMeta.value && videoMeta.value.video_id) initialSetup(videoMeta.value.video_id)
        })

        async function initialSetup(video_id) { 
            videoUrl.value = ''
            videoUrl.value = await getDownloadURL(storageRef(storage, `videos/${video_id}.mov`)).catch((error) => {
                console.error(error)
                return ''
            })
            // console.log(">>>", videoUrl.value)
            videoKey.value++
            speed.value = 100
        }

        function playPause(e) {
            if (e.target.paused) {
                return e.target.play()
            } else {
                e.target.pause()
            }
        }

        function displayControlsEvent(value) {
            if(!value) {
                displayControlsInterval.value = setTimeout(() => {
                    if (!document.querySelector('video').paused) {
                        displayControls.value = false
                    }
                }, 300)
            }
            else {
                try {
                    clearTimeout(displayControlsInterval.value)
                } catch (error) {}
                displayControls.value = true 
                displayControlsInterval.value = setTimeout(() => {
                    if (!document.querySelector('video').ended) {
                        displayControls.value = false
                    }
                }, 5000)
            }
        }

        return {
            dialog,
            loading,
            videoUrl,
            videoPlayer,
            getDate,
            videoMeta,
            prevVideo,
            thumbs,
            speed,
            nextVideo,
            videoKey,
            displayControls,
            playPause,
            displayControlsEvent
        }
    }
}

</script>

<style>




.vid-navigator, .speed-slider {
    position: absolute;
    width: 50px;
    height: 99%;
    transition: .15s ease-in-out;
    top: 0;
}

.vid-navigator button {
    z-index: 100;
}

.speed-slider {
    right:  -50px;
    height: auto;
    z-index: 101;
    top: 80px;
    transition: all 2s ease-in-out
}

/* .speed-slider > div {
    visibility: hidden;
}

.speed-slider:hover > div {
    visibility: visible
} */

.prev-vdeo {
    left: 0px;
}

.next-vdeo {
    right: 0px;
}


.top-overlay-wrapper {
    position: absolute;
    top: 0;
    transition: 2s ease-in-out;
    left: 0;
    width: 100%;
    /* min-height: 35%; */
    z-index: 100;
}

.top-overlay {
    background-color: rgba(0, 0, 0, 0.55);
    width: 100%;
    display: flex !important;
    /* display: none; */
}

/* .top-overlay-wrapper:hover .top-overlay {
    display: flex !important;
} */

video {
    /* override other styles to make responsive */
    width: auto !important;
    /* height: auto !important; */
    display: block;
    max-height: 100vh;
    height: 100vh !important;
    /* max-width: 350px; */
    margin: auto;
}

.vcp-dashboard {
    width: calc(100%) !important;
    margin-left: 0px !important;
}

figure {
    width: 100%;
    height: auto;
}

figcaption {
    display: block;
    font-size: 16px;
    font-size: 1rem;
}

video {
    width: 100%;
    height: auto;
}

/* controls */
.controls,
.controls li {
    padding: 0;
    margin: 0;
}

.controls {
    /* display: none; */
    list-style-type: none;
    overflow: hidden;
    background: transparent;
}

.controls li {
    float: left;
    width: 10%;
    margin-left: 0.3%;
}

.controls li:first-child {
    margin-left: 0;
}

.controls .progress {
    width: 38%;
    cursor: pointer;
}

.controls button {
    width: 100%;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.controls progress {
    display: block;
    width: 100%;
    height: 20px;
    height: 1.25rem;
    margin-top: 2px;
    margin-top: 0.125rem;
    border: 1px solid #aaa;
    overflow: hidden;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
}

.controls progress span {
    width: 0%;
    height: 100%;
    display: inline-block;
    background-color: #2a84cd;
}

/* fullscreen */
html:-ms-fullscreen {
    width: 100%;
}

:-webkit-full-screen {
    background-color: transparent;
}

/* hide controls on fullscreen with WebKit */
/* figure[data-fullscreen=true] video::-webkit-media-controls {
    display: none !important;
} */

figure[data-fullscreen=true] {
    max-width: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
}

figure[data-fullscreen=true] video {
    height: auto;
}

/* figure[data-fullscreen=true] figcaption {
    display: none;
} */

figure[data-fullscreen=true] .controls {
    position: absolute;
    bottom: 2%;
    width: 100%;
    z-index: 2147483647;
}

figure[data-fullscreen=true] .controls li {
    width: 5%;
}

figure[data-fullscreen=true] .controls .progress {
    width: 68%;
}

.v-overlay__scrim {
    background-color: black;
    opacity: 90%;
}
</style>