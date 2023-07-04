<template>
  <template v-if="loading">
    <div class="d-flex flex-column">
      <v-skeleton-loader type="image"></v-skeleton-loader>
      <div
        style="position: relative; bottom: 60px; width: 100%"
        class="d-flex flex-column align-center mx-auto"
      >
        <v-skeleton-loader width="180" type="image, list-item-two-line">
        </v-skeleton-loader>
      </div>
      <div style="width: 100%; max-width: 900px" class="mx-auto my-6">
        <v-skeleton-loader type="sentences"></v-skeleton-loader>
      </div>
      <div style="width: 100%; max-width: 900px" class="mx-auto my-6">
        <v-skeleton-loader type="table-row-divider"></v-skeleton-loader>
        <v-skeleton-loader type="table-row-divider"></v-skeleton-loader>
        <v-skeleton-loader type="table-row-divider"></v-skeleton-loader>
        <v-skeleton-loader type="table-row-divider"></v-skeleton-loader>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="d-flex flex-column">
      <v-img cover height="250px" class="d-flex align-end" :src="coverPhoto">
      </v-img>
      <div
        v-if="idUserProfile"
        style="
          position: relative;
          bottom: 60px;
          margin-bottom: -60px;
          width: 100%;
          max-width: 900px;
        "
        class="d-flex flex-column align-center mx-auto"
      >
        <v-avatar
          cover
          color="transparent"
          aspect-ratio="1"
          size="180"
          style="border-radius: 5%"
          tile
        >
          <v-img
            cover
            aspect-ratio="1"
            style="width: 100%"
            :src="idUserProfile.photo_url"
          >
          </v-img>
        </v-avatar>
        <div class="d-flex flex-column text-center">
          <h3 class="h4">
            {{ idUserProfile.first_name }} {{ idUserProfile.last_name }}
          </h3>
          <span class="text--disabled">{{ idUserProfile.location }}</span>
        </div>
      </div>

      <div
        v-if="idUserProfile"
        style="width: 100%; max-width: 900px"
        class="mx-auto my-6 d-flex flex-column"
      >
        <span class="subtitle-1 font-italic text-gray text--disabled">
          {{ idUserProfile.bio }}
        </span>
        <span class="mt-6 subtitle-1 text-gray text--disabled">
          Sponsors: {{ idUserProfile.sponsors }}
        </span>
      </div>

      <div
        v-if="
          idUserProfile &&
          (idUserProfile.account_type == 1 ||
            idUserProfile.account_type == 2) &&
          !showVideo
        "
        style="width: 100%; max-width: 900px"
        class="d-flex flex-column mx-auto my-6"
      >
        <h3 class="h5 mb-2">Animals</h3>
        <div class="d-flex align-center mb-6">
          <v-btn
            @click="showVideo = !showVideo"
            icon
            variant="text"
            class="d-flex items-center justify-center mr-1"
          >
            <img
              style="width: 30px"
              :src="
                require('@/assets/icons/glyph/glyphs/rectangle.grid.2x2.png')
              "
            />
          </v-btn>
          <v-text-field
            v-model="search"
            density="compact"
            prepend-inner-icon="fas fa-search"
            color="white"
            hide-no-data
            hide-selected
            hide-details
            variant="outlined"
            placeholder="Start typing to Search Animals"
            return-object
            class="py-0 mr-3"
            style="max-width: 440px"
          ></v-text-field>
          <div class="ml-auto d-flex align-center">
            <v-btn
              @click="$router.push({ path: '/animals/new' })"
              v-if="
                idUserProfile.account_type == 1 ||
                idUserProfile.account_type == 2
              "
              icon
              size="small"
              variant="text"
              class="d-flex items-center justify-center mr-2"
            >
              <img
                style="width: 30px"
                :src="require('@/assets/icons/glyph/glyphs/plus.circle.png')"
              />
            </v-btn>

            <v-btn-toggle v-if="animals" class="ml-1">
              <v-btn
                size="small"
                :active="select_animal == 2"
                @click="select_animal = 2"
              >
                All ({{ animals.length }})
              </v-btn>

              <v-btn
                size="small"
                :active="select_animal == 0"
                @click="select_animal = 0"
              >
                Bulls ({{
                  animals.filter((animal) => animal.animal_type == 1).length
                }})
              </v-btn>

              <v-btn
                size="small"
                :active="select_animal == 1"
                @click="select_animal = 1"
              >
                Horses ({{
                  animals.filter((animal) => animal.animal_type == 2).length
                }})
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>

        <AnimalCard
          v-for="animal in filteredAnimals"
          :animal="animal"
          :videos="videos"
          :key="animal.id"
        />
        <!-- <v-card flat class="d-flex pa-2" v-for="animal in filteredAnimals" :key="animal.animalID">
                    <span class="mr-3 text--disabled" style="min-width: 100px">{{ animal.brand }}</span>
                    <span v-if="animal.name && animal.name.length > 0">{{ animal.name }}</span>
                    <span v-else class="text--disabled">Unnamed</span>
                    <v-menu v-model="animal_menu" :close-on-content-click="false" location="end">
                        <template v-slot:activator="{ props }">
                            <v-btn fab icon size="small" variant="text" class="ml-auto" v-bind="props">
                                <v-icon>fas fa-ellipsis</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-btn @click="$router.push({ path: '/animals/edit', params: { id: animal.id } })" variant="text" block class="text-black">
                                Edit
                            </v-btn>
                            <v-divider></v-divider>
                            <v-btn variant="text" block class="text-black">
                                Delete
                            </v-btn>
                        </v-list>
                    </v-menu>
                </v-card> -->
        <span v-if="!animals || animals.length == 0" class="font-italic"
          >No animals to show</span
        >
      </div>

      <div
        v-if="idUserProfile && showVideo"
        style="width: 100%; max-width: 900px"
        class="d-flex flex-wrap mx-auto justify-space-between my-6"
      >
        <h3 class="h5 mb-2">Videos</h3>
        <div style="width: 100%" class="d-flex align-center mb-6">
          <v-btn
            v-if="
              idUserProfile.account_type == 1 || idUserProfile.account_type == 2
            "
            @click="showVideo = !showVideo"
            icon
            variant="text"
            class="d-flex items-center justify-center mr-1"
          >
            <img
              style="width: 30px"
              class="mt-1"
              :src="require('@/assets/icons/glyph/glyphs/list.dash.png')"
            />
          </v-btn>
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
        <span v-if="!videos || videos.length == 0" class="font-italic"
          >No videos to show</span
        >
        <videosPagination :videos="videos" />
        <!-- <VideoVue
            style="width: 100%"
            :class="(index + 1) % 1 !== 0 ? 'ml-auto' : ''"
            class="mb-5"
            v-for="(video, index) in videos"
            :video="video"
            :key="index"
          /> -->
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import {
  getFirestore,
  collection,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { VSkeletonLoader } from "vuetify/lib/labs/VSkeletonLoader";
// import VideoVue from "@/components/utilities/Video.vue";
import videosPagination from "@/components/utilities/videosPagination.vue";
import store from "@/store";
import { useRoute } from "vue-router";
import { getProfileImageById } from "@/services/profiles";
import AnimalCard from "@/components/utilities/animalCard.vue";
import { onBeforeMount } from "vue";

const db = getFirestore();
const route = useRoute();

const loading = ref(true);
const search = ref("");
const select_animal = ref(2);

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

  return localVideos;
});

const userProfile = computed(() => {
  return store.state.userProfile;
});

watch(userProfile, (v) => {
  if (v) initialSetup();
});

const showVideo = ref(false);

const animals = computed(() => {
  let localAnimals = store.state.animals;

  if (search.value) {
    localAnimals = localAnimals.filter(
      ({ name, brand }) => compareWithSearch(name) || compareWithSearch(brand)
    );
  }

  localAnimals.sort((a, b) => a.name.localeCompare(b.name));

  return localAnimals;
});

const coverPhoto = computed(() => {
  if (!idUserProfile.value) return;
  return idUserProfile.value.account_type !== 2
    ? idUserProfile.value.account_type !== 3
      ? require("@/assets/images/contractors.jpg")
      : require("@/assets/images/bareback.jpg")
    : require("@/assets/images/contestants.jpg");
});

const filteredAnimals = computed(() => {
  let localAnimals = animals.value;
  if (select_animal.value !== 2)
    localAnimals = localAnimals.filter(
      (animal) => animal.animal_type == select_animal.value + 1
    );
  return localAnimals;
});

const idUserProfile = ref(null);

async function initialSetup() {
  loading.value = true;
  let profileId;

  if (route.params.id) {
    profileId = route.params.id;
  } else {
    profileId = userProfile.value.id;
  }

  try {
    store.commit("SET_FIRESTORE_VALUE", { key: "animals", doc: [] });
    store.state.subscribers["animals"]();
  } catch {}
  try {
    store.commit("SET_FIRESTORE_VALUE", { key: "videos", doc: [] });
    store.state.subscribers["videos"]();
  } catch {}

  getDoc(doc(db, "users", profileId))
    .then(async (doc) => {
      idUserProfile.value = {
        ...doc.data(),
        id: doc.id,
        photo_url: await getProfileImageById({
          id: doc.id,
          account_type: doc.data().account_type,
        }),
      };

      let docRef;

      let key =
        idUserProfile.value.account_type == 2 ? "user_id" : "contractor_id";

      docRef = query(
        collection(db, "videos"),
        where(key, "==", idUserProfile.value.id)
      );
      store.dispatch("bindCollectionRef", { key: "videos", ref: docRef });

      if (
        idUserProfile.value.account_type == 1 ||
        idUserProfile.value.account_type == 2
      ) {
        docRef = query(
          collection(db, "animals"),
          where("contractor", "==", idUserProfile.value.id)
        );
        store.dispatch("bindCollectionRef", { key: "animals", ref: docRef });
      }
    })
    .finally(() => {
      loading.value = false;
    });
}

onBeforeMount(() => {
  initialSetup();
});
</script>

<style></style>
