const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;
let statusApp = "stop";
let workDuration = 25 * 60; // 25 minutos para el trabajo
let shortBreakDuration = 5 * 60; // 5 minutos de descanso corto
let longBreakDuration = 15 * 60; // 15 minutos de descanso largo
let sessions = 0;

const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");

const audio = document.querySelector("#audio"); // Referencia al elemento de audio

renderTasks();
renderTime();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (itTask.value !== "") {
    createTask(itTask.value);
    itTask.value = "";
    renderTasks();
  }
});

function createTask(value) {
  const newTask = {
    id: Date.now().toString(36),
    title: value,
    completed: false,
  };
  tasks.unshift(newTask);
}

function renderTasks() {
  const html = tasks.map((task) => {
    return `
        <div class="task">
          <div class="completed">${
            task.completed
              ? "<span class='done'>Done</span>"
              : `<button class="start-button" data-id="${task.id}">Start</button></div>`
          }
          <div class="title">${task.title}</div>
        </div>`;
  });
  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");

  const startButtons = document.querySelectorAll(".task .start-button");
  startButtons.forEach((startButton) => {
    startButton.addEventListener("click", () => {
      if (!timer && !timerBreak) {
        startButtonHandler(startButton.getAttribute("data-id"));
        startButton.textContent = "In progress...";
        startButton.disabled = true;
      }
    });
  });
}

function startButtonHandler(id) {
  time = workDuration;
  current = id;
  const taskId = tasks.findIndex((task) => task.id === id);
  document.querySelector("#time #taskName").textContent = tasks[taskId].title;
  timer = setInterval(() => {
    timerHandler(id);
  }, 1000);
}

function timerHandler(id = null) {
  time--;
  renderTime();
  if (time === 0) {
    markComplete(id);
    clearInterval(timer);
    timer = null;
    sessions++;
    renderTasks();
    playSound(); // Reproducir sonido al finalizar la sesión de trabajo
    if (sessions % 4 === 0) {
      startBreak(longBreakDuration); // Descanso largo cada 4 sesiones
    } else {
      startBreak(shortBreakDuration); // Descanso corto después de cada sesión de trabajo
    }
  }
}

function markComplete(id) {
  const taskId = tasks.findIndex((task) => task.id === id);
  tasks[taskId].completed = true;
}

function startBreak(duration) {
  time = duration;
  document.querySelector("#time #taskName").textContent = "Break";
  renderTime();
  timerBreak = setInterval(timerBreakHandler, 1000);
}

function timerBreakHandler() {
  time--;
  renderTime();
  if (time === 0) {
    clearInterval(timerBreak);
    timerBreak = null;
    current = null;
    playSound(); // Reproducir sonido al finalizar el descanso
    document.querySelector("#time #taskName").textContent = "";
    renderTime();
    renderTasks();
  }
}

function renderTime() {
  const timeDiv = document.querySelector("#time #value");
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);
  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function playSound() {
  audio.play(); // Reproducir el sonido
}
