document.getElementById("game").addEventListener("click", function (e) {
  const ripplePool = [];
  const maxRipples = 2;
  let ripple;
  if (ripplePool.length < maxRipples) {
    ripple = document.createElement("div");
    ripple.className = "ripple";
    this.appendChild(ripple);
    ripplePool.push(ripple);
  } else {
    ripple = ripplePool.shift();
    this.appendChild(ripple);
    ripplePool.push(ripple);
  }

  const diameter = Math.min(this.clientWidth, this.clientHeight);
  const radius = diameter / 2;
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${e.clientX - this.offsetLeft - radius}px`;
  ripple.style.top = `${e.clientY - this.offsetTop - radius}px`;

  const color = `hsla(${360 * Math.random()}, 100%, 50%, 0.3)`;
  ripple.style.background = color;

  ripple.style.animation = "none"; // Сброс текущей анимации
  ripple.offsetHeight; // Принудительный reflow
  ripple.style.animation = "ripple-animation 0.6s linear";

  ripple.addEventListener(
    "animationend",
    () => {
      ripple.remove(); // Удаление элемента из DOM после завершения анимации
      const index = ripplePool.indexOf(ripple);
      if (index > -1) {
        ripplePool.splice(index, 1); // Удаление элемента из пула
      }
    },
    { once: true },
  );
});

document.addEventListener("DOMContentLoaded", function () {
  const cat = document.getElementById("cat");
  const originalCoin = document.getElementById("coin");
  const maxCoins = 10;
  const coinPool = [];

  if (!cat || !originalCoin) {
    console.error("Ошибка: элементы 'cat' или 'coin' не найдены в DOM.");
    return;
  }

  cat.addEventListener("click", function () {
    if (this.classList.contains("animating")) {
      return;
    }
    this.classList.add("animating");
    const isFlipped = this.classList.toggle("flip-horizontal");

    this.style.transform = `scale(${isFlipped ? "-1" : "1"}, 0.9)`;
    setTimeout(() => {
      this.style.transform = `scale(${isFlipped ? "-1" : "1"}, 1)`;
      this.classList.remove("animating");
    }, 200);

    manageCoinAnimation(originalCoin, coinPool, maxCoins);
    updateGameStats();
  });
});

function manageCoinAnimation(originalCoin, coinPool, maxCoins) {
  let newCoin = coinPool.find(
    (coin) => !coin.classList.contains("animate-coin"),
  );
  if (!newCoin && coinPool.length < maxCoins) {
    newCoin = originalCoin.cloneNode(true);
    originalCoin.parentNode.insertBefore(newCoin, originalCoin.nextSibling);
    coinPool.push(newCoin);
  }
  if (newCoin) {
    newCoin.style.visibility = "visible";
    newCoin.style.opacity = "1";
    newCoin.classList.add("animate-coin");
    newCoin.addEventListener(
      "animationend",
      () => {
        newCoin.style.visibility = "hidden";
        newCoin.classList.remove("animate-coin");
      },
      { once: true },
    );
  }
}

function updateGameStats() {
  let currentExp = parseInt(
    document.getElementById("exp-value").textContent,
    10,
  );
  let currentBalance = parseFloat(
    document.getElementById("balance-value").textContent,
  );
  let expToNextLevel = parseInt(
    document.getElementById("exp-next-level").textContent,
    10,
  );

  currentExp += 1;
  currentBalance += 0.1;

  if (currentExp >= expToNextLevel) {
    currentExp -= expToNextLevel;
    expToNextLevel = Math.floor(expToNextLevel * 1.5);
    document.getElementById("level-value").textContent =
      parseInt(document.getElementById("level-value").textContent, 10) + 1;
    document.getElementById("exp-next-level").textContent = expToNextLevel;
  }

  document.getElementById("exp-value").textContent = currentExp;
  document.getElementById("balance-value").textContent =
    currentBalance.toFixed(1);
  updateExpBar(currentExp, expToNextLevel);
}

function updateExpBar(currentExp, expToNextLevel) {
  const percent = (currentExp / expToNextLevel) * 100;
  document.getElementById("exp-bar").style.width = `${percent}%`;
}
