const body = document.body;
const root = document.documentElement;
const a11yToggle = document.getElementById('a11yToggle');
const a11yPanel = document.getElementById('a11yPanel');

const themeBtn = document.getElementById('themeBtn');
const contrastBtn = document.getElementById('contrastBtn');
const fontUpBtn = document.getElementById('fontUpBtn');
const fontDownBtn = document.getElementById('fontDownBtn');
const spacingBtn = document.getElementById('spacingBtn');
const dyslexiaBtn = document.getElementById('dyslexiaBtn');
const imagesBtn = document.getElementById('imagesBtn');
const focusBtn = document.getElementById('focusBtn');
const readBtn = document.getElementById('readBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

let fontScale = 1;

function togglePanel() {
  const isHidden = a11yPanel.hasAttribute('hidden');
  if (isHidden) {
    a11yPanel.removeAttribute('hidden');
  } else {
    a11yPanel.setAttribute('hidden', '');
  }
}

a11yToggle?.addEventListener('click', togglePanel);

themeBtn?.addEventListener('click', () => body.classList.toggle('light'));
contrastBtn?.addEventListener('click', () => body.classList.toggle('contrast'));
spacingBtn?.addEventListener('click', () => body.classList.toggle('spacious'));
dyslexiaBtn?.addEventListener('click', () => body.classList.toggle('dyslexia'));
imagesBtn?.addEventListener('click', () => body.classList.toggle('hide-images'));
focusBtn?.addEventListener('click', () => body.classList.toggle('focus-mode'));

function applyFontScale() {
  root.style.setProperty('--font-scale', fontScale.toFixed(2));
}

fontUpBtn?.addEventListener('click', () => {
  fontScale = Math.min(fontScale + 0.1, 1.8);
  applyFontScale();
});

fontDownBtn?.addEventListener('click', () => {
  fontScale = Math.max(fontScale - 0.1, 0.9);
  applyFontScale();
});

readBtn?.addEventListener('click', () => {
  if (!('speechSynthesis' in window)) {
    alert('Tu navegador no admite lectura en voz alta.');
    return;
  }
  window.speechSynthesis.cancel();
  const text = document.querySelector('main')?.innerText || '';
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-CL';
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
});

stopBtn?.addEventListener('click', () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
});

resetBtn?.addEventListener('click', () => {
  body.classList.remove('light', 'contrast', 'spacious', 'dyslexia', 'hide-images', 'focus-mode');
  fontScale = 1;
  applyFontScale();
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
});


// Quiz pro
const quizCards = document.querySelectorAll('.quiz-card');
const gradeQuizBtn = document.getElementById('gradeQuizBtn');
const resetQuizBtn = document.getElementById('resetQuizBtn');
const quizScore = document.getElementById('quizScore');
const quizPercent = document.getElementById('quizPercent');
const quizGrade = document.getElementById('quizGrade');
const quizProgressBar = document.getElementById('quizProgressBar');
const quizProgressText = document.getElementById('quizProgressText');

function updateQuizProgress() {
  const answeredCards = [...quizCards].filter(card => card.dataset.selected);
  const total = quizCards.length;
  const answered = answeredCards.length;
  const percent = total ? (answered / total) * 100 : 0;
  if (quizProgressBar) quizProgressBar.style.width = `${percent}%`;
  if (quizProgressText) quizProgressText.textContent = `${answered} de ${total} respondidas`;
}

function gradeQuiz() {
  let correct = 0;
  quizCards.forEach(card => {
    const selected = card.dataset.selected;
    const correctAnswer = card.dataset.answer;
    if (selected && selected === correctAnswer) correct += 1;
  });

  const total = quizCards.length || 1;
  const percent = Math.round((correct / total) * 100);
  const grade = (1 + (correct / total) * 6).toFixed(1);

  if (quizScore) quizScore.textContent = String(correct);
  if (quizPercent) quizPercent.textContent = `${percent}%`;
  if (quizGrade) quizGrade.textContent = grade;
}

function resetQuiz() {
  quizCards.forEach(card => {
    delete card.dataset.selected;
    card.classList.remove('answered');
    const feedback = card.querySelector('.feedback');
    const buttons = card.querySelectorAll('.answer');
    buttons.forEach(btn => btn.classList.remove('correct', 'wrong'));
    if (feedback) feedback.textContent = '';
  });

  if (quizScore) quizScore.textContent = '0';
  if (quizPercent) quizPercent.textContent = '0%';
  if (quizGrade) quizGrade.textContent = '1.0';
  updateQuizProgress();
}

quizCards.forEach(card => {
  const correctAnswer = card.dataset.answer;
  const feedback = card.querySelector('.feedback');
  const buttons = card.querySelectorAll('.answer');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      card.dataset.selected = button.dataset.choice;
      card.classList.add('answered');
      buttons.forEach(btn => btn.classList.remove('correct', 'wrong'));

      if (button.dataset.choice === correctAnswer) {
        button.classList.add('correct');
        if (feedback) {
          feedback.textContent = '✅ Correcto';
          feedback.className = 'feedback ok';
        }
      } else {
        button.classList.add('wrong');
        const correctButton = card.querySelector(`.answer[data-choice="${correctAnswer}"]`);
        correctButton?.classList.add('correct');
        if (feedback) {
          feedback.textContent = '❌ Revisa la alternativa correcta';
          feedback.className = 'feedback bad';
        }
      }

      updateQuizProgress();
    });
  });
});

gradeQuizBtn?.addEventListener('click', gradeQuiz);
resetQuizBtn?.addEventListener('click', resetQuiz);

updateQuizProgress();
