<script setup>
import { onMounted, ref } from "vue";
import store from "@/store/index.js";

const TRIM_SERVER_URL = "http://localhost:3000/";
const fileName = ref();
const saveButton = ref();
const intermediateSource = ref();
const filePrompt = ref();
const slicePreview = ref();
const processButton = ref();
const download = ref();
const timeline = ref();
const previewCtx = ref(null);
const timelineCtx = ref(null);

let currentVideoURL = null;
let currentVideoFile = null;

function fileNameChange(e) {
  // display name of files
  filePrompt.value.textContent = fileName.value.value;

  // load files
  if (currentVideoURL !== null) {
    URL.revokeObjectURL(currentVideoURL);
  }

  currentVideoFile = e.target.files[0];
  currentVideoURL = URL.createObjectURL(e.target.files[0]);

  intermediateSource.value.src = currentVideoURL;
}

function loadedData() {
  console.log("data has been loaded!");
  previewCtx.value.width = intermediateSource.value.videoWidth;
  previewCtx.value.height = intermediateSource.value.videoHeight;

  timelineCtx.value.duration = intermediateSource.value.duration;
  timelineCtx.value.startTime = 0;
  timelineCtx.value.endTime = intermediateSource.value.duration;

  previewCtx.value.setTime(0);
  // previewCtx.value.renderFrame(intermediateSource.value, slicePreview.value);

  if (previewCtx.value.width > previewCtx.value.height) {
    previewCtx.value.landscape = true;
  }
  // timelineCtx.value.handleClick(0, 0);
}

onMounted(() => {
  try {
  filePrompt.value.textContent = store.state.videoToUpload.name;

  // load files
  if (currentVideoURL !== null) {
    URL.revokeObjectURL(currentVideoURL);
  }

    currentVideoFile = store.state.videoToUpload;
  currentVideoURL = URL.createObjectURL(store.state.videoToUpload);

  intermediateSource.value.src = currentVideoURL;
  } catch (error) {
    console.error(error)  
  }

  previewCtx.value = {
    width: null,
    height: null,
    time: null,

    setTime(time) {
      this.time = time;
    },

    getTargetSlice() {
      console.log("getting target slice");
      if (this.width > this.height) {
        let width = 800;
        let height = (800 / this.width) * this.height;

        return {
          x: 0,
          y: 300 - height / 2,
          width,
          height,
        };
      } else {
        let width = (600 / this.height) * this.width;
        let height = 600;
        return {
          x: 400 - width / 2,
          y: 0,
          width,
          height,
        };
      }
    },

    renderFrame(source, canvas) {
      source.currentTime = this.time;
      let { x, y, width, height } = this.getTargetSlice();
      console.table({ x, y, width, height });
      canvas.getContext("2d").clearRect(0, 0, 800, 600);
      canvas.getContext("2d").drawImage(source, x, y, width, height);
    },
  };

  timelineCtx.value = {
    element: timeline.value,
    duration: null,
    startTime: null,
    endTime: null,

    handleClick(x, y) {
      if (this.duration === null) return;

      const seekTime = this.duration * (x / 600);

      if (y < 40) {
        this.startTime = Math.min(seekTime, this.endTime);
        previewCtx.value.setTime(this.startTime);
      } else if (y >= 40) {
        this.endTime = Math.max(seekTime, this.startTime);
        previewCtx.value.setTime(this.endTime);
      }

      previewCtx.value.renderFrame(intermediateSource.value, slicePreview.value);

      this.render();
    },

    render() {
      let ctx = timeline.value.getContext("2d");

      ctx.clearRect(0, 0, 600, 80);

      ctx.fillStyle = "#00f880";
      ctx.fillRect(this.startTime * (600 / this.duration), 0, 3, 40);

      ctx.fillStyle = "#ee0572";
      ctx.fillRect(this.endTime * (600 / this.duration), 40, 3, 40);

      ctx.fillStyle = "#fff4e4";
      ctx.fillRect(0, 39, 600, 4);

      ctx.fillStyle = "#fff";
      ctx.font = "15px monospace";
      ctx.fillText("Start", this.startTime * (600 / this.duration) + 5, 25);
      ctx.fillText("End", this.endTime * (600 / this.duration) + 5, 65);
    },
  };

  let cooldown = true;
  setInterval(() => (cooldown = true), 250);

  timelineCtx.value.element.addEventListener("mousemove", (e) => {
    if (!cooldown || e.buttons === 0) return;

    cooldown = false;
    let { left, top } = timelineCtx.value.element.getBoundingClientRect();
    timelineCtx.value.handleClick(e.clientX - left, e.clientY - top);
  });

  timelineCtx.value.element.addEventListener("click", (e) => {
    let { left, top } = timelineCtx.value.element.getBoundingClientRect();
    timelineCtx.value.handleClick(e.clientX - left, e.clientY - top);
  });

  intermediateSource.value.addEventListener("loadeddata", () => loadedData);

  const regex = /(^[^\\/:"|?*]+?)\.\w+$/i;

  processButton.value.addEventListener("click", () => {
    if (currentVideoFile === null) return;

    if (currentVideoFile.size > 536870912) {
      alert("Video file is too large. Max size is 512MB");
      return;
    }

    let formData = new FormData();

    formData.append("file", currentVideoFile);

    formData.append("start", timelineCtx.value.startTime);
    formData.append("end", timelineCtx.value.endTime);

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
  });
});
</script>

<template>
  <div class="d-flex align-center">
    <video
      @loadeddata="loadedData"
      id="intermediateSource"
      ref="intermediateSource"
      muted="true"
    ></video>
    <div
      style="display: flex; flex-direction: column; width: 100%; margin-bottom: 50px"
      class="align-center"
      id="video_app"
    >
      <canvas ref="slicePreview" id="slicePreview" width="800" height="600"></canvas>
      <canvas width="600" id="timeline" height="80" ref="timeline"></canvas>

      <label for="fileName" id="filePrompt" ref="filePrompt" title="Select New File">
        Select Your Video File</label
      >
      <input
        type="file"
        id="fileName"
        ref="fileName"
        accept="video/*"
        @change="fileNameChange"
      />

      <div editor>
        <button id="processButton" ref="processButton">Re-process Video</button>
        <a ref="download" id="download" class="unavailable">Download</a>
      </div>
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

#video_app {
  align-items: center;
}

video#intermediateSource {
  display: none;
}

canvas#intermediateTarget {
  display: none;
}

#slicePreview {
  background-color: #141313;

  border: 1px double #2d2a2a;
  border-radius: 5px;

  width: 800px;
  height: 600px;
}

#timeline {
  width: 600px;
  height: 80px;
  margin: 0.4rem;
  padding: 0;

  background-color: #141313;
}

#fileName {
  display: none;
}

label[for="fileName"] {
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
}

div[editor] {
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
}

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
