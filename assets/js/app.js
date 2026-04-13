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


// Gamificación + quiz extendido
const starCount = document.getElementById('starCount');
const badgeText = document.getElementById('badgeText');

function updateGamification(correct, total) {
  const stars = correct;
  const percent = Math.round((correct / total) * 100);
  let badge = 'En progreso';
  if (percent >= 90) badge = 'Experto en evolución';
  else if (percent >= 75) badge = 'Muy buen dominio';
  else if (percent >= 50) badge = 'Buen comienzo';
  if (starCount) starCount.textContent = String(stars);
  if (badgeText) badgeText.textContent = badge;
}

const originalGradeQuiz = gradeQuiz;
gradeQuiz = function() {
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
  updateGamification(correct, total);
};

// Modo guiado
const guidedModeBtn = document.getElementById('guidedModeBtn');
const guidedSections = [...document.querySelectorAll('main > section')].filter(section => section.id && section.id !== 'accesibilidad');
let guidedIndex = 0;

const guidedControls = document.createElement('div');
guidedControls.className = 'guided-controls';
guidedControls.innerHTML = `
  <span class="guided-chip" id="guidedChip">Paso 1 de 1</span>
  <button type="button" class="btn btn-secondary" id="guidedPrevBtn">← Anterior</button>
  <button type="button" class="btn btn-primary" id="guidedNextBtn">Siguiente →</button>
  <button type="button" class="btn btn-secondary" id="guidedExitBtn">Salir</button>
`;
document.body.appendChild(guidedControls);

const guidedChip = document.getElementById('guidedChip');
const guidedPrevBtn = document.getElementById('guidedPrevBtn');
const guidedNextBtn = document.getElementById('guidedNextBtn');
const guidedExitBtn = document.getElementById('guidedExitBtn');

function renderGuidedMode() {
  guidedSections.forEach(section => section.classList.remove('guided-current'));
  const current = guidedSections[guidedIndex];
  if (!current) return;
  current.classList.add('guided-current');
  current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (guidedChip) guidedChip.textContent = `Paso ${guidedIndex + 1} de ${guidedSections.length}`;
  if (guidedPrevBtn) guidedPrevBtn.disabled = guidedIndex === 0;
  if (guidedNextBtn) guidedNextBtn.disabled = guidedIndex === guidedSections.length - 1;
}

function startGuidedMode() {
  body.classList.add('guided-active');
  guidedIndex = 0;
  renderGuidedMode();
}

function stopGuidedMode() {
  body.classList.remove('guided-active');
  guidedSections.forEach(section => section.classList.remove('guided-current'));
}

guidedModeBtn?.addEventListener('click', startGuidedMode);
guidedPrevBtn?.addEventListener('click', () => {
  guidedIndex = Math.max(0, guidedIndex - 1);
  renderGuidedMode();
});
guidedNextBtn?.addEventListener('click', () => {
  guidedIndex = Math.min(guidedSections.length - 1, guidedIndex + 1);
  renderGuidedMode();
});
guidedExitBtn?.addEventListener('click', stopGuidedMode);

// Simulador simple
const envRange = document.getElementById('envRange');
const envLabel = document.getElementById('envLabel');
const lightChance = document.getElementById('lightChance');
const darkChance = document.getElementById('darkChance');
const simStage = document.getElementById('simStage');
const simExplanation = document.getElementById('simExplanation');

function updateSimulation() {
  if (!envRange) return;
  const value = Number(envRange.value);
  const dark = value;
  const light = 100 - value;

  if (lightChance) lightChance.textContent = `${light}%`;
  if (darkChance) darkChance.textContent = `${dark}%`;

  if (value < 35) {
    simStage?.classList.add('light-env');
    simStage?.classList.remove('dark-env');
    if (envLabel) envLabel.textContent = 'Claro';
    if (simExplanation) simExplanation.textContent = 'En un ambiente claro, la mariposa clara se camufla mejor y aumenta su probabilidad de sobrevivir.';
  } else if (value > 65) {
    simStage?.classList.add('dark-env');
    simStage?.classList.remove('light-env');
    if (envLabel) envLabel.textContent = 'Oscuro';
    if (simExplanation) simExplanation.textContent = 'En un ambiente oscuro, la mariposa oscura se camufla mejor y aumenta su probabilidad de sobrevivir.';
  } else {
    simStage?.classList.remove('light-env', 'dark-env');
    if (envLabel) envLabel.textContent = 'Intermedio';
    if (simExplanation) simExplanation.textContent = 'En un ambiente intermedio, ninguna variante tiene una ventaja tan marcada y ambas pueden sobrevivir en proporciones parecidas.';
  }
}
envRange?.addEventListener('input', updateSimulation);
updateSimulation();
