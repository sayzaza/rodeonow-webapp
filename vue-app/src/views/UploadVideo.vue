<script setup>
// [SFC]
import { ref, onMounted } from "vue";

// [Components]
import Form from "@/components/UploadVideo/Form.vue";
import VideoTrimmer from "@/components/UploadVideo/VideoTrimmer.vue";

// [Utils]
import { v4 as uuidv4 } from "uuid";
import { useCookies } from "@vueuse/integrations/useCookies";
import axios from "axios";

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

const maxDuration = 60;

const valid = ref(false);
const uploading = ref(false);
const uploadingProgress = ref(0);

const toNext = () => {
  // if (Number(duration.value) > maxDuration) {
  //   setAlert(
  //     "error",
  //     `Videos must be ${maxDuration} seconds or less. Please trim the existing video or upload a new video.`
  //   );
  // } else {
  stepState.step.value = 1;
  // }
};

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
  e.preventDefault();

  if (!valid.value) {
    setAlert(
      "error",
      "Please fill out the required fields.",
      "Validation Error"
    );
    return;
  }

  uploading.value = true;
  const cookies = useCookies();

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
      onUploadProgress: (progressEvent) => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        uploadingProgress.value = percentCompleted;
      },
    });

    setPresaved();

    console.log(data.message);
  } catch (error) {
    if (error.response) {
      const { data } = error.response;

      if (data.code) {
        if (data.code == 3) {
          setAlert(
            "error",
            "Videos must be 60 seconds or less. Please trim your video or upload a different video..",
            "Error on upload"
          );
        }
      }
    }
  } finally {
    uploading.value = false;
    uploadingProgress.value = 0;
  }
}
</script>

<template>
  <v-overlay
    scrim="#0c0a09"
    class="align-center justify-center"
    v-model="uploading"
  >
    <v-row class="fill-height" align-content="center" justify="center">
      <v-col class="text-subtitle-1 text-center text-white" cols="12">
        Uploading video...
      </v-col>
      <v-col cols="24">
        <v-progress-linear
          color="primary"
          v-model="uploadingProgress"
          rounded
          :height="5"
        ></v-progress-linear>
      </v-col>
    </v-row>
  </v-overlay>
  <div class="mx-auto" style="max-width: 700px">
    <div class="d-flex flex-row mx-auto my-2">
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
      v-model="valid"
      @submit="handleSubmit"
      class="d-flex flex-column mx-auto my-4"
    >
      <div class="mb-6">
        <div v-show="getStep === 50">
          <VideoTrimmer />
        </div>
        <Form v-if="getStep === 100" />
      </div>
      <button ref="submitBtn" style="display: none" />
    </v-form>
  </div>
</template>
