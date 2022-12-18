<script setup>
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'

// eslint-disable-next-line no-unused-vars
const props = defineProps(['animal'])

const router = useRouter()

const animal_menu = ref(false)

const edit = () => {
    router.push({ name: 'editAnimal', params: { id: props.animal.id } })
}

</script>

<template>
    <v-card flat class="d-flex pa-2">
        <span class="mr-3 text--disabled" style="min-width: 100px">{{ animal.brand }}</span>
        <span v-if="animal.name && animal.name.length > 0">{{ animal.name }}</span>
        <span v-else class="text--disabled">Unnamed</span>
        <v-menu v-model="animal_menu" :close-on-content-click="false" location="end">
            <template v-slot:activator="{ props }">
                <!-- <v-btn variant="text" class="ml-auto" v-bind="props">
                    <v-icon size="24">fas fa-ellipsis</v-icon>
                </v-btn> -->
                <v-btn fab icon size="small" variant="text" class="ml-auto" v-bind="props">
                    <v-icon>fas fa-ellipsis</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-btn @click="edit" variant="text" block class="text-black">
                    Edit Animal
                </v-btn>
                <v-divider></v-divider>
                <v-btn variant="text" block class="text-red">
                    Delete Animal
                </v-btn>
            </v-list>
        </v-menu>
    </v-card>
</template>