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
import VideosCursorPagination from "@/components/utilities/videosCursorPagination.vue";
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

const plusDropdown = [
  {
    title: "Upload Video",
    href: "",
  },
  {
    title: "Add Animal",
    href: "/animals/new",
  },
  {
    title: "Add Social Media Link",
    href: "/profile/edit",
  },
];

const socialMediaLinks = computed(() => [
  {
    href: `https://www.facebook.com/${idUserProfile.value.facebook_url}`,
    icon: require("@/assets/icons/social-media/facebook.svg"),
  },
  {
    href: `https://www.instagram.com/${idUserProfile.value.instagram_url}/`,
    icon: require("@/assets/icons/social-media/instagram.svg"),
  },
  {
    href: `https://twitter.com/${idUserProfile.value.twitter_url}`,
    icon: require("@/assets/icons/social-media/twitter.svg"),
  },
  {
    href: `https://www.youtube.com/@${idUserProfile.value.youtube_url}`,
    icon: require("@/assets/icons/social-media/youtube.svg"),
  },
]);

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
    return b.event_date - a.event_date;
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

  let profileId =
    route.params.id ??
    (userProfile.value != null && userProfile.value.current_accessed_account);

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
      <v-img cover height="250px" class="d-flex align-start" :src="coverPhoto">
      </v-img>

      <div
        v-if="idUserProfile"
        style="position: relative; width: 100%; max-width: 900px"
        class="d-flex flex-column align-center mx-auto"
      >
        <div style="width: 100%" class="d-flex justify-space-between pa-3">
          <div style="position: absolute; top: 12px; left: 0">
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
          </div>

          <v-spacer />
          <v-avatar
            color="transparent"
            size="180"
            style="
              border-radius: 5%;
              position: relative;
              bottom: 90px;
              margin-bottom: -90px;
            "
            tile
          >
            <v-img
              cover
              :aspect-ratio="1"
              style="width: 100%"
              :src="idUserProfile.photo_url"
            >
            </v-img>
          </v-avatar>
          <v-spacer />
          <div
            class="d-flex"
            style="position: absolute; top: 12px; right: 0; column-gap: 8px"
          >
            <template v-for="link in socialMediaLinks" :key="link">
              <a target="_blank" :href="link.href" class="social-media-link">
                <img :src="link.icon" />
              </a>
            </template>
          </div>
        </div>

        <div class="d-flex flex-column text-center">
          <div class="d-flex align-center">
            <h3 class="h4">
              {{ idUserProfile.first_name }} {{ idUserProfile.last_name }}
            </h3>
            <v-icon
              :class="
                idUserProfile.isVerified
                  ? 'text-primary'
                  : 'text-grey-lighten-1'
              "
              class="ml-2"
              size="14"
              icon="fas fa-check-circle"
            />
          </div>
          <span class="text--disabled">{{ idUserProfile.location }}</span>
        </div>
      </div>

      <div
        v-if="idUserProfile"
        style="width: 100%; max-width: 900px"
        class="mx-auto mt-6 d-flex flex-column"
      >
        <span class="subtitle-1 font-italic text-gray text--disabled">
          {{ idUserProfile.bio }}
        </span>
        <span class="mt-6 subtitle-1 text-gray text--disabled">
          Sponsors: {{ idUserProfile.sponsors }}
        </span>
      </div>

      <template v-if="idUserProfile.id == userProfile.current_accessed_account">
        <div class="d-flex justify-center mt-6">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                size="small"
                variant="plain"
                class="d-flex items-center justify-center"
                v-bind="props"
              >
                <img
                  :src="
                    require('@/assets/icons/glyph/glyphs/plus.circle.red.png')
                  "
                />
              </v-btn>
            </template>

            <v-list>
              <template v-for="(item, index) in plusDropdown" :key="index">
                <v-btn
                  block
                  variant="text"
                  class="text-black"
                  :disabled="!item.href"
                  @click="$router.push(item.href)"
                  >{{ item.title }}</v-btn
                >
                <v-divider v-if="index != plusDropdown.length - 1"></v-divider>
              </template>
            </v-list>
          </v-menu>
        </div>
      </template>

      <template v-if="idUserProfile">
        <div
          style="width: 100%; max-width: 900px"
          class="d-flex flex-column mx-auto mt-6"
        >
          <h3 class="h5 mb-2">{{ !showVideo ? "Animals" : "Videos" }}</h3>
          <div class="d-flex align-center mb-6">
            <template v-if="!showVideo">
              <v-btn
                @click="showVideo = !showVideo"
                icon
                variant="plain"
                class="d-flex items-center justify-center mr-3"
              >
                <img
                  style="width: 30px"
                  :src="
                    require('@/assets/icons/glyph/glyphs/rectangle.grid.2x2.png')
                  "
                />
              </v-btn>
            </template>
            <template v-else>
              <v-btn
                v-if="
                  idUserProfile.account_type == 1 ||
                  idUserProfile.account_type == 2
                "
                @click="showVideo = !showVideo"
                icon
                variant="plain"
                class="d-flex items-center justify-center mr-3"
              >
                <img
                  style="width: 30px"
                  :src="require('@/assets/icons/glyph/glyphs/list.dash.png')"
                />
              </v-btn>
            </template>
            <v-text-field
              v-model="search"
              density="compact"
              prepend-inner-icon="fas fa-search"
              color="white"
              hide-no-data
              hide-selected
              hide-details
              variant="outlined"
              :placeholder="
                !showVideo
                  ? 'Start typing to Search Animals'
                  : 'Start typing to Search Videos'
              "
              return-object
              class="py-0"
              :class="{ 'mr-3': !showVideo }"
            ></v-text-field>
            <template v-if="!showVideo">
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
                    :src="
                      require('@/assets/icons/glyph/glyphs/plus.circle.png')
                    "
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
                      animals.filter((animal) => animal.animal_type == 1)
                        .length
                    }})
                  </v-btn>

                  <v-btn
                    size="small"
                    :active="select_animal == 1"
                    @click="select_animal = 1"
                  >
                    Horses ({{
                      animals.filter((animal) => animal.animal_type == 2)
                        .length
                    }})
                  </v-btn>
                </v-btn-toggle>
              </div>
            </template>
          </div>
          <template v-if="!showVideo">
            <template v-if="filteredAnimals.length">
              <template v-for="animal in filteredAnimals" :key="animal.id">
                <AnimalCard :animal="animal" :videos="videos" />
              </template>
            </template>
            <span v-if="!animals || animals.length == 0" class="font-italic"
              >No animals to show</span
            >
          </template>
          <template v-else>
            <template v-if="videos.length">
              <VideosCursorPagination :videos="videos" :key="videos.length" />
            </template>
            <span v-if="!videos || videos.length == 0" class="font-italic"
              >No videos to show</span
            >
          </template>
        </div>
      </template>
    </div>
  </template>
</template>

<style>
.social-media-link {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  padding: 0.5rem;
  border: 1px solid gray;
  background-color: white;
  width: 40px;
  height: 40px;
  transition: all ease-in 150ms;
}

.social-media-link:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
}

.social-media-link img {
  width: 28px;
}
</style>
