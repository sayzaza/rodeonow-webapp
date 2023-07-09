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
        v-if="animal && $store.state.selectedProfile"
        class="d-flex justify-space-between pa-3"
      >
        <v-btn
          icon
          size="small"
          variant="plain"
          class="d-flex align-center justify-center"
          @click="$router.go(-1)"
        >
          <img
            style="height: 30px"
            :src="require('@/assets/icons/glyph/glyphs/chevron.left.png')"
          />
        </v-btn>

        <v-avatar
          color="transparent"
          size="180"
          style="
            border-radius: 5%;
            position: relative;
            bottom: 90px;
            margin-left: -40px;
            margin-bottom: -90px;
          "
          tile
        >
          <v-img cover :aspect-ratio="1" style="width: 100%" :src="animalImage">
          </v-img>
        </v-avatar>

        <template v-if="animal.contractor === $store.state.selectedProfile.id">
          <router-link
            :to="{
              path: `/animals/edit/${animal.id}`,
            }"
          >
            <v-btn dark color="error" variant="text" class="ml-1">edit</v-btn>
          </router-link>
        </template>
        <template v-else>
          <div />
        </template>
      </div>

      <div class="d-flex flex-column text-center">
        <h3 class="">
          <span class="text--disabled">{{ animal.brand }}</span>
          {{ animal.name }}
        </h3>
        <span class="text--disabled">{{ animal.location }}</span>
        <span class="text-primary">{{ animal.contractor_name }}</span>
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
            :src="require('@/assets/icons/glyph/glyphs/plus.circle.red.png')"
          />
        </v-btn>
      </div>
    </div>

    <div
      style="width: 100%; max-width: 900px"
      class="mx-auto mb-6"
      v-if="showVideos"
    >
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
        <VideoVue style="width: 100%" :video="video" />
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
} from "firebase/firestore";
import VideoVue from "@/components/utilities/Video.vue";
import events from "@/utils/events";
import iconImage from "@/assets/images/thumb_rodeonow-1024x1024.png";

let route = useRoute();
let db = getFirestore();

const animalImage = ref(null);
const search = ref(null);
const showVideos = ref(false);

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

  if (image.length == 0) {
    image = iconImage;
  }

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

  showVideos.value = true;
}

const compareWithSearch = (value) =>
  value.toLowerCase().includes(search.value.toLowerCase());

const videos = computed(() => {
  let localVideos = store.state.videos;

  if (!localVideos) return [];

  if (search.value) {
    localVideos = localVideos.filter(
      ({ title, location, animal_brand, animal_name }) =>
        compareWithSearch(title ?? "") ||
        compareWithSearch(location ?? "") ||
        compareWithSearch(animal_brand ?? "") ||
        compareWithSearch(animal_name ?? "")
    );
  }

  localVideos.sort((a, b) => {
    return b.created.toDate() - a.created.toDate();
  });

  return localVideos || [];
});
</script>
