const symbols = ['🍒', '🍋', '🍊', '🍉', '🍇', '🍀'];
const spinButton = document.getElementById('spinButton');
const loanButton = document.getElementById('loanButton');
const repayButton = document.getElementById('repayButton');
const resultDisplay = document.getElementById('result');
const balanceDisplay = document.getElementById('balance');
const debtDisplay = document.getElementById('debt');

let balance = 5000; // Начальный баланс
let debt = 0; // Начальный долг

spinButton.addEventListener('click', () => {
    if (balance < 100) {
        resultDisplay.textContent = "Недостаточно средств для вращения!";
        return;
    }

    balance -= 100; 
    updateBalance(); 

    const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    let delays = [0, 300, 600];

    reels.forEach((reel, index) => {
        setTimeout(() => {
            reel.classList.add('spin');

            const randomSymbol = Math.floor(Math.random() * symbols.length);
            setTimeout(() => {
                reel.textContent = symbols[randomSymbol];
                reel.classList.remove('spin');

                if (index === reels.length - 1) {
                    checkWin(reels);
                    // Очищаем слоты через 5 секунд
                    setTimeout(() => {
                        reels.forEach(reel => {
                            reel.textContent = ''; // Очищаем символы
                        });
                    }, 800); // 5000 мс = 5 секунд
                }
            }, 1200);
        }, delays[index]);
    });
});

loanButton.addEventListener('click', () => {
    debt += 1000; 
    balance += 1000; 
    updateBalance(); 
    updateDebt(); 
    resultDisplay.textContent = "Вы взяли в долг 1000!";
});

repayButton.addEventListener('click', () => {
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

function checkWin(reels) {
    const results = reels.map(reel => reel.textContent);

    // Проверка выигрыша только при совпадении трех символов
    if (results[0] === results[1] && results[1] === results[2]) {
        resultDisplay.textContent = "Вы выиграли!";
        balance += 100000; 
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
        origin: { y: 0.6 } // Позиция начала конфетти
    });
}

function updateBalance() {
    balanceDisplay.textContent = `Баланс: ${balance}`;
}

function updateDebt() {
    debtDisplay.textContent = `Долг: ${debt}`;
}
reels.forEach((reel, index) => {
    setTimeout(() => {
        reel.classList.add('spin');

        const randomSymbol = Math.floor(Math.random() * symbols.length);
        setTimeout(() => {
            reel.textContent = symbols[randomSymbol];
            reel.classList.remove('spin');

            if (index === reels.length - 1) {
                checkWin(reels);
                // Очищаем слоты через 5 секунд
                setTimeout(() => {
                    reels.forEach(reel => {
                        reel.textContent = ''; // Очищаем символы
                    });
                }, 5000);
            }
        }, 2000); // Увеличиваем время до появления символов на 2000 мс
    }, delays[index]);
});
function updateBalance() {
    balanceDisplay.textContent = `Баланс: ${balance}`;
    localStorage.setItem('balance', balance); // Сохраняем баланс в localStorage
}
window.addEventListener('load', () => {
    const savedBalance = localStorage.getItem('balance');
    if (savedBalance) {
        balance = parseInt(savedBalance, 10); // Загружаем сохраненный баланс
    }
    updateBalance(); // Обновляем отображение баланса
});