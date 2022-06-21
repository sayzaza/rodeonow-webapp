<template>
  <v-app id="inspire">
    <v-alert v-if="alertShow" dense :type="alertType">
      {{ alertText }}
    </v-alert>

    <div class="spinner-wrapper" v-if="submitting">
      <PulseLoader
        class="spinner"
        :loading="submitting"
        color="#ffffff"
      ></PulseLoader>
    </div>

    <v-navigation-drawer v-model="drawer" permanent v-if="sideBarRequied">
      <v-list-item class="title">
        <img src="assets/images/rodeo.jpeg" alt="" width="255" />
      </v-list-item>

      <v-divider :thickness="0.7" class="main"></v-divider>

      <v-list density="compact" nav class="main">
        <div
          class="custom-list-item"
          :class="active == 'feed' ? 'active' : 'inactive'"
          @click="active = 'feed'"
        >
          <img
            src="assets/icons/glyph/glyphs/house.png"
            width="20"
            height="20"
            alt=""
          />
          <h4>Feed</h4>
        </div>

        <div
          class="custom-list-item"
          :class="active == 'search' ? 'active' : 'inactive'"
          @click="active = 'search'"
        >
          <img
            src="assets/icons/glyph/glyphs/magnifyingglass.png"
            width="20"
            height="20"
            alt=""
          />
          <h4>Search</h4>
        </div>

        <div
          class="custom-list-item"
          :class="active == 'news' ? 'active' : 'inactive'"
          @click="active = 'news'"
        >
          <img
            src="assets/icons/glyph/glyphs/doc.plaintext.png"
            width="20"
            height="20"
            alt=""
          />
          <h4>News</h4>
        </div>

        <div
          class="custom-list-item"
          :class="active == 'schedule' ? 'active' : 'inactive'"
          @click="active = 'schedule'"
        >
          <img
            src="assets/icons/glyph/glyphs/calendar.png"
            width="20"
            height="20"
            alt=""
          />
          <h4>Schedule</h4>
        </div>

        <div
          class="custom-list-item"
          :class="active == 'upload' ? 'active' : 'inactive'"
          @click="active = 'upload'"
        >
          <img
            src="assets/icons/glyph/glyphs/arrow.up.circle.png"
            width="20"
            height="20"
            alt=""
          />
          <h4>Upload Video</h4>
        </div>

        <div
          class="custom-list-item"
          :class="active == 'notifications' ? 'active' : 'inactive'"
          @click="active = 'notifications'"
        >
          <img
            src="assets/icons/glyph/glyphs/bell.png"
            width="20"
            height="20"
            alt=""
          />
          <h4>Notifications</h4>
        </div>

        <div
          class="custom-list-item"
          :class="active == 'rodeo' ? 'active' : 'inactive'"
          @click="active = 'rodeo'"
        >
          <img
            src="assets/icons/glyph/glyphs/photo.on.rectangle.png"
            width="20"
            height="20"
            alt=""
          />
          <h4>My Rodeo</h4>
        </div>

        <!-- <v-list-item
          @click="active = 'feed'"
          class="main"
          :class="active == 'feed' ? 'active' : 'inactive'"
          prepend-icon="assets/images/rodeo.jpeg"
          title="Feed"
          value="feed"
        ></v-list-item>
        <v-list-item
          class="main"
          @click="active = 'search'"
          :class="active == 'search' ? 'active' : 'inactive'"
          prepend-icon="fas fa-magnifying-glass"
          title="Search"
          value="search"
        ></v-list-item>
        <v-list-item
          @click="active = 'news'"
          class="main"
          :class="active == 'news' ? 'active' : 'inactive'"
          prepend-icon="fas fa-newspaper"
          title="News"
          value="news"
        ></v-list-item>
        <v-list-item
          class="main"
          @click="active = 'schedule'"
          :class="active == 'schedule' ? 'active' : 'inactive'"
          prepend-icon="fas fa-calendar-days"
          title="Schedule"
          value="schedule"
        ></v-list-item>
        <v-list-item
          class="main"
          @click="active = 'video'"
          :class="active == 'video' ? 'active' : 'inactive'"
          prepend-icon="fas fa-cloud"
          title="Upload Video"
          value="uploadVideo"
        ></v-list-item>
        <v-list-item
          class="main"
          @click="active = 'notification'"
          :class="active == 'notification' ? 'active' : 'inactive'"
          prepend-icon="fas fa-bell"
          title="Notifications"
          value="notifications"
        ></v-list-item>
        <v-list-item
          class="main"
          @click="active = 'rodeo'"
          :class="active == 'rodeo' ? 'active' : 'inactive'"
          prepend-icon="fas fa-rss"
          title="My Rodeo"
          value="myRodeo"
        ></v-list-item> -->
      </v-list>

      <template v-slot:append class="settings">
        <div
          :class="settingsOpen ? 'v-openSetting' : 'v-closeSetting'"
          class="settingsWrapper"
        >
          <v-divider :thickness="0.7" class="main"></v-divider>
          <v-list-item
            @click="settingsOpen = !settingsOpen"
            class="main profile"
            :prepend-avatar="currentUser.photoURL"
            :append-icon="
              settingsOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-up'
            "
            >{{ currentUser.displayName }}</v-list-item
          >

          <v-list class="main">
            <div
              class="custom-list-item"
              :class="active == 'schedule' ? 'active' : 'inactive'"
              @click="active = 'schedule'"
            >
              <img
                src="assets/icons/glyph/glyphs/lock.png"
                width="20"
                height="20"
                alt=""
              />
              <h4>Change Password</h4>
            </div>

            <div
              class="custom-list-item"
              :class="active == 'schedule' ? 'active' : 'inactive'"
              @click="active = 'schedule'"
            >
              <img
                src="assets/icons/glyph/glyphs/person.2.png"
                width="20"
                height="20"
                alt=""
              />
              <h4>All users</h4>
            </div>

            <div
              class="custom-list-item"
              :class="active == 'schedule' ? 'active' : 'inactive'"
              @click="active = 'schedule'"
            >
              <img
                src="assets/icons/glyph/glyphs/calendar.png"
                width="20"
                height="20"
                alt=""
              />
              <h4>Logout</h4>
            </div>
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      density="compact"
      :height="88"
      v-if="sideBarRequied"
      dense
      :elevation="0"
      :border="true"
    >
      <template v-slot:prepend>
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      </template>

      <!-- <v-app-bar-title>{{ active }}</v-app-bar-title> -->

      <!-- <template v-slot:append>
        <v-btn @click="logout">Logout</v-btn>
      </template> -->
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { computed, ref, watch } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useStore } from "vuex";
import firebase from "firebase/app";
import { useRoute, useRouter } from "vue-router";
import { logOut } from "./services/authentication.service";
// import Alert from "./components/utilities/alert.vue";

export default {
  name: "App",
  components: { PulseLoader },
  setup() {
    const auth = firebase.auth();
    const store = useStore();
    const route = useRoute();
    const settingsOpen = ref(false);
    const router = useRouter();
    const active = ref("feed");
    console.log("route===>", route.meta);
    const sideBarRequied = computed(() => {
      return route.meta.sideBar;
    });

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
      active,
      settingsOpen,
      logout,
      drawer,
      alertType,
    };
  },
};
</script>

<style lang="scss">
@import "theme/variable.scss";

.v-openSetting {
  transform: translateY(-230px);
}
.v-navigation-drawer__append {
  height: 100px;
}
.v-closeSetting {
  transform: translateY(10px);
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
</style>
