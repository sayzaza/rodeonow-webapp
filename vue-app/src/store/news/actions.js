import { getNews } from "@/services/news.service";

export const NewsActions = {
  async news({ commit }) {
  
    const response = await getNews(1);
    
    if (!response.error) {
      console.log(response.data)
      commit("setNews", response.data);
      console.log()
    }
  },
};