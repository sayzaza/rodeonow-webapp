<script setup>
import { ref } from '@firebase/storage';

    const categories = ref([
            {
                title: 'Contractors',
                image: require("@/assets/images/contractors.jpg")
            },
            {
                title: 'Contestants',
                image: require("@/assets/images/contestants.jpg")
            },
            {
                title: 'Bareback Riding',
                image: require('@/assets/images/bareback.jpg')
            },
            {
                title: 'Saddle Bronc',
                image: require('@/assets/images/saddle-bronc.jpg')
            },
            {
                title: 'Bull Riding',
                image: require('@/assets/images/bull-riding.jpg')
            },
            {
                title: 'Barrell Racing',
                image: require('@/assets/images/barrel-racing.jpg')
            },
            {
                title: 'Team Ropling',
                image: require('@/assets/images/team-roping.jpg')
            },
            {
                title: 'Tie Down Roping',
                image: require('@/assets/images/tie-down-roping.jpg')
            },
            {
                title: 'Steer wrestling',
                image: require('@/assets/images/steer-wrestling.jpg')
            },
            {
                title: 'Breakaway Roping',
                image: require('@/assets/images/breakaway.jpg')
            },
        ])
</script>

<template>
    <div class="d-flex flex-wrap mx-auto my-6 justify-center" style="max-width: 900px">
        <div class="text-h6 mb-6" style="width: 100%; display: block">
            Browse Categories
        </div>
        <div v-for="(category, index) in categories" class="d-flex justify-center mb-6" :key="index"
            style="width: 50%; display: block">
            <v-card @click="() => {}" class="rounded-xl " width="90%">
                <v-img class="d-flex align-end" :src="category.image" cover aspect-ratio="1.7">
                    <span style="position: absolute; bottom: 12px; left: 12px;" class="text-h6 text-white">{{
                    category.title }}</span>
                </v-img>
            </v-card>
        </div>
        <div style="width: 50%" v-if="categories.length % 3 !== 0" class="rounded-xl mb-6"></div>
        <div style="width: 50%" v-if="(categories.length+1) % 3 !== 0" class="rounded-xl mb-6"></div>
    </div>
</template>