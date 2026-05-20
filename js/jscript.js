(function () {
      // Функция генерации короткого звука (щелчок) без внешних файлов
      function playBeep() {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const audioCtx = new AudioContext();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.frequency.value = 880;
          gainNode.gain.value = 0.2;
          oscillator.start();
          gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
          oscillator.stop(audioCtx.currentTime + 0.3);
          if (audioCtx.state === 'suspended') {
            audioCtx.resume();
          }
        } catch (e) {
          console.warn('Звук не поддерживается', e);
        }
      }
// ----- Логика переворота и игры "Угадай число" -----
(function() {
  // Находим карточку игры
  const gameCard = document.getElementById('game-guess-number');
  if (!gameCard) return;
  
  let secretNumber = null;
  let attempts = 0;
  
  // Элементы игры
  let guessInput, checkBtn, feedbackMsg, attemptsSpan, newGameBtn, backBtn;
  
  // Функция инициализации игры (генерирует новое число, сбрасывает попытки)
  function initGame(resetAttempts = true) {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    if (resetAttempts) {
      attempts = 0;
      if (attemptsSpan) attemptsSpan.textContent = `Попыток: ${attempts}`;
    }
    if (feedbackMsg) {
      feedbackMsg.textContent = '';
      feedbackMsg.style.color = '';
    }
    if (guessInput) {
      guessInput.value = '';
      guessInput.disabled = false;
    }
    if (checkBtn) checkBtn.disabled = false;
    console.log('Новая игра! Загадано:', secretNumber); // для отладки (можно убрать)
  }
  
  // Проверка введённого числа
  function checkGuess() {
    if (!guessInput || !feedbackMsg) return;
    const rawValue = guessInput.value.trim();
    if (rawValue === '') {
      feedbackMsg.textContent = 'Введите число!';
      feedbackMsg.style.color = '#f44336';
      return;
    }
    const guess = Number(rawValue);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      feedbackMsg.textContent = 'Введите число от 1 до 100.';
      feedbackMsg.style.color = '#f44336';
      return;
    }
    
    attempts++;
    if (attemptsSpan) attemptsSpan.textContent = `Попыток: ${attempts}`;
    
    if (guess === secretNumber) {
      feedbackMsg.textContent = `🎉 Поздравляю! Ты угадал число ${secretNumber} за ${attempts} попыток! 🎉`;
      feedbackMsg.style.color = '#4caf50';
      if (guessInput) guessInput.disabled = true;
      if (checkBtn) checkBtn.disabled = true;
    } else if (guess < secretNumber) {
      feedbackMsg.textContent = '📈 Загаданное число БОЛЬШЕ. Попробуй ещё!';
      feedbackMsg.style.color = '#ff9800';
    } else {
      feedbackMsg.textContent = '📉 Загаданное число МЕНЬШЕ. Попробуй ещё!';
      feedbackMsg.style.color = '#ff9800';
    }
  }
  
  // Переворот карточки (показать игровую сторону)
  function flipToGame() {
    gameCard.classList.add('flipped');
    // Инициализируем игру, когда карточка перевернулась
    // Но элементы DOM уже должны быть доступны
    setTimeout(() => {
      if (!secretNumber) initGame(true);
    }, 100);
  }
  
  // Вернуться на лицевую сторону
  function flipToFront() {
    gameCard.classList.remove('flipped');
    // Не сбрасываем игру – при следующем открытии можно начать новую
    // (можно по желанию сбросить, но оставим как есть)
  }
  
  // Подключаем обработчики после того, как DOM загружен
  function bindGameEvents() {
    guessInput = document.getElementById('guessInput');
    checkBtn = document.getElementById('checkGuessBtn');
    feedbackMsg = document.getElementById('feedbackMessage');
    attemptsSpan = document.getElementById('attemptsCount');
    newGameBtn = document.getElementById('newGameBtn');
    backBtn = document.getElementById('backToFrontBtn');
    
    if (checkBtn) checkBtn.addEventListener('click', checkGuess);
    if (newGameBtn) newGameBtn.addEventListener('click', () => initGame(true));
    if (backBtn) backBtn.addEventListener('click', flipToFront);
    if (guessInput) {
      guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkGuess();
      });
    }
    
    // Инициализируем игру (но не запускаем до переворота)
    initGame(true);
  }
  
  // Находим кнопку "Играть!" внутри этой карточки (с классом play-guess-number)
  const playBtn = gameCard.querySelector('.play-guess-number');
  if (playBtn) {
    // Убираем стандартный обработчик, который вешает общий скрипт (если есть)
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      flipToGame();
    });
  }
  
  // Дожидаемся готовности DOM, чтобы найти элементы игры
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindGameEvents);
  } else {
    bindGameEvents();
  }
})();
      function highlightElement(element) {
        if (!element) return;
        element.classList.add('mini-game-card-highlight');
        setTimeout(() => {
          element.classList.remove('mini-game-card-highlight');
        }, 1000);
      }

      const gameCardLinks = document.querySelectorAll('.games-section__grid a');
      gameCardLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            playBeep();
            targetSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
            setTimeout(() => {
              highlightElement(targetSection);
            }, 400);
          } else {
            alert(`Раздел с игрой "${link.querySelector('.game-card__name')?.textContent || 'игра'}" пока недоступен.`);
          }
        });
      });

      const startBtn = document.querySelector('.header__button-start');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          const gamesSection = document.querySelector('.games-section');
          if (gamesSection) {
            gamesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            alert('Добро пожаловать! Список игр ниже ↓');
          }
        });
      }

    const allPlayButtons = document.querySelectorAll('.mini-game-card__button-play');
allPlayButtons.forEach((btn) => {
  // Если это кнопка игры "Угадай число" – не добавляем alert
  if (btn.classList.contains('play-guess-number')) {
    return;
  }
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.mini-game-card');
    const gameTitle = card?.querySelector('.mini-game-card__title')?.innerText || 'игра';
    alert(`✨ Запуск "${gameTitle}"\nЗдесь будет логика игры. ✨`);
  });
});
    })();