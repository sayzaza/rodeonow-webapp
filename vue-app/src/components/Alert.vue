<!-- eslint-disable no-unreachable -->
<script setup>
import { useAlertState } from "@/store/alert";
import { computed } from "vue";

const { activeAlert, alertProps, toggleAlert } = useAlertState();

// eslint-disable-next-line vue/return-in-computed-property
const defaultTitle = computed(() => {
  switch (alertProps.type) {
    case "success":
      return "Success";
      break;
    case "warning":
      return "Warning";
      break;
    case "error":
      return "Error";
      break;
    case "info":
      return "Info";
      break;
    default:
      return "Info";
      break;
  }
});
</script>

<template>
  <div
    style="
      position: absolute;
      z-index: 9999;
      width: 100%;
      padding: 8px;
      padding-left: 263px;
    "
  >
    <v-alert
      v-model="activeAlert"
      variant="flat"
      prominent
      border
      closable
      :type="alertProps.type"
    >
      <v-row justify="space-between" align="center">
        <v-col cols="auto">
          <div>
            <span class="mt-3 font-weight-bold">
              {{ defaultTitle }}
            </span>
            <p class="text-subtitle-2">{{ alertProps.text }}</p>
          </div>
        </v-col>
        <v-col cols="auto">
          <v-btn
            size="small"
            variant="tonal"
            @click="(_$event) => toggleAlert(false)"
          >
            CLOSE
          </v-btn>
        </v-col>
      </v-row>
      <template #close> </template>
    </v-alert>
  </div>
</template>
