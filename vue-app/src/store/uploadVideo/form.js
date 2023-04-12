import { reactive, computed } from "vue";
import { animal } from "./animal";
import { handlers } from "./handlers";

export const form = reactive({
  video_id: null,
  contestants_id: null,
  contractors_id: null,
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
  const { scoreTime } = handlers;
  const {
    brand: animal_brand,
    id: animal_id,
    name: animal_name,
    tagged_animal_contractor_id,
  } = animal;

  return {
    ...rest,
    created: new Date(),
    event_date: new Date(event_date).getTime() / 1000,
    score: scoreTime === "score" ? score : null,
    duration: scoreTime === "time" ? duration : null,
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
