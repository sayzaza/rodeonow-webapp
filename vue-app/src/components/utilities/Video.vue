<template>
  <v-card v-if="videoUser || $store.state.selectedProfile" class="video-card">
    <v-card-text class="d-flex justify-space-between py-1 px-2">
      <div class="d-flex" style="max-width: 60%; overflow: hidden">
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
      <!-- 
        <div class="text--disabled mt-auto" :title="video.location">
            {{ video.location.slice(0,20) }}{{ video.location.length > 20 ? '...' : '' }}
        </div> 
      -->

      <div class="d-flex flex-column text-end mr-1">
        <div class="d-flex align-center text-center">
          <span class="mr-1">{{ getDate() }}</span>
          <v-menu v-model="menu" :close-on-content-click="false" location="end">
            <template v-slot:activator="{ props }">
              <v-btn fab icon size="small" variant="text" v-bind="props">
                <v-icon>fas fa-ellipsis</v-icon>
              </v-btn>
            </template>
              <v-list v-if="isMine">
                <input ref="urlInput" type="hidden" name="" :value="videoUrl">
                <v-btn @click="copyLink" variant="text" block class="text-black">Copy Link</v-btn>
                <v-divider></v-divider>
                  <embed-modal :video="video" />
                <v-divider></v-divider>
                <v-btn @click="download" variant="text" block class="text-black">Download</v-btn>
                <v-divider></v-divider>
                <v-btn @click="deleteVideo" variant="text" block class="text-red">Delete</v-btn>
                <v-divider></v-divider>
                <v-btn @click="reportVideo" variant="text" block class="text-black">Report</v-btn>
              </v-list>
              <v-list v-else>
                <input ref="urlInput" type="hidden" name="" :value="videoUrl">
                <v-btn @click="copyLink" variant="text" block class="text-black">Copy Link</v-btn>
                <v-divider></v-divider>
                  <embed-modal :video="video" />
                <v-divider></v-divider>
                <v-btn @click="reportVideo" variant="text" block class="text-black">Report</v-btn>
              </v-list>
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
import store from "@/store"
import { ref } from "vue"
import { useRoute } from "vue-router"
import { getStorage, getDownloadURL, ref as storageRef } from 'firebase/storage'
import EmbedModal from "@/components/embedModal.vue"
export default {
  props: ["video", "videoUser", "isMine"],
  components: { EmbedModal },
  setup(props) {
    const menu = ref(null)
    const videoUrl = ref('')
    const urlInput = ref(null)
    const storage = getStorage()
    const route = useRoute()
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

    function download() {
        if(confirm("Are you sure you want to download this video to your computer?")){
            console.log('Something happened')
        }
    }
    function deleteVideo() {
      if(confirm("Are you sure you want to delete this video? This action cannot be undone.")){
            console.log('Something happened')
      }
    }
    function reportVideo() {
      if(confirm("Are you sure you want to report this video?")){
            console.log('Something happened')
      }
    }
    async function copyLink() {
      console.log(props.video.video_id)
      videoUrl.value = await getDownloadURL(storageRef(storage, `videos/${props.video.video_id}.mov`))
      .catch((error) => {
          console.error(error)
          return ''
      })
      console.log(videoUrl.value)
    }

    return {
      playVideo,
      getDate,
      menu,
      props,
      download,
      videoUrl,
      deleteVideo,
      reportVideo,
      copyLink,
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
