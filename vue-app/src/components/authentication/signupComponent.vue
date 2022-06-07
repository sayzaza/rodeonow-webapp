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
      <div class="form plan">
        <h5>Start with a 12 month free trial</h5>
        <Button
          class="price"
          @buttonClicked="nextSlide"
          :text="'$4.99/month'"
        />
        <Button
          class="price"
          @buttonClicked="nextSlide"
          :text="'$49.99/year'"
        />
        <span>Terms of service and Privacy Policy</span>
      </div>
    </swiper-slide>
    <swiper-slide class="swiper-no-swiping">
      <div class="backBtn">
        <img
          src="assets/icons/chevronLeft.png"
          width="30"
          @click="prevSlide"
          alt=""
        />
      </div>
      <h4>Choose an Account Type</h4>
      <div class="grid">
        <div
          class="option-card"
          :class="selectedOption == 'contractor' ? 'selected' : 'none'"
          @click="selectedOption = 'contractor'"
        >
          <img
            class="option-card-img"
            src="assets/images/contractor.png"
            alt=""
          />
          <h5>Contractor</h5>
        </div>
        <div
          class="option-card"
          :class="selectedOption == 'contestant' ? 'selected' : 'none'"
          @click="selectedOption = 'contestant'"
        >
          <img
            class="option-card-img"
            src="assets/images/contestant.png"
            alt=""
          />
          <h5>Contestant</h5>
        </div>
        <div
          class="option-card"
          :class="selectedOption == 'fan' ? 'selected' : 'none'"
          @click="selectedOption = 'fan'"
        >
          <img
            class="option-card-img"
            src="assets/images/rodeo-fan.png"
            alt=""
          />
          <h5>Rodeo Fan</h5>
        </div>

        <!-- <button class="next" @click="nextSlideBtn">Next</button> -->
        <!-- <button class="prev" @click="prevSlide">Back</button> -->
        <Button :text="'Next'" @buttonClicked="nextSlideBtn" />
      </div>
    </swiper-slide>
    <swiper-slide class="swiper-no-swiping">
      <div class="backBtn">
        <img
          src="assets/icons/chevronLeft.png"
          width="30"
          @click="prevSlide"
          alt=""
        />
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
        <img
          src="assets/icons/chevronLeft.png"
          width="30"
          @click="prevSlide"
          alt=""
        />
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
import { useStore } from "vuex";
// import { SwiperOptions } from 'swiper/types';
export default {
  name: "SignupComponent",
  components: {
    Swiper,
    Alert,
    SwiperSlide,
    Button,
    Contestant,
    Contractor,
    RodeoFan,
    FinalStep,
  },
  emits: ["successSignUp"],
  setup(props, context) {
    const selectedOption = ref(null);
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
    const onSwiper = (swiper) => {
      console.log(swiper);
      slides.value = swiper;
    };
    const onSlideChange = () => {
      console.log("slide change");
    };

    const nextSlide = (data) => {
      slides.value.slideNext();
    };
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
        context.emit("successSignUp");
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
  /* justify-content: center; */
  align-items: center;
  padding: 10px;
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
  min-height: 600px;
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
