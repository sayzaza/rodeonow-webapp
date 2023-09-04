<script setup>
// [SFC]
import { ref, onMounted } from "vue";

// [Components]
// import Button from "@/components/utilities/button.vue";
import Form from "@/components/UploadVideo/Form.vue";
import VideoTrimmer from "@/components/UploadVideo/VideoTrimmer.vue";

// [Utils]
import { v4 as uuidv4 } from "uuid";
import { useCookies } from "@vueuse/integrations/useCookies";
import axios from "axios";

// [Firebase]
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// [Store & State]
import store from "@/store/index.js";
import { useAlertState } from "@/store/alert";
import { form, formData } from "@/store/uploadVideo/form.js";
import { duration, trims } from "@/store/uploadVideo/trims.js";
import { useStepState } from "@/store/uploadVideo/step.js";
import { useEventState } from "@/store/event.js";
import { handlers } from "@/store/uploadVideo/handlers";

const upcomingEvent = useEventState();

const alertState = useAlertState();
const { setAlert } = alertState;

const stepState = useStepState();
const { step, getStep } = stepState;

const storage = getStorage();
const db = getFirestore();

const maxDuration = 60;
const canvas = ref();
const context = ref();

const toNext = () => {
  if (Number(duration.value) > maxDuration) {
    setAlert(
      "error",
      `Videos must be ${maxDuration} seconds or less. Please trim the existing video or upload a new video.`
    );
  } else {
    stepState.step.value = 1;
  }
};

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

const submitBtn = ref();

function setPresaved() {
  const { title: event, event_date: date, location } = form;
  const { selectedEvent: eventType } = handlers;

  Object.assign(upcomingEvent.value, {
    date,
    event,
    eventType,
    location,
  });
}

async function handleSubmit(e) {
  const cookies = useCookies();
  e.preventDefault();

  Object.assign(form, {
    user_id: store.state.selectedProfile.id,
    user_name: `${store.state.selectedProfile.first_name} ${store.state.selectedProfile.last_name}`,
    account_upload: store.state.selectedProfile.id,
    video_id: uuidv4(),
  });

  const fd = new FormData();

  fd.append("file", store.state.videoToUpload);
  fd.append("endTime", trims.endTime);
  fd.append("startTime", trims.startTime ?? 0);
  fd.append("userData", JSON.stringify(formData.value));

  console.log(store.state.videoToUpload);

  try {
    const { data } = await axios({
      method: "POST",
      url: "http://104.154.94.35",
      headers: {
        Authorization: `Bearer ${cookies.get("firebaseToken")}`,
        "Content-Type": "multipart/form-data",
      },
      data: fd,
    });

    console.log(data.message);
  } catch (error) {
    console.log(error);
  }

  // const extension = store.state.videoToUpload.name.split(".").pop();
  // const thumbnail_url = await captureThumbnail(video_id);

  // await uploadVideo(store.state.videoToUpload, video_id, extension)
  //   .then(async () => {
  //     console.log("Video uploaded!");
  //     Object.assign(form, {
  //       thumbnail_url,
  //       video_id,
  //     });

  //     console.log(formData.value);
  //     setPresaved();

  //     let dbRef = collection(db, "videos");
  //     await addDoc(dbRef, formData.value).then((val) => {
  //       console.log(val);
  //       setAlert("success", `Video and Data has been saved`);
  //     });
  //   })
  //   .catch((error) => {
  //     setAlert(
  //       "error",
  //       `An error occurred in the upload video`
  //       // `An error occurred in the upload video, reference: ${error}`
  //     );
  //     console.log(error);
  //   });
}

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
                  @click="
                    (_$event) => {
                      toNext();
                    }
                  "
                />
              </template>
              <template v-else>
                <v-btn
                  color="primary"
                  density="comfortable"
                  @click="(_$event) => submitBtn.click()"
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
    @submit="handleSubmit"
    class="d-flex flex-column mx-auto my-4"
    style="max-width: 700px"
  >
    <div class="mb-6">
      <div v-show="getStep === 50">
        <VideoTrimmer />
      </div>
      <Form v-if="getStep === 100" />
    </div>
    <button ref="submitBtn" style="display: none" />
  </v-form>
</template>
