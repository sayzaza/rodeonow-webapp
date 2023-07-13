<script setup>
import { getAnimalImage, getProfileImageById } from "@/services/profiles";
import iconImage from "@/assets/images/thumb_rodeonow-1024x1024.png";
import { onBeforeMount, ref } from "vue";
import events, { parseEvents } from "@/utils/events";

const props = defineProps(["item"]);

const photoUrl = ref(null);

async function getImage() {
  photoUrl.value = await getAnimalImage(props.item);
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
      <!-- {{ item }} -->
      <v-avatar size="100" class="mr-3" style="border-radius: 5%">
        <v-img :src="photoUrl" cover />
      </v-avatar>

      <div class="d-flex flex-column">
        <div>
          <div style="width: 100%; display: block" class="d-flex">
            <span class="text-subtitle-1 text--disabled mr-1">{{
              item.brand
            }}</span>
            <span class="text-subtitle-1 font-weight-medium">{{
              item.name
            }}</span>
          </div>

          <div style="width: 100%; display: block">
            <span class="text-subtitle-1 text-primary mr-1">{{
              item.contractor_name
            }}</span>
          </div>
        </div>
        <div
          class="mt-auto text-medium-emphasis"
          style="width: 100%; display: block"
        >
          <template v-if="item.events.length">
            <span>
              {{ parseEvents(item.events) }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </v-card>
</template>
