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
      setTimeout(() => {
        if (!secretNumber) initGame(true);
      }, 100);
    }
    
    // Вернуться на лицевую сторону
    function flipToFront() {
      gameCard.classList.remove('flipped');
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
      
      initGame(true);
    }
    
    const playBtn = gameCard.querySelector('.play-guess-number');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        flipToGame();
      });
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindGameEvents);
    } else {
      bindGameEvents();
    }
  })();

  // ----- Логика переворота и игры "Простая арифметика" -----
  (function() {
    const mathCard = document.getElementById('game-simple-math');
    if (!mathCard) return;
    
    let currentQuestion = { text: '', answer: 0 };
    let score = 0;
    
    // Элементы игры
    let questionSpan, answerInput, checkBtn, feedbackP, scoreSpan, newBtn, backBtn;
    
    // Генерация случайного примера
    function generateQuestion() {
      const operators = ['+', '-', '*', '/'];
      const op = operators[Math.floor(Math.random() * operators.length)];
      let a, b, answer;
      
      switch(op) {
        case '+':
          a = Math.floor(Math.random() * 50) + 1;
          b = Math.floor(Math.random() * 50) + 1;
          answer = a + b;
          currentQuestion.text = `${a} + ${b}`;
          break;
        case '-':
          a = Math.floor(Math.random() * 50) + 1;
          b = Math.floor(Math.random() * a) + 1;
          answer = a - b;
          currentQuestion.text = `${a} - ${b}`;
          break;
        case '*':
          a = Math.floor(Math.random() * 12) + 1;
          b = Math.floor(Math.random() * 12) + 1;
          answer = a * b;
          currentQuestion.text = `${a} × ${b}`;
          break;
        case '/':
          b = Math.floor(Math.random() * 12) + 1;
          answer = Math.floor(Math.random() * 12) + 1;
          a = b * answer;
          currentQuestion.text = `${a} ÷ ${b}`;
          break;
      }
      currentQuestion.answer = answer;
      if (questionSpan) questionSpan.textContent = currentQuestion.text;
    }
    
    // Проверка ответа
    function checkMathAnswer() {
      if (!answerInput || !feedbackP) return;
      const userAnswer = Number(answerInput.value.trim());
      if (isNaN(userAnswer)) {
        feedbackP.textContent = 'Введите число!';
        feedbackP.style.color = '#ffaaaa';
        return;
      }
      
      if (userAnswer === currentQuestion.answer) {
        score++;
        feedbackP.textContent = '✅ Верно! +1 очко';
        feedbackP.style.color = '#a5ffa5';
        generateQuestion();
        answerInput.value = '';
      } else {
        feedbackP.textContent = `❌ Неверно! Правильный ответ: ${currentQuestion.answer}`;
        feedbackP.style.color = '#ffaaaa';
      }
      if (scoreSpan) scoreSpan.textContent = `Счёт: ${score}`;
    }
    
    // Новая игра (сброс счёта и новый вопрос)
    function resetMathGame() {
      score = 0;
      if (scoreSpan) scoreSpan.textContent = `Счёт: ${score}`;
      generateQuestion();
      if (answerInput) answerInput.value = '';
      if (feedbackP) feedbackP.textContent = '';
    }
    
    // Переворот к игре
    function flipToMathGame() {
      mathCard.classList.add('flipped');
      setTimeout(() => {
        if (!currentQuestion.text) resetMathGame();
      }, 100);
    }
    
    function flipToFrontMath() {
      mathCard.classList.remove('flipped');
    }
    
    // Привязка элементов и обработчиков
    function bindMathEvents() {
      questionSpan = document.getElementById('mathQuestion');
      answerInput = document.getElementById('mathAnswer');
      checkBtn = document.getElementById('checkMathBtn');
      feedbackP = document.getElementById('mathFeedback');
      scoreSpan = document.getElementById('mathScore');
      newBtn = document.getElementById('newMathBtn');
      backBtn = document.getElementById('backFromMathBtn');
      
      if (checkBtn) checkBtn.addEventListener('click', checkMathAnswer);
      if (newBtn) newBtn.addEventListener('click', resetMathGame);
      if (backBtn) backBtn.addEventListener('click', flipToFrontMath);
      if (answerInput) {
        answerInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') checkMathAnswer();
        });
      }
      
      generateQuestion();
    }
    
    const mathPlayBtn = mathCard.querySelector('.play-simple-math');
    if (mathPlayBtn) {
      mathPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        flipToMathGame();
      });
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindMathEvents);
    } else {
      bindMathEvents();
    }
  })();

  // ----- Остальные функции сайта -----
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

  // Общий обработчик для кнопок "Играть!" (исключая кастомные игры)
  const allPlayButtons = document.querySelectorAll('.mini-game-card__button-play');
  allPlayButtons.forEach((btn) => {
    // Пропускаем кнопки с кастомными играми
    if (btn.classList.contains('play-guess-number') || btn.classList.contains('play-simple-math')) {
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