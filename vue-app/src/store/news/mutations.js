
export const NewsMutations = {
  setNews(state, news) {
    console.log("hereeee")
    state.news = news;
  },
  addNews(state, news) {
    const newArr = [];
    for (const property in state.news) {
      newArr.push(state.news[property]);
    }
    news.forEach((item) => {
      newArr.push(item);
    });
    state.news = newArr;
  },
};