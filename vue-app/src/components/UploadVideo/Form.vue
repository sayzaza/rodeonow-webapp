<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import {
  getFirestore,
  getDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import store from "@/store/index.js";
import { useEventState } from "@/store/event.js";
import { form } from "@/store/uploadVideo/form.js";
import { handlers } from "@/store/uploadVideo/handlers.js";
import { setAnimal } from "@/store/uploadVideo/animal.js";
import { useRouter } from "vue-router";
import FormCalendar from "../FormCalendar.vue";
import { toRaw } from "vue";

const router = useRouter();
const db = getFirestore();

const upcomingEvent = useEventState();

const noAccessUsers = ref(false);
const user_access_users = ref([]);
const contractorAnimals = ref([]);

const selectedProfile = computed(() => {
  return store.state.selectedProfile;
});

const nameHelper = (account) =>
  account.name ? account.name : `${account.first_name} ${account.last_name}`;

let events = [
  "Bull Riding",
  "Bareback Riding",
  "Saddle Bronc",
  "Team Roping",
  "Barrell Racing",
  "Steer Wrestling",
  "Tie Down Roping",
  "Breakaway Roping",
];

function addAnimal() {
  router.push({
    path: "/animals/new",
  });
}

function setSelectAccessUsers() {
  // let keys = Object.keys(store.state.userProfile.user_access).filter(
  //   (x) => store.state.userProfile.user_access[x]
  // );
  // console.log(store.state.userProfile.account_access);
  let accountsIDS = Object.keys(store.state.userProfile.account_access);

  if (!accountsIDS.length) {
    noAccessUsers.value = true;
  }

  if (!accountsIDS.includes(selectedProfile.value.id)) {
    accountsIDS = [selectedProfile.value.id, ...accountsIDS];
  }

  let promises = accountsIDS.map((accountID) => {
    return getDoc(doc(db, "users", accountID));
  });

  Promise.allSettled(promises)
    .then((results) => {
      let mappedUsers = results.map((res) => ({
        ...res.value.data(),
        id: res.value.id,
      }));

      user_access_users.value = mappedUsers;
      const logged = (acc) => acc.id === selectedProfile.value.id;

      let withoutLoggedUsers = mappedUsers.filter((acc) => !logged(acc));

      try {
        withoutLoggedUsers.sort((a, b) => a.name.localeCompare(b.name));
      } catch (err) {
        withoutLoggedUsers.sort((a, b) =>
          a.first_name.localeCompare(b.first_name)
        );
      }

      user_access_users.value = [
        mappedUsers.filter(logged).at(0),
        ...withoutLoggedUsers,
      ];

      handlers.selectedAccessUser = mappedUsers
        .filter(logged)
        .map(nameHelper)
        .at(0);
    })
    .catch(console.error);
}

function getAnimals() {
  let id = store.state.userProfile.id;
  let docRef = query(collection(db, "animals"), where("contractor", "==", id));
  getDocs(docRef)
    .then((snapshot) => {
      let cont_animals = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      cont_animals = cont_animals.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      contractorAnimals.value = cont_animals;
    })
    .catch(console.error);
}

function loadPresaved() {
  let rawPresaved = toRaw(upcomingEvent.value);

  const {
    event: title,
    eventType: selectedEvent,
    date: event_date,
    location,
  } = rawPresaved;

  Object.assign(form, {
    event_date,
    location,
    title,
  });
  Object.assign(handlers, {
    selectedEvent,
  });
}

function initialSetup() {
  if (!selectedProfile.value) return;
  setSelectAccessUsers();
  getAnimals();
  loadPresaved();
  // _loadVideoPreview();
  // if (route.query.selectedAccessUser) setDataFromAnimalsPage();
}

watch(
  () => handlers.selectedEvent,
  (v) => {
    console.log("selectedEvent", v);
    if (!v) return;
    handlers.scoreTime = events.indexOf(v) < 3 ? "score" : "time";
  }
);

watch(
  () => handlers.selectedAccessUser,
  () => {
    getAnimals();
  }
);

watch(
  () => handlers.selectedAnimal,
  () => {
    setAnimal(contractorAnimals.value);
  }
);

watch(selectedProfile, (v) => {
  if (v) {
    initialSetup();
  }
});

onBeforeMount(() => {
  initialSetup();
});
</script>

<template>
  <v-container>
    <template v-if="!noAccessUsers">
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="handlers.selectedAccessUser"
            :items="user_access_users.map(nameHelper)"
            variant="underlined"
            :close-on-click="false"
            label="User"
            :rules="[(v) => !!v || 'User is required!']"
          />
        </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col>
        <v-text-field
          v-model="form.title"
          label="Rodeo Event"
          variant="underlined"
          hide-no-data
          hide-selected
          class="py-0"
          :rules="[(v) => !!v || 'Rodeo Event is required!']"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="form.location"
          label="Location"
          hide-no-data
          hide-selected
          :rules="[(v) => !!v || 'Location is required!']"
          variant="underlined"
          class="py-0"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormCalendar
          v-model="form.event_date"
          label="Event Date"
          hide-no-data
          hide-selected
          variant="underlined"
          :rules="[(v) => !!v || 'Event Date is required!']"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          :items="events"
          v-model="handlers.selectedEvent"
          label="Select Event"
          variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn-toggle
          v-model="handlers.scoreTime"
          tile
          color="primary"
          group
          mandatory
          disabled
        >
          <v-btn size="small" value="score"> Score </v-btn>
          <v-btn size="small" value="time"> Time </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col alignSelf="start">
        <template v-if="handlers.scoreTime == 'score'">
          <v-text-field
            v-model="form.score"
            type="number"
            label="Value"
            hide-details
            hide-no-data
            variant="underlined"
          />
        </template>
        <template v-else>
          <v-text-field
            v-model="form.duration"
            type="number"
            label="Value"
            suffix="s"
            hide-details
            hide-no-data
            variant="underlined"
          />
        </template>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col>
        <v-autocomplete
          v-model="handlers.selectedAnimal"
          variant="underlined"
          :items="contractorAnimals.map((a) => `${a.name} (${a.brand})`)"
          :close-on-click="false"
          label="Animal in Video"
          hide-details
          :rules="[(v) => !!v || 'Animal is required!']"
        />
      </v-col>
      <v-col alignSelf="end" cols="auto">
        <v-btn
          color="primary"
          variant="text"
          density="comfortable"
          icon="fas fa-plus-circle"
          @click="addAnimal"
        >
          <img
            height="32"
            :src="require('@/assets/icons/glyph/glyphs/plus.circle.red.png')"
          />
        </v-btn>
      </v-col>
    </v-row>
    <template
      v-if="
        store.state.selectedProfile &&
        store.state.selectedProfile.account_type == 1
      "
    >
      <v-row>
        <v-col>
          <v-select
            :items="[]"
            label="Contestant"
            append-inner-icon="fas fa-search"
            variant="underlined"
          />
        </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col>
        <v-textarea
          v-model="form.notes"
          label="Notes"
          variant="underlined"
          hide-no-data
          hide-selected
          class="py-0"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
