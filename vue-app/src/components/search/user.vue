<script setup>
import iconImage from "@/assets/images/thumb_rodeonow-1024x1024.png";
import { getProfileImageById } from "@/services/profiles";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["item"]);

const photoUrl = ref(null);

async function getImage() {
  let image = "";

  if (props.item.photo_url && props.item.photo_url.length) {
    image = props.item.photo_url;
  } else {
    image = await getProfileImageById(props.item, false);
  }

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
  <v-card
    flat
    @click="
      () => {
        $router.push({ name: 'uniqueRodeo', params: { id: item.id } });
      }
    "
    class="d-flex flex-column"
  >
    <div v-if="item" class="d-flex px-3 py-3">
      <v-avatar size="100" class="mr-3" style="border-radius: 5%">
        <v-img :src="photoUrl" cover />
      </v-avatar>

      <div class="d-flex flex-column">
        <span class="text-h6 font-weight-bold text-high-emphasis"
          >{{ item.first_name }} {{ item.last_name }}</span
        >
        <div class="d-flex flex-column text-medium-emphasis">
          <span class="text-caption">{{ item.location }}</span>
          <span class="text-caption font-italic">{{ item.bio }}</span>
        </div>
      </div>
    </div>
  </v-card>
</template>
