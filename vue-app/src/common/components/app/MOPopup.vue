<template>
  <div class="popup">
    <div
      v-for="popup in $moPopup.MOPopupsToShow"
      :key="popup.id"
      class="popup__inner"
      :style="{ backgroundColor: popup.bgColor }"
    >
      <div class="popup__content" :style="{ color: popup.textColor }">
        <!-- warn -->
        <svg
          v-if="popup.type === 'warn'"
          class="popup__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 486.463 486.463"
        >
          <path
            d="M243.225 333.382c-13.6 0-25 11.4-25 25s11.4 25 25 25c13.1 0 25-11.4 24.4-24.4.6-14.3-10.7-25.6-24.4-25.6z"
          />
          <path
            d="M474.625 421.982c15.7-27.1 15.8-59.4.2-86.4l-156.6-271.2c-15.5-27.3-43.5-43.5-74.9-43.5s-59.4 16.3-74.9 43.4l-156.8 271.5c-15.6 27.3-15.5 59.8.3 86.9 15.6 26.8 43.5 42.9 74.7 42.9h312.8c31.3 0 59.4-16.3 75.2-43.6zm-34-19.6c-8.7 15-24.1 23.9-41.3 23.9h-312.8c-17 0-32.3-8.7-40.8-23.4-8.6-14.9-8.7-32.7-.1-47.7l156.8-271.4c8.5-14.9 23.7-23.7 40.9-23.7 17.1 0 32.4 8.9 40.9 23.8l156.7 271.4c8.4 14.6 8.3 32.2-.3 47.1z"
          />
          <path
            d="M237.025 157.882c-11.9 3.4-19.3 14.2-19.3 27.3.6 7.9 1.1 15.9 1.7 23.8 1.7 30.1 3.4 59.6 5.1 89.7.6 10.2 8.5 17.6 18.7 17.6s18.2-7.9 18.7-18.2c0-6.2 0-11.9.6-18.2 1.1-19.3 2.3-38.6 3.4-57.9.6-12.5 1.7-25 2.3-37.5 0-4.5-.6-8.5-2.3-12.5-5.1-11.2-17-16.9-28.9-14.1z"
          />
        </svg>

        <!-- info -->
        <svg
          v-if="popup.type === 'info'"
          class="popup__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 330 330"
        >
          <path
            d="M165 0C74.019 0 0 74.02 0 165.001 0 255.982 74.019 330 165 330s165-74.018 165-164.999S255.981 0 165 0zm0 300c-74.44 0-135-60.56-135-134.999S90.56 30 165 30s135 60.562 135 135.001C300 239.44 239.439 300 165 300z"
          />
          <path
            d="M164.998 70c-11.026 0-19.996 8.976-19.996 20.009 0 11.023 8.97 19.991 19.996 19.991 11.026 0 19.996-8.968 19.996-19.991 0-11.033-8.97-20.009-19.996-20.009zM165 140c-8.284 0-15 6.716-15 15v90c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15v-90c0-8.284-6.716-15-15-15z"
          />
        </svg>

        <!-- success -->
        <svg
          v-if="popup.type === 'success'"
          class="popup__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            d="M256 0C114.833 0 0 114.833 0 256s114.833 256 256 256 256-114.853 256-256S397.167 0 256 0zm0 472.341c-119.275 0-216.341-97.046-216.341-216.341S136.725 39.659 256 39.659c119.295 0 216.341 97.046 216.341 216.341S375.275 472.341 256 472.341z"
          />
          <path
            d="M373.451 166.965c-8.071-7.337-20.623-6.762-27.999 1.348L224.491 301.509 166.053 242.1c-7.714-7.813-20.246-7.932-28.039-.238-7.813 7.674-7.932 20.226-.238 28.039l73.151 74.361a19.804 19.804 0 0014.138 5.929c.119 0 .258 0 .377.02a19.842 19.842 0 0014.297-6.504l135.059-148.722c7.358-8.131 6.763-20.663-1.347-28.02z"
          />
        </svg>
        <p class="popup__text">
          {{ popup.messageText }}
        </p>
      </div>

      <button class="popup-close" @click="$moPopup.hideMOPopup(popup.id)">
        <svg
          class="popup__icon popup-close__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 241.171 241.171"
        >
          <path
            d="M138.138 120.754l99.118-98.576a11.931 11.931 0 000-17.011c-4.74-4.704-12.439-4.704-17.179 0l-99.033 98.492-99.949-99.96c-4.74-4.752-12.439-4.752-17.179 0-4.74 4.764-4.74 12.475 0 17.227l99.876 99.888L3.555 220.497c-4.74 4.704-4.74 12.319 0 17.011 4.74 4.704 12.439 4.704 17.179 0l100.152-99.599 99.551 99.563c4.74 4.752 12.439 4.752 17.179 0 4.74-4.764 4.74-12.475 0-17.227l-99.478-99.491z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: "MOPopup",
  computed: {
    allPopups() {
      return this.MOPopupsToShow;
    },
  },
};
</script>

<style scoped>
.popup {
/* you can fix position when you want here */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-left: 160px;
  margin-top: 52px;
}

.popup__inner {
  background: red;

  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  padding: 15px 20px;
  box-shadow: 0px 3px 7px -1px rgba(0,0,0,0.35);
}

.popup__inner + .popup__inner {
  margin-top: 4px;
}

.popup__content {
  padding-right: 16px;
  display: flex;
  align-items: center;
}

.popup__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-right: 16px;
  fill: #ffffff;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 1));
}

.popup__text {
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  margin: 0;
}

.popup-close {
  display: flex;
  flex-shrink: 0;
  padding: 0;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
  background: none;
}

.popup-close__icon {
  margin: auto;
  width: 15px;
  height: 15px;
}
</style>
