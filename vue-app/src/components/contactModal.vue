<template>
    <!-- <v-dialog
      v-model="contactDialog"
      persistent
    >
      <template v-slot:activator="{ props }">
        <a
            class="custom-list-item"
            v-bind="props"
        >
          <h4>Contact RodeoNow</h4>
        </a>
      </template>
      <v-card>
        <v-card-title class="d-flex justify-content">
          <span class="text-h5">
            Send Message to RodeoNow
          </span>
          <v-spacer />
          <v-btn
            variant="text"
            @click="contactDialog = false"
          >
            <v-icon icon="fas fa-x" />
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container style="min-width: 700px;">
            <v-textarea
                v-model="form.message"
                label="Your message"
                variant="underlined"
                required
            ></v-textarea>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="handleSubmit"
          >
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <a
      href="mailto:info@rodeonow.com?subject=Contact%20RodeoNow"
      target="_blank"
      class="custom-list-item"
    >
      <h4>Contact RodeoNow</h4>
    </a>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useStore } from "vuex";

const store = useStore()

// const contactDialog = ref(false)

const form = reactive({
    message: '',
    name: '',
    username: '',
    email: ''
})

// const handleSubmit = () => {
//     const UrlMailto = `mailto:info@rodeonow.com?subject=Contact RodeoNow&body=${form.message}`
//     window.open(`${encodeURI(UrlMailto)}`, '_blank')
//     form.message = ''
//     contactDialog.value = false
// }

function setData() {
    form.name = `${store.state.userProfile.first_name} ${store.state.userProfile.last_name}`
    form.username = store.state.userProfile.name
    form.email = store.state.userProfile.email
}

watch(() => store.state.userProfile, (userProfile) => {
        if (userProfile && (!userProfile.account_access || Object.keys(userProfile.account_access).length == 0)) {
            console.log('Unset data')
        } else {
            setData()
        }
    }
);
</script>