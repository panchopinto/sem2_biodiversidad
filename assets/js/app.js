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

// Quiz
const quizCards = document.querySelectorAll('.quiz-card');
quizCards.forEach(card => {
  const correctAnswer = card.dataset.answer;
  const feedback = card.querySelector('.feedback');
  const buttons = card.querySelectorAll('.answer');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('correct', 'wrong'));
      if (button.dataset.choice === correctAnswer) {
        button.classList.add('correct');
        feedback.textContent = '✅ Correcto';
      } else {
        button.classList.add('wrong');
        const correctButton = card.querySelector(`.answer[data-choice="${correctAnswer}"]`);
        correctButton?.classList.add('correct');
        feedback.textContent = '❌ Revisa la respuesta correcta';
      }
    });
  });
});


// ===== PIE FUNCIONES =====

// lectura por bloque
function leer(texto){
    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = 'es-CL';
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
}

// modo foco
function activarFoco(id){
    document.body.classList.add('focus-mode');
    document.getElementById(id).classList.add('focus-content');
}

function salirFoco(){
    document.body.classList.remove('focus-mode');
}
