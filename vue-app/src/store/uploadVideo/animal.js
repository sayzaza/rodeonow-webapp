import { reactive } from "vue";
import { handlers } from "./handlers";

export const animal = reactive({
  brand: "",
  id: "",
  name: "",
  tagged_animal_contractor_id: "",
});

export const setAnimal = (animals = []) => {
  const { selectedAnimal } = handlers;
  const record = animals.find((animal) => animal.title == selectedAnimal);
  // console.log(selectedAnimal);

  if (record) {
    console.log("chosenAnimal", record);
    const { brand, name, id, contractor: tagged_animal_contractor_id } = record;

    Object.assign(animal, {
      brand,
      name,
      id,
      tagged_animal_contractor_id,
    });
  }
};
