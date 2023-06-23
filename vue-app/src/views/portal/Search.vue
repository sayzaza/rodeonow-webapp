<script setup>
import {
  collection,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import store from "@/store";
import eventsDefalut from "@/utils/events";
import Typesense from "typesense";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDebounceFn } from "@vueuse/core";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import VideosPagination from "@/components/utilities/videosPagination.vue";
import VideoCard from "@/components/utilities/Video.vue";
import AnimalCard from "@/components/search/animal.vue";
import UserCard from "@/components/search/user.vue";

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

const route = useRoute();
const router = useRouter();
const db = getFirestore();

const categories = [
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
];

const events = ["Contestants", "Contractors", ...eventsDefalut];

const categoryQuery = computed(() => route.query.category);
const eventByCategory = computed(
  () => eventsDefalut.indexOf(categoryQuery.value) + 1
);
const search_ = computed(() => store.state.search_);
const videos = computed(() => store.state.videos);
const isUserCategory = computed(() =>
  ["Contestants", "Contractors"].includes(route.query.category)
);

const search = ref("");

const loadingVideos = ref(false);
const loadingDefaults = ref(false);
const loadingUsers = ref(false);
const loadingAnimals = ref(false);

const queryVideos = ref([]);
const queryUsers = ref([]);
const queryAnimals = ref([]);

const loading = computed(
  () =>
    loadingVideos.value ||
    loadingDefaults.value ||
    loadingUsers.value ||
    loadingAnimals.value
);

function clearQueries() {
  queryUsers.value = [];
  queryAnimals.value = [];
  queryVideos.value = [];
}

function navigateTo(category) {
  if (category) {
    router.push({
      path: "search",
      query: {
        category: category.title,
      },
    });
  } else {
    router.push({
      path: "search",
      query: {},
    });
  }
}

const searchUsersWithCategory = async (
  query,
  queryBy,
  accountType,
  eventType
) => {
  let searchParams = {
    q: query,
    query_by: queryBy,
    sort_by: "_text_match:desc",
  };

  if (accountType) {
    searchParams = {
      ...searchParams,
      filter_by: `account_type:[${accountType}]`,
    };
  } else {
    searchParams = {
      ...searchParams,
      filter_by: `events:[${eventType}]`,
    };
  }

  let data = await client
    .collections("users")
    .documents()
    .search(searchParams)
    .catch(console.error);

  console.log(data.hits.map((doc) => doc.document));

  return data.hits ? data.hits.map((doc) => doc.document) : [];
};

const searchAnimalsWithCategory = async (query, queryBy, eventType) => {
  let searchParams = {
    q: query,
    query_by: queryBy,
    sort_by: "_text_match:desc",
    perPage: 200,
  };

  if (eventType) {
    searchParams = {
      ...searchParams,
      filter_by: `events:[${eventType}]`,
    };
  }

  let data = await client
    .collections("animals")
    .documents()
    .search(searchParams)
    .catch(console.error);

  console.log(data.hits.map((doc) => doc.document));

  return data.hits ? data.hits.map((doc) => doc.document) : [];
};

const searchVideosWithCategory = async (query, queryBy, eventType) => {
  let searchParams = {
    q: query,
    query_by: queryBy,
    sort_by: "_text_match:desc",
    filter_by: `event_type:=${eventType}`,
  };

  let data = await client
    .collections("videos")
    .documents()
    .search(searchParams)
    .catch(console.error);

  console.log(data.hits.map((doc) => doc.document));

  return data.hits ? data.hits.map((doc) => doc.document) : [];
};

async function initialSetup(cq) {
  clearQueries();
  loadingDefaults.value = true;

  setTimeout(() => {
    loadingDefaults.value = false;
  }, 30000);

  try {
    store.commit("search_", []);
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
          where(
            "event_type",
            "==",
            eventsDefalut.indexOf(route.query.category) + 1
          )
        );
    }

  if (events.indexOf(route.query.category) <= 1) {
    store.dispatch("bindCollectionRef", {
      key: "search_",
      ref,
      callback: (docs) => {
        loadingDefaults.value = false;
        return docs;
      },
    });
  } else {
    store.dispatch("bindCollectionRef", {
      key: "videos",
      ref,
    });
  }
}

async function doSearch() {
  let eventType = null;
  let accountType = null;
  let queryByAnimal = "";
  let queryByVideo = "";
  let queryByUser = "";
  clearQueries();
  store.commit("search_", []);

  loadingUsers.value = true;
  loadingAnimals.value = true;
  loadingVideos.value = true;
  switch (route.query.category.toLowerCase()) {
    case "contractors":
      accountType = 1;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      break;
    case "contestants":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      break;
    case "bareback riding":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = eventByCategory.value;
      break;
    case "saddle bronc":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = eventByCategory.value;
      break;
    case "bull riding":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = eventByCategory.value;
      break;
    case "barrell racing":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = eventByCategory.value;
      break;
    case "team roping":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = eventByCategory.value;
      break;
    case "tie down roping":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = eventByCategory.value;
      break;
    case "steer wrestling":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = eventByCategory.value;
      break;
    case "breakaway roping":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = eventByCategory.value;
      break;
    case "goat tying":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = eventByCategory.value;
      break;
    case "pole bending":
      accountType = 2;
      queryByUser = "location,first_name,last_name";
      queryByAnimal = "name,brand,contractor_name";
      queryByVideo = "animal_name,animal_brand,location,user_name,title";
      eventType = eventByCategory.value;
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
      queryUsers.value = values;
      return values;
    });
    promises.push(promise);
  }

  if (queryByAnimal != "") {
    promise = searchAnimalsWithCategory(
      search.value,
      queryByAnimal,
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

const debounceSearch = useDebounceFn(doSearch, 1000);

watch(search, (new_v) => {
  if (new_v.length) {
    debounceSearch();
  } else {
    initialSetup(categoryQuery.value);
  }
});

watch(videos, (newVideos) => {
  loadingDefaults.value = false;
  queryVideos.value = newVideos.sort((a, b) => b.event_date - a.event_date);
});

watch(search_, (newSearch) => {
  if (newSearch.length) {
    queryUsers.value = newSearch;
  }
});

watch(
  () => route.query.category,
  (cq) => {
    search.value = "";
    queryUsers.value = [];
    queryAnimals.value = [];
    queryVideos.value = [];
    if (cq) {
      initialSetup(cq);
    }
  }
);

onMounted(() => {
  if (route.query.category) initialSetup(route.query.category);
});

// onUnmounted(() => {
//   store.commit("search_", []);
// });
</script>

<template>
  <div class="mx-auto my-6" style="max-width: 900px">
    <template v-if="!categoryQuery">
      <div class="d-flex flex-wrap justify-center">
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
            @click="navigateTo(category)"
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
    </template>
    <template v-else>
      <div class="d-flex flex-wrap">
        <div style="width: 100%" class="d-flex align-center mb-6">
          <v-btn
            @click="navigateTo(null)"
            icon
            color="error"
            variant="text"
            class="mx-1"
          >
            <v-icon icon="fas fa-arrow-left" size="small" />
            <!-- <img
              style="width: 30px"
              :src="require('@/assets/icons/glyph/glyphs/arrow.left.png')"
            /> -->
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
          <v-btn
            @click="search = ''"
            color="primary"
            variant="text"
            class="ml-1"
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
            <!-- <v-icon icon="fas fa-left" /> -->
            <img
              style="width: 30px"
              :src="require('@/assets/icons/glyph/glyphs/gobackward.png')"
            />
          </v-btn>
        </div>
      </div>

      <div
        class="d-flex flex-column justify-center my-9"
        style="width: 100%"
        v-if="loading"
      >
        <template v-if="isUserCategory">
          <template v-for="(item, index) in Array(5)" :key="index">
            <VSkeletonLoader
              type="list-item-avatar-three-line"
              width="900"
              height="100"
            />
            <v-divider
              v-if="index + 1 !== 5"
              class="flex-none"
              style="width: 100%; display: block; margin: 15px 0px"
            ></v-divider>
          </template>
        </template>
        <template v-else>
          <template v-for="(item, index) in Array(5)" :key="index">
            <v-card class="d-flex flex-column" style="width: 100%">
              <div class="d-flex justify-space-between">
                <VSkeletonLoader type="list-item-avatar-two-line" width="300" />
                <VSkeletonLoader type="list-item-two-line" width="300" />
              </div>
              <VSkeletonLoader type="image" width="900" />
            </v-card>
            <v-divider
              v-if="index + 1 !== 5"
              class="flex-none"
              style="width: 100%; display: block; margin: 40px 0px"
            ></v-divider>
          </template>
        </template>
        <!-- <v-progress-circular
          class="mx-auto"
          indeterminate
        ></v-progress-circular> -->
      </div>

      <template v-if="queryUsers.length">
        <div class="d-flex flex-column my-6" style="width: 100%">
          <template v-for="(item, index) in queryUsers" :key="item.first_name">
            <user-card v-bind="{ item }" />
            <v-divider
              v-if="index + 1 !== queryUsers.length"
              class="flex-none"
              style="width: 100%; display: block"
            ></v-divider>
          </template>
        </div>
      </template>

      <template v-if="queryAnimals.length">
        <div class="d-flex flex-column my-6" style="width: 100%">
          <template v-for="(item, index) in queryAnimals" :key="item.name">
            <animal-card v-bind="{ item }" />
            <v-divider
              v-if="index + 1 !== queryAnimals.length"
              class="flex-none"
              style="width: 100%; display: block"
            ></v-divider>
          </template>
        </div>
      </template>

      <template v-if="queryVideos.length">
        <div class="d-flex flex-column" style="width: 100%; margin-top: 60px">
          <!-- <videos-pagination :videos="queryVideos">
              <template #divider>
                <v-divider
                  v-if="index !== queryVideos.length - 1"
                  style="margin: 40px 0"
                ></v-divider>
              </template>
            </videos-pagination> -->
          <template v-for="(video, index) in queryVideos" :key="index">
            <video-card style="width: 100%" :video="video" />
            <v-divider
              v-if="index !== queryVideos.length - 1"
              style="margin: 40px 0"
            ></v-divider>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<style>
.floating-action-button {
  position: fixed;
  bottom: 12px;
  right: 2vw;
}
</style>
