<script setup>
import {
  ref,
  computed,
  onMounted,
  watch,
  onBeforeUnmount,
  toRefs,
  nextTick,
} from "vue";

const Handles = Object.freeze({
  START_HANDLE: "START_HANDLE",
  END_HANDLE: "END_HANDLE",
  TIME_HANDLE: "TIME_HANDLE",
});

// eslint-disable-next-line no-undef
const emit = defineEmits([
  "trim-start",
  "trim-end",
  "current-time",
  "handle-mouse",
]);
// eslint-disable-next-line no-undef
const props = defineProps({
  frames: {
    type: Array,
    required: true,
  },
  currentTime: {
    type: Number,
    default: 0,
  },
  videoDuration: {
    type: Number,
    required: true,
  },
  defaultTrim: {
    type: Object,
    default: null,
  },
  minTrimDuration: {
    type: Number,
    default: 1,
  },
  maxTrimDuration: {
    type: Number,
    default: 60,
  },
});

const sliderCanvas = ref();

const startHandlePos = ref(0);
const endHandlePos = ref(700);
const timeHandlePos = ref(0);
const canvasWidth = ref(700);
const canvasHeight = ref(54);
const frameWidth = ref(58);
const handleWidth = ref(14);

const trimStart = ref(0);
const trimEnd = ref(0);

const framesCanvas = ref(null);
const canvasContext = ref(null);
const selectedElement = ref(null);

const durationPositionRatio = computed(
  () => props.videoDuration / canvasWidth.value
);
const positionDurationRatio = computed(
  () => canvasWidth.value / props.videoDuration
);

const {
  frames,
  videoDuration,
  maxTrimDuration,
  defaultTrim,
  currentTime,
  minTrimDuration,
} = toRefs(props);

function setCanvasWidth() {
  canvasWidth.value = sliderCanvas.value.offsetWidth;
  frameWidth.value =
    (canvasWidth.value - handleWidth.value * 2) / frames.value.length;
}

function handleDurationChange() {
  if (videoDuration.value > maxTrimDuration.value) {
    endHandlePos.value = maxTrimDuration.value * positionDurationRatio.value;

    trimEnd.value = maxTrimDuration.value;
    emit("trim-end", trimEnd.value);
  } else {
    endHandlePos.value = canvasWidth.value;
    trimEnd.value =
      videoDuration.value || (defaultTrim.value && defaultTrim.value.end);
    emit("trim-end", trimEnd.value);
  }
}

function updateHandles(mouseX) {
  // Move the closest handle to the mouse
  if (selectedElement.value === Handles.START_HANDLE) {
    const currentVideoDuration =
      durationPositionRatio.value * (endHandlePos.value - mouseX);
    if (
      currentVideoDuration < minTrimDuration.value ||
      currentVideoDuration > maxTrimDuration.value
    ) {
      return;
    }
    startHandlePos.value = mouseX;
    trimStart.value =
      durationPositionRatio.value * mouseX > 0
        ? durationPositionRatio.value * mouseX
        : 0;
    emit("trim-start", trimStart.value);
  } else if (selectedElement.value === Handles.END_HANDLE) {
    const currentVideoDuration =
      durationPositionRatio.value * (mouseX - startHandlePos.value);
    if (
      currentVideoDuration < minTrimDuration.value ||
      currentVideoDuration > maxTrimDuration.value
    ) {
      return;
    }
    endHandlePos.value = mouseX;
    trimEnd.value =
      durationPositionRatio.value * mouseX <= videoDuration.value
        ? durationPositionRatio.value * mouseX
        : videoDuration.value;

    emit("trim-end", trimEnd.value);
  } else if (selectedElement.value === Handles.TIME_HANDLE) {
    timeHandlePos.value = mouseX;
    const currentTime = durationPositionRatio.value * mouseX;
    emit("current-time", currentTime);
  }

  // Make sure the handles stay within the slider track
  if (startHandlePos.value < 0) {
    startHandlePos.value = 0;
  }
  if (endHandlePos.value > canvasWidth.value) {
    endHandlePos.value = canvasWidth.value;
  }
  if (startHandlePos.value > endHandlePos.value) {
    startHandlePos.value = endHandlePos.value;
  }

  // Redraw the slider using requestAnimationFrame
  requestAnimationFrame(() => {
    drawSlider();
  });
}

function updateGlobalCompositeOperation() {
  // Set the global composite operation to draw the black filter over the non-intersecting areas
  canvasContext.value.globalCompositeOperation = "source-over";
  canvasContext.value.fillStyle = "rgba(23, 23, 23, 0.7)";
  canvasContext.value.fillRect(
    0,
    0,
    startHandlePos.value + handleWidth.value,
    framesCanvas.value.height
  );
  canvasContext.value.fillRect(
    endHandlePos.value,
    0,
    canvasWidth.value - endHandlePos.value,
    framesCanvas.value.height
  );
}

function handleMouseDown(event) {
  const mouseX = event.offsetX;

  // Calculate the distance between the mouse and each handle
  const distStartHandlePos = Math.abs(mouseX - startHandlePos.value);
  const distEndHandlePos = Math.abs(mouseX - endHandlePos.value);
  const distTimeHandlePos = Math.abs(mouseX - timeHandlePos.value);

  // Set selected element to the closest handle to the mouse
  if (distStartHandlePos < handleWidth.value * 2) {
    selectedElement.value = Handles.START_HANDLE;
    emit("handle-mouse", true);
  } else if (distEndHandlePos < handleWidth.value * 2) {
    selectedElement.value = Handles.END_HANDLE;
    emit("handle-mouse", true);
  } else if (distTimeHandlePos < handleWidth.value * 2) {
    selectedElement.value = Handles.TIME_HANDLE;
  }
  updateHandles(mouseX);
}
function handleMouseMove(event) {
  if (selectedElement.value) {
    if (event.buttons === 1) {
      updateHandles(event.offsetX);
    }
  }
}
function handleMouseUp() {
  if (selectedElement.value != Handles.TIME_HANDLE) {
    emit("handle-mouse", false);
  }
  selectedElement.value = null;
}

async function drawFrames() {
  framesCanvas.value = document.createElement("canvas");
  framesCanvas.value.width = canvasWidth.value;
  framesCanvas.value.height = canvasHeight.value;

  framesCanvas.value.fillStyle = "#000000";

  await Promise.all(
    frames.value.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
      });
    })
  ).then((frames) => {
    let x = handleWidth.value;
    frames.forEach((img) => {
      // Finding the new width and height based on the scale factor
      let newWidth = frameWidth.value;
      let newHeight = (frameWidth.value * img.height) / img.width;

      let y = canvasHeight.value / 2 - newHeight / 2;

      framesCanvas.value
        .getContext("2d")
        .drawImage(img, x, y, newWidth, newHeight);
      x += frameWidth.value;
    });
  });
}

async function drawSlider() {
  // Clear the canvas
  canvasContext.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

  // Draw the offscreen canvas onto the main canvas
  canvasContext.value.drawImage(framesCanvas.value, 0, 0);

  // Add a black filter over the non-intersecting areas
  updateGlobalCompositeOperation();

  const handleProps = {
    bg: "#dc2626",
    currentTime: "#fca5a5",
    symbol: "#f87171",
    borderRadius: 8,
  };

  // Draw handle current time
  canvasContext.value.fillStyle = handleProps.currentTime;
  canvasContext.value.fillRect(
    timeHandlePos.value,
    0,
    handleWidth.value / 3,
    framesCanvas.value.height
  );

  // Draw handle 1
  canvasContext.value.fillStyle = handleProps.bg;
  canvasContext.value.beginPath();
  canvasContext.value.roundRect(
    startHandlePos.value,
    0,
    handleWidth.value,
    framesCanvas.value.height,
    [handleProps.borderRadius, 0, 0, handleProps.borderRadius]
  );
  canvasContext.value.fill();

  // Draw line 1 in the middle of the rectangle
  canvasContext.value.fillStyle = handleProps.symbol;
  canvasContext.value.fillRect(
    startHandlePos.value + handleWidth.value / 2,
    framesCanvas.value.height / 4,
    2,
    framesCanvas.value.height / 2
  );

  // Draw handle 2
  canvasContext.value.fillStyle = handleProps.bg;
  canvasContext.value.beginPath();
  canvasContext.value.roundRect(
    endHandlePos.value - handleWidth.value,
    0,
    handleWidth.value,
    framesCanvas.value.height,
    [0, handleProps.borderRadius, handleProps.borderRadius, 0]
  );
  canvasContext.value.fill();

  // Draw line 2 in the middle of the rectangle
  canvasContext.value.fillStyle = handleProps.symbol;
  canvasContext.value.fillRect(
    endHandlePos.value - handleWidth.value / 2,
    framesCanvas.value.height / 4,
    2,
    framesCanvas.value.height / 2
  );
}

async function onWindowResize() {
  setCanvasWidth();
  handleDurationChange();

  if (!sliderCanvas.value) return;
  else {
    canvasContext.value = sliderCanvas.value.getContext("2d");
  }

  // Set the canvas width and height
  sliderCanvas.value.width = canvasWidth.value;
  sliderCanvas.value.height = canvasHeight.value;

  await nextTick();

  // Calculate the new handle positions based on the current trim duration
  const durationPositionRatio = videoDuration.value / canvasWidth.value;

  startHandlePos.value = trimStart.value / durationPositionRatio;
  endHandlePos.value = trimEnd.value / durationPositionRatio;
  timeHandlePos.value = currentTime.value / durationPositionRatio;

  drawFrames().then(() => {
    sliderCanvas.value.getContext("2d").drawImage(framesCanvas.value, 0, 0);
    drawSlider();
  });
}

onMounted(() => {
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("mousemove", handleMouseMove);

  timeHandlePos.value = currentTime.value * positionDurationRatio.value;
  setCanvasWidth();
  handleDurationChange();

  // Get the canvas element and its context
  canvasContext.value = sliderCanvas.value.getContext("2d");

  // Set the canvas width and height
  sliderCanvas.value.width = sliderCanvas.value.offsetWidth;
  sliderCanvas.value.height = canvasHeight.value;

  // Draw the frames
  drawFrames().then(() => {
    // Draw the offscreen canvas onto the main canvas
    canvasContext.value.drawImage(framesCanvas.value, 0, 0);

    // Draw the initial slider
    drawSlider();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener("mousemove", handleMouseMove);
});

watch(frames, () => {
  setCanvasWidth();
});

// eslint-disable-next-line no-unused-vars
watch(currentTime, (newValue, _oldValue) => {
  timeHandlePos.value = newValue * positionDurationRatio.value;
  drawSlider();
});

// eslint-disable-next-line no-unused-vars
watch(defaultTrim, (newValue, _oldValue) => {
  const { start, end } = newValue;

  trimStart.value = start;
  startHandlePos.value = start * positionDurationRatio.value;

  trimEnd.value = end;
  endHandlePos.value = end * positionDurationRatio.value;
});
</script>

<template>
  <div style="width: 100%">
    <canvas
      ref="sliderCanvas"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      style="user-select: none"
    />
  </div>
</template>

<style scoped lang="scss">
canvas {
  // border: 1px solid #3cff00;
  // border-left: 1px solid #fff;
  // border-right: 1px solid #fff;
  border-radius: 8px;
  // filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  background: #dc2626;
  width: 100%;
}
.second-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  &--bold {
    background: #6e7787;
  }
  &--light {
    background: #afbbca;
  }
}
</style>
