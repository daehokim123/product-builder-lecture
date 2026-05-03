const lottoArea = document.getElementById("lottoNumbers");
const generateButton = document.getElementById("generateButton");
const modeToggle = document.getElementById("modeToggle");
const contactForm = document.getElementById("contactForm");

// 다크 모드 초기화 및 토글 로직
function initDarkMode() {
  const isDark = localStorage.getItem("darkMode") === "true" || 
                 (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  if (isDark) {
    document.body.classList.add("dark-mode");
    modeToggle.textContent = "🌙";
  }
}

modeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark);
  modeToggle.textContent = isDark ? "🌙" : "☀️";
});

function createInitialSets() {
  const sets = Array.from({ length: 5 }, () => Array(6).fill("?"));
  renderLottoSets(sets);
}

function generateFiveLotto() {
  const sets = Array.from({ length: 5 }, generateOneLotto);
  renderLottoSets(sets);
}

function generateOneLotto() {
  const numbers = [];

  while (numbers.length < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;

    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }

  return numbers.sort((a, b) => a - b);
}

function renderLottoSets(sets) {
  lottoArea.innerHTML = "";

  sets.forEach((numbers, index) => {
    const lottoSet = document.createElement("article");
    lottoSet.className = "lotto-set";

    const setTitle = document.createElement("div");
    setTitle.className = "set-title";
    setTitle.textContent = `${index + 1}세트`;

    const numbersArea = document.createElement("div");
    numbersArea.className = "numbers";

    numbers.forEach((number) => {
      const ball = document.createElement("div");
      ball.className = number === "?" ? "ball placeholder" : `ball ${getBallColor(number)}`;
      ball.textContent = number;
      numbersArea.appendChild(ball);
    });

    lottoSet.appendChild(setTitle);
    lottoSet.appendChild(numbersArea);
    lottoArea.appendChild(lottoSet);
  });
}

function getBallColor(number) {
  if (number <= 10) return "range-1";
  if (number <= 20) return "range-2";
  if (number <= 30) return "range-3";
  if (number <= 40) return "range-4";
  return "range-5";
}

generateButton.addEventListener("click", generateFiveLotto);
initDarkMode();
createInitialSets();
