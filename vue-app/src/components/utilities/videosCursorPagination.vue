<script setup>
import VideoCard from "./Video.vue";
import { paginate } from "@/utils/pagination";
import { useIntersectionObserver } from "@vueuse/core";
import { toRefs, ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  videos: {
    type: Array,
    required: true,
  },
});

const { videos } = toRefs(props);

const loading = ref(false);
const page = ref(1);
const videosQueue = ref([]);
const cursorIntersector = ref();

const pagination = computed(() => {
  const { paginatedItems: items, totalPages: length } = paginate(
    videos.value,
    page.value,
    10
  );

  return {
    items,
    length,
  };
});

const setVideos = () => {
  if (page.value > pagination.value.length) return;
  loading.value = true;

  setTimeout(() => {
    videosQueue.value = [...videosQueue.value, ...pagination.value.items];
    page.value++;
    loading.value = false;
  }, 500);
};

onMounted(() => {
  setVideos();
});

const cursorIsVisible = ref(false);

watch(cursorIsVisible, (new_value) => {
  if (new_value) {
    setVideos();
  }
});

useIntersectionObserver(cursorIntersector, ([{ isIntersecting }]) => {
  cursorIsVisible.value = isIntersecting;
});
</script>

<template>
  <div ref="videosContainer" style="width: 100%">
    <template v-for="(video, index) in videosQueue" :key="video">
      <VideoCard
        style="width: 100%"
        :class="(index + 1) % 1 !== 0 ? 'ml-auto' : ''"
        class="mb-5"
        :video="video"
      />
      <v-divider
        v-if="index !== videosQueue.length - 1 && !loading"
        style="margin: 40px 0"
      ></v-divider>
    </template>
    <div class="d-flex justify-center" style="width: 100%">
      <v-progress-circular
        class="mx-auto"
        indeterminate
        v-if="loading"
      ></v-progress-circular>
    </div>
  </div>
  <template v-if="!loading">
    <div ref="cursorIntersector" class="mt-4" />
  </template>
</template>
