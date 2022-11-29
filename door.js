const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");

const data = fetch("./data.json").then((response) => response.json());

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const door = params.door;

const database = JSON.parse(localStorage.getItem("db"));

const compareAnswerAndSolution = (answer, solution) => {
  return solution.every((category) => {
    return category.some((item) =>
      answer.toLowerCase().includes(item.toLowerCase())
    );
  });
};

const transitionToSuccess = () => {
  const newCards = database.cards.map((card, i) => {
    if (i == door - 1) {
      return true;
    } else {
      return card;
    }
  });
  const newDatabase = {
    ...database,
    cards: newCards,
  };
  localStorage.setItem("db", JSON.stringify(newDatabase));
  window.location.href = `./success.html?door=${door}`;
};

const transitionToFailure = () => {
  modalText.textContent = "Leider falsch 😞";
  setTimeout(() => {
    modal.classList.remove("opacity-100");
    modal.classList.add("opacity-0");
  }, 2000);
};

const handleAnswer = (answer, solution) => {
  modalText.textContent = "Ist die Antwort wirklich richtig? 🤔";
  modal.classList.add("opacity-100");
  modal.classList.remove("opacity-0");
  setTimeout(() => {
    modalText.textContent = "Die Lösung kommt in 3";
  }, 2000);
  setTimeout(() => {
    modalText.textContent = "Die Lösung kommt in 2";
  }, 3000);
  setTimeout(() => {
    modalText.textContent = "Die Lösung kommt in 1";
  }, 4000);
  setTimeout(() => {
    modalText.textContent = "...";
  }, 5000);
  setTimeout(() => {
    compareAnswerAndSolution(answer, solution)
      ? transitionToSuccess()
      : transitionToFailure();
  }, 6000);
};

const setData = (doorData) => {
  if (!doorData) {
    window.location.href = "./index.html";
  }

  const title = document.getElementById("title");
  const question = document.getElementById("question");
  const submit = document.getElementById("submit");
  const input = document.getElementById("input");

  title.textContent = `Türchen ${doorData.number}`;
  question.textContent = doorData.question;

  submit.addEventListener("click", () => {
    console.log(doorData.solution);
    handleAnswer(input.value, doorData.solution);
  });
};

const loadData = async () => {
  const rawData = await fetch("./data.json");
  const data = await rawData.json();
  const doorData = data.riddles.find((riddle) => riddle.number == door);
  setData(doorData);
};

loadData();
