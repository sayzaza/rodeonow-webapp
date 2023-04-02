<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import {
  doc,
  getFirestore,
  updateDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getProfileImageById } from "@/services/profiles";
import { useRoute, useRouter } from "vue-router";
import store from "@/store/index.js";

const db = getFirestore();
const storage = getStorage();

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => {
  return route.params.id ? true : false;
});

const events = [
  "Bull",
  "Bareback",
  "SaddleBronc",
  "TeamRoping",
  "BarrellRacing",
  "SteerWrestling",
  "TieDownRoping",
  "BreakawayRoping",
];

const animal = computed(() => store.state.animal);
const profile = computed(() => store.state.selectedProfile);

const fileInput = ref(null);

const form = reactive({
  type: null,
  name: "",
  bio: "",
  brand: "",
  picture_url: "",
  events: [],
});

function uploadImage(event) {
  const image = event.target.files[0];
  const fileRef = storageRef(storage, `animals/${route.params.id}/profile.jpg`);
  let uploadTask = uploadBytesResumable(fileRef, image);

  uploadTask.on("state_changed", console.log, console.error, () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      form.picture_url = downloadURL;
    });
  });
}

async function getImage() {
  let image = "";
  if (animal.value.picture_url) {
    image = animal.value.picture_url;
  } else if (animal.value.contractor && animal.value.contractor.length > 0) {
    image = await getProfileImageById({
      id: animal.value.contractor,
      account_type: 1,
    });
  }
  form.picture_url = image;
}

async function save() {
  if (isEditing.value) {
    let docRef = doc(db, "animals", route.params.id);
    let data = {
      name: form.name || "",
      bio: form.bio || "",
      brand: form.brand || "",
      animal_type: form.type == null ? 1 : form.type + 1,
      picture_url: form.picture_url,
      contractor: store.state.userProfile.id,
      events:
        form.events.map((x) => events.indexOf(x) + 1) ||
        profile.value.favorite_events ||
        [],
    };
    console.log(">>>", data);
    await updateDoc(docRef, data)
      .then(() => {
        console.log(`Edited successful: ${route.params.id}`);
        router.push({
          path: `/animals/${route.params.id}`,
        });
      })
      .catch(console.error);
  } else {
    const dbRef = collection(db, "animals");
    let data = {
      name: form.name || "",
      bio: form.bio || "",
      brand: form.brand || "",
      animal_type: form.type == null ? 1 : form.type + 1,
      picture_url: form.picture_url,
      contractor: store.state.userProfile.id,
      events:
        form.events.map((x) => events.indexOf(x) + 1) ||
        profile.value.favorite_events ||
        [],
    };

    await addDoc(dbRef, data)
      .then((docRef) => {
        console.log(`Added successful: ${docRef.id}`);
        if (!route.query.selectedAccessUser) {
          router.push({
            path: `/animals/${docRef.id}`,
          });
        } else {
          router.go(-1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

async function fetchOne() {
  try {
    store.commit("SET_FIRESTORE_VALUE", { key: "animal", doc: null });
    store.state.subscribers["animal"]();
    // eslint-disable-next-line no-empty
  } catch {}

  let docRef = doc(db, "animals", route.params.id);
  store.dispatch("bindRef", { key: "animal", ref: docRef });
}

onMounted(async () => {
  if (isEditing.value) {
    await fetchOne();
  } else {
    store.commit("SET_FIRESTORE_VALUE", { key: "animal", doc: null });
  }
});

watch(animal, async () => {
  if (animal.value !== null) {
    const {
      contractor_name,
      animalID,
      animal_type,
      contractor,
      created_time,
      id,
      events: animal_events,
      ...rest
    } = animal.value;
    Object.assign(form, { ...rest, type: animal_type - 1 });
    if (animal_events.length !== 0) {
      animal_events.forEach((event) => {
        form.events.push(events[event - 1]);
      });
    }
    await getImage();
  }
});

watch(
  () => form.type,
  (newValue, oldValue) => {
    if (newValue == undefined) {
      form.type = oldValue;
    }

    if (newValue == 0) {
      form.events = [events.at(0)];
    } else if (newValue == 3) {
      form.events = [events.at(6)];
    } else {
      form.events = [];
    }

    if (animal.value != null) {
      if (newValue == animal.value.animal_type - 1) {
        form.events = [];

        animal.value.events.forEach((event) => {
          form.events.push(events[event - 1]);
        });
      }
    }
  }
);
</script>

<template>
  <v-form class="d-flex flex-column mx-auto my-6" style="max-width: 900px">
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
      <!-- :loading="saving" -->
      <v-btn
        color="primary"
        @click="save"
        class="d-flex align-center justify-center mr-2"
      >
        <span>Save</span>
      </v-btn>
    </div>

    <h2 class="mb-6 text-h6">About (Required)</h2>
    <div class="d-flex align-end mb-6">
      <span style="min-width: 7%" class="mr-2">Name:</span>
      <v-text-field
        v-model="form.name"
        density="compact"
        hide-no-data
        hide-selected
        hide-details
        placeholder="Animal's Name"
        return-object
        class="py-0"
      >
      </v-text-field>
    </div>
    <div class="d-flex align-center mb-6">
      <span style="min-width: 7%" class="mr-2">Brand:</span>
      <v-text-field
        required
        :rules="[(v) => !!v || 'Brand is required']"
        v-model="form.brand"
        density="compact"
        hide-no-data
        hide-selected
        placeholder="Animal's Brand"
        return-object
        class="py-0"
      >
      </v-text-field>
    </div>
    <div class="d-flex align-center mb-6">
      <span style="min-width: 7%" class="mr-2">Type:</span>
      <div>
        <v-btn-toggle v-model="form.type" group>
          <v-btn>
            <span>Bull</span>
          </v-btn>

          <v-btn>
            <span>Horse</span>
          </v-btn>

          <v-btn>
            <span>Steer</span>
          </v-btn>

          <v-btn>
            <span>Calf</span>
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <div class="d-flex align-start mb-6" v-if="form.type != null">
      <span style="min-width: 7%" class="mr-2 mt-4">Events:</span>
      <div class="d-flex flex-column" :key="form.events">
        <!-- 'BarrellRacing',
                'BreakawayRoping', -->
        <template v-if="form.type == 0">
          <v-checkbox
            v-model="form.events"
            :readonly="form.type == 0"
            label="Bull Riding"
            value="Bull"
            color="primary"
            :rules="[
              form.events.length > 0 || 'At least one event has to be selected',
            ]"
          />
        </template>
        <template v-if="form.type == 1">
          <v-checkbox
            v-model="form.events"
            hide-details="auto"
            density="compact"
            label="Bareback Riding"
            value="Bareback"
            color="primary"
            :rules="[
              form.events.length > 0 || 'At least one event has to be selected',
            ]"
          />

          <v-checkbox
            v-model="form.events"
            hide-details="auto"
            density="compact"
            label="Saddle Bronc"
            value="SaddleBronc"
            color="primary"
            :rules="[
              form.events.length > 0 || 'At least one event has to be selected',
            ]"
          />
        </template>
        <template v-if="form.type == 2">
          <v-checkbox
            v-model="form.events"
            hide-details="auto"
            density="compact"
            label="Steer Wrestling"
            value="SteerWrestling"
            color="primary"
            :rules="[
              form.events.length > 0 || 'At least one event has to be selected',
            ]"
          />
          <v-checkbox
            v-model="form.events"
            hide-details="auto"
            density="compact"
            label="Team Roping"
            value="TeamRoping"
            color="primary"
            :rules="[
              form.events.length > 0 || 'At least one event has to be selected',
            ]"
          />
        </template>
        <template v-if="form.type == 3">
          <v-checkbox
            v-model="form.events"
            :readonly="form.type == 3"
            hide-details="auto"
            density="compact"
            label="Tie Down Roping"
            value="TieDownRoping"
            color="primary"
            :rules="[
              (v) =>
                form.events.length > 0 ||
                'At least one event has to be selected',
            ]"
          />
        </template>
      </div>
    </div>
    <h2 class="mb-6 text-h6">Animal image (Optional)</h2>

    <v-card
      @click="$refs.fileInput.click()"
      class="d-flex pa-3 mb-6 align-center"
    >
      <v-avatar
        size="120"
        class="mr-3"
        style="border-radius: 5%"
        color="gray"
        tile
      >
        <img style="height: 100%; width: auto" :src="form.picture_url" alt="" />
      </v-avatar>

      <div class="caption">Choose animal image from library</div>
    </v-card>

    <input
      type="file"
      style="display: none"
      @change="uploadImage"
      ref="fileInput"
    />

    <h2 class="my-6 text-h6">Bio (Optional)</h2>

    <v-textarea v-model="form.bio" placeholder="About the animal"></v-textarea>
  </v-form>
</template>

<style>
.v-btn__overlay {
  background-color: #bd2a24;
}

.v-btn-toggle {
  border: 1px solid #e3e3e3;
}
</style>
