const getComponent = (component, node = document) =>
  node.querySelector(`[data-component="${component}"]`);

const defaultDatabase = {
  cards: Array(24).fill(false),
  testing: false,
};

let dayOfTheMonth = new Date().getDate();
let month = new Date().getMonth();

const getDatabase = () => {
  const savedDatabase = localStorage.getItem("db");
  if (savedDatabase) {
    return JSON.parse(savedDatabase);
  }
  localStorage.setItem("db", JSON.stringify(defaultDatabase));
  return defaultDatabase;
};

const database = getDatabase();

if (database.testing) {
  dayOfTheMonth = 31;
  month = 11;
}

const card = getComponent("card");
const cardContainer = getComponent("card-container");

for (let i = 1; i <= 24; i++) {
  const clonedNode = card.cloneNode(true);
  const emoji = getComponent("emoji", clonedNode);
  const number = getComponent("number", clonedNode);

  const isUnLocked = month === 11 && i <= dayOfTheMonth; // "🔒"
  const isSolved = database.cards[i - 1] ? "🎉" : "🎁";

  clonedNode.setAttribute("data-component", `card-${i}`);
  emoji.setAttribute("data-component", `emoji-${i}`);
  number.setAttribute("data-component", `number-${i}`);

  emoji.textContent = isUnLocked ? isSolved : "🔒";
  number.textContent = i.toString().padStart(2, "0");

  if (isUnLocked) {
    clonedNode.addEventListener("click", () => {
      window.location.href = `./door.html?door=${i}`;
    });
  } else {
    clonedNode.setAttribute("disabled", "");
  }

  cardContainer.appendChild(clonedNode);
}

card.remove();
