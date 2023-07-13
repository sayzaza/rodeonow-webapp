const events = [
  "Bull Riding",
  "Bareback Riding",
  "Saddle Bronc",
  "Team Roping",
  "Barrell Racing",
  "Steer Wrestling",
  "Tie Down Roping",
  "Breakaway Roping",
  "Pole Bending",
  "Goat Tying",
];

const parseEvents = (arr = []) => {
  return arr.map((event) => events.at(event == 0 ? 0 : event - 1)).join(", ");
};

export { parseEvents };

export default events;
