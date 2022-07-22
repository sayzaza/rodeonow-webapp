<template>
    <v-card v-if="videoUser || $store.state.selectedProfile" class="video-card">
        <v-card-text class="d-flex justify-space-between py-1 px-2">
            <div class="d-flex" style="max-width: 60%; overflow: hidden;">
                <!--  -->
                <v-avatar cover size="36" color="grey">
                    <v-img cover aspect-ratio="1" style="width: 100%"
                        :src="videoUser ? videoUser.photo_url : $store.state.selectedProfile.photo_url">
                    </v-img>
                </v-avatar>
                <div class="d-flex flex-column ml-2 ">
                    <span v-if="videoUser">{{ videoUser.first_name }} {{
                    videoUser.last_name
                    }}</span>
                    <span class="text-caption" v-else>{{ $store.state.selectedProfile.first_name }} {{
                    $store.state.selectedProfile.last_name
                    }}</span>
                    <span v-if="video.animal_name" class="text-caption">{{ video.animal_name }} <span
                            v-if="video.animal_brand">({{
                            video.animal_brand }})</span></span>
                    <span>{{ video.title }}</span>
                </div>
            </div>
            <!-- 
            <div class="text--disabled mt-auto" :title="video.location">
                {{ video.location.slice(0,20) }}{{ video.location.length > 20 ? '...' : '' }}
            </div> -->

            <div class="d-flex flex-column text-end mr-1">
                <div class="d-flex align-center">
                    <span class="mr-1">{{ getDate() }}</span>
                    <v-btn icon variant="flat" size="small">
                        <v-icon>fas fa-ellipsis</v-icon>
                    </v-btn>
                </div>

                <div :title="video.location">
                    {{ video.location.slice(0,20) }}{{ video.location.length > 20 ? '...' : '' }}
                </div>
            </div>
        </v-card-text>

        <v-img :key="videoUser" @click="playVideo" min-width="100%" :src="video.thumbnail_url"
            class="d-flex align-center" aspect-ratio="1.7" cover>
            <img src="/assets/icons/glyph/glyphs/play.circle.png" class="mx-auto play-icon">
        </v-img>
    </v-card>
</template>

<script>
import store from '@/store'
export default {
    props: ['video', 'videoUser'],
    setup(props) {
        function playVideo() {
            store.commit('SET_MODAL_VIDEO', props.video)
            store.commit('VIDEO_PLAYER_MODAL', true)
        }
        function getDate() {
            let endString = 'N/A';
            if (props.video.event_date.toDate) {
                endString = props.video.event_date.toDate().toDateString()
            }
            else {
                try {
                    endString = (new Date(props.video.event_date * 1000)).toDateString()
                    console.log(">>", props.video, props.video.event_date, endString)
                } catch (error) {
                    endString = props.video.event_date
                }
            }
            if (endString !== 'N/A' && endString != props.video.event_date) {
                endString = endString.split(' ').slice(1, 4)
                endString = `${endString[0]} ${endString[1]}, ${endString[2]}`
            }
            return endString
        }
        return {
            playVideo,
            getDate
        }
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