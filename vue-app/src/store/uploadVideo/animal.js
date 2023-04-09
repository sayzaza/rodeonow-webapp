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
  const chosenAnimal = animals.filter(
    (animal) => `${animal.name} (${animal.brand})` == selectedAnimal
  )[0];

  console.log("chosenAnimal", chosenAnimal);

  Object.assign(animal, {
    brand: chosenAnimal.brand,
    name: chosenAnimal.name,
    id: chosenAnimal.id,
    tagged_animal_contractor_id: chosenAnimal.contractor,
  });
};
