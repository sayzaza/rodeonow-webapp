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
      <v-list-item class="title">RodeoNow </v-list-item>

      <v-divider :thickness="0.7" class="main"></v-divider>

      <v-list density="compact" nav class="main">
        <v-list-item
          @click="active = 'feed'"
          class="main"
          :class="active == 'feed' ? 'active' : 'inactive'"
          prepend-icon="fas fa-rss"
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
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider :thickness="0.7" class="main"></v-divider>
        <v-list-item
          class="main profile"
          prepend-avatar="https://randomuser.me/api/portraits/men/45.jpg"
          append-icon="fas fa-chevron-up"
          >John Leider</v-list-item
        >
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

      <v-app-bar-title>{{ active }}</v-app-bar-title>

      <template v-slot:append>
        <v-btn @click="logout">Logout</v-btn>
      </template>
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
import { useRoute, useRouter } from "vue-router";
import { logOut } from "./services/authentication.service";
// import Alert from "./components/utilities/alert.vue";

export default {
  name: "App",
  components: { PulseLoader },
  setup() {
    const store = useStore();
    const route = useRoute();
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
      active,
      logout,
      drawer,
      alertType,
    };
  },
};
</script>

<style lang="scss">
@import "theme/variable.scss";

.active {
  background: #c5443f;
}
.v-navigation-drawer {
  background: var(--RODEONOW_RED);
}
.v-list.main {
  background: transparent;
  // color: #fff;
}
.v-divider.main {
  color: #fff;
}
.v-list-item.title {
  padding-top: 20px;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
}
.v-list-item:not(.title) {
  color: #fff;
  & > .svg-inline--fa {
    font-size: 16px;
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
