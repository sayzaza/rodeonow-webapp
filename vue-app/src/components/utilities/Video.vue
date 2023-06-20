<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-card class="video-card">
    <v-card-text class="d-flex align-center justify-space-between py-2 px-2">
      <div class="d-flex align-center" style="max-width: 60%">
        <template v-if="!userVideo">
          <v-skeleton-loader
            type="avatar"
            style="margin-left: -8px"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="list-item-two-line"
            style="margin-left: -16px"
            width="200"
          ></v-skeleton-loader>
        </template>
        <template v-else>
          <router-link
            :to="{
              path: 'my-rodeo',
              query: {
                id: userVideo.id ?? $store.state.selectedProfile.id,
              },
            }"
            class="ml-2"
          >
            <v-avatar size="48" color="transparent">
              <v-img cover :aspect-ratio="1" :src="userVideo.photo_url ?? ''">
              </v-img>
            </v-avatar>
          </router-link>
          <div class="d-flex flex-column ml-4">
            <template v-if="userVideo.first_name || userVideo.last_name">
              <router-link
                :to="{
                  path: 'my-rodeo',
                  query: {
                    id: userVideo.id ?? $store.state.selectedProfile.id,
                  },
                }"
              >
                <span>{{
                  `${userVideo.first_name} ${userVideo.last_name}`
                }}</span>
              </router-link>
            </template>
            <template v-else>
              <span class="text-caption">
                {{
                  `${$store.state.first_name} ${$store.state.selectedProfile.last_name}`
                }}
              </span>
            </template>
            <span v-if="video.animal_name" class="text-caption">
              <span v-if="video.animal_brand" class="text-medium-emphasis mr-1">
                {{ video.animal_brand }}
              </span>
              <span class="text-high-emphasis">
                {{ video.animal_name }}
              </span>
            </span>
            <span>
              {{ video.title }}
            </span>
          </div>
        </template>
      </div>
      <iframe ref="downloadFrame" style="display: none"></iframe>
      <div class="d-flex flex-column">
        <div class="d-flex justify-space-between align-center">
          <span class="mr-1">{{ videoDate }}</span>
          <v-menu v-model="menu" :close-on-content-click="false" location="end">
            <template v-slot:activator="{ props }">
              <v-btn fab icon size="small" variant="text" v-bind="props">
                <v-icon icon="fas fa-ellipsis"></v-icon>
              </v-btn>
            </template>
            <v-list v-if="isMy">
              <v-btn
                @click="copyVideoLink"
                variant="text"
                block
                class="text-black"
                >Copy Link</v-btn
              >
              <v-divider></v-divider>
              <embed-modal :video="video" />
              <v-divider></v-divider>
              <v-btn @click="download" variant="text" block class="text-black"
                >Download</v-btn
              >
              <v-divider></v-divider>
              <v-btn @click="deleteVideo" variant="text" block class="text-red"
                >Delete</v-btn
              >
              <v-divider></v-divider>
              <v-btn
                @click="reportVideo"
                variant="text"
                block
                class="text-black"
                >Report</v-btn
              >
            </v-list>
            <v-list v-else>
              <v-btn
                @click="copyVideoLink"
                variant="text"
                block
                class="text-black"
                >Copy Link</v-btn
              >
              <v-divider></v-divider>
              <embed-modal :video="video" />
              <v-divider></v-divider>
              <v-btn
                @click="reportVideo"
                variant="text"
                block
                class="text-black"
                >Report</v-btn
              >
            </v-list>
          </v-menu>
        </div>

        <div class="d-flex align-center" style="position: relative">
          <v-icon
            color="primary"
            icon="fas fa-map-marker-alt"
            size="small"
            style="position: absolute; top: 0; left: -22px"
          />
          <div :title="video.location">
            {{ video.location }}
            <!-- {{ video.location.slice(0, 20)
            }}{{ video.location.length > 20 ? "..." : "" }} -->
          </div>
        </div>
      </div>
    </v-card-text>

    <div style="position: relative">
      <v-img
        @click="playVideo"
        :src="video.thumbnail_url"
        :aspect-ratio="1"
        height="600"
        width="900"
        cover
        style="cursor: pointer"
      >
        <div class="d-flex align-center" style="height: 100%">
          <img
            src="/assets/icons/glyph/glyphs/play.circle.png"
            width="40"
            class="mx-auto play-icon"
          />
        </div>
      </v-img>
      <div
        style="position: absolute; bottom: 0; left: 0"
        class="d-flex justify-space-between w-100 pb-3 px-3"
      >
        <div
          class="pa-2 rounded text-white text-subtitle-2"
          style="background-color: rgba(0, 0, 0, 0.5)"
        >
          {{ views }} views
        </div>
        <div
          class="pa-2 rounded text-white text-subtitle-2"
          style="background-color: rgba(0, 0, 0, 0.5)"
        >
          {{ duration }}
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import store from "@/store";
import { ref, computed, defineProps, defineEmits } from "vue";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import {
  getStorage,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";
import {
  doc,
  addDoc,
  getDoc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";

import EmbedModal from "@/components/embedModal.vue";
import { computedAsync, useClipboard } from "@vueuse/core";
import { getProfileImageById } from "@/services/profiles";

dayjs.extend(durationPlugin);

const props = defineProps(["video"]);
const emit = defineEmits(["delete"]);

const menu = ref(null);
const storage = getStorage();
const downloadFrame = ref();
const db = getFirestore();
const views = ref(0);

const duration = computed(() => {
  const seconds = Number(props.video.duration).toFixed(0);

  return dayjs.duration(seconds, "seconds").format("m:ss");
});

const realtimeDB = getDatabase();
const videoViews = dbRef(realtimeDB, `videoViews/${props.video.video_id}`);

onValue(videoViews, (snapshot) => {
  const data = snapshot.val();
  if (data != null) {
    views.value = data;
  }
});

function playVideo() {
  store.commit("SET_MODAL_VIDEO", props.video);
  store.commit("VIDEO_PLAYER_MODAL", true);
}

const isMy = computed(() => {
  return userVideo.value.id === store.state.selectedProfile.id;
});

const videoDate = computed(() => {
  let endString = "N/A";

  try {
    endString = dayjs(props.video.event_date * 1000).format("MMMM D, YYYY");
  } catch (error) {
    endString = props.video.event_date;
  }

  return endString;
});

const userVideo = computedAsync(() => {
  let docRef = getDoc(doc(db, "users", props.video.user_id)).then(
    async (doc) => {
      return {
        ...doc.data(),
        id: doc.id,
        photo_url: await getProfileImageById(doc.data()),
      };
    }
  );

  return docRef;
}, null);

async function download() {
  if (
    confirm("Are you sure you want to download this video to your computer?")
  ) {
    downloadFrame.value.src = await getDownloadURL(
      storageRef(storage, `videos/${props.video.video_id}.mov`)
    ).catch((error) => {
      console.error(error);
      return "";
    });
  }
}
function deleteVideo() {
  if (
    confirm(
      "Are you sure you want to delete this video? This action cannot be undone."
    )
  ) {
    return deleteDoc(doc(db, "videos", props.video.id))
      .then(() => {
        emit("deleted");
      })
      .catch(console.error);
  }
}
function reportVideo() {
  if (confirm("Are you sure you want to report this video?")) {
    return addDoc(doc(db, "reported_videos"), {
      reported_date: new Date(),
      user_id: props.video.user_id,
      video_id: props.video.video_id,
    }).catch(console.error);
  }
}

function copyVideoLink() {
  const source = `${window.location.origin}/feed?play=${props.video.id}`;

  const { copy, isSupported } = useClipboard({ source, legacy: true });

  if (isSupported.value) {
    copy();
  } else {
    navigator.clipboard
      .writeText(source)
      .then(() => {
        alert("Copied!");
      })
      .catch((error) => {
        alert(`Copy failed! error:${error}`);
      });
  }

  // if (window.isSecureContext && navigator.clipboard) {
  //   setTimeout(async () => {
  //     await navigator.clipboard.writeText(source);
  //   });
  // } else {
  //   unsecuredCopyToClipboard(url);
  // }
}
// function unsecuredCopyToClipboard(text) {
//   urlInput.value.value = text;
//   urlInput.value.focus();
//   urlInput.value.select();
//   urlInput.value.setSelectionRange(0, 99999);
//   try {
//     document.execCommand("copy");
//   } catch (err) {
//     console.error("Unable to copy to clipboard", err);
//   }
// }
</script>

<style>
.video-card {
  overflow: hidden;
}

.video-card:hover img {
  cursor: pointer;
}

.video-card:hover .play-icon {
  transform: scale(1.1);
}

.play-icon {
  display: block;
  filter: invert();
}

.v-theme--light a {
  text-decoration: none;
  color: black;
}
</style>
