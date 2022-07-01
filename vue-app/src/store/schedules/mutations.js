
export const SchedulesMutations = {
  setSchedules(state, schedules) {
    console.log("hereeee")
    state.schedules = schedules;
  },
  addSchedules(state, schedules) {
    const newArr = [];
    for (const property in state.schedules) {
      newArr.push(state.schedules[property]);
    }
    schedules.forEach((item) => {
      newArr.push(item);
    });
    state.schedules = newArr;
  },
};