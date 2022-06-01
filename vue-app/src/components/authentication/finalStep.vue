<template>
  <div class="form">
    <div class="profile-image" @click="chooseImage">
      <img
        :src="previewImageSrc || 'assets/images/user.png'"
        alt=""
        srcset=""
      />
      <span class="overlay">
        <i class="fa fa-camera"></i>
      </span>
      <input
        type="file"
        id="photoInput"
        style="display: none"
        @change="previewImage"
        accept="image/*"
      />
    </div>

    <Input
      :placeholder="'Location'"
      :type="'text'"
      @getInputValue="userData.location = $event"
    />
    <!-- <select v-model="userData.favouriteEvent">
      <option :value="1">Bull Riding</option>
      <option :value="2">Bareback Riding</option>
      <option :value="3">Saddle Bronc</option>
      <option :value="4">Team Roping</option>
      <option :value="5">Barrel Racing</option>
      <option :value="6">Steer Wrestling</option>
      <option :value="7">Tie Down Roping</option>
      <option :value="8">Breakaway Roping</option>
    </select> -->
    <div class="select-wrap">
      <v-combobox
        v-model="userData.favourite_events"
        :items="items"
        hint="You can add as many as you want"
        label="Favorite Events"
        persistent-hint
        attach
        chips
        :multiple="true"
      ></v-combobox>
    </div>

    <Button :text="'Next'" @buttonClicked="nextPage" />

    <!-- <Button :text="'Skip'" @buttonClicked="$emit('nextSlide', userData)" /> -->

    <span class="rbtn" @click="$emit('prevSlide')">Back</span>
  </div>
</template>

<script>
import Input from "@/components/utilities/input.vue";
import Button from "@/components/utilities/button.vue";
import { ref } from "vue";
export default {
  name: "FinalStepComponent",
  emits: ["nextSlide", "prevSlide"],
  components: { Input, Button },

  setup(props, context) {
    const items = [
      "Bull Riding",
      "Bareback Riding",
      "Saddle Bronc",
      "Team Roping",
      "Barrel Racing",
      "Steer Wrestling",
      "Tie Down Roping",
      "Breakaway Roping",
    ];
    const uploadValue = ref(0);
    const previewImageSrc = ref(null);
    const userData = ref({
      location: null,
      favourite_events: [],
      imageData: null,
    });
    const chooseImage = () => {
      document.getElementById("photoInput").click();
    };
    const previewImage = (event) => {
      previewImageSrc.value = URL.createObjectURL(event.target.files[0]);
      userData.value.imageData = event.target.files[0];
    };
    const nextPage = () => {
      context.emit("nextSlide", userData.value);
    };

    return {
      userData,
      chooseImage,
      previewImageSrc,
      nextPage,
      previewImage,
      items,
    };
  },
};
</script>

<style scoped>
.form {
  height: 100%;
  /* background: red; */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
Button {
  margin-top: 10px;
}

.profile-image {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  position: relative;
}
.profile-image > img {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.profile-image > .overlay {
  position: absolute;
  height: 100px;
  width: 100px;
  background: #35030357;
  border-radius: 50%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  color: #fff;
  display: flex;
  opacity: 0.6;
  justify-content: center;
  align-items: center;
  font-size: 30px;
}
.profile-image > .overlay:hover {
  background: #0f00008d;
  cursor: pointer;
  font-size: 35px;
}

select {
  width: 70%;
  border: none;
  border-bottom: 1px solid #000;
  padding: 5px 20px;
  outline: none;
}

.select-wrap {
  width: 80%;
  padding: 15px 20px;
}
</style>
