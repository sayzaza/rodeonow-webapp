<script setup>
import { getProfileImageById } from "@/services/profiles";
import iconImage from "@/assets/images/thumb_rodeonow-1024x1024.png";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["item"]);

const photoUrl = ref(null);

async function getImage() {
  let image = "";

  if (props.item.picture_url) {
    image = props.item.picture_url;
  } else if (props.item.contractor && props.item.contractor.length) {
    image = await getProfileImageById({
      id: props.item.contractor,
      account_type: 1,
    });
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
        $router.push({ name: 'oneAnimal', params: { id: item.id } });
      }
    "
    class="d-flex flex-column"
  >
    <div class="d-flex px-3 py-3">
      <v-avatar size="100" class="mr-3" cover tile style="border-radius: 5%">
        <v-img :src="photoUrl" cover />
      </v-avatar>

      <div class="d-flex flex-column">
        <div style="width: 100%; display: block" class="d-flex">
          <span class="text-subtitle-1 text--disabled mr-1">{{
            item.brand
          }}</span>
          <span class="text-subtitle-1 font-weight-normal">{{
            item.name
          }}</span>
        </div>

        <div style="width: 100%; display: block">
          <span class="text-subtitle-1 text-primary mr-1">{{
            item.contractor_name
          }}</span>
        </div>
      </div>
    </div>
  </v-card>
</template>
