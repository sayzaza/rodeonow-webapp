import { reactive, computed } from "vue";
import { animal } from "./animal";
import { handlers } from "./handlers";
import events from "@/utils/events";

export const form = reactive({
  video_id: null,
  contestants_id: null,
  contractor_id: null,
  created: null,
  duration: null,
  score: null,
  event_date: "",
  title: "",
  user_name: null,
  notes: "",
  location: "",
  edited: false,
  user_id: null,
  thumbnail_url: "",
});

export const formData = computed(() => {
  // eslint-disable-next-line no-unused-vars
  const { created, duration, score, event_date, ...rest } = form;
  const { scoreTime, selectedEvent } = handlers;
  const {
    brand: animal_brand,
    id: animal_id,
    name: animal_name,
    tagged_animal_contractor_id,
  } = animal;

  return {
    ...rest,
    created: new Date().getTime(),
    event_date: new Date(event_date).getTime(),
    event_type: events.indexOf(selectedEvent) + 1,
    score: scoreTime === "score" ? score : 0,
    time: scoreTime === "time" ? duration : 0,
    animal_brand,
    animal_name,
    animal_id,
    tagged_animal_contractor_id,
  };
});

export const setContestant = (contestants = []) => {
  const { selectedContestant } = handlers;
  const record = contestants.find(
    (contestant) => contestant.title == selectedContestant
  );

  if (record) {
    const { id: contestants_id } = record;

    Object.assign(form, {
      contestants_id,
    });
  }
};

// const d = {
//   contestants_invited_ids: video.contestantsInvitedIds,
//   user_name: video.userName,
//   contractor_id: video.contractorId,
//   account_upload: video.accountUpload,
//   contestants_names: video.contestantsNames,
//   contractor_name: video.contractorName,
//   ride_of_the_week: video.rideOfTheWeek,
// };
