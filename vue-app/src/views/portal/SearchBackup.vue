<script setup>
import {
  collection,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";
import { getProfileImageById } from "@/services/profiles";
import Typesense from "typesense";
import VideoVue from "@/components/utilities/Video.vue";
// import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import iconImage from "@/assets/images/thumb_rodeonow-1024x1024.png";
import eventsArr from "@/utils/events";

const router = useRouter();
const route = useRoute();
const db = getFirestore();
const categories = ref([
  {
    title: "Contractors",
    image: require("@/assets/images/contractors.jpg"),
  },
  {
    title: "Contestants",
    image: require("@/assets/images/contestants.jpg"),
  },
  {
    title: "Bareback Riding",
    image: require("@/assets/images/bareback.jpg"),
  },
  {
    title: "Saddle Bronc",
    image: require("@/assets/images/saddle-bronc.jpg"),
  },
  {
    title: "Bull Riding",
    image: require("@/assets/images/bull-riding.jpg"),
  },
  {
    title: "Barrell Racing",
    image: require("@/assets/images/barrel-racing.jpg"),
  },
  {
    title: "Team Roping",
    image: require("@/assets/images/team-roping.jpg"),
  },
  {
    title: "Tie Down Roping",
    image: require("@/assets/images/tie-down-roping.jpg"),
  },
  {
    title: "Steer Wrestling",
    image: require("@/assets/images/steer-wrestling.jpg"),
  },
  {
    title: "Breakaway Roping",
    image: require("@/assets/images/breakaway.jpg"),
  },
  {
    title: "Pole Bending",
    image: require("@/assets/images/pole-bending.jpg"),
  },
  {
    title: "Goat Tying",
    image: require("@/assets/images/goat-tying.jpg"),
  },
]);

let host = "qlfs4dzmyjg9u7khp-1.a1.typesense.net";
let apiKey = "xNVfwTWVjKhxfRa00Ke7h4SHrpoP3geg";

if (process.env.environment == "production") {
  host = "a42zqpchkvriw3t1p-1.a1.typesense.net";
  apiKey = "5wEHbO8SyXeDhRRnpeIROj22ttw5RRF2";
}

let client = new Typesense.Client({
  nodes: [
    {
      host: host,
      port: "443",
      protocol: "https",
    },
  ],
  apiKey: apiKey,
});

let events = ["Contestants", "Contractors", ...eventsArr];

function createDebounce() {
  let timeout = null;
  return function (fnc, delayMs) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fnc();
    }, delayMs || 500);
  };
}

const search = ref(null);
const queryUsers = ref([]);
const queryUsersAdded = ref([]);
const queryVideos = ref([]);
const queryAnimals = ref([]);
const queryAnimalsAdded = ref([]);
const debounce = createDebounce();
const loadingUsers = ref(false);
const loadingAnimals = ref(false);
const loadingVideos = ref(false);
const loadingDefaults = ref(false);
const showFAB = ref(false);
const videos = computed(() => {
  return store.state.videos || [];
});

watch(videos, (newVideos) => {
  loadingDefaults.value = false;
  queryVideos.value = newVideos.sort((a, b) => b.event_date - a.event_date);
});

async function doSearch() {
  let eventType = null;
  let accountType = null;
  let queryByAnimal = "";
  let queryByVideo = "";
  let queryByUser = "";
  queryUsersAdded.value = [];
  queryAnimalsAdded.value = [];
  queryUsers.value = [];
  queryAnimals.value = [];
  queryVideos.value = [];
  store.commit("search_", []);

  // if (search.value.length == 0) {
  //   initialSetup(categoryQuery.value);
  //   return;
  // }

  loadingUsers.value = true;
  loadingAnimals.value = true;
  loadingVideos.value = true;
  switch (route.query.category.toLowerCase()) {
    case "contractors":
      accountType = 1;
      queryByUser = "location,first_name";
      queryByAnimal = "name,brand,contractor_name";
      break;
    case "contestants":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      break;
    case "bareback riding":
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = events.indexOf(route.query.category) - 1;
      break;
    case "saddle bronc":
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = events.indexOf(route.query.category) - 1;
      break;
    case "bull riding":
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = events.indexOf(route.query.category) - 1;
      break;
    case "barrell racing":
      queryByUser = "location,first_name,last_name";
      queryByVideo = "animal_name,location,user_name,title";
      eventType = events.indexOf(route.query.category) - 1;
      break;
    case "team roping":
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand";
      queryByVideo = "animal_name,location,user_name,title";
      eventType = events.indexOf(route.query.category) - 1;
      break;
    case "tie down roping":
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand";
      queryByVideo = "animal_name,location,user_name,title";
      eventType = events.indexOf(route.query.category) - 1;
      break;
    case "steer wrestling":
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand";
      queryByVideo = "animal_name,location,user_name,title";
      eventType = events.indexOf(route.query.category) - 1;
      break;
    case "breakaway roping":
      queryByUser = "location,first_name,last_name";
      queryByVideo = "animal_name,location,user_name,title";
      eventType = events.indexOf(route.query.category) - 1;
      break;
    case "goat tying":
      queryByUser = "location,first_name,last_name";
      queryByVideo = "animal_name,location,user_name,title";
      eventType = events.indexOf(route.query.category) - 1;
      break;
    case "pole bending":
      queryByUser = "location,first_name,last_name";
      queryByVideo = "animal_name,location,user_name,title";
      eventType = events.indexOf(route.query.category) - 1;
      break;
    default:
      break;
  }

  let promises = [];
  let promise;
  if (queryByUser != "") {
    promise = searchUsersWithCategory(
      search.value,
      queryByUser,
      accountType,
      eventType
    ).then(async (values) => {
      queryUsersAdded.value = [];
      queryUsers.value = values;
      return values;
    });
    promises.push(promise);
  }

  if (queryByAnimal != "") {
    promise = searchAnimalsWithCategory(
      search.value,
      queryByAnimal,
      accountType,
      eventType
    ).then(async (values) => {
      queryAnimals.value = values;
      return values;
    });
    promises.push(promise);
  }

  if (queryByVideo != "") {
    promise = searchVideosWithCategory(
      search.value,
      queryByVideo,
      accountType,
      eventType
    ).then(async (values) => {
      queryVideos.value = values.sort((a, b) => b.event_date - a.event_date);
      return values;
    });
    promises.push(promise);
  }

  return Promise.allSettled(promises).then(() => {
    loadingUsers.value = false;
    loadingAnimals.value = false;
    loadingVideos.value = false;
  });
}

async function searchUsersWithCategory(query, queryBy, accountType, eventType) {
  let searchParameters = {
    q: query,
    query_by: queryBy,
    sort_by: "_text_match:desc",
  };

  if (eventType) {
    searchParameters = {
      ...searchParameters,
      filterBy: `events:[${eventType}]`,
    };
  } else {
    searchParameters = {
      ...searchParameters,
      filterBy: `account_type:[${accountType}]`,
    };
  }

  let data = await client
    .collections("users")
    .documents()
    .search(searchParameters)
    .catch(console.error);
  return data.hits ? data.hits.map((doc) => doc.document) : [];
}

async function searchAnimalsWithCategory(query, queryBy, eventType) {
  let searchParameters = {
    q: query,
    query_by: queryBy,
    sort_by: "_text_match:desc",
    perPage: 200,
  };

  if (eventType) {
    searchParameters = {
      ...searchParameters,
      filterBy: `events:[${eventType}]`,
    };
  }

  let data = await client
    .collections("animals")
    .documents()
    .search(searchParameters)
    .catch(console.error);
  return data.hits ? data.hits.map((doc) => doc.document) : [];
}

async function searchVideosWithCategory(query, queryBy, eventType) {
  let searchParameters = {
    q: query,
    query_by: queryBy,
    sort_by: "_text_match:desc",
    filterBy: `events:[${eventType}]`,
  };

  let data = await client
    .collections("videos")
    .documents()
    .search(searchParameters)
    .catch(console.error);
  return data.hits ? data.hits.map((doc) => doc.document) : [];
}

watch(search, () => {
  debounce(doSearch, 1000);
});

const categoryQuery = computed(() => route.query.category);

onMounted(() => {
  if (route.query.category) initialSetup(route.query.category);
});
onUnmounted(() => {
  try {
    store.state.search_ = [];
    // store.state.subscribers.search_();
  } catch (error) {
    console.log(error);
  }
});

watch(categoryQuery, (cq) => {
  search.value = "";
  queryUsersAdded.value = [];
  queryUsers.value = [];
  queryAnimals.value = [];
  queryVideos.value = [];
  initialSetup(cq);
});

watch(queryUsers, (users) => {
  let promises = users.map(async (user) => {
    return {
      ...user,
      photo_url: await getProfileImageById(user),
    };
  });
  Promise.allSettled(promises).then((results) => {
    queryUsersAdded.value = results.map((res) => res.value);
  });
});

watch(queryAnimals, (animals) => {
  getAnimalsImages(animals);
});

async function initialSetup(cq, append = true) {
  loadingDefaults.value = true;
  setTimeout(() => {
    loadingDefaults.value = false;
  }, 30000);
  try {
    store.commit("search_", []);
    // store.state.subscribers.search_();
    queryVideos.value = [];
  } catch (error) {
    console.log(error);
  }

  let ref;
  if (cq)
    switch (cq.toLowerCase()) {
      case "contractors":
        ref = query(
          collection(db, "users"),
          where("account_type", "==", 1),
          orderBy("first_name", "asc")
        );
        break;

      case "contestants":
        ref = query(
          collection(db, "users"),
          where("account_type", "==", 2),
          orderBy("first_name", "asc")
        );
        break;

      default:
        ref = query(
          collection(db, "videos"),
          where("event_type", "==", events.indexOf(route.query.category) - 1)
          // orderBy('title', 'asc')
        );
    }

  if (events.indexOf(route.query.category) < 2) {
    store.dispatch("bindCollectionRef", {
      key: "search_",
      ref,
      callback: (docs) => {
        let promises = docs.map(async (doc) => {
          doc.photo_url = await getProfileImageById(doc);
          return doc;
        });
        return Promise.allSettled(promises)
          .then((results) => {
            loadingDefaults.value = false;
            return results.map((res) => res.value || "");
          })
          .catch(console.error);
      },
    });
  } else {
    store.dispatch("bindCollectionRef", {
      key: "videos",
      ref,
      append,
      preserve: true,
    });
  }
}

async function getAnimalsImages(animals) {
  let promises = animals.map(async (animal) => {
    let image = "";

    if (animal.photo_url) {
      image = animal.photo_url;
    } else if (animal.contractor && animal.contractor.length > 0) {
      console.log("animal.contractor", animal.contractor);
      image = await getProfileImageById({
        id: animal.contractor,
        account_type: 1,
      });
    }

    if (image.length == 0) {
      image = iconImage;
    }

    return {
      ...animal,
      photo_url: image,
    };
  });

  queryAnimalsAdded.value = await Promise.allSettled(promises).then(
    (results) => {
      return results.map((res) => res.value);
    }
  );
}

function goTo(category) {
  if (category)
    router.push({
      path: "search",
      query: {
        category: category.title,
      },
    });
  else {
    router.push({
      path: "search",
      query: {},
    });
  }
}

// function onRefresh() {
//   return initialSetup(categoryQuery.value);
// }

async function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

const isUserCategory = computed(() =>
  ["Contestants", "Contractors"].includes(route.query.category)
);

onUnmounted(() => {
  window.removeEventListener("scroll", () => {});
});

onMounted(() => {
  window.addEventListener("scroll", () => {
    showFAB.value =
      window.scrollY / window.innerHeight > 0.3 && window.innerHeight > 600;
  });
});
</script>

<template>
  <div>
    <div
      v-if="!categoryQuery"
      class="d-flex flex-wrap mx-auto my-6 justify-center"
      style="max-width: 900px"
    >
      <div class="text-h6 mb-6" style="width: 100%; display: block">
        Browse Categories
      </div>
      <div
        v-for="(category, index) in categories"
        class="d-flex justify-center mb-6"
        :key="index"
        style="width: 50%; display: block"
      >
        <v-card
          @click="goTo(category)"
          class="rounded-xl"
          overflow-hidden
          style="overflow: hidden !important"
          width="90%"
        >
          <v-img height="256" cover :src="category.image" :aspect-ratio="1">
          </v-img>
          <span
            style="position: absolute; bottom: 12px; left: 12px"
            class="text-h6 text-white"
            >{{ category.title }}</span
          >
        </v-card>
      </div>
      <div
        style="width: 50%"
        v-if="categories.length % 3 !== 0"
        class="rounded-xl mb-6"
      ></div>
      <div
        style="width: 50%"
        v-if="(categories.length + 1) % 3 !== 0"
        class="rounded-xl mb-6"
      ></div>
    </div>

    <div class="d-flex flex-wrap mx-auto my-6" style="max-width: 900px" v-else>
      <!-- this is the content for: {{ $route.query.category }} -->
      <div style="width: 100%" class="d-flex align-center mb-6">
        <v-btn
          @click="goTo(null)"
          icon
          color="error"
          variant="text"
          class="mx-1"
        >
          <img
            style="width: 30px"
            :src="require('@/assets/icons/glyph/glyphs/arrow.left.png')"
          />
        </v-btn>
        <v-text-field
          v-model.lazy="search"
          density="compact"
          prepend-inner-icon="fas fa-search"
          color="white"
          hide-no-data
          hide-selected
          hide-details
          variant="outlined"
          :placeholder="$route.query.category"
          return-object
          class="py-0"
        >
        </v-text-field>
        <v-btn @click="search = ''" color="error" variant="text" class="ml-1"
          >cancel</v-btn
        >
        <v-btn
          v-if="!search || search === ''"
          @click="initialSetup(categoryQuery)"
          color="error"
          variant="text"
          class="ml-1"
          icon
        >
          <img
            style="width: 30px"
            :src="require('@/assets/icons/glyph/glyphs/gobackward.png')"
          />
        </v-btn>
      </div>

      <div
        class="d-flex justify-center"
        style="width: 100%"
        v-if="
          loadingUsers || loadingVideos || loadingAnimals || loadingDefaults
        "
      >
        <v-progress-circular
          class="mx-auto"
          indeterminate
        ></v-progress-circular>
        <!-- <PulseLoader class="spinner" :loading="true" color="#ffffff"></PulseLoader> -->
      </div>

      <div
        v-if="
          queryAnimals.length == 0 &&
          queryUsersAdded.length == 0 &&
          queryVideos.length == 0 &&
          !loadingUsers &&
          !loadingAnimals &&
          !loadingVideos
        "
        class="d-flex flex-column py-3"
        style="width: 100%"
      >
        <div
          v-for="item in store.state.search_"
          :key="item.id"
          class="d-flex flex-column"
        >
          <v-card
            @click="
              $router.push({
                path: '/my-rodeo',
                query: {
                  id: item.id,
                },
              })
            "
            v-if="item"
            class="d-flex py-3"
          >
            <v-avatar
              color="grey lighten-3"
              size="100"
              class="mr-3"
              cover
              tile
              style="border-radius: 5%"
            >
              <v-img :src="item.photo_url" contain />
            </v-avatar>

            <div class="d-flex flex-column">
              <span class="text-h6 font-weight-bold"
                >{{ item.first_name }} {{ item.last_name }}</span
              >
              <span class="text-caption">{{ item.location }}</span>
            </div>
          </v-card>
          <v-divider
            class="flex-none"
            style="width: 100%; display: block"
          ></v-divider>
        </div>

        <v-fab-transition>
          <v-btn
            v-if="showFAB"
            elevation="2"
            class="floating-action-button"
            icon
            @click="scrollToTop"
          >
            <img
              style="width: 30px"
              :src="require('@/assets/icons/glyph/glyphs/chevron.up.png')"
            />
          </v-btn>
        </v-fab-transition>
      </div>

      <div class="" style="width: 100%" v-else>
        <div
          class="d-flex flex-column my-6"
          style="width: 100%"
          v-if="queryUsersAdded.length > 0 && isUserCategory"
        >
          <div
            v-for="(item, index) in queryUsersAdded"
            :key="item.first_name"
            class="d-flex flex-column"
          >
            <div v-if="item" class="d-flex py-3">
              <v-avatar
                color="grey lighten-3"
                size="100"
                class="mr-3"
                cover
                tile
                style="border-radius: 5%"
              >
                <v-img :src="item.photo_url" contain />
              </v-avatar>

              <div class="d-flex flex-column">
                <span class="text-h6 font-weight-bold"
                  >{{ item.first_name }} {{ item.last_name }}</span
                >
                <span class="text-caption">{{ item.location }}</span>
              </div>
            </div>
            <v-divider
              v-if="index + 1 !== queryUsersAdded.length"
              class="flex-none"
              style="width: 100%; display: block"
            ></v-divider>
          </div>
        </div>

        <div
          class="d-flex flex-column my-6"
          style="width: 100%; margin-top: 20px"
          v-if="queryAnimals.length > 0 && !isUserCategory"
        >
          <v-card
            flat
            @click="
              () => {
                $router.push({ path: '/animals', query: { id: item.id } });
              }
            "
            v-for="item in queryAnimalsAdded"
            :key="item.name"
            class="d-flex flex-column"
          >
            <div v-if="item" class="d-flex py-3">
              <v-avatar
                size="100"
                class="mr-3"
                cover
                tile
                style="border-radius: 5%"
              >
                <v-img :src="item.photo_url" cover />
              </v-avatar>

              <div class="d-flex flex-column">
                <div style="width: 100%; display: block" class="d-flex">
                  <span class="text-subtitle-1 text--disabled mr-1">{{
                    item.brand
                  }}</span>
                  <span class="text-subtitle-1 font-weight-normal">{{
                    item.name
                  }}</span>
                </div>

                <div style="width: 100%; display: block">
                  <span class="text-subtitle-1 text-red mr-1">{{
                    item.contractor_name
                  }}</span>
                </div>
              </div>
            </div>

            <v-divider
              class="flex-none"
              style="width: 100%; display: block"
            ></v-divider>
          </v-card>
        </div>

        <div
          class="d-flex flex-column"
          style="width: 100%; margin-top: 60px"
          v-if="!isUserCategory"
        >
          <template v-for="(video, index) in queryVideos" :key="video.id">
            <VideoVue style="width: 100%" :video="video" />
            <v-divider
              v-if="index !== queryVideos.length - 1"
              style="margin: 40px 0"
            ></v-divider>
          </template>
        </div>
        <v-fab-transition>
          <v-btn
            v-if="showFAB"
            elevation="2"
            class="floating-action-button"
            icon
            @click="scrollToTop"
          >
            <img
              style="width: 30px"
              :src="require('@/assets/icons/glyph/glyphs/chevron.up.png')"
            />
          </v-btn>
        </v-fab-transition>
      </div>
    </div>
  </div>
</template>

<style>
.floating-action-button {
  position: fixed;
  bottom: 12px;
  right: 2vw;
}
</style>
