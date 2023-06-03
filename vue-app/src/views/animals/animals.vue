<template>
  <div class="d-flex flex-column">
    <v-img cover height="250px" class="d-flex align-start" :src="coverPhoto">
    </v-img>

    <div
      v-if="animal"
      style="position: relative; width: 100%; max-width: 900px"
      class="d-flex flex-column align-center mx-auto"
    >
      <div
        style="width: 100%"
        v-if="
          animal &&
          $store.state.selectedProfile &&
          animal.contractor === $store.state.selectedProfile.id
        "
        class="d-flex justify-space-between pa-3"
      >
        <v-btn
          icon
          size="small"
          variant="text"
          class="d-flex align-center justify-center mr-2"
          @click="$router.go(-1)"
        >
          <img
            style=""
            class="mt-1"
            :src="require('@/assets/icons/glyph/glyphs/chevron.left.png')"
          />
        </v-btn>

        <v-avatar
          cover
          color="transparent"
          aspect-ratio="1"
          size="180"
          style="
            border-radius: 5%;
            position: relative;
            bottom: 60px;
            margin-bottom: -60px;
          "
          tile
        >
          <v-img cover aspect-ratio="1" style="width: 100%" :src="animalImage">
          </v-img>
        </v-avatar>

        <router-link
          :to="{
            path: `/animals/edit/${animal.id}`,
          }"
        >
          <v-btn dark color="error" variant="text" class="ml-1">edit</v-btn>
        </router-link>
      </div>

      <div class="d-flex flex-column text-center">
        <h3 class="">
          <span class="text--disabled">{{ animal.brand }}</span>
          {{ animal.name }}
        </h3>
        <span class="text--disabled">{{ animal.location }}</span>
        <span class="text-red">{{ animal.contractor_name }}</span>
        <span class="text--disabled text-caption">{{
          animal.events.map((event) => events[event + 1]).join(", ")
        }}</span>
      </div>

      <div class="d-flex justify-center mt-6">
        <v-btn
          v-if="animal"
          icon
          size="small"
          variant="text"
          class="d-flex items-center justify-center mr-2"
        >
          <img
            class="mt-1"
            :src="require('@/assets/icons/glyph/glyphs/plus.circle.red.png')"
          />
        </v-btn>
      </div>
    </div>

    <div style="width: 100%; max-width: 900px" class="mx-auto">
      <div style="width: 100%" class="d-flex align-center my-6">
        <v-text-field
          v-model="search"
          density="compact"
          prepend-inner-icon="fas fa-search"
          color="white"
          hide-no-data
          hide-selected
          hide-details
          variant="outlined"
          placeholder="Start typing to Search Videos"
          return-object
          class="py-0"
        ></v-text-field>
      </div>

      <template v-for="(video, index) in videos" :key="video.firestoreID">
        <VideoVue
          style="width: 100%"
          :video="video"
          :videoUser="videoUsers[index] ? videoUsers[index] : null"
        />
        <v-divider
          v-if="index !== videos.length - 1"
          style="margin: 40px 0"
        ></v-divider>
      </template>
    </div>
  </div>
</template>

<script setup>
import { getProfileImageById } from "@/services/profiles.js";
import { onMounted, computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import store from "@/store";
import {
  doc,
  getFirestore,
  query,
  collection,
  where,
  getDoc,
} from "firebase/firestore";
import VideoVue from "@/components/utilities/Video.vue";
import events from "@/utils/events";

let route = useRoute();
let db = getFirestore();
// let events = [
//   "Contestants",
//   "Contractors",
//   "Bull Riding",
//   "Bareback Riding",
//   "Saddle Bronc",
//   "Team Roping",
//   "Barrell Racing",
//   "Steer Wrestling",
//   "Tie Down Roping",
//   "Breakaway Roping",
// ];

const animalImage = ref(null);
const search = ref(null);
const videoUsers = ref([]);

onMounted(() => {
  getAnimal();
});

async function getAnimal() {
  if (!route.params.id) {
    return;
  }
  try {
    store.commit("SET_FIRESTORE_VALUE", { key: "animal", doc: null });
    store.state.subscribers["animal"]();
  } catch {}

  let docRef = doc(db, "animals", route.params.id);
  store.dispatch("bindRef", { key: "animal", ref: docRef });
}

const animal = computed(() => store.state.animal);

watch(animal, (a) => {
  getVideos();
  if (a) getImage();
});

const coverPhoto = computed(() => {
  if (!animal.value) {
    return;
  }
  return animal.value.animal_type == 2
    ? require("@/assets/images/barrel-racing.jpg")
    : require("@/assets/images/bull-riding.jpg");
});

async function getImage() {
  let image = "";
  if (animal.value.picture_url) {
    image = animal.value.picture_url;
  } else if (animal.value.contractor && animal.value.contractor.length > 0) {
    image = await getProfileImageById({
      id: animal.value.contractor,
      account_type: 1,
    });
  }

  // if (image.length == 0) {
  //     image = iconImage
  // }

  animalImage.value = image;
}

function getVideos() {
  if (!animal.value) {
    return;
  }
  try {
    store.commit("SET_FIRESTORE_VALUE", { key: "videos", doc: [] });
    store.state.subscribers["videos"]();
  } catch {}

  let ref = query(
    collection(db, "videos"),
    where("animal_id", "==", animal.value.id)
  );
  store.dispatch("bindCollectionRef", { key: "videos", ref });
}

const videos = computed(() => {
  let localVideos = store.state.videos;
  if (!localVideos) return [];
  localVideos.sort((a, b) => {
    return b.created.toDate() - a.created.toDate();
  });
  try {
    localVideos = localVideos.filter((video) => {
      return (
        (video.title &&
          video.title.toLowerCase().includes(search.value.toLowerCase())) ||
        (video.location &&
          video.location.toLowerCase().includes(search.value.toLowerCase())) ||
        (video.animal_brand &&
          video.animal_brand
            .toLowerCase()
            .includes(search.value.toLowerCase())) ||
        (video.animal_name &&
          video.animal_name.toLowerCase().includes(search.value.toLowerCase()))
      );
    });
  } catch (error) {
    console.error(error);
  }
  return localVideos || [];
});

watch(videos, updateVideos);

function updateVideos(videos) {
  if (!videos) return;

  let promises = videos.map((video) => {
    const id =
      video.user_id && video.user_id.length > 0
        ? video.user_id
        : video.contractor_id;
    return getDoc(doc(db, "users", id));
  });
  return Promise.allSettled(promises)
    .then((results) => {
      promises = results.map(async (res) => {
        return {
          ...res.value.data(),
          id: res.value.id,
          photo_url: await getProfileImageById(res.value.data()),
        };
      });
      return Promise.allSettled(promises).then((results) => {
        videoUsers.value = results.map((res) => res.value);
      });
    })
    .catch(console.error);
}
</script>
