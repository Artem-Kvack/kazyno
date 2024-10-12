const symbols = ["🍒", "🍋", "🍊", "🍉", "🍇", "🍀"];
const spinButton = document.getElementById("spinButton");
const loanButton = document.getElementById("loanButton");
const repayButton = document.getElementById("repayButton");

const resultDisplay = document.getElementById("result");
const balanceDisplay = document.getElementById("balance");
const debtDisplay = document.getElementById("debt");
const spinsDisplay = document.getElementById("spins");

let balance = 5000; // Начальный баланс
let debt = 0; // Начальный долг
let spins = 0; // Количество спинов

spinButton.addEventListener("click", () => {
  if (spins < 5) {
    resultDisplay.textContent = "Недостаточно спинов для прокрутки!";
    return;
  }

  spins -= 5; // Уменьшаем количество спинов на 5
  updateSpins(); // Обновляем количество спинов
  spinButton.disabled = true;
  const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
  ];
  let delays = [0, 300, 600];

  const isWin = Math.random() * 100000 < 1; // Шанс 0.1% (1 из 1000)

  reels.forEach((reel, index) => {
    setTimeout(() => {
      reel.classList.add("spin");

      setTimeout(() => {
        if (isWin) {
          reel.textContent = symbols[0]; // При выигрыше одинаковые символы
        } else {
          const randomSymbol = Math.floor(Math.random() * symbols.length);
          reel.textContent = symbols[randomSymbol];
        }

        reel.classList.remove("spin");

        if (index === reels.length - 1) {
          checkWin(isWin); // Проверка выигрыша

          // Очищаем слоты через 0.5 секунды
          setTimeout(() => {
            reels.forEach((reel) => {
              reel.textContent = ""; // Очищаем символы
            });
          }, 500); // Очищение через 500 мс
          spinButton.disabled = false;
        }
      }, 1200);
    }, delays[index]);
  });
});

loanButton.addEventListener("click", () => {
  debt += 1000;
  balance += 1000;
  updateBalance();
  updateDebt();
  resultDisplay.textContent = "Вы взяли в долг 2000!";
});

repayButton.addEventListener("click", () => {
  if (debt === 0) {
    resultDisplay.textContent = "У вас нет долга!";
    return;
  }

  let repaymentAmount = Math.min(debt, 500);
  balance -= repaymentAmount;
  debt -= repaymentAmount;
  updateBalance();
  updateDebt();
  resultDisplay.textContent = `Вы вернули ${repaymentAmount} в долг.`;
});

// Покупка спинов за очки
document.getElementById("buySpinsButton").addEventListener("click", () => {
  if (balance >= 1000) {
    balance -= 1000; // Списываем 1000 поинтов
    spins += 10; // Добавляем 10 спинов
    updateBalance();
    updateSpins();
    resultDisplay.textContent = "Вы купили 10 спинов!";
  } else {
    resultDisplay.textContent = "Недостаточно средств для покупки спинов!";
  }
});

function checkWin(isWin) {
  if (isWin) {
    resultDisplay.textContent = "Вы выиграли!";
    balance += 200000;
    launchConfetti();
  } else {
    resultDisplay.textContent = "Попробуйте снова!";
  }

  updateBalance();
}

function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

function updateBalance() {
  balanceDisplay.textContent = `Баланс: ${balance}`;
  localStorage.setItem("balance", balance); // Сохраняем баланс
}

function updateSpins() {
  spinsDisplay.textContent = `Спины: ${spins}`;
  localStorage.setItem("spins", spins); // Сохраняем количество спинов
}

function updateDebt() {
  debtDisplay.textContent = `Долг: ${debt}`;
  localStorage.setItem("debt", debt); // Сохраняем долг
}

window.addEventListener("load", () => {
  const savedBalance = localStorage.getItem("balance");
  if (savedBalance) {
    balance = parseInt(savedBalance, 10);
  }

  const savedSpins = localStorage.getItem("spins");
  if (savedSpins) {
    spins = parseInt(savedSpins, 10);
  }

  const savedDebt = localStorage.getItem("debt");
  if (savedDebt) {
    debt = parseInt(savedDebt, 10);
  }

  updateBalance();
  updateSpins();
  updateDebt();
});

loanButton.addEventListener("click", () => {
  debt += 1700; // Добавляем долг 1700 за каждый взятый кредит
  balance += 1000; // При этом добавляем 1000 на баланс
  updateBalance();
  updateDebt();
  resultDisplay.textContent = "Вы взяли в долг 1000! Долг увеличился на 1700.";
});

repayButton.addEventListener("click", () => {
  if (debt === 0) {
    resultDisplay.textContent = "У вас нет долга!";
    return;
  }

  let repaymentAmount = Math.min(debt, 500); // Вернуть 500 или меньше, если долг меньше
  balance -= repaymentAmount; // Списываем с баланса
  debt -= repaymentAmount; // Уменьшаем долг
  updateBalance();
  updateDebt();
  resultDisplay.textContent = `Вы вернули ${repaymentAmount} в долг. Остаток долга: ${debt}.`;
});

function updateDebt() {
  debtDisplay.textContent = `Долг: ${debt}`;
  localStorage.setItem("debt", debt); // Сохраняем долг
}
