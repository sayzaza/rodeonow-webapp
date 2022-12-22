<template>
  <v-form
    ref="form"
    @submit.prevent
    v-model="valid"
    class="d-flex flex-column mx-auto my-6"
    style="max-width: 700px"
  >
    <div class="mb-6">
      <!-- <span class="text-subtitle">Location</span> -->
      <video
        ref="videoPreview"
        v-show="store.state.videoToUpload"
        class="mb-3"
        style="max-width: 100%"
        controls
      >
        <source src="" id="video_here" />
        Your browser does not support HTML5 video.
      </video>
      <div v-if="!noAccessUsers" class="d-flex">
        <v-autocomplete
          v-model="selectedAccessUser"
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
          v-model="radioEvent"
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
          v-model="location"
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
        <v-text-field
          v-model="videoDate"
          label="Event Date"
          @click="$refs.datePicker.showPicker()"
          ref="datePicker"
          hide-no-data
          hide-selected
          :rules="[(v) => !!v || 'Event Date is required!']"
          type="date"
          variant="underlined"
          class="py-0 flex-grow-1 flex-shrink-0 mr-3"
        >
        </v-text-field>
        <div class="d-flex ml-auto align-center">
          <span class="text-caption">Today</span>
          <v-checkbox
            color="primary"
            hide-details
            v-model="today"
            :key="today"
          ></v-checkbox>
        </div>
      </div>

      <div class="d-flex align-center" style="width: 100%">
        <v-autocomplete
          v-model="selectedAnimal"
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
          v-model="selectedEvent"
          label="Select Event"
          variant="underlined"
        ></v-select>
      </div>

      <div class="d-flex">
        <v-select
          :items="[]"
          v-if="$store.state.selectedProfile.account_type == 1"
          label="Contestant"
          append-inner-icon="fas fa-search"
          variant="underlined"
        ></v-select>
      </div>

      <div class="d-flex align-center" style="width: 100%">
        <div class="d-flex ml-auto align-center">
          <v-btn-toggle
            v-model="scoreTime"
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
          v-if="scoreTime == 'score'"
          v-model="score"
          hide-no-data
          hide-selected
          variant="underlined"
          class="py-0"
          type="number"
        >
        </v-text-field>

        <v-text-field
          v-else
          v-model="score"
          hide-no-data
          hide-selected
          variant="underlined"
          class="py-0"
        >
        </v-text-field>
      </div>

      <div class="d-flex">
        <v-textarea
          v-model="notes"
          label="Notes"
          variant="underlined"
          hide-no-data
          hide-selected
          class="py-0"
        >
        </v-textarea>
      </div>
    </div>

    <Button @click="save" class="mx-auto mt-auto" :text="'Save'" />
    <video ref="videoPlayer" style="display: none"></video>
    <canvas ref="canvasInput" style="display: none"></canvas>
  </v-form>
</template>

<script setup>
import Typesense from "typesense";
import store from "@/store/index.js";
import { ref, computed, watch, onMounted } from "vue";
import Button from "@/components/utilities/button.vue";
import { useRoute, useRouter } from "vue-router";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadString,
} from "@firebase/storage";
import {
  query,
  where,
  getFirestore,
  collection,
  getDoc,
  doc,
  getDocs,
  addDoc,
} from "@firebase/firestore";
import { v4 as uuidv4 } from "uuid";

let todaysDate = new Date().toDateString().split(" ").slice(1, 4);
const storage = getStorage();
const radioEvent = ref("");
const location = ref("");
const form = ref(null);
const scoreTime = ref("score");
const score = ref("");
const notes = ref("");
const videoDate = ref(`${todaysDate[2]}-${new Date().getMonth() + 1}-${todaysDate[1]}`);
const today = ref(false);
const noAccessUsers = ref(false);
const selectedAccessUser = ref(null);
const contractorAnimals = ref([]);
const user_access_users = ref([]);
const selectedAnimal = ref(null);
const selectedEvent = ref("Select Event");
const datePicker = ref(null);
const canvasInput = ref(null);
const videoPlayer = ref(null);
const videoPreview = ref(null);
const selectedProfile = computed(() => {
  return store.state.selectedProfile;
});
const db = getFirestore();
const router = useRouter();
const route = useRoute();
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

function addAnimal() {
  const query = {
    selectedAccessUser: selectedAccessUser.value,
    radioEvent: radioEvent.value,
    location: location.value,
    videoDate: videoDate.value,
    selectedAnimal: selectedAnimal.value,
    selectedEvent: selectedEvent.value,
    scoreTime: scoreTime.value,
    score: score.value,
    notes: notes.value,
    today: today.value,
  };

  router.push({
    path: "/animals/new",
    query,
  });
}

function _createData(video_id, thumbnailURL) {
  selectedAccessUser.value = route.query.selectedAccessUser;
  const chosenAnimal = contractorAnimals.value.filter(
    (animal) => `${animal.name} (${animal.brand})` == selectedAnimal.value
  )[0];
  let data = {
    video_id,
    contestants_id: null,
    contractors_id: null,
    created: new Date(),
    duration: scoreTime.value === "time" ? score.value : null,
    score: scoreTime.value === "score" ? score.value : null,
    event_date: new Date(videoDate.value).getTime() / 1000,
    title: radioEvent.value,
    user_name: null,
    notes: notes.value,
    location: location.value,
    edited: false,
    user_id: store.state.userProfile.id,
    thumbnail_url: thumbnailURL,
  };
  console.log("chosenAnimal", chosenAnimal);
  data.animal_brand = chosenAnimal.brand;
  data.animal_name = chosenAnimal.name;
  data.animal_id = chosenAnimal.id;
  data.tagged_animal_contractor_id = chosenAnimal.contractor;
  return data;
}

async function _uploadVideo(storeFile, uuid, extension) {
  const fileRef = storageRef(storage, `videos/${uuid}/${uuid}.${extension}`);
  return uploadBytes(fileRef, storeFile);
}

function _captureUploadThumbnail(uuid) {
  return _generateVideoThumbnail().then((dataURL) => {
    const fileRef = storageRef(storage, `videos/${uuid}/${uuid}.png`);
    return uploadString(fileRef, dataURL, "data_url").then((snapshot) =>
      getDownloadURL(snapshot.ref)
    );
  });
}

const _generateVideoThumbnail = () => {
  return new Promise((resolve) => {
    let file = store.state.videoToUpload;
    let canvas = canvasInput.value;
    videoPlayer.value.autoplay = true;
    videoPlayer.value.muted = true;
    videoPlayer.value.src = (window.URL || window.webkitURL).createObjectURL(file);
    videoPlayer.value.onloadeddata = () => {
      let ctx = canvas.getContext("2d");
      canvas.width = videoPlayer.value.videoWidth;
      canvas.height = videoPlayer.value.videoHeight;
      ctx.drawImage(
        videoPlayer.value,
        0,
        0,
        videoPlayer.value.videoWidth,
        videoPlayer.value.videoHeight
      );
      videoPlayer.value.pause();
      console.log(canvas.toDataURL("image/png"));
      return resolve(canvas.toDataURL("image/png"));
    };
  });
};

async function save() {
  const video_id = uuidv4();
  const extension = store.state.videoToUpload.name.split(".").pop();
  const thumbnailURL = await _captureUploadThumbnail(video_id, extension);
  return _uploadVideo(store.state.videoToUpload, video_id, extension)
    .then(() => {
      console.log("Video uploaded successfully!");
      let data = _createData(video_id, thumbnailURL);
      return addDoc(collection(db, "videos"), data)
        .then(console.log)
        .then(router.push("feed"));
    })
    .catch(console.error);
}

watch(today, (v) => {
  videoDate.value = new Date().toISOString().split("T")[0];
});

watch(selectedProfile, (v) => {
  if (v) {
    initialSetup();
  }
});

watch(selectedEvent, (v) => {
  console.log("selectedEvent", v);
  if (!v) return;
  scoreTime.value = events.indexOf(v) < 3 ? "score" : "time";
});

watch(selectedAccessUser, () => {
  getAnimals();
});

function setDataFromAnimalsPage() {
  selectedAccessUser.value = route.query.selectedAccessUser;
  radioEvent.value = route.query.radioEvent;
  location.value = route.query.location;
  videoDate.value = route.query.videoDate;
  selectedAnimal.value = route.query.selectedAnimal;
  selectedEvent.value = route.query.selectedEvent;
  scoreTime.value = route.query.scoreTime;
  score.value = route.query.score;
  notes.value = route.query.notes;
  today.value = route.query.today == "true";
}

function initialSetup() {
  if (!selectedProfile.value) return;
  setSelectAccessUsers();
  getAnimals();
  _loadVideoPreview();
  if (route.query.selectedAccessUser) setDataFromAnimalsPage();
}

function _loadVideoPreview() {
  if(!store.state.videoToUpload) return 
  let source = videoPreview.value.firstChild;
  source.src = URL.createObjectURL(store.state.videoToUpload);
  videoPreview.value.load();
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
      selectedAccessUser.value = user_access_users.value.map((acc) =>
        acc.name ? acc.name : `${acc.first_name} ${acc.last_name}`
      )[0];
      try {
        user_access_users.value.sort((a, b) => a.name.localeCompare(b.name));
      } catch {
        user_access_users.value.sort((a, b) => a.first_name.localeCompare(b.first_name));
      }
    })
    .catch(console.error);
}

watch(datePicker, () => (today.value = false));
watch(() => store.state.videoToUpload, _loadVideoPreview);
onMounted(() => {
  initialSetup();
});
</script>

<style></style>
