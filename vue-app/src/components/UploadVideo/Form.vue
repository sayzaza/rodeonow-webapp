<script setup>
import { ref, computed, toRaw, onBeforeMount, watch } from "vue";
import { computedAsync } from "@vueuse/core";
import {
  getFirestore,
  getDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import typesense from "typesense";
import store from "@/store/index.js";
import { useEventState } from "@/store/event.js";
import { form, setContestant } from "@/store/uploadVideo/form.js";
import { handlers } from "@/store/uploadVideo/handlers.js";
import { setAnimal } from "@/store/uploadVideo/animal.js";
import { useRouter } from "vue-router";
import FormCalendar from "../FormCalendar.vue";
import events from "@/utils/events";

let host = "qlfs4dzmyjg9u7khp-1.a1.typesense.net";
let apiKey = "xNVfwTWVjKhxfRa00Ke7h4SHrpoP3geg";

if (process.env.environment == "production") {
  host = "a42zqpchkvriw3t1p-1.a1.typesense.net";
  apiKey = "5wEHbO8SyXeDhRRnpeIROj22ttw5RRF2";
}

let client = new typesense.Client({
  nodes: [
    {
      host: host,
      port: "443",
      protocol: "https",
    },
  ],
  apiKey: apiKey,
});

const router = useRouter();
const db = getFirestore();

const upcomingEvent = useEventState();

const searchAnimal = ref("");
const loadingAnimals = ref(false);

const searchContestant = ref("");
const loadingContestants = ref(false);

const noAccessUsers = ref(false);
const accessUsersData = ref([]);

const selectedProfile = computed(() => {
  return store.state.selectedProfile;
});

const nameHelper = (account) =>
  account.first_name != "" || account.first_name != null
    ? `${account.first_name} ${account.last_name}`
    : account.name;

const selectedAccessUserData = computed(() => {
  let record = accessUsersData.value.find(
    (user) => user.id === handlers.selectedAccessUser
  );

  if (record) {
    return record;
  } else {
    return null;
  }
});

const accountType = computed(() => {
  return selectedAccessUserData.value
    ? selectedAccessUserData.value.account_type
    : 0;
});

// let events = [
//   "Bull Riding",
//   "Bareback Riding",
//   "Saddle Bronc",
//   "Team Roping",
//   "Barrell Racing",
//   "Steer Wrestling",
//   "Tie Down Roping",
//   "Breakaway Roping",
// ];

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
      // [Methods]
      const logged = (acc) => acc.id === selectedProfile.value.id;

      // [Data]
      let mappedUsers = results.map((res) => ({
        ...res.value.data(),
        id: res.value.id,
      }));

      accessUsersData.value = mappedUsers.map((user) => {
        const { account_type, id, first_name, last_name } = user;
        return {
          account_type,
          id,
          first_name,
          last_name,
          mapped_name: nameHelper(user),
        };
      });

      let data = toRaw(accessUsersData.value);

      let withoutLoggedUsers = data.filter((acc) => !logged(acc));

      try {
        withoutLoggedUsers.sort((a, b) => a.name.localeCompare(b.name));
      } catch (err) {
        withoutLoggedUsers.sort((a, b) =>
          a.first_name.localeCompare(b.first_name)
        );
      }

      const loggedUser = data.filter(logged);

      accessUsersData.value = [...loggedUser, ...withoutLoggedUsers];

      handlers.selectedAccessUser = loggedUser.at(0).id;
    })
    .catch(console.error);
}

const animals = computedAsync(() => {
  let id = store.state.userProfile.id;

  if (selectedAccessUserData.value) {
    id = selectedAccessUserData.value.id;
  }

  if (selectedAccessUserData.value.account_type != 1) {
    return [];
  }

  let docRef = query(collection(db, "animals"), where("contractor", "==", id));
  let data = getDocs(docRef)
    .then((snapshot) => {
      let cont_animals = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      cont_animals = cont_animals.sort((a, b) => a.name.localeCompare(b.name));
      console.log(cont_animals);

      cont_animals = cont_animals.map((animal) => {
        return {
          ...animal,
          title: `${animal.name} (${animal.brand})`,
        };
      });

      return cont_animals;
    })
    .catch(console.error);

  return data;
}, []);

const contestants = computedAsync(() => {
  if (accountType.value != 1) {
    return [];
  }
  if (form.contestants_id == null) {
    if (searchContestant.value === "") {
      return [];
    }
  }

  loadingContestants.value = true;

  let search = {
    q: searchContestant.value,
    query_by: "first_name,last_name",
    filter_by: "account_type:=2",
  };

  let data = client
    .collections("users")
    .documents()
    .search(search)
    .then((res) => {
      const { found } = res;

      if (found) {
        let cont_contestants = res.hits.map((hit) => hit.document);

        cont_contestants = cont_contestants.sort((a, b) =>
          a.first_name.localeCompare(b.first_name)
        );
        console.log(cont_contestants);

        cont_contestants = cont_contestants.map((contestant) => {
          return {
            ...contestant,
            title: `${contestant.first_name} ${contestant.last_name}`,
          };
        });

        return cont_contestants;
      }
    })
    .finally(() => {
      loadingContestants.value = false;
    });

  return data;
}, []);

const contestantAnimals = computedAsync(() => {
  if (accountType.value != 2) {
    return [];
  }
  if (handlers.selectedAnimal == null) {
    if (searchAnimal.value === "") {
      return [];
    }
  }

  loadingAnimals.value = true;

  let search = {
    q: searchAnimal.value,
    query_by: "name,brand",
  };

  let data = client
    .collections("animals")
    .documents()
    .search(search)
    .then((res) => {
      const { found } = res;

      if (found) {
        let cont_animals = res.hits.map((hit) => hit.document);

        cont_animals = cont_animals.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        console.log(cont_animals);

        cont_animals = cont_animals.map((animal) => {
          return {
            ...animal,
            title: `${animal.name} (${animal.brand})`,
          };
        });

        return cont_animals;
      } else {
        return [];
      }
    })
    .finally(() => {
      loadingAnimals.value = false;
    });

  return data;
}, []);

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
  () => handlers.selectedAnimal,
  () => {
    setAnimal(accountType.value == 1 ? animals.value : contestantAnimals.value);
  }
);

watch(
  () => handlers.selectedContestant,
  () => {
    setContestant(contestants.value);
  }
);

watch(selectedProfile, (v) => {
  if (v) {
    initialSetup();
  }
});

watch(selectedAccessUserData, () => {
  handlers.selectedContestant = null;
  handlers.selectedAnimal = null;
  form.contestants_id = null;
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
            :close-on-click="false"
            :items="accessUsersData"
            :rules="[(v) => !!v || 'User is required!']"
            item-title="mapped_name"
            item-value="id"
            label="User"
            variant="underlined"
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
            label="Score"
            hide-details
            hide-no-data
            variant="underlined"
          />
        </template>
        <template v-else>
          <v-text-field
            v-model="form.duration"
            type="number"
            label="Time"
            suffix="s"
            hide-details
            hide-no-data
            variant="underlined"
          />
        </template>
      </v-col>
    </v-row>
    <v-row align="center">
      <template v-if="accountType == 1">
        <v-col>
          <v-autocomplete
            v-model="handlers.selectedAnimal"
            :items="animals"
            :close-on-click="false"
            :rules="[(v) => !!v || 'Animal is required!']"
            variant="underlined"
            item-title="title"
            item-value="title"
            label="Animal in Video"
            hide-details
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
      </template>
      <template v-else>
        <v-col>
          <v-autocomplete
            v-model="handlers.selectedAnimal"
            v-model:search="searchAnimal"
            :loading="loadingAnimals"
            :items="contestantAnimals"
            :close-on-click="false"
            :rules="[(v) => !!v || 'Animal is required!']"
            :hide-no-data="searchAnimal === ''"
            item-title="title"
            variant="underlined"
            label="Animal in Video"
            no-data-text="No results match your search. Please try again."
            append-inner-icon=""
            no-filter
            hide-details
          >
            <template #append-inner>
              <div id="unrotate">
                <v-icon icon="fas fa-search" color="#7a7a7a" size="x-small" />
              </div>
            </template>
          </v-autocomplete>
        </v-col>
      </template>
    </v-row>
    <template v-if="accountType == 1">
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="handlers.selectedContestant"
            v-model:search="searchContestant"
            :loading="loadingContestants"
            :items="contestants"
            :close-on-click="false"
            :rules="[(v) => !!v || 'Contestant is required!']"
            :hide-no-data="searchContestant === ''"
            item-title="title"
            item-value="title"
            variant="underlined"
            label="Contestant"
            no-data-text="No results match your search. Please try again."
            append-inner-icon=""
            no-filter
            hide-details
          >
            <template #append-inner>
              <div id="unrotate">
                <v-icon icon="fas fa-search" color="#7a7a7a" size="x-small" />
              </div>
            </template>
          </v-autocomplete>
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

.v-autocomplete.v-select--is-menu-active
  .v-input__icon--append
  #unrotate
  .v-icon {
  transform: none;
}
</style>
