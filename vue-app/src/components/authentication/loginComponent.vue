<template>
  <div id="content">
    <swiper :slides-per-view="1" :space-between="50" @swiper="onSwiper" @slideChange="onSlideChange">
      <SwiperSlide class="swiper-no-swiping">
        <div class="form" id="form" :key="swiperKey">
          <Input :placeholder="'Email Address'" :type="'email'" @getInputValue="email = $event" />

          <Input v-if="!recoverPassword" :placeholder="'Password'" @getInputValue="password = $event"
            :type="'password'" />

          <Button v-if="!recoverPassword" :text="'Login'" @buttonClicked="login" />
          <Button v-else :text="'Recover'" @buttonClicked="recover" />
          <span class="mt-10 link" @click="forgetPassword">Forget Password</span>
        </div>
      </SwiperSlide>
      <SwiperSlide class="swiper-no-swiping">
        <div class="backBtn">
          <img src="assets/icons/chevronLeft.png" width="30" @click="prevSlide" alt="" />
        </div>
        <h4>User Account</h4>

        <div v-if="accessible_accounts" class="d-flex flex-column py-6" style="width: 100%; height: 100%;">
          <div v-for="(acc, index) in accessible_accounts" @click="selectedAccountIndex = index" :key="acc.email"
            style="width: 100%;" class="d-flex align-center py-3 account">
            <div class="px-3">
              <v-avatar color="transparent" size="56">
                <img style="height: 56px; width: auto;" v-if="acc.photo_url && acc.photo_url.length > 0"
                  :src="acc.photo_url" />
                <!-- <span>{{ `${acc.first_name.charAt(0)}${acc.last_name.charAt(0)}` }}</span> -->
              </v-avatar>
            </div>
            <div class="d-flex flex-column align-start">
              <div class="subtitle-1">{{ acc.account_type == 1 ? acc.name ? acc.name : acc.first_name : `${acc.first_name} ${acc.last_name}` }}</div>
              <div class="text-caption">{{ acc.email }}</div>
            </div>
            <div class="ml-auto pr-2">
              <svg xmlns="http://www.w3.org/2000/svg" v-if="selectedAccountIndex == index" style="width: 2rem"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <Button v-if="accessible_accounts.length > 0" class="mx-auto mt-auto" :text="'Continue'"
            @buttonClicked="finishLogin" />

        </div>
      </SwiperSlide>
    </swiper>

    <PulseLoader v-if="loading" class="spinner" :loading="loading" color="#2c3346"></PulseLoader>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useRouter } from "vue-router";
import Input from "../utilities/input.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import Button from "../utilities/button.vue";
import { useStore } from "vuex";
import { getUserAccessibleProfiles } from '@/services/profiles'
import {
  loginUser,
  recoverUserPassword,
} from "@/services/authentication.service";
import { doc, getFirestore, setDoc } from '@firebase/firestore';

export default {
  name: "LoginComponent",
  components: { Input, Button, PulseLoader, Swiper, SwiperSlide },
  setup() {
    const loading = ref(false);
    const router = useRouter();
    const slides = ref(null);
    const store = useStore();
    const recoverPassword = ref(false);
    const email = ref(null);
    const password = ref(null);
    const swiperKey = ref(69420)
    const accessible_accounts = ref([])
    const selectedAccountIndex = ref(0)
    const db = getFirestore()
    const onSwiper = (swiper) => {
      console.log(swiper);
      swiperKey.value++
      slides.value = swiper;
    };
    const onSlideChange = () => {
      swiperKey.value++
      console.log("slide change");
    };
    const nextSlide = (data) => {
      slides.value.slideNext();
    };
    const nextSlideBtn = () => {
      if (selectedOption.value !== null) {
        slides.value.slideNext();
      }
    };
    const prevSlide = () => {
      slides.value.slidePrev();
    };
    const forgetPassword = () => {
      recoverPassword.value = true;
    };
    const recover = async () => {
      // recoverPassword.value = true;
      loading.value = true;
      document.getElementById("form").style.opacity = "0";
      const response = await recoverUserPassword(email.value);
      console.log(response);
      recoverPassword.value = false;
      loading.value = false;

      if (!response.error) {
        store.commit("setAlert");
        store.commit("setAlertType", "success");
        store.commit("setAlertText", "check your email for reset instructions");
      } else {
        document.getElementById("form").style.opacity = "1";
        store.commit("setAlert");
        store.commit("setAlertType", "error");
        store.commit("setAlertText", response.error.message);
      }
    };

    const finishLogin = async () => {
      loading.value = true
      return setDoc(doc(db, 'users', store.state.user.uid), {
        current_accessed_account: accessible_accounts.value[selectedAccountIndex.value].id
      }, { merge: true })
      .then(() => {
        loading.value = false
        return router.replace("/feed");
      })
      .catch(console.error)
    }

    let userProfile = computed(() => {
      return store.state.userProfile
    })

    let accessibleProfiles = computed(() => {
      return store.state.accessibleProfiles
    })

    watch(accessibleProfiles, () => {
      console.log(">>", accessibleProfiles.value)
      if(!accessibleProfiles.value) return
        loading.value = false
        accessible_accounts.value = accessibleProfiles.value
    })

    watch(userProfile, () => {
      console.log("accessibleProfiles.value", accessibleProfiles.value)
      if(!userProfile.value) return
      if(!userProfile.value.account_access || Object.keys(userProfile.value.account_access).length == 0) {
        store.commit('SET_SELECTED_PROFILE', userProfile.value)
        router.replace("/feed")
      }
    })

    const login = async () => {
      if (email.value !== null && password.value !== null) {
        accessible_accounts.value = []
        loading.value = true;
        document.getElementById("form").style.opacity = "0";
        const response = await loginUser({
          email: email.value,
          password: password.value,
        });
        if (response.result) {
          accessible_accounts.value = accessibleProfiles.value
          if(accessible_accounts.value.length > 0) {
            loading.value = false;
          }
          nextSlide()
        } else {
          loading.value = false;
          document.getElementById("form").style.opacity = "1";
          store.commit("setAlert");
          store.commit("setAlertType", "error");
          store.commit("setAlertText", response.error.message);
        }
      } else {
        loading.value = false;
        store.commit("setAlert");
        store.commit("setAlertType", "warning");
        store.commit("setAlertText", "All field are required");
      }
    };
    return {
      email,
      password,
      loading,
      finishLogin,
      recoverPassword,
      forgetPassword,
      login,
      recover,
      onSwiper,
      onSlideChange,
      swiperKey,
      prevSlide,
      selectedAccountIndex,
      nextSlide,
      nextSlideBtn,
      accessible_accounts
    };
  },
};
</script>

<style scoped lang="scss">
#content {
  height: 100%;
  position: relative;
}
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
  margin-top: 20px;
}

.spinner {
  z-index: 99
}
.v-spinner {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  height: fit-content;
  width: fit-content;
}
.mt-10 {
  margin-top: 10px;
}
.link {
  cursor: pointer;
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

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  // min-height: 600px;
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

.account {
  cursor: pointer;
  transition: .25s ease-in-out;
}
.account:hover {
  background-color: rgb(216, 216, 216);
}
</style>
