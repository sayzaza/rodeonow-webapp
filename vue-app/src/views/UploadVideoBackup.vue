<script setup>
import Form from "@/components/UploadVideo/Form.vue";
import { useUploadVideo } from "@/store/uploadVideo.js";

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
} from "firebase/storage";
import {
  query,
  where,
  getFirestore,
  collection,
  getDoc,
  doc,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import interact from "interactjs";
import videoTrimmer from "@/components/videoTrimmer.vue";
import { storeToRefs } from "pinia";

const uploadVideoStore = useUploadVideo();
const { getStep, step } = storeToRefs(uploadVideoStore);

let todaysDate = new Date().toDateString().split(" ").slice(1, 4);
const storage = getStorage();
const radioEvent = ref("");
const location = ref("");
const form = ref(null);
const scoreTime = ref("score");
const score = ref("");
const notes = ref("");
const videoStart = ref("0:00");
const videoEnd = ref("0:00");
const videoDate = ref(
  `${todaysDate[2]}-${new Date().getMonth() + 1}-${todaysDate[1]}`
);
let today = ref(false);
const noAccessUsers = ref(false);
const selectedAccessUser = ref(null);
const contractorAnimals = ref([]);
const user_access_users = ref([]);
const selectedAnimal = ref(null);
const selectedEvent = ref("Select Event");
const datePicker = ref(null);
const canvasInput = ref(null);
const videoPlayer = ref(null);
const videoDuration = ref(null);
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
    videoPlayer.value.src = (window.URL || window.webkitURL).createObjectURL(
      file
    );
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
  // _loadVideoPreview();
  if (route.query.selectedAccessUser) setDataFromAnimalsPage();
}

function _loadVideoPreview() {
  if (!store.state.videoToUpload) return;
  let source = videoPreview.value.firstChild;
  source.src = URL.createObjectURL(store.state.videoToUpload);
  videoPreview.value.load();
  console.log(videoPreview.value);
  videoPreview.value.addEventListener("canplay", () => {
    videoDuration.value = parseInt(videoPreview.value.duration);
    videoEnd.value = timeFromFloat(videoDuration.value);
  });
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
        user_access_users.value.sort((a, b) =>
          a.first_name.localeCompare(b.first_name)
        );
      }
    })
    .catch(console.error);
}

function timeFromFloat(value) {
  return `${Math.floor(value / 60)}:${(value % 60)
    .toString()
    .padStart(2, "0")}`;
}

watch(datePicker, () => (today.value = false));
// watch(() => store.state.videoToUpload, _loadVideoPreview);
onMounted(() => {
  initialSetup();

  interact(".resize-drag")
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: false, top: false },

      listeners: {
        move(event) {
          var target = event.target;
          var track = document.getElementById("time-track");
          var x = parseFloat(target.getAttribute("data-x")) || 0;
          // var y = (parseFloat(target.getAttribute('data-y')) || 0)
          console.log("track", track);
          if (
            videoDuration.value * (event.rect.width / track.offsetWidth) <=
            30
          )
            return;

          // update the element's style
          target.style.width = event.rect.width + "px";
          // target.style.height = event.rect.height + 'px'

          // translate when resizing from top or left edges
          x += event.deltaRect.left;
          // y += event.deltaRect.top

          // target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
          target.style.transform = "translate(" + x + "px)";

          target.setAttribute("data-x", x);
          // target.setAttribute('data-y', y)

          videoStart.value = Math.round(event.rect.width); // + '\u00D7' + Math.round(event.rect.height)
          videoEnd.value = Math.round(event.rect.width); // + '\u00D7' + Math.round(event.rect.height)
        },
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: "parent",
        }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 },
        }),
      ],

      inertia: true,
    })
    .draggable({
      listeners: {
        move: (event) => {
          var target = event.target;
          // keep the dragged position in the data-x/data-y attributes
          var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          // var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          // translate the element
          // target.style.transform = "translate(" + x + "px, " + y + "px)";
          target.style.transform = "translate(" + x + "px)";

          // update the posiion attributes
          target.setAttribute("data-x", x);
          // target.setAttribute("data-y", y);
        },
      },
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
    });
});
</script>

<template>
  <div class="d-flex flex-row mx-auto my-2" style="max-width: 700px">
    <v-container>
      <v-row align="center">
        <v-col>
          <v-progress-linear :model-value="getStep"></v-progress-linear>
        </v-col>
        <v-col cols="auto">
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn
                :disabled="getStep == 50"
                variant="tonal"
                density="comfortable"
                icon="fas fa-angle-left"
                @click="(_$event) => (step = 0)"
              ></v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn
                :disabled="getStep == 100"
                variant="tonal"
                density="comfortable"
                icon="fas fa-angle-right"
                @click="(_$event) => (step = 1)"
              ></v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <v-form
    ref="form"
    @submit.prevent
    class="d-flex flex-column mx-auto my-4"
    style="max-width: 700px"
  >
    <div class="mb-6">
      <template v-if="getStep == 50">
        <videoTrimmer />
      </template>
      <template v-else>
        <Form />
      </template>
    </div>

    <template v-if="getStep == 100">
      <Button @click="save" class="mx-auto mb-2" :text="'Save'" />
    </template>

    <video ref="videoPlayer" style="display: none"></video>
    <canvas ref="canvasInput" style="display: none"></canvas>
  </v-form>
</template>

<style scoped>
.resize-drag {
  border-radius: 8px;
  padding: 5px;
  border: 3px solid #bd2a24;
  border-right: 7px solid #bd2a24;
  border-left: 7px solid #bd2a24;
  color: #bd2a24;
  background-color: rgb(15, 15, 15);
  font-size: 20px;
  font-family: sans-serif;
  touch-action: none;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

#time-track {
  margin-bottom: 20px;
  height: 80px;
  border-radius: 8px;
  background-color: rgb(34, 34, 34);
  position: relative;
}
</style>
