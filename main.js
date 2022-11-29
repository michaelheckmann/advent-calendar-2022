const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const getComponent = (component, node = document) =>
  node.querySelector(`[data-component="${component}"]`);

const defaultDatabase = {
  cards: Array(24).fill(false),
  testing: false,
};

let dayOfTheMonth = new Date().getDate();
let month = new Date().getMonth();

// https://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed
const shuffle = (array, seed) => {
  let m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(random(seed) * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed;
  }
  return array;
};

const random = (seed) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const getDatabase = () => {
  const savedDatabase = localStorage.getItem("db");
  if (savedDatabase) {
    return JSON.parse(savedDatabase);
  }
  localStorage.setItem("db", JSON.stringify(defaultDatabase));
  return defaultDatabase;
};

const database = getDatabase();

if (database.testing || params.testing === "true") {
  dayOfTheMonth = 31;
  month = 11;
}

const card = getComponent("card");
const cardContainer = getComponent("card-container");

const randomOrder = shuffle(
  Array(24)
    .fill(0)
    .map((_, i) => i),
  dayOfTheMonth
);

for (let i = 1; i <= 24; i++) {
  const day = randomOrder[i - 1] + 1;
  const clonedNode = card.cloneNode(true);
  const emoji = getComponent("emoji", clonedNode);
  const number = getComponent("number", clonedNode);

  const isUnLocked = month === 11 && day <= dayOfTheMonth;
  const isSolved = database.cards[day - 1] ? "🎉" : "🎁";

  clonedNode.setAttribute("data-component", `card-${day}`);
  emoji.setAttribute("data-component", `emoji-${day}`);
  number.setAttribute("data-component", `number-${day}`);

  emoji.textContent = isUnLocked ? isSolved : "🔒";
  number.textContent = day.toString().padStart(2, "0");

  if (isUnLocked) {
    clonedNode.addEventListener("click", () => {
      window.location.href = `./door.html?door=${day}`;
    });
  } else {
    clonedNode.setAttribute("disabled", "");
  }

  cardContainer.appendChild(clonedNode);
}

card.remove();
