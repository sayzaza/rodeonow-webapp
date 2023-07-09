<template>
  <div class="d-flex flex-wrap mx-auto my-6" style="max-width: 900px">
    <div class="d-flex" style="width: 100%; padding: 30px 0">
      <v-btn
        @click="
          () => {
            $store.commit('SET_VIDEOS', []);
            initialSetup((append = false));
          }
        "
        icon
        variant="flat"
        style="margin-left: auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
          style="width: 32px"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </v-btn>
    </div>
    <div style="width: 100%">
      <template v-for="(video, index) in videos" :key="video.firestoreID">
        <VideoVue
          @deleted="initialSetup((append = false))"
          style="width: 100%"
          :video="video"
        />
        <v-divider
          v-if="index !== videos.length - 1 && !loading"
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
    <v-card
      v-intersect="debouncedSetup"
      :key="videos.length"
      style="width: 100%"
    ></v-card>
  </div>
</template>

<script setup>
import store from "@/store";
import { computed, watch, ref, onUnmounted, onBeforeMount } from "vue";
import {
  getFirestore,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import VideoVue from "@/components/utilities/Video.vue";

let loading = ref(true);

let videos = computed({
  get: () => {
    return store.state.videos || [];
  },
});

function initialSetup(append = true) {
  if (!store.state.selectedProfile) return;
  loading.value = true;
  console.log("keep loading");
  setTimeout(() => {
    console.log("keeping up");
    loading.value = false;
  }, 30000);
  const db = getFirestore();
  const events = store.state.selectedProfile.favouriteEvents;
  let newVideos = store.state.videos;
  let ref;
  if (events && events.length > 0) {
    if (newVideos.length == 0) {
      ref = query(
        collection(db, "videos"),
        orderBy("created", "desc"),
        where("event_type", "in", events),
        limit(6)
      );
    } else {
      ref = query(
        collection(db, "videos"),
        orderBy("created", "desc"),
        where("event_type", "in", events),
        limit(4)
      );
    }
  } else {
    if (newVideos.length == 0) {
      ref = query(
        collection(db, "videos"),
        orderBy("created", "desc"),
        limit(6)
      );
    } else {
      ref = query(
        collection(db, "videos"),
        orderBy("created", "desc"),
        startAfter(videos.value[videos.value.length - 1].preserved),
        limit(4)
      );
    }
  }
  store.dispatch("bindCollectionRef", {
    key: "videos",
    ref,
    append,
    preserve: true,
    callback: (docs) => docs,
  });

  loading.value = false;
}

function debouncedSetup() {
  if (!loading.value && window.scrollY > 0) initialSetup();
}

watch(
  () => store.state.selectedProfile,
  () => {
    initialSetup();
  }
);

onUnmounted(() => {
  initialSetup();
});

onBeforeMount(() => {
  store.commit("SET_VIDEOS", []);
  initialSetup();
});
</script>

<style></style>
