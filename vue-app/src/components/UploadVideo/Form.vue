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
import { form } from "@/store/uploadVideo/form.js";
import { handlers } from "@/store/uploadVideo/handlers.js";
import { setAnimal } from "@/store/uploadVideo/animal.js";
import { useRouter } from "vue-router";
import FormCalendar from "../FormCalendar.vue";

const router = useRouter();
const db = getFirestore();

const noAccessUsers = ref(false);
const user_access_users = ref([]);
const contractorAnimals = ref([]);

const selectedProfile = computed(() => {
  return store.state.selectedProfile;
});

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

function setSelectAccessUsers() {
  let keys = Object.keys(store.state.userProfile.user_access).filter(
    (x) => store.state.userProfile.user_access[x]
  );
  if (keys.length == 0) {
    noAccessUsers.value = true;
  }
  if (!keys.includes(selectedProfile.value.id))
    keys = [selectedProfile.value.id, ...keys];
  let promises = keys.map((k) => {
    return getDoc(doc(db, "users", k));
  });
  Promise.allSettled(promises)
    .then((results) => {
      user_access_users.value = results
        .map((res) => ({
          ...res.value.data(),
          id: res.value.id,
        }))
        .filter((user) => user.account_type < 3);
      handlers.selectedAccessUser = user_access_users.value.map((acc) =>
        acc.name ? acc.name : `${acc.first_name} ${acc.last_name}`
      )[0];
      try {
        user_access_users.value.sort((a, b) => a.name.localeCompare(b.name));
      } catch {
        user_access_users.value.sort((a, b) =>
          a.first_name.localeCompare(b.first_name)
        );
      }
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

function addAnimal() {
  router.push({
    path: "/animals/new",
  });
}

function initialSetup() {
  if (!selectedProfile.value) return;
  setSelectAccessUsers();
  getAnimals();
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
  <div class="d-flex flex-column">
    <div v-if="!noAccessUsers" class="d-flex">
      <v-autocomplete
        v-model="handlers.selectedAccessUser"
        :items="
          user_access_users.map((acc) =>
            acc.name ? acc.name : `${acc.first_name} ${acc.last_name}`
          )
        "
        variant="underlined"
        :close-on-click="false"
        label="User"
        :rules="[(v) => !!v || 'User is required!']"
      >
      </v-autocomplete>
    </div>

    <div class="d-flex">
      <v-text-field
        v-model="form.title"
        label="Rodeo Event"
        variant="underlined"
        hide-no-data
        hide-selected
        class="py-0"
        :rules="[(v) => !!v || 'Rodeo Event is required!']"
      >
      </v-text-field>
    </div>

    <div class="d-flex">
      <v-text-field
        v-model="form.location"
        label="Location"
        hide-no-data
        hide-selected
        :rules="[(v) => !!v || 'Location is required!']"
        variant="underlined"
        class="py-0"
      >
      </v-text-field>
    </div>

    <div class="d-flex align-center" style="width: 100%">
      <FormCalendar
        v-model="form.event_date"
        label="Event Date"
        hide-no-data
        hide-selected
        variant="underlined"
        :rules="[(v) => !!v || 'Event Date is required!']"
      />
    </div>

    <div class="d-flex align-center" style="width: 100%">
      <v-autocomplete
        v-model="handlers.selectedAnimal"
        variant="underlined"
        :items="contractorAnimals.map((a) => `${a.name} (${a.brand})`)"
        :close-on-click="false"
        label="Animal in Video"
        :rules="[(v) => !!v || 'Animal is required!']"
      >
      </v-autocomplete>

      <div class="d-flex ml-auto align-center">
        <v-btn
          icon
          size="small"
          variant="text"
          class="d-flex items-center justify-center mr-2 ml-auto"
          @click="addAnimal"
        >
          <img
            width="32"
            :src="require('@/assets/icons/glyph/glyphs/plus.circle.red.png')"
          />
        </v-btn>
      </div>
    </div>

    <div class="d-flex">
      <v-select
        :items="events"
        v-model="handlers.selectedEvent"
        label="Select Event"
        variant="underlined"
      ></v-select>
    </div>

    <div class="d-flex">
      <v-select
        :items="[]"
        v-if="
          store.state.selectedProfile &&
          store.state.selectedProfile.account_type == 1
        "
        label="Contestant"
        append-inner-icon="fas fa-search"
        variant="underlined"
      ></v-select>
    </div>

    <div class="d-flex align-center" style="width: 100%">
      <div class="d-flex ml-auto align-center">
        <v-btn-toggle
          v-model="handlers.scoreTime"
          tile
          color="primary"
          group
          mandatory
          class="mr-3"
          disabled
        >
          <v-btn size="small" value="score"> Score </v-btn>

          <v-btn size="small" value="time"> Time </v-btn>
        </v-btn-toggle>
      </div>

      <v-text-field
        v-if="handlers.scoreTime == 'score'"
        v-model="form.score"
        hide-no-data
        hide-selected
        variant="underlined"
        class="py-0"
        type="number"
      >
      </v-text-field>

      <v-text-field
        v-else
        v-model="form.score"
        hide-no-data
        hide-selected
        variant="underlined"
        class="py-0"
      >
      </v-text-field>
    </div>

    <div class="d-flex">
      <v-textarea
        v-model="form.notes"
        label="Notes"
        variant="underlined"
        hide-no-data
        hide-selected
        class="py-0"
      >
      </v-textarea>
    </div>
  </div>
</template>
