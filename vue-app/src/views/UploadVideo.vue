<script setup>
// [SFC]
import { ref, onMounted } from "vue";

// [Components]
// import Button from "@/components/utilities/button.vue";
import Form from "@/components/UploadVideo/Form.vue";
import VideoTrimmer from "@/components/UploadVideo/VideoTrimmer.vue";

// [Utils]
import { v4 as uuidv4 } from "uuid";

// [Firebase]
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// [Store]
import store from "@/store/index.js";
import { useUploadVideo } from "@/store/uploadVideo.js";
import { storeToRefs } from "pinia";

const uploadVideoStore = useUploadVideo();
const { getStep, step } = storeToRefs(uploadVideoStore);

const storage = getStorage();
const db = getFirestore();

const canvas = ref();
const context = ref();

const generateThumbnail = () => {
  return new Promise((resolve) => {
    let file = store.state.videoToUpload;
    const video = document.createElement("video");

    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      let thumbWidth = video.videoWidth;
      let thumbHeight = video.videoHeight;

      canvas.value.width = thumbWidth;
      canvas.value.height = thumbHeight;
      video.currentTime = 0;

      video.pause();
      context.value.drawImage(video, 0, 0, thumbWidth, thumbHeight);

      return resolve(canvas.value.toDataURL("image/png"));
    };
  });
};

async function captureThumbnail(uuid) {
  return await generateThumbnail().then(async (dataURL) => {
    const fileRef = storageRef(storage, `videos/${uuid}/${uuid}.png`);
    return await uploadString(fileRef, dataURL, "data_url").then(
      async (snapshot) => {
        return await getDownloadURL(snapshot.ref).then((url) => url);
      }
    );
  });
}

async function uploadVideo(file, uuid, extension) {
  const fileRef = storageRef(storage, `videos/${uuid}/${uuid}.${extension}`);
  return await uploadBytes(fileRef, file);
}

const save = async () => {
  const video_id = uuidv4();
  const extension = store.state.videoToUpload.name.split(".").pop();
  const thumbnail_url = await captureThumbnail(video_id);

  return await uploadVideo(store.state.videoToUpload, video_id, extension).then(
    async () => {
      console.log("Video uploaded!");
      uploadVideoStore.$patch((state) => {
        state.form.thumbnail_url = thumbnail_url;
        state.form.video_id = video_id;
      });

      console.log(uploadVideoStore.getFormData);

      return await addDoc(
        collection(db, "videos", uploadVideoStore.getFormData)
      ).then((filled) => console.log(filled));
    }
  );
};

onMounted(() => {
  /**
   * Canvas for thumb
   */
  canvas.value = document.createElement("canvas");
  context.value = canvas.value.getContext("2d");
});
</script>

<template>
  <div class="d-flex flex-row mx-auto my-2" style="max-width: 700px">
    <v-container>
      <v-row align="center">
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
          </v-row>
        </v-col>
        <v-col>
          <v-progress-linear
            :model-value="getStep"
            :height="10"
            color="primary"
            rounded
          ></v-progress-linear>
        </v-col>
        <v-col cols="1">
          <v-row justify="center">
            <v-col cols="auto">
              <template v-if="getStep == 50">
                <v-btn
                  :disabled="!store.state.videoToUpload"
                  variant="tonal"
                  density="comfortable"
                  icon="fas fa-angle-right"
                  @click="(_$event) => (step = 1)"
                />
              </template>
              <template v-else>
                <v-btn
                  color="primary"
                  variant="tonal"
                  density="comfortable"
                  @click="(_$event) => (step = 1)"
                >
                  Save
                </v-btn>
              </template>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <v-form
    ref="form"
    @submit.prevent="save"
    class="d-flex flex-column mx-auto my-4"
    style="max-width: 700px"
  >
    <div class="mb-6">
      <template v-if="getStep == 50">
        <VideoTrimmer />
      </template>
      <template v-else>
        <Form />
      </template>
    </div>

    <!-- <template v-if="getStep == 100">
      <Button
        @click="
          () => {
            save();
          }
        "
        class="mx-auto mb-2"
        :text="'Save'"
      />
    </template> -->
  </v-form>
</template>
