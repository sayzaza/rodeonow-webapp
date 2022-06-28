<template>
    <v-card v-if="$store.state.selectedProfile" class="video-card">
        <v-card-text class="d-flex justify-space-between py-1 px-2">
            <div class="d-flex" style="max-width: 60%; overflow: hidden;">
                <v-avatar cover size="36" color="grey">
                    <v-img cover aspect-ratio="1" style="width: 100%" :src="$store.state.selectedProfile.photo_url">
                    </v-img>
                </v-avatar>
                <div class="d-flex flex-column ml-2 ">
                    <span>{{ $store.state.selectedProfile.first_name }} {{ $store.state.selectedProfile.last_name
                        }}</span>
                    <span class="text-caption">{{ video.animal_name }}</span>
                    <span class="text-caption">{{ video.brand }}</span>
                </div>
            </div>

            <div class="d-flex flex-column text-end">
                <div class="d-flex text-caption align-center">
                    <span class="mr-1">{{ video.created.toDate().toDateString().split(' ').slice(1, 4).join(' ')
                        }}</span>
                    <v-icon size="13">fas fa-ellipsis-vertical</v-icon>
                </div>

                <div class="text-caption text--disabled">
                    {{ $store.state.selectedProfile.location }}
                </div>
            </div>


        </v-card-text>

        <v-img min-width="100%" :src="video.thumbnail_url" class="d-flex align-center" aspect-ratio="1.7" cover>
            <img src="/assets/icons/glyph/glyphs/play.circle.png" class="mx-auto play-icon">
        </v-img>


    </v-card>
</template>

<script>
export default {
    props: ['video', 'user_id'],
    setup() {
        
    }
}
</script>

<style>



.video-card {
    overflow: hidden;
}


.video-card:hover{
    cursor: pointer;
}
.video-card:hover .play-icon {
    transform: scale(1.1);
}

.play-icon {
    display: block;
    filter: invert();
}

</style>