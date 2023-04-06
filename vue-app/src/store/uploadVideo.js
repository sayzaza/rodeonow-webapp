import { defineStore } from "pinia";

export const useUploadVideo = defineStore("uploadVideo", {
  state: () => ({
    form: {
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
    },
    animal: {
      brand: "",
      id: "",
      name: "",
      tagged_animal_contractor_id: "",
    },
    handlers: {
      selectedAccessUser: null,
      scoreTime: "score",
      selectedEvent: null,
      selectedAnimal: null,
    },
    trims: {
      startTime: null,
      endTime: null,
    },
    step: 0,
  }),
  actions: {
    resetTrims() {
      this.$patch((state) => {
        Object.assign(state.trims, {
          startTime: null,
          endTime: null,
        });
      });
    },
    setAnimal(animals) {
      const { selectedAnimal } = this.handlers;
      const chosenAnimal = animals.filter(
        (animal) => `${animal.name} (${animal.brand})` == selectedAnimal
      )[0];

      console.log("chosenAnimal", chosenAnimal);

      this.$patch((state) => {
        Object.assign(state.animal, {
          brand: chosenAnimal.brand,
          name: chosenAnimal.name,
          id: chosenAnimal.id,
          tagged_animal_contractor_id: chosenAnimal.contractor,
        });
      });
    },
  },
  getters: {
    getFormData(state) {
      // eslint-disable-next-line no-unused-vars
      const { scoreTime } = state.handlers;
      // eslint-disable-next-line no-unused-vars
      const { created, duration, score, event_date, ...rest } = state.form;

      const {
        brand: animal_brand,
        id: animal_id,
        name: animal_name,
        tagged_animal_contractor_id,
      } = state.animal;

      return {
        ...rest,
        created: new Date(),
        duration: scoreTime === "time" ? score : null,
        score: scoreTime === "score" ? score : null,
        event_date: new Date(event_date).getTime() / 1000,
        animal_brand,
        animal_name,
        animal_id,
        tagged_animal_contractor_id,
      };
    },
    getStep(state) {
      return state.step == 0 ? 50 : 100;
    },
  },
});
