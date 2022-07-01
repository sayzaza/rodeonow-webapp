import { getSchedules } from "@/services/news.service";

export const SchedulesActions = {
  async schedules({ commit }) {
  
    const response = await getSchedules(1);
    if (!response.error) {
      console.log(response.data)
      commit("setSchedules", response.data);
      console.log()
    }
  },
};