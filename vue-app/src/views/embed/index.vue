<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const Route = useRoute()

onMounted(() => {
    document.body.classList.add('scroll-hidden')
})
onUnmounted(() => {
    document.body.classList.remove('scroll-hidden')
})

</script>

<template>
    <div class="video-container">
        <vue3-video-player src="https://firebasestorage.googleapis.com/v0/b/rodeotestenv.appspot.com/o/videos%2F8271c168-7d84-4d91-8aa3-542224b0fef6.mov?alt=media&token=29a97f47-aa08-41f5-b18e-69aaa3e02480" ></vue3-video-player>
    </div>
</template>

<style lang="scss">
.video-container {
    width: 100%;
    height: 100%;
}
.scroll-hidden::-webkit-scrollbar {
  width: 0px;
}
</style>
