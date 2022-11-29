const data = fetch("./data.json").then((response) => response.json());

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const door = params.door;
const gif = document.getElementById("gif");

const setData = (doorData) => {
  if (!doorData) {
    window.location.href = "./index.html";
  }
  gif.src = doorData.gif;
};

const loadData = async () => {
  const rawData = await fetch("./data.json");
  const data = await rawData.json();
  const doorData = data.riddles.find((riddle) => riddle.number == door);
  setData(doorData);
};

loadData();
window.addEventListener("load", function () {
  startConfetti();
  setTimeout(() => {
    stopConfetti();
  }, 5000);
});
