<template>
    <div class="d-flex flex-column mx-auto my-6" style="max-width: 900px; position: relative">
        <v-card flat class="d-flex justify-start mb-3 align-center py-3" style="position: sticky; top: 0; left: 0; z-index: 9; width: 100%">
            <span class="text-subtitle-1 font-weight-bold">My Next Event</span>
        </v-card>
        <div>
            <p class="text-subtitle-2">
                Save this information before your next event, so it will automatically be filled in when you upload your next video.
            </p>
        </div>
        <v-spacer />
        <v-form>
            <v-container>
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="form.event"
                            variant="underlined"
                            label="Event"
                            required
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="form.location"
                            variant="underlined"
                            label="Location"
                            required
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row class="pt-6">
                    <v-col>
                        <div style="position: relative;">
                            <span class="text-caption" style="position: absolute; top: -20px; left: 0px; opacity: .7; user-select: none;">
                                Select Date
                            </span>
                            <Datepicker
                                v-model="form.date"
                                :dark="true"
                                :enableTimePicker="false"
                                modelType="MM/dd/yyyy"
                                :format="format"
                            />
                            <v-btn @click="today = !today" variant="text" style="position: absolute; top: 1px; right: 30px;">
                                <div v-if="today">
                                    <v-icon v-if="today" icon="fas fa-square-check"></v-icon>
                                </div>
                                <div v-else>
                                    <v-icon icon="fas fa-regular fa-square"></v-icon>
                                </div>
                                <span style="padding-left: 10px;">
                                    Today
                                </span>
                            </v-btn>
                            <!-- <v-checkbox v-model="today" label="Today" true-icon="fas fa-x" style="position: absolute; top: 0; right: 0px; padding-right: 10px;"></v-checkbox> -->
                        </div>
                    </v-col>
                </v-row>
                <v-row class="pt-12">
                    <v-col>
                        <v-autocomplete
                            v-model="form.eventType"
                            label="Select Event"
                            variant="underlined"
                            clearable
                            :items="events"
                        ></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-spacer />
                    <v-col>
                        <v-btn
                            @click="handleSet"
                            color="primary"
                            variant="text"
                        >
                            Save
                        </v-btn>
                        <v-snackbar v-model="handleSaved" timeout="4000">
                            {{ textSaved }}

                            <template v-slot:actions>
                                <v-btn
                                    variant="text"
                                    @click="handleSaved = false"
                                >
                                    <v-icon icon="fas fa-x" />
                                </v-btn>
                            </template>
                        </v-snackbar>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>
  
<script setup>
import { ref, reactive, watch, onMounted } from "vue"
import { useCookies } from '@vueuse/integrations/useCookies'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const today = ref(false)
const handleSaved = ref(false)
const textSaved = ref('')

const todayHandle = () => {
    const date = new Date()
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear()

    return `${month}/${day}/${year}`
}

const format = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

let form = reactive({
    event: '',
    eventType: '',
    location: '',
    date: ''
})

const { set, get, remove } = useCookies(['event'])

function handleSet(){
    var expiresDate = new Date();
    expiresDate = new Date(expiresDate.getTime() +1000*60*60*24*365);
    if (get('event') !== undefined) {
        remove('event')
        set('event', {
            ...form
        }, {
            path: '/',
            expires: expiresDate.toUTCString()
        })
        textSaved.value = 'Saved successfully!'
        handleSaved.value = true
    }
    set('event', {
        ...form
    }, {
        path: '/',
        expires: expiresDate.toUTCString()
    })
    textSaved.value = 'Saved successfully!'
    handleSaved.value = true
}

onMounted(() => {
    const event = get('event')
    if (event !== undefined) {
        form.event = event.event
        form.eventType = event.eventType
        form.location = event.location
        form.date = event.date

        textSaved.value = 'Saved values have been used!'
        handleSaved.value = true
    }
})

const events = [
    'Bull Riding',
    'Bareback Riding',
    'Saddle Bronc',
    'Team Roping',
    'Barrell Racing',
    'Steer Wrestling',
    'Tie Down Roping',
    'Breakaway Roping',
]

watch(today, () => {
    if (today.value)
        form.date = todayHandle()
})
watch(form, () => {
    if (form.date !== todayHandle()) {
        today.value = false
    }
    else {
        today.value = true
    }
})

</script>

<style>
.v-list-item:not(.title) {
    color: black;
}

.dp__theme_dark {
    border-bottom: 1px solid #a3a3a3;
  --dp-background-color: #fff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #b52727;
  --dp-primary-disabled-color: #6bacea;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: rgb(255, 255, 255);
  --dp-border-color-hover: #ffffff;
  --dp-menu-border-color: #ddd;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #7fd27d;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-marker-color: #ff6f60;
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgb(25 118 210 / 10%);
}

.dp__theme_dark:hover {
    border-bottom: 1px solid #000000;
    transition: .25s ease-in;
}
</style>