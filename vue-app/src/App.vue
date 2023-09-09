<script setup>
import videoPlayerModalVue from "@/components/videoPlayerModal.vue";
import Alert from "@/components/Alert.vue";
import accountTypeModalVue from "@/components/accountTypeModal.vue";
import LogOutModalVue from "@/components/LogOutModal.vue";
import contactModal from "@/components/contactModal.vue";
import { computed, ref, watch, onMounted } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useStore } from "vuex";
import { getAuth } from "firebase/auth";
import { useRoute, useRouter } from "vue-router";
import { logOut } from "./services/authentication.service";
import switchUserModalVue from "./components/switchUserModal.vue";
import { getUserAccessibleProfiles } from "@/services/profiles";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const auth = getAuth();
const store = useStore();
const route = useRoute();
const settingsOpen = ref(false);
const router = useRouter();
const chevKey = ref(69420);
const active = ref("feed");
const db = getFirestore();
const videoInput = ref(null);
const videoInputForm = ref(null);

const sideBarRequied = computed(() => {
  return route.meta.sideBar;
});

const blankPage = computed(() => {
  return route.meta.blankPage;
});

watch(
  () => store.state.userProfile,
  (userProfile) => {
    getUserAccessibleProfiles(userProfile);
    if (
      userProfile &&
      (!userProfile.account_access ||
        Object.keys(userProfile.account_access).length == 0)
    ) {
      store.commit("SET_SELECTED_PROFILE", userProfile);
    }
  }
);

store.dispatch("news");
store.dispatch("schedules");

function uploadAVideo() {
  videoInputForm.value.reset();
  videoInput.value.click();
}

function videoInputChange(event) {
  event.preventDefault();
  store.commit("VIDEO_TO_UPLOAD", event.target.files[0]);
  router.push("/upload");
}

function editProfile() {
  active.value = "editProfile";
  router.push({
    path: "/profile/edit",
    query: {
      id: store.state.selectedProfile.id,
    },
  });
}

const logout = async () => {
  store.commit("setSpinner");
  const result = await logOut().then((response) => {
    return response;
  });

  if (result.success) {
    store.commit("setSpinner");
    router.go(0);
  } else {
    store.commit("setSpinner");
    alert(result.error.message);
  }
};

const drawer = true;
const submitting = computed(() => {
  return store.getters.spinner;
});
const currentUser = computed(() => {
  return auth.currentUser;
});
// eslint-disable-next-line no-unused-vars
watch(route, (currentValue, oldValue) => {
  console.log(route.meta.sideBar);
});

onMounted(() => {
  router.isReady().then(() => {
    console.log("we are mounted", route.query.play);
    if (route.query.play && route.query.play.length > 0) {
      getDoc(doc(db, "videos", route.query.play)).then((doc) => {
        const video = {
          ...doc.data(),
          id: doc.id,
        };
        console.log(video);
        store.commit("SET_MODAL_VIDEO", video);
        store.commit("VIDEO_PLAYER_MODAL", true);
      });
    }
  });
});
</script>

<script>
export default {
  name: "App",
};
</script>

<template>
  <div class="blank" v-if="blankPage">
    <router-view />
  </div>
  <v-app v-else id="inspire">
    <Alert />
    <!-- <v-alert v-if="alertShow" dense :type="alertType">
      {{ alertText }}
    </v-alert> -->

    <div class="spinner-wrapper" v-if="submitting">
      <PulseLoader
        class="spinner"
        :loading="submitting"
        color="#ffffff"
      ></PulseLoader>
    </div>

    <v-navigation-drawer v-model="drawer" permanent v-if="sideBarRequied">
      <v-list-item class="title">
        <img
          src="/assets/images/rodeo-text-logo.png"
          width="240"
          style="object-fit: cover"
        />
      </v-list-item>
      <!-- <v-list-item class="title d-flex justify-center">
        <img
          src="/assets/images/rodeo-logo.png"
          height="96"
          style="object-fit: cover"
        />
      </v-list-item> -->

      <v-divider :thickness="0.7" class="main"></v-divider>

      <v-list density="compact" nav class="main">
        <RouterLink to="/feed" class="custom-list-item" active-class="active">
          <img
            :src="require('./assets/icons/glyph/glyphs/house.png')"
            width="20"
            height="20"
            alt=""
          />
          <h4>Feed</h4>
        </RouterLink>

        <RouterLink to="/search" class="custom-list-item" active-class="active">
          <img
            :src="require('./assets/icons/glyph/glyphs/magnifyingglass.png')"
            width="20"
            height="20"
            alt=""
          />
          <h4>Search</h4>
        </RouterLink>

        <RouterLink to="/news" class="custom-list-item" active-class="active">
          <img
            :src="require('./assets/icons/glyph/glyphs/doc.plaintext.png')"
            width="20"
            height="20"
            alt=""
          />
          <h4>News</h4>
        </RouterLink>

        <RouterLink
          to="/schedules"
          class="custom-list-item"
          active-class="active"
        >
          <img
            :src="require('./assets/icons/glyph/glyphs/calendar.png')"
            width="20"
            height="20"
            alt=""
          />
          <h4>Schedule</h4>
        </RouterLink>

        <div
          @click="uploadAVideo"
          :class="[{ active: $route.path == '/upload' }, 'custom-list-item']"
        >
          <img
            :src="require('./assets/icons/glyph/glyphs/arrow.up.circle.png')"
            width="20"
            height="20"
            alt=""
          />
          <h4>Upload Video</h4>
        </div>

        <RouterLink
          to="/notifications"
          class="custom-list-item"
          active-class="active"
        >
          <img
            :src="require('./assets/icons/glyph/glyphs/bell.png')"
            width="20"
            height="20"
            alt=""
          />
          <h4>Notifications</h4>
        </RouterLink>

        <RouterLink
          v-if="$store.state.selectedProfile"
          to="/my-rodeo"
          :class="`custom-list-item ${
            $route.fullPath.includes('animals') ? 'active' : ''
          }`"
          active-class="active"
        >
          <img
            :src="require('./assets/icons/glyph/glyphs/photo.on.rectangle.png')"
            width="20"
            height="20"
            alt=""
          />
          <h4>My Rodeo</h4>
        </RouterLink>
      </v-list>
      <template v-if="currentUser" v-slot:append>
        <div
          :class="settingsOpen ? 'v-openSetting' : 'v-closeSetting'"
          class="settingsWrapper"
        >
          <v-divider class="main"></v-divider>
          <div
            @click="
              settingsOpen = !settingsOpen;
              chevKey++;
            "
            v-ripple
            class="d-flex justify-center py-2 chevron"
            :key="chevKey"
          >
            <v-icon color="#141414">
              {{ settingsOpen ? "fas fa-chevron-down" : "fas fa-chevron-up" }}
            </v-icon>
          </div>

          <v-divider v-if="settingsOpen" class="main"></v-divider>
          <v-list class="main">
            <div
              @click="$store.commit('SWITCH_USER_MODAL', true)"
              class="custom-list-item"
              v-if="$store.state.selectedProfile"
            >
              <v-avatar size="36" class="mr-3">
                <img
                  style="height: 56px; width: auto"
                  :src="$store.state.selectedProfile.photo_url"
                  alt=""
                />
              </v-avatar>
              <h4>
                {{ $store.state.selectedProfile.first_name }}
                {{ $store.state.selectedProfile.last_name }}
              </h4>
            </div>

            <div
              class="custom-list-item"
              :class="active == 'editProfile' ? 'active' : 'inactive'"
              @click="editProfile"
            >
              <!-- <v-icon class="mr-3" small color="black">fas fa-user</v-icon> -->
              <h4>Edit Profile</h4>
            </div>

            <RouterLink
              to="/profile/change-password"
              class="custom-list-item"
              :class="active == 'changePassword' ? 'active' : 'inactive'"
              @click="active = 'changePassword'"
            >
              <h4>Change Password</h4>
            </RouterLink>

            <RouterLink
              to="/profile/grant-access"
              class="custom-list-item"
              :class="active == 'grantAccAccess' ? 'active' : 'inactive'"
              @click="active = 'grantAccAccess'"
            >
              <h4>Grant Account Access</h4>
            </RouterLink>

            <RouterLink
              to="/profile/event"
              class="custom-list-item"
              :class="active == 'upcomingEvent' ? 'active' : 'inactive'"
              @click="active = 'upcomingEvent'"
            >
              <h4>Upcoming Event</h4>
            </RouterLink>

            <div
              class="custom-list-item"
              @click="$store.commit('CHANGE_ACC_TYPE_MODAL', true)"
            >
              <h4>Change Account Type</h4>
            </div>

            <contactModal />

            <div
              class="custom-list-item"
              @click="$store.commit('SWITCH_USER_MODAL', true)"
            >
              <!-- <v-icon class="mr-3" small color="black">fas fa-right-left</v-icon> -->
              <h4>Switch User</h4>
            </div>

            <div
              class="custom-list-item"
              @click="$store.commit('LOGOUT_MODAL', true)"
            >
              <h4>Logout</h4>
            </div>
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>
    <!-- <v-app-bar density="compact" :height="88" v-if="sideBarRequied" dense :elevation="0" :border="true">
      <template v-slot:prepend>
      </template>
    </v-app-bar> -->

    <v-main>
      <router-view />
    </v-main>
    <form ref="videoInputForm" @submit.prevent>
      <input
        @change="videoInputChange"
        type="file"
        accept="video/mp4,video/x-m4v,video/*"
        style="display: none"
        ref="videoInput"
      />
    </form>
    <switchUserModalVue v-if="$store.state.userProfile"></switchUserModalVue>
    <videoPlayerModalVue v-if="$store.state.modalVideo"></videoPlayerModalVue>
    <accountTypeModalVue></accountTypeModalVue>
    <LogOutModalVue @logout="logout" />

    <!-- <v-btn
      @click="scrollToTop"
      v-show="showScroller"
      class="floating-action"
      color="primary"
      icon
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </v-btn> -->
  </v-app>
</template>

<style lang="scss">
@import "theme/variable.scss";

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.floating-action {
  position: fixed;
  bottom: 3vw;
  right: 3vw;
}

.floating-action svg {
  width: 34px;
}

.v-list-item__prepend {
  display: none !important;
}

a {
  text-decoration: none;
}

.v-openSetting {
  transform: translateY(-311px);
}

.v-navigation-drawer__append {
  height: 100px;
}

.v-closeSetting {
  transform: translateY(5px);
}

.settingsWrapper {
  background: #F6F8FA;
  transition: transform 0.5s ease-out;
}

.custom-list-item {
  display: flex;
  align-items: center;
  padding: 10px;
  // margin-bottom: 10px;

  border-bottom: 1px solid #bcb6bc;

  & > img {
    margin-right: 20px;
    border-radius: 5px;
  }

  & > h4 {
    font-size: 12px;
    color: #141414;
    margin: 0;
  }

  &:first-child {
    border-top: 1px solid #bcb6bc;
  }
}

.custom-list-item:hover {
  cursor: pointer;
  background: #c1c1c1;
}

.active {
  background: #c1c1c1;
}

.v-navigation-drawer {
  background: #F6F8FA;
}

.v-list.main {
  background: transparent;
  padding: 0;
  // color: #fff;
}

.v-divider.main {
  color: #fff;
}

.v-list-item.title {
  padding: 6px 8px 0px 8px !important;
}

.v-list-item:not(.title) {
  color: rgb(0, 0, 0);
  font-size: 12px;

  & > .svg-inline--fa {
    font-size: 12px;
  }
}

.v-list-item:not(.profile) {
  padding: 15px;
}

.v-list-item.profile:hover {
  cursor: pointer;
}

.spinner-wrapper {
  height: 100vh;
  width: 100vw;
  position: absolute;
  background: #00000085;
  /* top: 0; */
  z-index: 99999999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rbtn:hover {
  cursor: pointer;
  color: var(--RODEONOW_RED);
}

.multiselect {
  border: none !important;
  border-bottom: 1px solid #000 !important;
}

.multiselect-option {
  font-size: 12px;
}

.multiselect-tag {
  background: var(--RODEONOW_RED) !important;
  font-size: 12px !important;
}

.v-app-bar-title {
  font-size: 30px;
  text-transform: uppercase;
  font-weight: 600;
}

.chevron {
  transition: 0.25s ease-in-out;
}

.chevron:hover {
  background-color: #bcb6bc;
}

.text--disabled {
  color: grey;
}
</style>
