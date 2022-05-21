<template>
  <swiper
    :slides-per-view="1"
    :space-between="50"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
    <swiper-slide>
      <div class="form">
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
    <swiper-slide>
      <h4>Choose an Account Type</h4>
      <div class="grid">
        <div
          class="option-card"
          :class="selectedOption == 'contractor' ? 'selected' : 'none'"
          @click="selectedOption = 'contractor'"
        >
          <img
            class="option-card-img"
            src="@/assets/images/contractor.png"
            alt=""
          />
          <h5>Contractor</h5>
        </div>
        <div
          class="option-card"
          :class="selectedOption == 'fan' ? 'selected' : 'none'"
          @click="selectedOption = 'fan'"
        >
          <img
            class="option-card-img"
            src="@/assets/images/rodeo-fan.png"
            alt=""
          />
          <h5>Rodeo Fan</h5>
        </div>
        <div
          class="option-card"
          :class="selectedOption == 'contestant' ? 'selected' : 'none'"
          @click="selectedOption = 'contestant'"
        >
          <img
            class="option-card-img"
            src="@/assets/images/contestant.png"
            alt=""
          />
          <h5>Contestant</h5>
        </div>
        <button class="next" @click="nextSlide">Next</button>
        <button class="prev" @click="prevSlide">Back</button>
      </div>
    </swiper-slide>
    <swiper-slide>
      <Contestant
        v-if="selectedOption == 'contestant'"
        @nextSlide="getContestantData"
      />
      <Contractor
        v-if="selectedOption == 'contractor'"
        @nextSlide="getContractorData"
      />
      <RodeoFan v-if="selectedOption == 'fan'" @nextSlide="getFanData" />
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
// import { SwiperOptions } from 'swiper/types';
export default {
  name: "SignupComponent",
  components: {
    Swiper,
    SwiperSlide,
    Button,
    Contestant,
    Contractor,
    RodeoFan,
  },
  setup() {
    const selectedOption = ref(null);
    const slides = ref(null);
    const userData = ref({});
    const onSwiper = (swiper) => {
      console.log(swiper);
      slides.value = swiper;
    };
    const onSlideChange = () => {
      console.log("slide change");
    };
    const nextSlide = (data) => {
      const index = slides.value.activeIndex;
      slides.value.slideNext();
    };
    const getContestantData = (data) => {
      console.log(data);
      slides.value.slideNext();
    };
    const getContractorData = (data) => {
      console.log(data);
      slides.value.slideNext();
    };
    const getFanData = () => {};

    const prevSlide = () => {
      slides.value.slidePrev();
    };

    return {
      onSwiper,
      onSlideChange,
      prevSlide,
      nextSlide,
      getContestantData,
      getContractorData,
      getFanData,
      selectedOption,
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
  padding: 10px;
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

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
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
  background: #cc1a1a;
  color: #fff;
}
.selected {
  background: #cc1a1a;
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
  background: #cc1a1a;
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
  background: #cc1a1a;
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
</style>
