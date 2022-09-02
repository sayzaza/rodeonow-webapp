<template>
  <v-app id="inspire">
    <v-alert v-if="alertShow" dense :type="alertType">
      {{ alertText }}
    </v-alert>

    <div class="spinner-wrapper" v-if="submitting">
      <PulseLoader class="spinner" :loading="submitting" color="#ffffff"></PulseLoader>
    </div>

    <v-navigation-drawer v-model="drawer" permanent v-if="sideBarRequied">
      <v-list-item class="title">
        <img :src="require('./assets/images/rodeo.jpeg')" alt="" width="255" />
      </v-list-item>

      <v-divider :thickness="0.7" class="main"></v-divider>

      <v-list density="compact" nav class="main">
        <RouterLink
          to="/feed"
          class="custom-list-item"
          :class="active == 'feed' ? 'active' : 'inactive'"
          @click="active = 'feed'"
        >
          <img
            :src="require('./assets/icons/glyph/glyphs/house.png')"
            width="20"
            height="20"
            alt=""
          />
          <h4>Feed</h4>
        </RouterLink>

        <RouterLink
          to="/search"
          class="custom-list-item"
          :class="active == 'search' ? 'active' : 'inactive'"
          @click="active = 'search'"
        >
          <img
            :src="require('./assets/icons/glyph/glyphs/magnifyingglass.png')"
            width="20"
            height="20"
            alt=""
          />
          <h4>Search</h4>
        </RouterLink>

        <RouterLink
          to="/news"
          class="custom-list-item"
          :class="active == 'news' ? 'active' : 'inactive'"
          @click="active = 'news'"
        >
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
          :class="active == 'schedule' ? 'active' : 'inactive'"
          @click="active = 'schedule'"
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
          class="custom-list-item"
          :class="active == 'upload' ? 'active' : 'inactive'"
          @click="active = 'upload'"
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
          :class="active == 'notifications' ? 'active' : 'inactive'"
          @click="active = 'notifications'"
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
          :to="{
            path: '/my-rodeo',
            query: {
              id: $store.state.selectedProfile.id,
            },
          }"
          class="custom-list-item"
          :class="active == 'rodeo' ? 'active' : 'inactive'"
          @click="active = 'rodeo'"
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

      <template v-if="currentUser" v-slot:append class="settings">
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
            <v-icon color="white">
              {{ settingsOpen ? "fas fa-chevron-down" : "fas fa-chevron-up" }}
            </v-icon>
          </div>

          <v-divider v-if="settingsOpen" class="main"></v-divider>
          <v-list class="main">
            <div
              class="custom-list-item"
              v-if="$store.state.selectedProfile"
              @click="() => {}"
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

            <div
              class="custom-list-item"
              :class="active == 'upcomingEvent' ? 'active' : 'inactive'"
              @click="active = 'upcomingEvent'"
            >
              <h4>Upcoming Event</h4>
            </div>

            <div
              class="custom-list-item"
              :class="active == 'changeAccType' ? 'active' : 'inactive'"
              @click="active = 'changeAccType'"
            >
              <h4>Change Account Type</h4>
            </div>

            <div
              class="custom-list-item"
              @click="$store.commit('SWITCH_USER_MODAL', true)"
            >
              <!-- <v-icon class="mr-3" small color="black">fas fa-right-left</v-icon> -->
              <h4>Switch User</h4>
            </div>

            <div
              class="custom-list-item"
              :class="active == 'contactRodeoNow' ? 'active' : 'inactive'"
              @click="active = 'contactRodeoNow'"
            >
              <!-- <v-icon class="mr-3" small color="black">fas fa-right-left</v-icon> -->
              <h4>Contact RodeoNow</h4>
            </div>

            <div class="custom-list-item" @click="logout">
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
    <switchUserModalVue v-if="$store.state.userProfile"></switchUserModalVue>
    <videoPlayerModalVue v-if="$store.state.modalVideo"></videoPlayerModalVue>
  </v-app>
</template>

<script>
import videoPlayerModalVue from "@/components/videoPlayerModal.vue";
import { computed, ref, watch } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useStore } from "vuex";
import { getAuth } from "firebase/auth";
import { useRoute, useRouter } from "vue-router";
import { logOut } from "./services/authentication.service";
// import Alert from "./components/utilities/alert.vue";
import switchUserModalVue from "./components/switchUserModal.vue";
import { getUserAccessibleProfiles } from "@/services/profiles";

export default {
  name: "App",
  components: { PulseLoader, switchUserModalVue, videoPlayerModalVue },
  setup() {
    const auth = getAuth();
    const store = useStore();
    const route = useRoute();
    const settingsOpen = ref(false);
    const router = useRouter();
    const chevKey = ref(69420);
    const active = ref("feed");
    console.log("route =>", route.meta);
    const sideBarRequied = computed(() => {
      return route.meta.sideBar;
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
      const result = await logOut();
      store.commit("setSpinner");
      if (!result.error) {
        router.replace("/");
      } else {
        //nothing
      }
    };
    console.log(sideBarRequied.value);
    const drawer = true;
    console.log(store);
    const submitting = computed(() => {
      return store.getters.spinner;
    });
    const currentUser = computed(() => {
      return auth.currentUser;
    });
    const alertText = computed(() => {
      return store.getters.alertText;
    });
    const alertShow = computed(() => {
      return store.getters.alert;
    });
    const alertType = computed(() => {
      return store.getters.alertType;
    });
    watch(route, (currentValue, oldValue) => {
      console.log(route.meta.sideBar);
    });
    return {
      submitting,
      alertText,
      alertShow,
      sideBarRequied,
      route,
      currentUser,
      editProfile,
      active,
      settingsOpen,
      logout,
      drawer,
      chevKey,
      alertType,
    };
  },
};
</script>

<style lang="scss">
@import "theme/variable.scss";

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
  background: #9c9b9c;
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
    color: #fff;
    margin: 0;
  }
}
.custom-list-item:hover {
  cursor: pointer;
  background: #c5443f;
}
.active {
  background: #c5443f;
}
.v-navigation-drawer {
  background: #9c9b9c;
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
  padding: 0px !important;
}
.v-list-item:not(.title) {
  color: #fff;
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
.v-alert {
  position: absolute;
  z-index: 99999999;
  width: 100%;
  height: 80px;
  font-size: 20px;
  font-weight: 600;
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
  background: var(--RODEONOW_RED) !important ;
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
