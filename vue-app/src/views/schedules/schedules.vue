<template>
  <v-container>
    <v-row align="start" gutters v-if="schedules">
      <v-col
        v-for="schedule of schedules"
        :key="schedule.RodeoId"
        cols="4"
        cols-lg="6"
      >
        <v-card>
          <v-row class="inner-item-row1">
            <v-col cols="6" class="col1">
              <h3>
                {{ formatData(schedule.StartDate) }} -
                {{ formatData(schedule.EndDate) }}
              </h3>
            </v-col>
            <v-col cols="6" class="col2">
              <h5>{{ schedule.City }}, {{ schedule.StateAbbrv }}</h5>
            </v-col>
          </v-row>
          <v-row class="inner-item-row2">
            <v-col cols="6" class="col1">
              <h4>{{ schedule.Name }}</h4>
            </v-col>
            <v-col cols="6" class="col2">
              <p>Califonia</p>
            </v-col>
          </v-row>
          <v-row class="inner-item-row3">
            <v-col cols="6" class="col1">
              <p>{{ schedule.VenueName }}</p>
            </v-col>
            <v-col cols="6" class="col2">
              <p>${{ toCurrency(schedule.Payout) }}</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <div icon class="scrollTop" @click="scrollTop" v-if="scheduleIndex > 1">
      <img
        :src="require('@/assets/icons/glyph/glyphs/arrow.up.circle.fill.png')"
        alt=""
      />
    </div>
  </v-container>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { getSchedules } from "@/services/news.service";
export default {
  name: "ScheduleView",

  components: {},

  setup() {
    const windowTop = ref(window.top.scrollY);
    const store = useStore();
    const scheduleIndex = ref(1);
    const schedules = computed(() => store.getters.schedules);
    console.log(schedules.value);
    const getUrl = (path) => {
      console.log(path);
      return process.env.VUE_APP_BASE_URL + path;
    };
    const gotoPage = (path) => {
      console.log(path);
      const url = process.env.VUE_APP_BASE_URL + path;
      console.log(url);
      window.location.href = url;
    };
    const getNextSet = async () => {
      scheduleIndex.value++;
      const response = await getSchedules(scheduleIndex.value);
      if (!response.error) {
        console.log(response.data);
        store.commit("addSchedules", response.data);

        console.log();
      }
    };

    const scrollTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatData = (date) => {
      console.log(date);
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const dt = new Date(date);
      console.log(dt.getDay());
      console.log(dt.getMonth());
      return `${months[dt.getMonth()]} ${dt.getDate()}`;
    };
    const toCurrency = (value) => {
      if (typeof value !== "number") {
        return value;
      }
      var formatter = new Intl.NumberFormat("en-US");
      return formatter.format(value);
    };

    const onScroll = (e) => {
      windowTop.value = e.target.scrollTop;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        console.log("reached");
        getNextSet();
      }
    };
    onMounted(() => {
      window.addEventListener("scroll", onScroll, true);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("scroll", onScroll, true);
    });
    return {
      schedules,
      getUrl,
      scrollTop,
      gotoPage,
      formatData,
      toCurrency,
      scheduleIndex,
    };
    {
    }
  },
};
</script>

<style lang="scss" scoped>
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}
.container {
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.v-card {
  // max-height: 150px;
  height: fit-content;
  padding: 20px;
  // min-height: 150px;
  box-shadow: 2px 2px 6px #faeaea;
}
.v-card-title {
  line-height: 1.5rem;
  font-size: 1.1rem;
}
.v-card-text {
  font-size: 0.8rem;
}
.scrollTop {
  position: fixed;
  bottom: 20px;
  z-index: 99999;
  right: 20px;
  background: var(--RODEONOW_RED);
  padding: 10px;
  border-radius: 50%;
  display: flex;
}
.scrollTop:hover {
  cursor: pointer;
}

.col1 {
  justify-content: flex-start;
  display: flex;
  align-items: center;
  padding: 0;
}
.col2 {
  justify-content: flex-end;
  display: flex;
  align-items: center;
  padding: 0;
}

.inner-item-row1 {
  padding: 10px;
  & > .col1 > h3 {
    color: var(--RODEONOW_RED);
    font-weight: 700;
    font-size: 14px;
  }

  & > .col2 {
    & > h5 {
      font-size: 12px;
    }
  }
}

.inner-item-row2 {
  padding: 10px;
  & > .col1 {
    & > h4 {
      font-size: 12px;
    }
  }

  & > .col2 {
    & > p {
      font-size: 12px;
      color: #9c9b9c;
    }
  }
}

.inner-item-row3 {
  padding: 10px;
  & > .col1 {
    & > p {
      font-size: 12px;
      color: #9c9b9c;
    }
  }

  & > .col2 {
    & > p {
      font-size: 12px;
      color: #9c9b9c;
    }
  }
}
</style>
