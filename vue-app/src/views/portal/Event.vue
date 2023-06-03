<script setup>
// [Components]
import FormCalendar from "@/components/FormCalendar.vue";
// [SFC & State]
import { ref } from "vue";
// import store from "@/store";
import { useEventState } from "@/store/event";
import { useAlertState } from "@/store/alert";
import events from "@/utils/events";

const submitElement = ref();
const state = useEventState();

const { setAlert } = useAlertState();

function handleSet(e) {
  e.preventDefault();
  setAlert("success", "Your data has been saved");
}

// const events = [
//   "Bull Riding",
//   "Bareback Riding",
//   "Saddle Bronc",
//   "Team Roping",
//   "Barrell Racing",
//   "Steer Wrestling",
//   "Tie Down Roping",
//   "Breakaway Roping",
// ];
</script>

<template>
  <div class="d-flex flex-row mx-auto my-2" style="max-width: 700px">
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col>
          <span class="text-subtitle-1 font-weight-bold">My Next Event</span>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="primary"
            density="comfortable"
            @click="(_$event) => submitElement.click()"
          >
            Save
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p class="text-subtitle-2">
            Save this information before your next event, so it will
            automatically be filled in when you upload your next video.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <v-form
    @submit="handleSet"
    class="d-flex mx-auto mt-4"
    style="max-width: 700px"
  >
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="state.event"
            variant="underlined"
            label="Event"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="state.location"
            variant="underlined"
            label="Location"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <FormCalendar
            v-model="state.date"
            label="Date"
            variant="underlined"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete
            label="Select Event"
            variant="underlined"
            v-model="state.eventType"
            :items="events"
          />
        </v-col>
      </v-row>
    </v-container>
    <button ref="submitElement" style="display: none" />
  </v-form>
</template>
