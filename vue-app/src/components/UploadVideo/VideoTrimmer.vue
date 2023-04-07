<script setup>
// eslint-disable-next-line no-unused-vars
import { onMounted, ref, reactive, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import VideoTrimmerSkeleton from "@/components/UploadVideo/VideoTrimmerSkeleton.vue";
import trimmer from "@/components/trimmer.vue";
import store from "@/store/index.js";
import { trims, resetTrims } from "@/store/uploadVideo/trims.js";

const TRIM_SERVER_URL = "http://localhost:3000/";

// Input & File Handler
const fileName = ref();
const filePrompt = ref();
const download = ref();

// Video Player
const videoSource = ref();
const preview = ref();

// Slider
const frames = ref([]);
const canvas = ref(null);
const context = ref(null);
const numFrames = ref(12);

const videoData = reactive({
  duration: null,
  currentTime: null,
});

let currentVideoURL = null;
let currentVideoFile = null;

const trimmerKey = ref(0);
const trimmerTarget = ref();
const trimmerVisible = ref(false);

useIntersectionObserver(
  trimmerTarget,
  // eslint-disable-next-line no-unused-vars
  ([{ isIntersecting }], observerElement) => {
    trimmerVisible.value = isIntersecting;
  }
);

const controls = {
  pause() {
    if (preview.value) {
      preview.value.pause();
      preview.value.muted = true;
    }
  },
  play() {
    if (preview.value) {
      preview.value.play();
      preview.value.muted = false;
    }
  },
};

watch(trimmerVisible, (new_v, old_v) => {
  if (new_v === true && old_v === false) {
    trimmerKey.value++;
  }
  if (trimmerVisible.value) {
    controls.play();
  } else {
    controls.pause();
  }
});

const setLabel = (value) => {
  if (filePrompt.value) {
    filePrompt.value.textContent = value;
  }
};

function extractFrames() {
  if (!videoSource.value) return;
  // Create a new video element
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.volume = 0;
  video.src = videoSource.value.src;
  video.play();
  // Clear frames
  frames.value = [];

  // Handle the 'durationchange' event
  const handleDurationChange = () => {
    const duration = video.duration;
    const interval = duration / numFrames.value;
    let currentTime = 0;
    // const frames = [];

    // Create a canvas element to draw the frames on
    const actualVideoHeight = video.videoHeight;
    const actualVideoWidth = video.videoWidth;
    const thumbnailWidth = 200;
    const thumbnailHeight =
      (thumbnailWidth / actualVideoWidth) * actualVideoHeight;
    canvas.value.width = thumbnailWidth;
    canvas.value.height = thumbnailHeight;

    // Extract frames from the video
    const extractFrame = () => {
      if (currentTime > duration || frames.value.length === numFrames.value) {
        // Set the frames in the store
        // console.log(frames.value);
        video.currentTime = 0;
        return;
      }
      currentTime += interval;
      video.currentTime = currentTime;
      context.value.drawImage(video, 0, 0, thumbnailWidth, thumbnailHeight);
      const dataUrl = canvas.value.toDataURL();
      frames.value.push(dataUrl);
      video.requestVideoFrameCallback(extractFrame);
    };
    video.requestVideoFrameCallback(extractFrame);
    video.currentTime = 0;
  };

  video.addEventListener("durationchange", handleDurationChange);
}

function loadNewVideo(video) {
  // display label
  setLabel("Change Your Video File");

  // load files
  if (currentVideoURL !== null) {
    URL.revokeObjectURL(currentVideoURL);
  }

  currentVideoFile = video;
  currentVideoURL = URL.createObjectURL(video);

  videoSource.value.src = currentVideoURL;
  extractFrames();
}

function fileNameChange(e) {
  store.commit("VIDEO_TO_UPLOAD", e.target.files[0]);
  // console.log(frames.value);
}

function loadedData() {
  console.log("data has been loaded!");
  videoData.duration = videoSource.value.duration;
}

watch(
  () => store.state.videoToUpload,
  (newV, oldV) => {
    if (store.state.videoToUpload != null) {
      loadNewVideo(store.state.videoToUpload);
    }
    if (newV != null && newV != oldV) {
      resetTrims();
    }
  }
);

onMounted(() => {
  /**
   * Canvas
   */
  canvas.value = document.createElement("canvas");
  context.value = canvas.value.getContext("2d");

  if (store.state.videoToUpload != null) {
    try {
      loadNewVideo(store.state.videoToUpload);
    } catch (error) {
      console.error(error);
    }
  }
});

// eslint-disable-next-line no-unused-vars
const handleProcess = () => {
  const regex = /(^[^\\/:"|?*]+?)\.\w+$/i;

  if (currentVideoFile === null) return;

  if (currentVideoFile.size > 536870912) {
    alert("Video file is too large. Max size is 512MB");
    return;
  }

  let formData = new FormData();

  formData.append("file", currentVideoFile);

  formData.append("start", trims.startTime);
  formData.append("end", trims.endTime);

  if (download.value.href) URL.revokeObjectURL(download.value.href);
  download.value.classList.add("unavailable");
  download.value.removeAttribute("download");
  download.value.textContent = "Processing";

  fetch(TRIM_SERVER_URL, {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        res.text().then((text) => {
          console.error(text);
          download.value.textContent = "Error";
        });
      }

      return res.blob();
    })
    .then((data) => {
      download.value.value.href = URL.createObjectURL(data);
      download.value.value.setAttribute(
        "download",
        currentVideoFile.name.replace(regex, "$1-trimmed.webm")
      );
      download.value.value.classList.remove("unavailable");
      download.value.value.textContent = "Download";
    });
};

// const sourceTrimmed = computed(() => {
//   let start_time = Number(trims.startTime).toFixed(1);
//   let end_time = Number(trims.endTime).toFixed(1);
//   return `${videoSource.value.src}#t=${start_time},${end_time}`;
// });

const putTime = (e) => {
  if (preview.value) {
    preview.value.currentTime = e;
  }
};

const replayVideo = () => {
  if (preview.value) {
    preview.value.pause();
    preview.value.currentTime = trims.startTime != null ? trims.startTime : 0;

    preview.value.play();
  }
};

watch(videoData, () => {
  // console.log(videoData.currentTime);
  if (videoData.currentTime != null) {
    if (trims.endTime != null) {
      if (preview.value) {
        let a = videoData.currentTime;
        let b = trims.endTime;
        let diff = Math.abs(a - b);
        if (
          diff < 0.05 ||
          diff < 0.075 ||
          diff < 0.1 ||
          diff < 0.125 ||
          diff < 0.15 ||
          diff < 0.175 ||
          diff < 0.2
        ) {
          preview.value.pause();
          // replayVideo();
        }
      }
    }
  }
});
</script>

<template>
  <div ref="trimmerTarget" class="d-flex align-center">
    <video
      style="display: none"
      @loadeddata="loadedData"
      id="videoSource"
      ref="videoSource"
      muted
    ></video>
    <div
      class="mb-8"
      style="display: flex; flex-direction: column; width: 100%"
      id="video_app"
    >
      <template v-if="videoSource">
        <template v-if="videoSource.src && frames.length >= 12">
          <div
            class="mb-4"
            style="
              width: 700px;
              height: 100%;
              background: black;
              border-radius: 8px;
            "
          >
            <div style="display: flex; justify-content: center; height: 100%">
              <video
                ref="preview"
                :src="videoSource.src"
                @play.prevent="
                  () => {
                    if (trims.startTime != null) {
                      preview.currentTime = trims.startTime;
                    } else {
                      preview.currentTime = 0;
                    }
                  }
                "
                @timeupdate="
                  (_$event) =>
                    (videoData.currentTime = preview && preview.currentTime)
                "
                :autoplay="trimmerVisible ? true : false"
                controlslist="nodownload noplaybackrate"
                controls
                disablepictureinpicture
              />
            </div>
          </div>
        </template>
        <template v-else>
          <VideoTrimmerSkeleton />
        </template>
      </template>

      <trimmer
        v-if="frames.length >= 12"
        :key="trimmerKey"
        :videoDuration="videoData.duration"
        :frames="frames"
        :defaultTrim="
          trims.startTime != null || trims.endTime != null
            ? {
                start: trims.startTime,
                end: trims.endTime,
              }
            : null
        "
        :currentTime="videoData.currentTime"
        @handleMouse="
          ($event) => {
            if (!$event) {
              replayVideo();
            }
          }
        "
        @currentTime="($event) => putTime($event)"
        @trimStart="
          ($event) => {
            trims.startTime = $event;
          }
        "
        @trimEnd="
          ($event) => {
            trims.endTime = $event;
          }
        "
      />

      <div class="d-flex mt-4">
        <v-row justify="center">
          <v-col cols="auto">
            <v-btn @click="() => fileName.click()" variant="tonal">
              <span ref="filePrompt" class="mx-4">
                Select Your Video File
              </span>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <input
        style="display: none"
        type="file"
        id="fileName"
        ref="fileName"
        accept="video/*"
        @change="fileNameChange"
      />
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  user-select: none;
}

html,
body {
  width: 100vw;
  height: 100vh;
}

body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: #fff4e4;
}

video::-webkit-media-controls-timeline {
  display: none;
}

video::-webkit-media-controls-volume {
  display: none;
}

/* #video_app {
  align-items: center;
} */

/* #slicePreview {
  background-color: #141313;

  border: 1px double #2d2a2a;
  border-radius: 5px;

  width: 700px;
  height: 600px;
}

#timeline {
  width: 700px;
  height: 80px;
  margin: 0.4rem;
  border-radius: 5px;
  padding: 0;

  background-color: #141313;
} */

/* label[for="fileName"] {
  min-width: 20rem;
  height: 2rem;
  margin: 0.25rem;
  padding: 0.75rem;
  cursor: pointer;

  text-align: center;
  text-overflow: clip;

  border: 2px;
  border-radius: 5px;

  background-color: black;
  color: white;

  user-select: contain;
  font-size: large;
  font-family: monospace;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  transition: 5ms ease-in;
}

label[for="fileName"]:hover {
  background-color: white;
  color: black;

  font-style: italic;
  outline: 2px solid black;
} */

/* div[editor] {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
}

div[editor] > button {
  cursor: pointer;
  width: 30rem;
  height: 2rem;
  margin: 0.25rem;
  padding: 1.8rem;

  outline: 0.5px solid black;
  border: none;
  background-color: #f6bfbf;
  border-radius: 5px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 250ms ease-in;
}

div[editor] > button.loading {
  cursor: wait;
  filter: blur(0.2rem);
} */

#download {
  width: 30rem;
  height: 2rem;
  margin: 0.25rem;
  padding: 0.75rem;

  border-radius: 5px;

  background-color: rgb(36, 238, 0);
  color: #000000;

  font-size: large;
  font-family: monospace;
  text-decoration: none;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 5ms ease-in;
}

#download.unavailable {
  background-color: #afaeae;
  color: white;

  font-style: italic;
  border: 1px dotted rgb(255, 255, 255);
}

a[title] {
  color: #000;
  font-family: sans-serif;
  padding: 2rem;
}
</style>
