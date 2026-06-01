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
    const gameCard = document.getElementById('game-guess-number');
    if (!gameCard) return;
    
    let secretNumber = null;
    let attempts = 0;
    let guessInput, checkBtn, feedbackMsg, attemptsSpan, newGameBtn, backBtn;
    
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
    }
    
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
    
    function flipToGame() {
      gameCard.classList.add('flipped');
      setTimeout(() => {
        if (!secretNumber) initGame(true);
      }, 100);
    }
    
    function flipToFront() {
      gameCard.classList.remove('flipped');
    }
    
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
    let questionSpan, answerInput, checkBtn, feedbackP, scoreSpan, newBtn, backBtn;
    
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
    
    function resetMathGame() {
      score = 0;
      if (scoreSpan) scoreSpan.textContent = `Счёт: ${score}`;
      generateQuestion();
      if (answerInput) answerInput.value = '';
      if (feedbackP) feedbackP.textContent = '';
    }
    
    function flipToMathGame() {
      mathCard.classList.add('flipped');
      setTimeout(() => {
        if (!currentQuestion.text) resetMathGame();
      }, 100);
    }
    
    function flipToFrontMath() {
      mathCard.classList.remove('flipped');
    }
    
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

  // ----- Логика переворота и игры "Переверни текст" -----
  (function() {
    const reverseCard = document.getElementById('game-reverse-text');
    if (!reverseCard) return;
    
    let reverseInput, reverseBtn, reverseResult, clearBtn, backBtn;
    
    function flipToReverse() {
      reverseCard.classList.add('flipped');
    }
    
    function flipFromReverse() {
      reverseCard.classList.remove('flipped');
    }
    
    function reverseText() {
      const text = reverseInput.value;
      if (text.trim() === '') {
        reverseResult.textContent = '⚠️ Введите текст!';
        return;
      }
      const reversed = text.split('').reverse().join('');
      reverseResult.textContent = `Результат: ${reversed}`;
    }
    
    function clearReverse() {
      reverseInput.value = '';
      reverseResult.textContent = '';
    }
    
    function bindReverseEvents() {
      reverseInput = document.getElementById('reverseInput');
      reverseBtn = document.getElementById('reverseBtn');
      reverseResult = document.getElementById('reverseResult');
      clearBtn = document.getElementById('clearReverseBtn');
      backBtn = document.getElementById('backFromReverseBtn');
      
      if (reverseBtn) reverseBtn.addEventListener('click', reverseText);
      if (clearBtn) clearBtn.addEventListener('click', clearReverse);
      if (backBtn) backBtn.addEventListener('click', flipFromReverse);
      if (reverseInput) {
        reverseInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') reverseText();
        });
      }
    }
    
    const playReverseBtn = reverseCard.querySelector('.play-reverse-text');
    if (playReverseBtn) {
      playReverseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        flipToReverse();
      });
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindReverseEvents);
    } else {
      bindReverseEvents();
    }
  })();

  // ----- Логика переворота и игры "Викторина" -----
  (function() {
    const quizCard = document.getElementById('game-quiz');
    if (!quizCard) return;
    
    // Массив вопросов по вселенной Лавкрафта (10 вопросов)
    const quiz = [
      {
        question: "Как называется знаменитое божество-спрут, созданное Лавкрафтом?",
        options: ["1. Азатот", "2. Ктулху", "3. Йог-Сотот"],
        correctAnswer: 2
      },
      {
        question: "В каком городе происходит действие большинства рассказов Лавкрафта?",
        options: ["1. Аркхем", "2. Данвич", "3. Иннсмут"],
        correctAnswer: 1
      },
      {
        question: "Кто является автором «Некрономикона» в мифах Лавкрафта?",
        options: ["1. Абдул Альхазред", "2. Герберт Уэст", "3. Рэндольф Картер"],
        correctAnswer: 1
      },
      {
        question: "Как называется существо из рассказа «Тень над Иннсмутом»?",
        options: ["1. Глубоководные", "2. Ми-го", "3. Шогготы"],
        correctAnswer: 1
      },
      {
        question: "Какой бог в мифах Лавкрафта известен как «Слепой идиотский бог»?",
        options: ["1. Ньярлатхотеп", "2. Азатот", "3. Ктулху"],
        correctAnswer: 2
      },
      {
        question: "Как называется вымышленный оккультный университет в Аркхеме?",
        options: ["1. Университет Данвича", "2. Университет Мискатоника", "3. Университет Кингспорта"],
        correctAnswer: 2
      },
      {
        question: "Какой из этих рассказов Лавкрафта считается самым известным?",
        options: ["1. Зов Ктулху", "2. Хребты безумия", "3. Случай Чарльза Декстера Варда"],
        correctAnswer: 1
      },
      {
        question: "Кто такой Рэндольф Картер?",
        options: ["1. Ученый-оккультист", "2. Главный герой нескольких рассказов", "3. Древнее божество"],
        correctAnswer: 2
      },
      {
        question: "Как называются крылатые существа-грибы с Юггот?",
        options: ["1. Гончие Тиндала", "2. Ми-го", "3. Старцы"],
        correctAnswer: 2
      },
      {
        question: "Какой город в мифах Лавкрафта знаменит своими ведьмами?",
        options: ["1. Аркхем", "2. Данвич", "3. Кингспорт"],
        correctAnswer: 2
      }
    ];
    
    let startBtn, quizResultSpan, backBtn;
    
    function flipToQuiz() {
      quizCard.classList.add('flipped');
    }
    
    function flipFromQuiz() {
      quizCard.classList.remove('flipped');
      if (quizResultSpan) quizResultSpan.textContent = '';
    }
    
    function runQuiz() {
      let correctCount = 0;
      let userAnswers = [];
      
      for (let i = 0; i < quiz.length; i++) {
        const q = quiz[i];
        let userAnswer = prompt(`${i + 1}. ${q.question}\n${q.options.join('\n')}\n\nВведите номер ответа (1, 2 или 3):`);
        
        if (userAnswer === null) {
          alert('Викторина прервана. Хотите начать заново?');
          return;
        }
        
        const answerNum = parseInt(userAnswer);
        const isCorrect = (answerNum === q.correctAnswer);
        
        if (isCorrect) {
          correctCount++;
          userAnswers.push(`${i + 1}. ${q.question} - ✅ Правильно`);
        } else {
          let correctText = q.options[q.correctAnswer - 1];
          userAnswers.push(`${i + 1}. ${q.question} - ❌ Неправильно (Правильный ответ: ${correctText})`);
        }
      }
      
      const percentage = (correctCount / quiz.length) * 100;
      let gradeMessage = '';
      
      if (percentage === 100) {
        gradeMessage = '🏆 Истинный знаток Лавкрафта! Ф’тагн! 🏆';
      } else if (percentage >= 80) {
        gradeMessage = '📖 Отлично! Ктулху бы гордился тобой! 📖';
      } else if (percentage >= 60) {
        gradeMessage = '🌊 Неплохо! Погружение в Мифы продолжается! 🌊';
      } else if (percentage >= 40) {
        gradeMessage = '📚 Советую почитать Лавкрафта! Путь к безумию только начинается! 📚';
      } else {
        gradeMessage = '💀 Твой разум ещё не готов... Изучи Мифы Ктулху и вернись! 💀';
      }
      
      const resultText = `Результат: ${correctCount} / ${quiz.length} (${percentage}%)\n${gradeMessage}`;
      alert(`✅ ${resultText}`);
      
      if (quizResultSpan) {
        quizResultSpan.innerHTML = `${resultText.replace(/\n/g, '<br>')}`;
      }
    }
    
    function bindQuizEvents() {
      startBtn = document.getElementById('startQuizBtn');
      quizResultSpan = document.getElementById('quizResult');
      backBtn = document.getElementById('backFromQuizBtn');
      
      if (startBtn) startBtn.addEventListener('click', runQuiz);
      if (backBtn) backBtn.addEventListener('click', flipFromQuiz);
    }
    
    const playQuizBtn = quizCard.querySelector('.play-quiz');
    if (playQuizBtn) {
      playQuizBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        flipToQuiz();
      });
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindQuizEvents);
    } else {
      bindQuizEvents();
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
    if (btn.classList.contains('play-guess-number') || 
        btn.classList.contains('play-simple-math') ||
        btn.classList.contains('play-reverse-text') ||
        btn.classList.contains('play-quiz')) {
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