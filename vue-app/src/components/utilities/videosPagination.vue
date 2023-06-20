<script setup>
import videoCard from "./Video.vue";
import { paginate } from "@/utils/pagination";
import { watch } from "vue";
import { computed, ref } from "vue";

const props = defineProps({
  videos: {
    type: Array,
    required: true,
  },
});

const videosContainer = ref();
const page = ref(1);

const pagination = computed(() => {
  const { paginatedItems: items, totalPages: length } = paginate(
    props.videos,
    page.value
  );

  return {
    items,
    length,
  };
});

async function scrollToTop() {
  var rect = videosContainer.value.getBoundingClientRect();
  let top = rect.top + window.scrollY - 20;
  window.scrollTo({ top, left: 0, behavior: "smooth" });
}

watch(page, () => {
  scrollToTop();
});
</script>

<template>
  <div ref="videosContainer" style="width: 100%; position: relative">
    <template v-for="(video, index) in pagination.items" :key="video">
      <videoCard
        style="width: 100%"
        :class="(index + 1) % 1 !== 0 ? 'ml-auto' : ''"
        class="mb-5"
        :video="video"
      />
    </template>
    <div
      style="width: 100%; position: sticky; bottom: 16px; left: 0"
      class="d-flex justify-center"
    >
      <v-card>
        <v-pagination
          v-model="page"
          :length="pagination.length"
          :total-visible="7"
        ></v-pagination>
      </v-card>
    </div>
  </div>
</template>
