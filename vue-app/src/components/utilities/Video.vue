<template>
  <v-card v-if="videoUser || $store.state.selectedProfile" class="video-card">
    <v-card-text class="d-flex justify-space-between py-1 px-2">
      <div class="d-flex" style="max-width: 60%; overflow: hidden">
        <!--  -->

        <router-link
          :to="{
            path: 'my-rodeo',
            query: {
              id: videoUser ? videoUser.id : $store.state.selectedProfile.id,
            },
          }"
        >
          <v-avatar cover size="36" color="transparent">
            <v-img
              cover
              aspect-ratio="1"
              style="width: 100%"
              :src="videoUser ? videoUser.photo_url : ''"
            >
            </v-img>
          </v-avatar>
        </router-link>

        <div class="d-flex flex-column ml-2">
          <router-link
            v-if="videoUser"
            :to="{
              path: 'my-rodeo',
              query: {
                id: videoUser ? videoUser.id : $store.state.selectedProfile.id,
              },
            }"
          >
            <span>{{ videoUser.first_name }} {{ videoUser.last_name }}</span>
          </router-link>
          <span class="text-caption" v-else
            >{{ $store.state.first_name }}
            {{ $store.state.selectedProfile.last_name }}</span
          >
          <span v-if="video.animal_name" class="text-caption"
            >{{ video.animal_name }}
            <span v-if="video.animal_brand">({{ video.animal_brand }})</span></span
          >
          <span>{{ video.title }}</span>
        </div>
      </div>
      <input ref="urlInput" type="text" name="" :value="videoUrl" style="display: none" />
      <iframe ref="downloadFrame" style="display: none"></iframe>
      <div class="d-flex flex-column text-end mr-1">
        <div class="d-flex align-center">
          <span class="mr-1">{{ getDate() }}</span>
          <v-menu v-model="menu" location="start">
            <template v-slot:activator="{ props }">
              <v-btn fab icon variant="flat" size="small" v-bind="props">
                <v-icon>fas fa-ellipsis</v-icon>
              </v-btn>
            </template>
            <v-card min-width="300">
              <v-list>
                <v-btn
                  @click="copyVideoLink"
                  variant="flat"
                  block
                  class="text-black"
                  v-if="$store.state.userProfile.id === video.user_id"
                  >Copy Link</v-btn
                >
                <v-divider
                  v-if="$store.state.userProfile.id === video.user_id"
                ></v-divider>
                <v-btn
                  @click="download"
                  variant="flat"
                  block
                  class="text-black"
                  v-if="$store.state.userProfile.id === video.user_id"
                  >Download</v-btn
                >
                <v-divider
                  v-if="$store.state.userProfile.id === video.user_id"
                ></v-divider>
                <v-btn
                  @click="deleteVideo"
                  variant="flat"
                  block
                  class="text-red"
                  v-if="$store.state.userProfile.id === video.user_id"
                  >Delete</v-btn
                >
                <v-divider
                  v-if="$store.state.userProfile.id === video.user_id"
                ></v-divider>
                <v-btn @click="reportVideo" variant="flat" block class="text-black"
                  >Report</v-btn
                >
              </v-list>
            </v-card>
          </v-menu>
        </div>

        <div :title="video.location">
          {{ video.location.slice(0, 20) }}{{ video.location.length > 20 ? "..." : "" }}
        </div>
      </div>
    </v-card-text>

    <v-img
      :key="videoUser"
      @click="playVideo"
      min-width="100%"
      :src="video.thumbnail_url"
      class="d-flex align-center"
      aspect-ratio="1.7"
      cover
    >
      <img src="/assets/icons/glyph/glyphs/play.circle.png" class="mx-auto play-icon" />
    </v-img>
  </v-card>
</template>

<script>
import store from "@/store";
import { ref } from "vue";
import { getStorage, getDownloadURL, ref as storageRef } from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
} from "@firebase/firestore";
import { useRoute } from "vue-router";
export default {
  props: ["video", "videoUser"],
  setup(props, { emit }) {
    const menu = ref(null);
    const videoUrl = ref("");
    const urlInput = ref(null);
    const downloadFrame = ref(null);
    const storage = getStorage();
    const db = getFirestore();
    function playVideo() {
      store.commit("SET_MODAL_VIDEO", props.video);
      store.commit("VIDEO_PLAYER_MODAL", true);
    }
    function getDate() {
      let endString = "N/A";
      if (props.video.event_date.toDate) {
        endString = props.video.event_date.toDate().toDateString();
      } else {
        try {
          endString = new Date(props.video.event_date * 1000).toDateString();
          // console.log(">>", props.video, props.video.event_date, endString)
        } catch (error) {
          endString = props.video.event_date;
        }
      }
      if (endString !== "N/A" && endString != props.video.event_date) {
        endString = endString.split(" ").slice(1, 4);
        endString = `${endString[0]} ${endString[1]}, ${endString[2]}`;
      }
      return endString;
    }
    async function download() {
      if (confirm("Are you sure you want to download this video to your computer?")) {
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
        return addDoc(collection(db, "reported_videos"), {
          reported_date: new Date(),
          user_id: props.video.user_id,
          video_id: props.video.video_id,
        }).catch(console.error);
      }
    }
    async function copyVideoLink() {
      urlInput.value.value = props.video.id;
      const url = `${window.location.origin}/feed?play=${urlInput.value.value}`;
      urlInput.value.select();
      urlInput.value.setSelectionRange(0, 99999);
      if (window.isSecureContext && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        unsecuredCopyToClipboard(url);
      }
      alert("Copied link to clickboard!");
    }
    function unsecuredCopyToClipboard(text) {
      urlInput.value.value = text;
      urlInput.value.focus();
      urlInput.value.select();
      urlInput.value.setSelectionRange(0, 99999);
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Unable to copy to clipboard", err);
      }
    }
    return {
      playVideo,
      getDate,
      menu,
      props,
      download,
      deleteVideo,
      reportVideo,
      copyVideoLink,
      urlInput,
      videoUrl,
      downloadFrame,
    };
  },
};
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
