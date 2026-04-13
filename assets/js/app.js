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

let score=0;
let progress=0;

function q(v){
 if(v){score+=50;alert("Correcto 👍")}else alert("Intenta otra vez 💡");
 progress+=25; updateBar();
}
function q2(v){
 if(v){score+=50;alert("Correcto 👍")}else alert("Intenta otra vez 💡");
 progress+=25; updateBar();
 let nota=1+(score/100)*6;
 document.getElementById("nota").innerHTML="Nota: "+nota.toFixed(1);
}

function updateBar(){
 document.getElementById("bar").style.width=progress+"%";
}

function toggleTheme(){
 document.body.classList.toggle("light");
}

function incFont(){
 document.body.style.fontSize="22px";
}
function decFont(){
 document.body.style.fontSize="16px";
}

function leerPagina(){
 let t=document.body.innerText;
 let s=new SpeechSynthesisUtterance(t);
 s.lang="es-CL";
 speechSynthesis.speak(s);
}

function q3(v){
 if(v){score+=50;alert("Correcto 👍")}else alert("Intenta otra vez 💡");
 progress+=25; updateBar();
}

function q4(v){
 if(v){score+=50;alert("Correcto 👍")}else alert("Intenta otra vez 💡");
 progress+=25; updateBar();
 let nota=1+(score/200)*6;
 document.getElementById("nota").innerHTML="Nota: "+nota.toFixed(1);
}
