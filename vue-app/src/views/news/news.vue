<template>
  <v-container>
    <v-row align="start" gutters v-if="news">
      <v-col v-for="item of news" :key="item.story_id" cols="4" cols-lg="6">
        <v-card class="mx-auto" max-width="344">
          <v-img :src="getUrl(item.story_image)" height="200px" cover></v-img>

          <v-card-title> {{ item.story_headline }} </v-card-title>

          <v-card-text v-html="item.story_summary"> </v-card-text>

          <v-card-actions>
            <div>{{ item.story_postdate }}</div>
            <v-btn
              @click="gotoPage(item.story_path)"
              class="readMore"
              variant="text"
            >
              Read more
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div icon class="scrollTop" @click="scrollTop" v-if="newsIndex > 1">
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
import { getNews } from "@/services/news.service";
export default {
  name: "NewsView",

  components: {},

  setup() {
    const windowTop = ref(window.top.scrollY);
    const store = useStore();
    const newsIndex = ref(1);
    const news = computed(() => store.getters.news);
    console.log(news);
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
      newsIndex.value++;
      const response = await getNews(newsIndex.value);
      if (!response.error) {
        console.log(response.data);
        store.commit("addNews", response.data);

        console.log();
      }
    };

    const scrollTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onScroll = (e) => {
      windowTop.value = e.target.scrollTop;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
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
      news,
      getUrl,
      scrollTop,
      gotoPage,
      newsIndex,
    };
    {
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.v-card {
  max-height: 500px;
  min-height: 500px;
}
.v-card-title {
  line-height: 1.5rem;
  font-size: 1.1rem;
}
.v-card-text {
  font-size: 0.8rem;
}
.readMore {
  color: var(--RODEONOW_RED);
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

.v-card-actions {
  position: absolute;
  bottom: 0;
  width: 100%;
  justify-content: space-between;
}
</style>
