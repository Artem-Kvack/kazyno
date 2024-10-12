// Массив символов для слота
const symbols = ["🍒", "🍋", "🍊", "🍉", "🍇", "🍀"];

// Получаем элементы управления
const spinButton = document.getElementById("spinButton");
const loanButton = document.getElementById("loanButton");
const repayButton = document.getElementById("repayButton");
const jackpot = document.getElementById("jackpot");
const resultDisplay = document.getElementById("result");
const balanceDisplay = document.getElementById("balance");
const debtDisplay = document.getElementById("debt");
const spinsDisplay = document.getElementById("spins");
const buySpinsButton = document.getElementById("buySpinsButton");

// Начальные значения
let balance = 5000; // Начальный баланс
let debt = 0; // Начальный долг
let spins = 5; // Начальное количество спинов (изменено на 5)

// Обновление интерфейса с учетом состояния кнопки
function updateSpinButtonState() {
  spinButton.disabled = spins < 5; // Кнопка недоступна, если недостаточно спинов
}

// Обновление значений в интерфейсе
updateSpinButtonState();

// Обработчик для кнопки спина
spinButton.addEventListener("click", () => {
  if (spins < 5) {
    resultDisplay.textContent = "Недостаточно спинов для прокрутки!";
    return;
  }

  spins -= 5; // Уменьшаем количество спинов на 5
  updateSpins(); // Обновляем количество спинов
  spinButton.disabled = true; // Делаем кнопку недоступной

  const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
  ];
  const delays = [0, 300, 600];

  const isWin = Math.random() < 0.0001; // Шанс 0.01%

  reels.forEach((reel, index) => {
    setTimeout(() => {
      reel.classList.add("spin");

      setTimeout(() => {
        // Обновление текста символа в зависимости от выигрыша
        reel.textContent = isWin
          ? symbols[0] // В случае выигрыша показываем символ "🍒"
          : symbols[Math.floor(Math.random() * symbols.length)];
        reel.classList.remove("spin");

        // Проверка выигрыша после завершения анимации последнего барабана
        if (index === reels.length - 1) {
          checkWin(isWin, reels);

          // Очищаем слоты через полсекунды после показа всех символов
          setTimeout(() => {
            reels.forEach((reel) => {
              reel.textContent = ""; // Очищаем символы
            });
            spinButton.disabled = false; // Включаем кнопку после очистки
          }, 500);
        }
      }, 1200);
    }, delays[index]);
  });
});

// Обработка кредита
loanButton.addEventListener("click", () => {
  debt += 1700; // Увеличиваем долг на 1700
  balance += 1000; // Увеличиваем баланс на 1000
  updateBalance();
  updateDebt();
  resultDisplay.textContent = "Вы взяли в долг 1000! Долг увеличился на 1700.";
});

// Обработка возврата долга
repayButton.addEventListener("click", () => {
  if (debt === 0) {
    resultDisplay.textContent = "У вас нет долга!";
    return;
  }

  const repaymentAmount = Math.min(debt, 500); // Вернуть 500 или меньше, если долг меньше
  balance -= repaymentAmount; // Списываем с баланса
  debt -= repaymentAmount; // Уменьшаем долг
  updateBalance();
  updateDebt();
  resultDisplay.textContent = `Вы вернули ${repaymentAmount} в долг. Остаток долга: ${debt}.`;
});

// Покупка спинов за очки
buySpinsButton.addEventListener("click", () => {
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

// Проверка выигрыша
function checkWin(isWin, reels) {
  if (isWin) {
    resultDisplay.textContent = "Вы выиграли!";
    balance += 200000; // Увеличиваем баланс при выигрыше
    launchConfetti(); // Запускаем конфетти
  } else if (
    reels[0].textContent === "🍀" &&
    reels[1].textContent === "🍀" &&
    reels[2].textContent === "🍀"
  ) {
    balance += 600000; // Увеличиваем баланс на 600000
    jackpot.style.opacity = 1; // Показываем сообщение
    jackpot.classList.remove("hidden"); // Убираем скрытие
    setTimeout(() => {
      jackpot.style.opacity = 0; // Убираем сообщение через 2 секунды
      jackpot.classList.add("hidden"); // Скрываем элемент
    }, 2000);
    resultDisplay.textContent = "Вы выиграли Супер выигрыш!"; // Обновляем результат
  } else {
    resultDisplay.textContent = "Попробуйте снова!";
  }

  updateBalance(); // Обновляем баланс
}

// Запуск конфетти
function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

// Обновление баланса
function updateBalance() {
  balanceDisplay.textContent = `Баланс: ${balance}`;
  localStorage.setItem("balance", balance); // Сохраняем баланс
}

// Обновление количества спинов
function updateSpins() {
  spinsDisplay.textContent = `Спины: ${spins}`;
  updateSpinButtonState(); // Обновляем состояние кнопки спина
  localStorage.setItem("spins", spins); // Сохраняем количество спинов
}

// Обновление долга
function updateDebt() {
  debtDisplay.textContent = `Долг: ${debt}`;
  localStorage.setItem("debt", debt); // Сохраняем долг
}

// Загрузка сохраненных данных
window.addEventListener("load", () => {
  const savedBalance = localStorage.getItem("balance");
  if (savedBalance) {
    balance = parseInt(savedBalance, 10);
  }

  const savedSpins = localStorage.getItem("spins");
  if (savedSpins) {
    spins = parseInt(savedSpins, 10);
  } else {
    spins = 5; // Устанавливаем 5 спинов, если сохраненные данные отсутствуют
  }

  const savedDebt = localStorage.getItem("debt");
  if (savedDebt) {
    debt = parseInt(savedDebt, 10);
  }

  updateBalance();
  updateSpins();
  updateDebt();
});
