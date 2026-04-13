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


// Ultra visual PIE: lectura rápida de tarjetas clave
document.querySelectorAll('.idea-clave').forEach(box => {
  box.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(box.innerText);
    utterance.lang = 'es-CL';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  });
});


/* ===== Plataforma educativa local ===== */
const PLATFORM_KEYS = {
  profile: 'piePlatformProfile',
  progress: 'piePlatformProgress',
  result: 'piePlatformLatestResult',
  stars: 'piePlatformStars',
};

const SECTION_LABELS = {
  ideas: 'Ideas clave',
  teorias: 'Teorías evolutivas',
  pruebas: 'Pruebas de la evolución',
  conceptos: 'Conceptos clave',
  especiacion: 'Especiación',
  cuidado: 'Cuidado de la biodiversidad',
  xr: 'XR / 3D',
  quiz: 'Quiz final',
};

function getProfile() {
  try { return JSON.parse(localStorage.getItem(PLATFORM_KEYS.profile) || 'null'); }
  catch { return null; }
}
function setProfile(profile) {
  localStorage.setItem(PLATFORM_KEYS.profile, JSON.stringify(profile));
}
function getProgressMap() {
  try { return JSON.parse(localStorage.getItem(PLATFORM_KEYS.progress) || '{}'); }
  catch { return {}; }
}
function setProgressMap(map) {
  localStorage.setItem(PLATFORM_KEYS.progress, JSON.stringify(map));
}
function getLatestResult() {
  try { return JSON.parse(localStorage.getItem(PLATFORM_KEYS.result) || 'null'); }
  catch { return null; }
}
function setLatestResult(data) {
  localStorage.setItem(PLATFORM_KEYS.result, JSON.stringify(data));
}
function getStars() {
  return Number(localStorage.getItem(PLATFORM_KEYS.stars) || '0');
}
function setStars(value) {
  localStorage.setItem(PLATFORM_KEYS.stars, String(value));
}
function awardStars(value) {
  const current = getStars();
  setStars(current + value);
}
function sectionOrder() {
  return ['ideas','teorias','pruebas','conceptos','especiacion','cuidado','xr','quiz'];
}
function getOverallProgressPercent() {
  const map = getProgressMap();
  const total = sectionOrder().length;
  const completed = sectionOrder().filter(key => map[key]).length;
  return Math.round((completed / total) * 100);
}
function hydrateStudentBar() {
  const profile = getProfile();
  const nameChip = document.getElementById('studentNameChip');
  const courseChip = document.getElementById('studentCourseChip');
  const starsChip = document.getElementById('studentStarsChip');
  const loginBtn = document.getElementById('loginLinkBtn');

  if (nameChip) nameChip.textContent = profile?.name ? `👤 ${profile.name}` : '👤 Invitado';
  if (courseChip) courseChip.textContent = profile?.course ? profile.course : 'Curso no definido';
  if (starsChip) starsChip.textContent = `⭐ ${getStars()}`;
  if (loginBtn && profile?.name) loginBtn.textContent = 'Cambiar estudiante';
}

function attachSectionTracking() {
  const sections = document.querySelectorAll('section[data-track]');
  if (!sections.length) return;
  const map = getProgressMap();

  sections.forEach(section => {
    const key = section.dataset.track;
    const status = document.createElement('div');
    status.className = 'section-status';
    status.id = `status-${key}`;
    status.textContent = map[key] ? '✅ Sección completada' : '🕓 Sección pendiente';

    const actions = document.createElement('div');
    actions.className = 'track-actions';

    const completeBtn = document.createElement('button');
    completeBtn.type = 'button';
    completeBtn.className = 'btn btn-secondary compact-btn track-complete-btn';
    completeBtn.textContent = map[key] ? '✅ Marcada como completada' : 'Marcar como completada';

    if (map[key]) completeBtn.classList.add('done');

    completeBtn.addEventListener('click', () => {
      const progress = getProgressMap();
      const wasDone = !!progress[key];
      progress[key] = true;
      setProgressMap(progress);
      if (!wasDone) awardStars(1);
      status.textContent = '✅ Sección completada';
      completeBtn.textContent = '✅ Marcada como completada';
      completeBtn.classList.add('done');
      hydrateStudentBar();
    });

    const readBtn = document.createElement('button');
    readBtn.type = 'button';
    readBtn.className = 'btn btn-secondary compact-btn track-read-btn';
    readBtn.textContent = '🗣️ Escuchar sección';
    readBtn.addEventListener('click', () => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(section.innerText);
      utterance.lang = 'es-CL';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    });

    actions.appendChild(completeBtn);
    actions.appendChild(readBtn);

    const container = section.querySelector('.container') || section;
    container.appendChild(status);
    container.appendChild(actions);
  });
}

function attachLoginForm() {
  const form = document.getElementById('studentLoginForm');
  if (!form) return;
  const profile = getProfile();
  const nameInput = document.getElementById('studentNameInput');
  const courseInput = document.getElementById('studentCourseInput');
  const goalInput = document.getElementById('studentGoalInput');

  if (profile) {
    if (nameInput) nameInput.value = profile.name || '';
    if (courseInput) courseInput.value = profile.course || '';
    if (goalInput) goalInput.value = profile.goal || '';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nextProfile = {
      name: nameInput?.value.trim() || '',
      course: courseInput?.value || '',
      goal: goalInput?.value.trim() || '',
      updatedAt: new Date().toISOString()
    };
    setProfile(nextProfile);
    window.location.href = 'dashboard.html';
  });
}

function renderDashboard() {
  const dashName = document.getElementById('dashStudentName');
  if (!dashName) return;

  const profile = getProfile();
  const latest = getLatestResult();
  const progress = getProgressMap();
  const overall = getOverallProgressPercent();
  const stars = getStars();

  document.getElementById('dashStudentName').textContent = profile?.name || 'Estudiante sin configurar';
  document.getElementById('dashStudentCourse').textContent = profile?.course || 'Curso no definido';
  document.getElementById('dashStudentGoal').textContent = `Objetivo personal: ${profile?.goal || '—'}`;
  document.getElementById('dashOverallProgress').textContent = `${overall}%`;
  document.getElementById('dashOverallBar').style.width = `${overall}%`;
  document.getElementById('dashStars').textContent = `${stars} ⭐`;
  document.getElementById('dashGrade').textContent = latest?.grade || '1.0';
  document.getElementById('dashScoreLine').textContent = latest ? `Puntaje: ${latest.correct} / ${latest.total}` : 'Puntaje: 0 / 8';
  document.getElementById('dashBadge').textContent = latest?.badge || 'En progreso';

  const topicList = document.getElementById('topicList');
  if (topicList) {
    topicList.innerHTML = '';
    sectionOrder().forEach(key => {
      const item = document.createElement('div');
      item.className = `topic-item ${progress[key] ? 'done' : ''}`;
      item.innerHTML = `
        <div class="topic-item-name">${SECTION_LABELS[key]}</div>
        <div class="topic-item-status">${progress[key] ? 'Completada' : 'Pendiente'}</div>
        <a class="btn btn-secondary compact-btn" href="index.html#${key}">Abrir</a>
      `;
      topicList.appendChild(item);
    });
  }

  const recommendation = document.getElementById('dashRecommendation');
  if (recommendation) {
    const nextPending = sectionOrder().find(key => !progress[key]);
    recommendation.textContent = nextPending
      ? `Te recomiendo continuar con: ${SECTION_LABELS[nextPending]}.`
      : 'Completaste todas las secciones. Puedes repetir el quiz o explorar XR / 3D.';
  }

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem(PLATFORM_KEYS.profile);
    localStorage.removeItem(PLATFORM_KEYS.progress);
    localStorage.removeItem(PLATFORM_KEYS.result);
    localStorage.removeItem(PLATFORM_KEYS.stars);
    window.location.href = 'login.html';
  });
}

// Override and extend quiz grading
const previousGradeQuiz = gradeQuiz;
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

  const badge = badgeText?.textContent || 'En progreso';
  setLatestResult({
    correct,
    total,
    percent,
    grade,
    badge,
    savedAt: new Date().toISOString()
  });

  const progress = getProgressMap();
  progress.quiz = true;
  setProgressMap(progress);
  awardStars(Math.max(0, correct));
  hydrateStudentBar();
};

document.addEventListener('DOMContentLoaded', () => {
  hydrateStudentBar();
  attachSectionTracking();
  attachLoginForm();
  renderDashboard();
});



// ===== Cierre de clase y correo =====
const finishClassBtn = document.getElementById('finishClassBtn');
const finishClassMsg = document.getElementById('finishClassMsg');

function getStudentProfile() {
  try {
    const raw = localStorage.getItem('studentProfile') || localStorage.getItem('student') || localStorage.getItem('perfilEstudiante');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function getPlatformProgressPercent() {
  let percent = 0;

  const directKeys = ['progressPercent', 'overallProgress', 'courseProgress', 'progresoGeneral'];
  for (const key of directKeys) {
    const value = Number(localStorage.getItem(key));
    if (!Number.isNaN(value) && value > percent) percent = value;
  }

  // Fallback: estimate from section progress object if available
  const objectKeys = ['progress', 'courseSections', 'sectionProgress', 'progreso'];
  for (const key of objectKeys) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '{}');
      const values = Object.values(parsed).map(v => Number(v)).filter(v => !Number.isNaN(v));
      if (values.length) {
        const avg = values.reduce((a,b)=>a+b,0) / values.length;
        if (avg > percent) percent = avg;
      }
    } catch (e) {}
  }

  // Fallback from quiz answered score if nothing else
  if (!percent) {
    const quizPercentEl = document.getElementById('quizPercent');
    if (quizPercentEl) {
      const match = (quizPercentEl.textContent || '').match(/(\d+)/);
      if (match) percent = Number(match[1]);
    }
  }

  return Math.max(0, Math.min(100, Math.round(percent)));
}

function getSavedEvaluation() {
  const score = document.getElementById('quizScore')?.textContent || localStorage.getItem('quizScore') || '0';
  const percent = document.getElementById('quizPercent')?.textContent || localStorage.getItem('quizPercent') || '0%';
  const grade = document.getElementById('quizGrade')?.textContent || localStorage.getItem('quizGrade') || '1.0';
  const stars = document.getElementById('starCount')?.textContent || localStorage.getItem('starCount') || '0';
  const badge = document.getElementById('badgeText')?.textContent || localStorage.getItem('badgeText') || 'En progreso';
  return { score, percent, grade, stars, badge };
}

function updateFinishClassState() {
  if (!finishClassBtn) return;
  const progress = getPlatformProgressPercent();
  const enabled = progress >= 100;
  finishClassBtn.disabled = !enabled;
  if (finishClassMsg) {
    finishClassMsg.textContent = enabled
      ? 'El progreso llegó al 100%. Puedes preparar el correo de cierre de clase.'
      : `Progreso actual: ${progress}%. Completa el 100% para habilitar el envío.`;
  }
}

function buildFinishMailto() {
  const profile = getStudentProfile();
  const progress = getPlatformProgressPercent();
  const evalData = getSavedEvaluation();
  const nombre = profile.nombre || profile.name || profile.studentName || 'Estudiante sin nombre';
  const curso = profile.curso || profile.course || profile.nivel || 'Curso no indicado';
  const objetivo = profile.objetivo || profile.goal || 'Sin objetivo registrado';
  const fecha = new Date().toLocaleString('es-CL');

  const subject = `Cierre de clase - ${nombre} - ${curso}`;
  const body = [
    'Hola,',
    '',
    'Se informa el cierre de clase del siguiente estudiante:',
    '',
    `Nombre: ${nombre}`,
    `Curso: ${curso}`,
    `Objetivo: ${objetivo}`,
    `Fecha y hora: ${fecha}`,
    '',
    'Resumen de avance:',
    `Progreso general: ${progress}%`,
    `Puntaje quiz: ${evalData.score}`,
    `Porcentaje quiz: ${evalData.percent}`,
    `Nota final: ${evalData.grade}`,
    `Estrellas: ${evalData.stars}`,
    `Logro: ${evalData.badge}`,
    '',
    'Este correo fue preparado desde la plataforma local de biodiversidad.',
    '',
    'Saludos.'
  ].join('\n');

  return `mailto:belenacuna@liceosannicolas.cl,franciscopinto@liceosannicolas.cl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

finishClassBtn?.addEventListener('click', () => {
  const progress = getPlatformProgressPercent();
  if (progress < 100) {
    alert(`Aún no se puede terminar la clase. Progreso actual: ${progress}%.`);
    updateFinishClassState();
    return;
  }
  const mailto = buildFinishMailto();
  window.location.href = mailto;
});

// Persist quiz result values if available
function persistDisplayedResults() {
  const scoreEl = document.getElementById('quizScore');
  const percentEl = document.getElementById('quizPercent');
  const gradeEl = document.getElementById('quizGrade');
  const starsEl = document.getElementById('starCount');
  const badgeEl = document.getElementById('badgeText');

  if (scoreEl) localStorage.setItem('quizScore', scoreEl.textContent || '0');
  if (percentEl) localStorage.setItem('quizPercent', percentEl.textContent || '0%');
  if (gradeEl) localStorage.setItem('quizGrade', gradeEl.textContent || '1.0');
  if (starsEl) localStorage.setItem('starCount', starsEl.textContent || '0');
  if (badgeEl) localStorage.setItem('badgeText', badgeEl.textContent || 'En progreso');
}

// Wrap existing gradeQuiz if present
if (typeof gradeQuiz === 'function') {
  const _originalGradeQuiz = gradeQuiz;
  gradeQuiz = function() {
    _originalGradeQuiz();
    persistDisplayedResults();
    // when quiz complete, mirror percent if it hits 100
    const percentText = document.getElementById('quizPercent')?.textContent || '';
    const match = percentText.match(/(\d+)/);
    if (match) {
      const qPercent = Number(match[1]);
      if (!Number.isNaN(qPercent)) {
        localStorage.setItem('progressPercent', String(qPercent));
      }
    }
    updateFinishClassState();
  }
}

window.addEventListener('load', () => {
  persistDisplayedResults();
  updateFinishClassState();
});
