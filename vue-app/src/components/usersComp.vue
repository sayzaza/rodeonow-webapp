<template>
  <div v-for="item in users" :key="item.id" class="d-flex flex-column my-4">
    <v-card
      @click="
        $router.push({
          path: '/my-rodeo',
          query: {
            id: item.id,
          }
        })
      "
      v-if="item"
      class="d-flex pa-3"
    >
      <v-avatar
        color="grey lighten-3"
        size="100"
        class="mr-3"
        cover
        tile
        style="border-radius: 5%"
      >
        <v-img :src="item.photo_url" contain />
      </v-avatar>

      <div class="d-flex flex-column">
        <span class="text-h6 font-weight-bold"
          >{{ item.first_name }} {{ item.last_name }}</span
        >
        <span class="text-caption">{{ item.location }}</span>
      </div>
    </v-card>
    <v-divider class="flex-none" style="width: 100%; display: block"></v-divider>
  </div>
</template>

<script setup>
const props = defineProps(['users'])

</script>
