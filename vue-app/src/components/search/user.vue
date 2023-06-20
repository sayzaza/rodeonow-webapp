<script setup>
import iconImage from "@/assets/images/thumb_rodeonow-1024x1024.png";
import { getProfileImageById } from "@/services/profiles";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["item"]);

const photoUrl = ref(null);

async function getImage() {
  let image = "";

  image = await getProfileImageById(props.item);

  if (image.length == 0) {
    image = iconImage;
  }

  photoUrl.value = image;
}

onBeforeMount(() => {
  getImage();
});
</script>

<template>
  <div class="d-flex flex-column">
    <div v-if="item" class="d-flex py-3">
      <v-avatar
        color="grey lighten-3"
        size="100"
        class="mr-3"
        cover
        tile
        style="border-radius: 5%"
      >
        <v-img :src="photoUrl" contain />
      </v-avatar>

      <div class="d-flex flex-column">
        <span class="text-h6 font-weight-bold"
          >{{ item.first_name }} {{ item.last_name }}</span
        >
        <span class="text-caption">{{ item.location }}</span>
      </div>
    </div>
  </div>
</template>
