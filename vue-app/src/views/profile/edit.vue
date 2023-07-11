<script setup>
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { ref, reactive, watch, onMounted, computed } from "vue";
import { getProfileImageById } from "@/services/profiles";
import events from "@/utils/events";
import { useAlertState } from "@/store/alert";
import { useStore } from "vuex";

const { setAlert } = useAlertState();
const store = useStore();
const currentUser = computed(() => store.state.selectedProfile);

const fileInput = ref(null);
const db = getFirestore();
const storage = getStorage();
const errors = ref(null);

const formRef = ref(null);
const loading = ref(false);
const profile = ref(null);
const profileImage = ref("");
const form = reactive({
  first_name: "",
  last_name: "",
  email: "",
  sponsors: "",
  location: "",
  bio: "",
  events: [],
  favorite_events: [],
  tiktok_url: "",
  twitter_url: "",
  website_url: "",
  youtube_url: "",
  facebook_url: "",
  instagram_url: "",
});

const commonAttributes = {
  density: "compact",
  hideDetails: "auto",
  class: "py-0",
};

async function save() {
  loading.value = true;

  const { valid, errors } = await formRef.value.validate();

  if (!valid) {
    errors.value = errors;
    loading.value = false;
    return;
  }

  let payload = {
    ...form,
    events:
      form.events.map((x) => events.indexOf(x) + 1) ||
      profile.value.events ||
      [],
    favorite_events:
      form.favorite_events.map((x) => events.indexOf(x) + 1) ||
      profile.value.favorite_events ||
      [],
  };

  if (profile.value.account_type == 1) {
    payload.first_name = form.first_name || profile.value.first_name || "";
    payload.last_name = form.last_name || profile.value.last_name || "";
  } else {
    payload.name = form.first_name || profile.value.name || "";
  }

  let docRef = doc(db, "users", profile.value.id);

  await updateDoc(docRef, payload)
    .then(() => {
      setAlert("success", "Your information was updated successfully.");
    })
    .catch(() => {
      setAlert("error", "An error occurred while updating your information.");
    })
    .finally(() => {
      loading.value = false;
    });
}

function uploadImage(event) {
  const image = event.target.files[0];
  const fileRef = storageRef(storage, `users/${profile.value.id}/profile.jpg`);
  let uploadTask = uploadBytesResumable(fileRef, image);

  uploadTask.on("state_changed", console.log, console.error, () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      profileImage.value = downloadURL;
    });
  });
}

watch(profile, async (profileValue) => {
  if (profileValue == null) return;

  profileImage.value = await getProfileImageById(profileValue);

  form.first_name = profileValue.first_name;
  form.last_name = profileValue.last_name;
  form.location = profileValue.location;
  form.sponsors = profileValue.sponsors;
  form.email = profileValue.email;
  form.bio = profileValue.bio;
  form.facebook_url = profileValue.facebook_url;
  form.instagram_url = profileValue.instagram_url;
  form.twitter_url = profileValue.twitter_url;
  form.youtube_url = profileValue.youtube_url;
  form.tiktok_url = profileValue.tiktok_url;
  form.website_url = profileValue.website_url;
  form.events = Object.values(profileValue.events).map(
    (event) => events[event - 1]
  );
  form.favorite_events = Object.values(profileValue.favorite_events).map(
    (event) => events[event - 1]
  );
});

async function setProfile() {
  if (currentUser.value != null) {
    const { id } = currentUser.value;
    const data = await getDoc(doc(db, "users", id)).then((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });

    profile.value = data;
  }
}

watch(currentUser, (v) => {
  if (v) setProfile();
});

onMounted(() => {
  setProfile();
});
</script>

<template>
  <div>
    <template v-if="profile != null">
      <v-form
        ref="formRef"
        class="d-flex flex-column mx-auto my-6"
        style="max-width: 900px"
      >
        <div class="d-flex justify-space-between mb-6">
          <v-btn
            variant="text"
            @click="$router.go(-1)"
            class="d-flex align-center justify-center mr-2 pl-0"
          >
            <img
              class="mr-3"
              :src="require('@/assets/icons/glyph/glyphs/chevron.left.png')"
            />
            <span>Back</span>
          </v-btn>
          <v-btn
            color="primary"
            @click="save"
            :loading="loading"
            class="d-flex align-center justify-center mr-2"
          >
            <span>Save</span>
          </v-btn>
        </div>

        <v-alert
          v-if="errors"
          title="Please fix the errors below."
          type="error"
          class="my-3"
          style="position: relative; font-size: 14px"
        >
          <ul>
            <li v-for="(error, index) in errors.errors" :key="index">
              <span>{{ error.id }}</span
              >: {{ error.errorMessages[0] }}
            </li>
          </ul>
        </v-alert>

        <h2 class="mb-6 text-h6">Profile Picture</h2>
        <v-card
          @click="fileInput.click()"
          class="d-flex pa-3 mb-6 align-center"
        >
          <v-avatar
            size="120"
            class="mr-3"
            style="border-radius: 5%"
            color="gray"
            tile
          >
            <img
              style="height: 100%; width: auto"
              :src="profile ? profileImage : ''"
              alt=""
            />
          </v-avatar>

          <div class="caption">Choose profile image from library</div>
        </v-card>
        <input
          type="file"
          @change="uploadImage"
          style="display: none"
          ref="fileInput"
        />

        <h2 class="mb-6 text-h6" style="margin-top: 20px">About</h2>
        <template v-if="profile.account_type == 1">
          <div class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Name:</span>
            <v-text-field
              name="Name"
              placeholder="Name"
              v-model="form.first_name"
              v-bind="commonAttributes"
              :rules="[(v) => !!v || 'Name is required']"
            >
            </v-text-field>
          </div>
        </template>
        <template v-else-if="profile.account_type == 2">
          <div class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">First Name:</span>
            <v-text-field
              name="First Name"
              placeholder="First Name"
              v-model="form.first_name"
              v-bind="commonAttributes"
              :rules="[(v) => !!v || 'First Name is required']"
            >
            </v-text-field>
          </div>
          <div class="d-flex align-center mb-6">
            <span style="min-width: 10%" class="mr-2">Last Name:</span>
            <v-text-field
              name="Last Name"
              placeholder="Last Name"
              v-model="form.last_name"
              v-bind="commonAttributes"
              :rules="[(v) => !!v || 'Last Name is required']"
            >
            </v-text-field>
          </div>
        </template>

        <div class="d-flex align-center mb-6">
          <span style="min-width: 10%" class="mr-2">Email:</span>
          <v-text-field
            name="email"
            placeholder="Email"
            v-bind="commonAttributes"
            v-model="form.email"
            :rules="[
              (v) => !!v || 'E-mail is required',
              (v) => /.+@.+/.test(v) || 'E-mail must be valid',
            ]"
          >
          </v-text-field>
        </div>

        <div class="d-flex align-center mb-6 edit_profile">
          <span style="min-width: 10%" class="mr-2">Favorite Events:</span>

          <v-autocomplete
            name="favorite_events"
            multiple
            :items="events"
            :close-on-click="false"
            v-model="form.favorite_events"
            v-bind="commonAttributes"
          ></v-autocomplete>
          <!-- <v-autocomplete
            v-model="form.favEvents"
            :items="events"
            outlined
            dense
            name="Favourite Events"
            hide-details
            chips
            small-chips
            multiple
            :close-on-click="false"
          ></v-autocomplete> -->
        </div>

        <template v-if="profile.account_type == 2">
          <div class="d-flex align-center mb-6 edit_profile">
            <span style="min-width: 10%" class="mr-2"
              >Participating Events:</span
            >

            <v-autocomplete
              name="events"
              multiple
              :items="events"
              :close-on-click="false"
              v-model="form.events"
              v-bind="commonAttributes"
              :rules="[
                (v) => !!v || 'Participating events are required',
                (v) => v.length > 0 || 'You have to choose an event ',
              ]"
            ></v-autocomplete>
            <!-- <v-autocomplete
              v-model="form.participating_events"
              :items="events"
              outlined
              dense
              name="Participating events"
              :rules="[
                (v) => !!v || 'Participating events are required',
                (v) => v.length > 0 || 'You have to choose an event ',
              ]"
              chips
              small-chips
              label="Participating Events"
              multiple
              :close-on-click="false"
            ></v-autocomplete> -->
          </div>
        </template>

        <div class="d-flex align-center mb-6">
          <span style="min-width: 10%" class="mr-2">Location:</span>
          <v-text-field
            name="location"
            placeholder="Location"
            v-model="form.location"
            v-bind="commonAttributes"
          >
          </v-text-field>
        </div>

        <div class="d-flex align-center mb-6">
          <span style="min-width: 10%" class="mr-2">Sponsors:</span>
          <v-text-field
            name="sponsors"
            placeholder="Sponsors"
            v-model="form.sponsors"
            v-bind="commonAttributes"
          >
          </v-text-field>
        </div>

        <h2 class="mb-6 text-h6" style="margin-top: 20px">Links</h2>
        <div class="d-flex align-center mb-6">
          <span style="min-width: 10%" class="mr-2">Facebook:</span>
          <v-text-field
            name="facebook_url"
            placeholder="Facebook"
            v-model="form.facebook_url"
            v-bind="commonAttributes"
          >
          </v-text-field>
        </div>
        <div class="d-flex align-center mb-6">
          <span style="min-width: 10%" class="mr-2">Instagram:</span>
          <v-text-field
            name="instagram_url"
            placeholder="Instagram"
            v-model="form.instagram_url"
            v-bind="commonAttributes"
          >
          </v-text-field>
        </div>

        <div class="d-flex align-center mb-6">
          <span style="min-width: 10%" class="mr-2">Twitter:</span>
          <v-text-field
            name="twitter_url"
            placeholder="Twitter"
            v-model="form.twitter_url"
            v-bind="commonAttributes"
          >
          </v-text-field>
        </div>

        <div class="d-flex align-center mb-6">
          <span style="min-width: 10%" class="mr-2">Youtube:</span>
          <v-text-field
            name="youtube_url"
            placeholder="Youtube"
            v-model="form.youtube_url"
            v-bind="commonAttributes"
          >
          </v-text-field>
        </div>

        <div class="d-flex align-center mb-6">
          <span style="min-width: 10%" class="mr-2">Tiktok:</span>
          <v-text-field
            name="tiktok_url"
            placeholder="Tiktok"
            v-model="form.tiktok_url"
            v-bind="commonAttributes"
          >
          </v-text-field>
        </div>
        <div class="d-flex align-center mb-6">
          <span style="min-width: 10%" class="mr-2">Website:</span>
          <v-text-field
            name="website_url"
            placeholder="Website"
            v-model="form.website_url"
            v-bind="commonAttributes"
          >
          </v-text-field>
        </div>

        <h2 class="my-6 text-h6" style="margin-top: 20px">Bio (Optional)</h2>

        <v-textarea
          v-model="form.bio"
          name="Bio"
          placeholder="About"
        ></v-textarea>
      </v-form>
    </template>
    <!-- <v-form
      v-model="valid"
      ref="formComp"
      class="d-flex flex-column mx-auto my-6"
      style="max-width: 900px"
    >

  
  
    
  
      <h2 class="mb-6 text-h6" style="margin-top: 20px">Links</h2>
      <div class="d-flex align-center mb-6">
        <span style="min-width: 10%" class="mr-2">Facebook:</span>
        <v-text-field
          name="Facebook"
          v-model="form.facebook"
          density="compact"
          hide-no-data
          hide-selected
          hide-details
          placeholder="Facebook"
          return-object
          class="py-0"
        >
        </v-text-field>
      </div>
      <div class="d-flex align-start mb-6">
        <span style="min-width: 10%" class="mr-2 mt-4">Instagram:</span>
        <v-text-field
          v-model="form.instagram"
          density="compact"
          hide-no-data
          hide-selected
          hide-details
          placeholder="Instagram"
          return-object
          class="py-0"
        >
        </v-text-field>
      </div>
  
      <div class="d-flex align-start mb-6">
        <span style="min-width: 10%" class="mr-2 mt-4">Twitter:</span>
        <v-text-field
          v-model="form.twitter"
          density="compact"
          hide-no-data
          hide-selected
          hide-details
          placeholder="Twitter"
          return-object
          class="py-0"
        >
        </v-text-field>
      </div>
  
      <div class="d-flex align-start mb-6">
        <span style="min-width: 10%" class="mr-2 mt-4">Youtube:</span>
        <v-text-field
          v-model="form.youtube"
          density="compact"
          hide-no-data
          hide-selected
          hide-details
          placeholder="Youtube"
          return-object
          class="py-0"
        >
        </v-text-field>
      </div>
  
      <div class="d-flex align-center mb-6">
        <span style="min-width: 10%" class="mr-2">Tiktok:</span>
        <v-text-field
          v-model="form.tiktok"
          density="compact"
          hide-no-data
          hide-selected
          hide-details
          placeholder="Tiktok"
          return-object
          class="py-0"
        >
        </v-text-field>
      </div>
      <div class="d-flex align-start mb-6">
        <span style="min-width: 10%" class="mr-2 mt-4">Website:</span>
        <v-text-field
          v-model="form.website"
          density="compact"
          hide-no-data
          hide-selected
          hide-details
          placeholder="Website"
          return-object
          class="py-0"
        >
        </v-text-field>
      </div>
  
      <h2 class="my-6 text-h6" style="margin-top: 20px">Bio (Optional)</h2>
  
      <v-textarea v-model="form.bio" name="Bio" placeholder="About"></v-textarea>
    </v-form> -->
  </div>
</template>

<style scoped>
.v-btn__overlay {
  background-color: #bd2a24;
}

.v-btn-toggle {
  border: 1px solid #e3e3e3;
}

.v-list-item:not(.title) {
  color: black !important;
}

.edit_profile svg.svg-inline--fa.fa-square-check,
.edit_profile svg.svg-inline--fa.fa-square,
.edit_profile svg:not(:root).svg-inline--fa,
.edit_profile svg:not(:host).svg-inline--fa {
  display: none;
}
</style>
