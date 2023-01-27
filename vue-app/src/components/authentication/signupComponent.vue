<template>
  <!-- <Alert
    :text="alertData.alertText"
    :type="alertData.alertType"
    :show="alertData.alertShow"
    class="alert"
  /> -->
  <swiper
    :slides-per-view="1"
    :space-between="50"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
    <swiper-slide class="swiper-no-swiping">
      
      <div class="d-flex pa-3 align-center">
        <v-card
          @click="nextSlide('register:rodeoFan')"
          class="d-flex flex-column pa-3 mr-4 elevation-5 rounded-xl"
        >
          <img :src="rodeoFanPng" alt="rodeo" style="width: 75%; margin: auto" />
          <v-card-title> Person </v-card-title>
        </v-card>

        <v-card
          @click="nextSlide('register:contractor')"
          class="d-flex flex-column pa-3 elevation-5 rounded-xl"
        >
          <img :src="contractorPng" alt="rodeo" style="width: 75%; margin: auto" />
          <v-card-title> Contractor </v-card-title>
        </v-card>
      </div>
    </swiper-slide>

    <swiper-slide class="swiper-no-swiping">
      <div class="backBtn mb-3">
        <img src="assets/icons/chevronLeft.png" width="30" @click="prevSlide" alt="" />
      </div>
      <v-form 
      ref="form"
      @submit.prevent
      v-if="showPersonForm" 
      class="form" 
      id="form" 
      :key="swiperKey">
        <Input placeholder="First Name" type="text" @getInputValue="firstName = $event" />

        <Input placeholder="Last Name" @getInputValue="lastName = $event" type="text" />

        <Input placeholder="Email" type="email" @getInputValue="email = $event" />

        <Input
          placeholder="Password"
          type="password"
          @getInputValue="password = $event"
        />

        <Input
          placeholder="Confirm password"
          type="password"
          @getInputValue="confirmPassword = $event"
        />

        <div class="d-flex align-center" style="width: 80%; padding: 15px 20px">
          <span class="mr-2 font-weight-bold">Contestant</span>
          <label class="switch">
            <input v-model="contestant" type="checkbox" checked />
            <span class="slider round"></span>
          </label>
        </div>

        <v-autocomplete
          multiple
          v-if="contestant"
          v-model="participatingEvents"
          variant="underlined"
          placeholder="Participating Events"
          mandatory
          :items="events"
          style="width: 80%"
        >
        </v-autocomplete>

        <PulseLoader
          v-if="loading"
          class="spinner"
          :loading="loading"
          color="#c5443f"
          style="margin-top: 12px"
        ></PulseLoader>

        <Button class="" v-else text="Next" @buttonClicked="signUp" />
      </v-form>
    </swiper-slide>

    <!-- <swiper-slide class="swiper-no-swiping">
      <div class="form plan">
        <h5>Start with a 12 month free trial</h5>
        <Button class="price" @buttonClicked="nextSlide" :text="'$4.99/month'" />
        <Button class="price" @buttonClicked="nextSlide" :text="'$49.99/year'" />
        <span>Terms of service and Privacy Policy</span>
      </div>
    </swiper-slide> -->
    <!-- <swiper-slide class="swiper-no-swiping">
      <div class="backBtn">
        <img src="assets/icons/chevronLeft.png" width="30" @click="() => {prevSlide(); prevSlide();}" alt="" />
      </div>
      <h4>Choose an Account Type</h4>
      <div class="grid">
        <div
          class="option-card"
          :class="selectedOption == 'contractor' ? 'selected' : 'none'"
          @click="selectedOption = 'contractor'"
        >
          <img class="option-card-img" src="assets/images/contractor.png" alt="" />
          <h5>Contractor</h5>
        </div>
        <div
          class="option-card"
          :class="selectedOption == 'contestant' ? 'selected' : 'none'"
          @click="selectedOption = 'contestant'"
        >
          <img class="option-card-img" src="assets/images/contestant.png" alt="" />
          <h5>Contestant</h5>
        </div>
        <div
          class="option-card"
          :class="selectedOption == 'fan' ? 'selected' : 'none'"
          @click="selectedOption = 'fan'"
        >
          <img class="option-card-img" src="assets/images/rodeo-fan.png" alt="" />
          <h5>Rodeo Fan</h5>
        </div>

        <button class="next" @click="nextSlideBtn">Next</button>
        <button class="prev" @click="prevSlide">Back</button>
        <Button :text="'Next'" @buttonClicked="nextSlideBtn" />
      </div>
    </swiper-slide> -->
    
    <swiper-slide class="swiper-no-swiping">
      <div class="backBtn">
        <img src="assets/icons/chevronLeft.png" width="30" @click="() => { prevSlide(); prevSlide(); }" alt="" />
      </div>
      <Contestant
        v-if="selectedOption == 'contestant'"
        @prevSlide="prevSlide"
        @nextSlide="getContestantData"
      />
      <Contractor
        v-if="selectedOption == 'contractor'"
        @prevSlide="prevSlide"
        @nextSlide="getContractorData"
      />
      <RodeoFan
        v-if="selectedOption == 'fan'"
        @nextSlide="getFanData"
        @prevSlide="prevSlide"
      />
    </swiper-slide>
    <swiper-slide class="swiper-no-swiping">
      <div class="backBtn">
        <img src="assets/icons/chevronLeft.png" width="30" @click="prevSlide" alt="" />
      </div>
      <FinalStep @nextSlide="getFinalData" @prevSlide="prevSlide" />
    </swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { ref } from "vue";
import Button from "../utilities/button.vue";
import Contestant from "./accountTypes/contestant.vue";
import Contractor from "./accountTypes/contractor.vue";
import RodeoFan from "./accountTypes/rodeoFan.vue";
import FinalStep from "./finalStep.vue";
import { registerUser } from "../../services/authentication.service";
import Alert from "@/components/utilities/alert.vue";
import rodeoFanPng from "@/assets/images/rodeo-fan.png";
import contractorPng from "@/assets/images/contractor.png";
import Input from "../utilities/input.vue";
import { defineEmits } from "vue";
import { useStore } from "vuex";
import { doc, getFirestore, setDoc } from "@firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
// import { SwiperOptions } from 'swiper/types';
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default {
  name: "SignupComponent",
  components: {
    Swiper,
    Alert,
    Input,
    SwiperSlide,
    Button,
    Contestant,
    Contractor,
    RodeoFan,
    FinalStep,
    PulseLoader,
  },
  emits: ["go-to-login"],
  setup(props, context) {
    const db = getFirestore();
    const auth = getAuth();
    const emit = defineEmits(["go-to-login"]);
    const selectedOption = ref('contractor');
    const slides = ref(null);
    const submitting = ref(false);
    const store = useStore();
    // const alertData = ref({
    //   alertText: "",
    //   alertType: "",
    //   alertShow: false,
    // });
    const ContestantData = ref({});
    const ContractorData = ref({});
    const FanData = ref({});
    const FinalData = ref({});
    const showPersonForm = ref(false);
    const loading = ref(false);
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const lastName = ref("");
    const firstName = ref("");
    const contestant = ref(false);
    const participatingEvents = ref([]);
    let events = [
      "Bull Riding",
      "Bareback Riding",
      "Saddle Bronc",
      "Team Roping",
      "Barrell Racing",
      "Steer Wrestling",
      "Tie Down Roping",
      "Breakaway Roping",
    ];

    const getContestantData = (data) => {
      ContestantData.value = data;
      console.log(data);

      slides.value.slideNext();
    };
    const getContractorData = (data) => {
      ContractorData.value = data;
      console.log(data);
      slides.value.slideNext();
    };

    const getFanData = (data) => {
      console.log(data);
      FanData.value = data;
      slides.value.slideNext();
    };

    const onSwiper = (swiper) => {
      console.log(swiper);
      slides.value = swiper;
    };

    const onSlideChange = () => {
      console.log("slide change");
    };

    const signUp = () => {
      loading.value = true;
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((authUser) => {
          const id = authUser.user.uid;
          let data = {
            first_name: firstName.value,
            email: email.value,
            last_name: lastName.value,
            events: participatingEvents.value.map((e) => events.indexOf(e) + 1),
            account_type: contestant.value ? 2 : 1,
            deleted: false,
            id,
          };
          if (contestant.value) data.name = firstName.value;
          return setDoc(doc(db, `users`, id), data).then(() => {
            loading.value = false;
            context.emit("go-to-login");
          });
        })
        .catch((error) => {
          console.error(error);
          loading.value = false;
        });
    };

    const nextSlide = (value) => {
      switch (value) {
        case "register:rodeoFan":
          showPersonForm.value = true;
          break;
        case "register:contractor":
          showPersonForm.value = true;
          slides.value.slideNext();
          break;
        default:
          showPersonForm.value = false;
          break;
      }
      slides.value.slideNext();
    };

    const nextSlideBtn = () => {
      if (selectedOption.value !== null) {
        slides.value.slideNext();
      }
    };

    const getFinalData = async (data) => {
      store.commit("setSpinner");

      console.log("store spinner", store.getters.spinner);

      FinalData.value = data;
      let userIfo = {};
      if (selectedOption.value == "contestant") {
        ContestantData.value.participating_events = Array.from(
          { length: ContestantData.value.participating_events.length },
          (v, i) => i + 1
        );
        userIfo = ContestantData.value;
        userIfo.account_type = 2;
      } else if (selectedOption.value == "contractor") {
        userIfo.account_type = 1;
        userIfo = ContractorData.value;
      } else if (selectedOption.value == "fan") {
        userIfo.account_type = 3;
        userIfo = FanData.value;
      }

      Object.assign(FinalData.value, userIfo);
      FinalData.value.favourite_events = Array.from(
        { length: FinalData.value.favourite_events.length },
        (v, i) => i + 1
      );
      const response = await registerUser(FinalData.value);
      console.log(response);
      store.commit("setSpinner");
      if (response.result) {
        store.commit("setAlertText", "Registration Successful");
        store.commit("setAlertType", "success");
        store.commit("setAlert");
        context.emit("go-to-login");
        console.log(response.result);
      } else {
        store.commit("setAlert");
        console.log("store", store.getters.alertText);
        store.commit("setAlertText", response.error.message);
        store.commit("setAlertType", "error");

        console.log(response.error.message);
      }
    };

    const prevSlide = () => {
      slides.value.slidePrev();
    };

    return {
      loading,
      onSwiper,
      onSlideChange,
      prevSlide,
      nextSlide,
      nextSlideBtn,
      getContestantData,
      getContractorData,
      getFanData,
      getFinalData,
      selectedOption,
      submitting,
      rodeoFanPng,
      contractorPng,
      showPersonForm,
      events,
      participatingEvents,
      firstName,
      email,
      lastName,
      confirmPassword,
      password,
      contestant,
      signUp,
    };
  },
};
</script>

<style scoped>
.v-input--density-default .v-field--variant-underlined {
  --v-input-control-height: 36px;
}

.v-field__input {
  margin: 0;
  padding: 0;
  height: auto;
}

.v-field__append-inner {
  padding: 0;
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--RODEONOW_RED);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--RODEONOW_RED);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.form {
  /* height: 100%; */
  /* background: red; */
  /* margin-top: 50px; */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
div.plan {
  justify-content: center;
}
h4 {
  font-weight: 600;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  height: 400px;
  overflow-y: auto;
  padding-bottom: 20px;
  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  /* -webkit-justify-content: center; */
  /* justify-content: center; */
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  flex-direction: column;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

Button.price {
  margin: 10px;
}

span {
  font-size: 14px;
}
h4 {
  margin-top: 40px;
}

.grid {
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  justify-content: center;
}
.option-card {
  height: 130px;
  background: #fff;
  width: 40%;
  border-radius: 10px;
  margin: 10px;
  box-shadow: 2px 2px 6px #cccccc;
  text-align: center;
  transition: background 0.5 ease-out;
}
.option-card:hover {
  cursor: pointer;
  box-shadow: 2px 2px 3px #a40101;
  background: #bd2a24;
  color: #fff;
}
.selected {
  background: #bd2a24;
  color: #fff;
}
.none {
  background: #fff;
  color: #000;
}
.option-card-img {
  display: block;
  height: 70% !important;
  width: 60% !important;
  margin: auto;
}
button.next {
  background: #bd2a24;
  color: #fff;
  height: 50px;
  width: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 50%;
  border: none;
  outline: none;
  position: absolute;
  bottom: 15px;
  right: 40px;
}
button.prev {
  background: #bd2a24;
  color: #fff;
  height: 50px;
  width: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 50%;
  border: none;
  outline: none;
  position: absolute;
  bottom: 15px;
  left: 40px;
}

.backBtn {
  width: 80%;
  display: flex;
  margin-top: 20px;
}
.backBtn > img {
  width: 20px;
}
.backBtn > img:hover {
  cursor: pointer;
}
</style>
