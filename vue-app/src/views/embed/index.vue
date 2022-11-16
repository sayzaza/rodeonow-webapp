<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { getStorage as GetStorage, getDownloadURL as GetURL, ref as StorageRef } from 'firebase/storage'
import { useRoute } from 'vue-router'

const Route = useRoute()
const Storage = GetStorage()
const VideoSrc = ref('')

const LinkToApp = computed(() => {
    return `${window.location.origin}${Route.fullPath}`
})
console.log()

async function initialSetup(){
    const data = await GetURL(StorageRef(Storage, `videos/${Route.params.id}.mov`))
    .catch((error) => {
        console.error(error)
        return ''
    })
    VideoSrc.value = data
}

initialSetup()

onMounted(() => {
    document.body.classList.add('scroll-hidden')
})
onUnmounted(() => {
    document.body.classList.remove('scroll-hidden')
})

</script>

<template>
    <div class="video-container" v-if="VideoSrc !== ''">
        <!-- <div class="logo-container">
            <a :href="LinkToApp" target="_blank" class="linkLogo">
                <img src="/assets/images/rodeo.jpeg" class="logo" alt="">
                <div class="logo-text">
                    See in RodeoNow
                </div>
            </a>
        </div> -->
        <vue3-video-player :src="VideoSrc">
            <template #cusControls>
                <a :href="LinkToApp" target="_blank" class="linkLogo">
                    <span class="tooltip-rodeo">
                        See in RodeoNow
                    </span>
                    <img src="/assets/images/logotype.png" class="logo" alt="RodeoNOW">
                </a>
            </template>
        </vue3-video-player>
    </div>
    <div v-else>
        <div style="text-align: center;" class="d-flex justify-center align-center w-100 h-screen">
            <v-progress-circular
                :size="70"
                indeterminate
                color="primary"
            ></v-progress-circular>
        </div>
    </div>
</template>

<style lang="scss">
.linkLogo {
    position: relative;
    display: block;
    width: 100px;
    opacity: 0.5;
    pointer-events: auto;
    transition: all;
    transition-duration: 300ms;
    transition-timing-function: ease-in;
}
.linkLogo:hover {
    opacity: 1;
}
.linkLogo:hover > .tooltip-rodeo {
    opacity: 1;
}
.logo {
    width: 100px;
}
.tooltip-rodeo {
    position: absolute;
    width: 150px;
    text-decoration: none;
    background: rgb(189, 189, 189);
    border-radius: 5px;
    color: rgb(66, 66, 66);
    font-size: 14px;
    opacity: 0;
    top: -30px;
    left: -25px;
    pointer-events: none;
}
.video-container {
    width: 100%;
    height: 100%;
}
.scroll-hidden::-webkit-scrollbar {
  width: 0px;
}
</style>
