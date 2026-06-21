// ============================================
// GAME STATE
// ============================================
const state = {
  playerName: '',
  lives: 5,
  gems: 0,
};

// ============================================
// CONTENT DATA
// ============================================

const level1Rounds = [
  {
    prompt: "SCEGLI I PRIMI 2!",
    pickCount: 2,
    items: [
      { id: 'guanti',     name: 'GUANTI',            desc: '',                                                                                                   emoji: '🧤', correct: true  },
      { id: 'pcr',        name: 'MACCHINA PCR',       desc: 'Amplifica il genoma dei batteri e scopre quali microrganismi hai campionato',                        emoji: '🔬', correct: false },
      { id: 'giggenbach', name: 'GIGGENBACH',         desc: 'Bottiglia di vetro per raccogliere gas grazie a un sistema di valvole',                             emoji: '🫙', correct: true  },
    ]
  },
  {
    prompt: "SCEGLI I PROSSIMI 2!",
    pickCount: 2,
    items: [
      { id: 'filtri',  name: 'FILTRI',          desc: 'Utilizzati per evitare la contaminazione microbica',                                                    emoji: '🔵', correct: true  },
      { id: 'falcon',  name: 'FALCON',          desc: 'Provetta di plastica usata per raccogliere i campioni',                                                 emoji: '🧪', correct: true  },
      { id: 'cappa',   name: 'CAPPA BIOLOGICA', desc: "Area di lavoro sterile che protegge le scienziate/gli scienziati, il campione e l'ambiente",            emoji: '🏗️', correct: false },
    ]
  },
  {
    prompt: "SCEGLI I PROSSIMI 2!",
    pickCount: 2,
    items: [
      { id: 'autoclave', name: 'AUTOCLAVE',        desc: 'Strumento che sterilizza attrezzature con vapore ad alta pressione e temperatura',                   emoji: '⚙️', correct: false },
      { id: 'hungate',   name: 'HUNGATE TUBES',    desc: 'Provette di vetro utilizzate per colture anaerobiche',                                               emoji: '🧫', correct: true  },
      { id: 'spettro',   name: 'SPETTROFOTOMETRO', desc: "Misura quanta luce viene assorbita o trasmessa da una soluzione per capire la concentrazione",       emoji: '📡', correct: true  },
    ]
  },
  {
    prompt: "SCEGLI L'ULTIMO!",
    pickCount: 1,
    items: [
      { id: 'freezer',     name: 'FREEZER',           desc: 'Per conservare i campioni a -80°C',                                                              emoji: '🧊', correct: false },
      { id: 'pompa',       name: 'POMPA PERISTALTICA', desc: 'Dispositivo che sposta liquidi attraverso un tubo comprimendolo in modo ciclico',               emoji: '🔄', correct: true  },
      { id: 'microscopio', name: 'MICROSCOPIO',       desc: 'Per osservare i nostri microrganismi',                                                           emoji: '🔭', correct: false },
    ]
  }
];

const level2Locations = [
  { id: 'falda',    name: 'FALDA ACQUIFERA',   emoji: '💧', correct: true  },
  { id: 'bottiglie', name: "BOTTIGLIE D'ACQUA", emoji: '🍶', correct: false },
  { id: 'caverne',  name: 'CAVERNE ROCCIOSE',  emoji: '🪨', correct: true  },
  { id: 'foresta',  name: 'FORESTA',           emoji: '🌲', correct: false },
  { id: 'sale',     name: 'CAVERNE DI SALE',   emoji: '🧂', correct: true  },
];

const level3Steps = [
  { id: 1, text: 'estrazione del DNA',                                                                     color: '#4ddf8a' },
  { id: 2, text: 'analisi ioni e cationi ed elementi in traccia nei fluidi e sedimenti',                   color: '#ff7bf8' },
  { id: 3, text: 'analisi dei gas',                                                                        color: '#ffd700' },
  { id: 4, text: 'continuare crescita dei microrganismi con condizioni controllate di temperatura',        color: '#00d4ff' },
  { id: 5, text: 'osservazione al microscopio dei microrganismi',                                          color: '#00d4ff' },
  { id: 6, text: 'sequenziamento del DNA',                                                                 color: '#9090ff' },
  { id: 7, text: 'analisi bioinformatiche',                                                                color: '#ff7bf8' },
  { id: 8, text: 'ricerca di particolari enzimi batterici come le idrogenasi',                             color: '#ffd700' },
];

// ============================================
// NAVIGATION
// ============================================

function goToScene(id) {
  document.querySelectorAll('.scene').forEach(s => s.style.display = 'none');
  const scene = document.getElementById(id);
  if (scene) scene.style.display = 'flex';

  const hud = document.getElementById('hud');
  if (id === 'scene-0' || id === 'scene-2') {
    hud.style.display = 'none';
  } else {
    hud.style.display = 'flex';
    updateHUD();
  }
}

function updateHUD() {
  document.getElementById('hud-gems').textContent = String(state.gems).padStart(2, '0');
  const nameEl = document.getElementById('hud-name');
  if (nameEl) nameEl.textContent = state.playerName.toUpperCase();

  const heartsEl = document.getElementById('hud-hearts');
  heartsEl.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const h = document.createElement('span');
    h.className = 'heart-icon';
    h.textContent = i < state.lives ? '♥' : '♡';
    h.style.color = i < state.lives ? '#ff7bf8' : '#444';
    heartsEl.appendChild(h);
  }
}

// ============================================
// SCENE 0 → 1
// ============================================

function startGame() {
  const saved = localStorage.getItem('playerName');
  if (saved) {
    state.playerName = saved;
    const inp = document.getElementById('player-name');
    if (inp) inp.value = saved;
  }
  goToScene('scene-1');
}

// ============================================
// SCENE 2: NAME
// ============================================

function saveName() {
  const name = document.getElementById('player-name').value.trim();
  if (!name) {
    alert('Inserisci il tuo nome!');
    return;
  }
  state.playerName = name;
  localStorage.setItem('playerName', name);
  goToScene('scene-3');
}

// ============================================
// LEVEL 1: ITEM SELECTION
// ============================================

let l1Round = 0;
let l1Selection = [];

function startLevel1() {
  l1Round = 0;
  l1Selection = [];
  renderL1Round();
  goToScene('scene-l1');
}

function renderL1Round() {
  const round = level1Rounds[l1Round];
  const scene = document.getElementById('scene-l1');

  scene.innerHTML = `
    <div class="level-spacer"></div>
    <div class="l1-layout">
      <div class="l1-left">
        <h1 class="pixel-text l1-counter">PUOI PORTARE<br>CON TE 7<br>OGGETTI.</h1>
        <p class="pixel-text l1-prompt">${round.prompt}</p>
        <div class="l1-pip-row">
          ${Array.from({length: round.pickCount}, (_, i) => `<span class="l1-pip" id="pip-${i}">◇</span>`).join('')}
        </div>
      </div>
      <div class="l1-items" id="l1-items">
        ${round.items.map(item => `
          <div class="item-card" id="card-${item.id}" onclick="toggleL1Item('${item.id}')">
            <div class="item-card-img">
              <span class="item-emoji">${item.emoji}</span>
            </div>
            <div class="item-card-info">
              <p class="pixel-text item-name">♦ ${item.name}</p>
              ${item.desc ? `<p class="item-desc">${item.desc}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <button class="start-btn pixel-text" id="l1-btn" onclick="confirmL1Round()" disabled style="opacity:0.4">
      ▶ CONFERMA
    </button>
  `;

  l1Selection = [];
}

function toggleL1Item(itemId) {
  const round = level1Rounds[l1Round];
  const card = document.getElementById(`card-${itemId}`);

  if (l1Selection.includes(itemId)) {
    l1Selection = l1Selection.filter(id => id !== itemId);
    card.classList.remove('card-selected');
  } else {
    if (l1Selection.length >= round.pickCount) return;
    l1Selection.push(itemId);
    card.classList.add('card-selected');
  }

  // Update pips
  for (let i = 0; i < round.pickCount; i++) {
    const pip = document.getElementById(`pip-${i}`);
    if (pip) pip.textContent = i < l1Selection.length ? '◆' : '◇';
  }

  const btn = document.getElementById('l1-btn');
  const ready = l1Selection.length === round.pickCount;
  btn.disabled = !ready;
  btn.style.opacity = ready ? '1' : '0.4';
}

function confirmL1Round() {
  const round = level1Rounds[l1Round];
  const wrongIds = l1Selection.filter(id => {
    const item = round.items.find(i => i.id === id);
    return !item.correct;
  });

  if (wrongIds.length > 0) {
    state.lives = Math.max(0, state.lives - 1);
    updateHUD();

    wrongIds.forEach(id => {
      const card = document.getElementById(`card-${id}`);
      card.classList.remove('card-selected');
      card.classList.add('card-wrong');
      card.innerHTML += '<div class="card-404">404<br><small>NOT FOUND</small></div>';
    });

    showFeedback('❌ Questo oggetto non si porta sul campo!<br>Riprova!', false, () => {
      round.items.forEach(item => {
        const card = document.getElementById(`card-${item.id}`);
        if (card) {
          card.classList.remove('card-wrong', 'card-selected');
          const err = card.querySelector('.card-404');
          if (err) err.remove();
        }
      });
      l1Selection = [];
      for (let i = 0; i < round.pickCount; i++) {
        const pip = document.getElementById(`pip-${i}`);
        if (pip) pip.textContent = '◇';
      }
      const btn = document.getElementById('l1-btn');
      btn.disabled = true;
      btn.style.opacity = '0.4';
    });
    return;
  }

  // Correct!
  state.gems += l1Selection.length;
  l1Selection.forEach(id => {
    const card = document.getElementById(`card-${id}`);
    if (card) card.classList.add('card-correct');
  });

  setTimeout(() => {
    l1Round++;
    updateHUD();
    if (l1Round < level1Rounds.length) {
      renderL1Round();
    } else {
      goToScene('scene-l1-end');
    }
  }, 900);
}

// ============================================
// LEVEL 2: LOCATION SELECTION
// ============================================

let l2Selection = [];

function startLevel2() {
  l2Selection = [];
  renderL2();
  goToScene('scene-l2');
}

function renderL2() {
  const scene = document.getElementById('scene-l2');
  scene.innerHTML = `
    <div class="level-spacer"></div>
    <h1 class="pixel-text level-title" style="color:#ff7bf8">LIVELLO 2</h1>
    <p class="pixel-text level-subtitle" style="color:#6dfc9b">
      ORA SCEGLI I <span style="color:#ffd700">3 LUOGHI</span> DOVE CAMPIONARE
    </p>
    <div class="l2-grid" id="l2-grid">
      ${level2Locations.map(loc => `
        <div class="loc-card" id="loc-${loc.id}" onclick="toggleL2Location('${loc.id}')">
          <div class="loc-emoji">${loc.emoji}</div>
          <p class="pixel-text loc-name">${loc.name}</p>
        </div>
      `).join('')}
    </div>
    <p class="pixel-text l2-counter">Selezionati: <span id="l2-count">0</span>/3</p>
    <button class="start-btn pixel-text" id="l2-btn" onclick="confirmL2()" disabled style="opacity:0.4">
      ▶ CONFERMA
    </button>
  `;
}

function toggleL2Location(locId) {
  const card = document.getElementById(`loc-${locId}`);

  if (l2Selection.includes(locId)) {
    l2Selection = l2Selection.filter(id => id !== locId);
    card.classList.remove('card-selected');
  } else {
    if (l2Selection.length >= 3) return;
    l2Selection.push(locId);
    card.classList.add('card-selected');
  }

  document.getElementById('l2-count').textContent = l2Selection.length;
  const btn = document.getElementById('l2-btn');
  const ready = l2Selection.length === 3;
  btn.disabled = !ready;
  btn.style.opacity = ready ? '1' : '0.4';
}

function confirmL2() {
  const wrongIds = l2Selection.filter(id => {
    const loc = level2Locations.find(l => l.id === id);
    return !loc.correct;
  });

  if (wrongIds.length > 0) {
    state.lives = Math.max(0, state.lives - wrongIds.length);
    updateHUD();

    wrongIds.forEach(id => {
      const card = document.getElementById(`loc-${id}`);
      card.classList.remove('card-selected');
      card.classList.add('card-wrong');
      card.innerHTML += '<div class="card-404 loc-404">404<br><small>NOT FOUND</small></div>';
    });

    showFeedback('❌ Qui non troverai idrogeno naturale!<br>Riprova!', false, () => {
      level2Locations.forEach(loc => {
        const card = document.getElementById(`loc-${loc.id}`);
        if (card) {
          card.classList.remove('card-wrong', 'card-selected');
          const err = card.querySelector('.card-404');
          if (err) err.remove();
        }
      });
      l2Selection = [];
      document.getElementById('l2-count').textContent = '0';
      const btn = document.getElementById('l2-btn');
      btn.disabled = true;
      btn.style.opacity = '0.4';
    });
    return;
  }

  // Correct!
  state.gems += 3;
  l2Selection.forEach(id => {
    const card = document.getElementById(`loc-${id}`);
    if (card) card.classList.add('card-correct');
  });

  setTimeout(() => {
    updateHUD();
    goToScene('scene-l2-end');
  }, 900);
}

// ============================================
// LEVEL 3: CHRONOLOGICAL SORTING
// ============================================

let l3Items = [];
let l3ClickedIdx = null;
let l3DraggedIdx = null;
let l3Attempts = 0;

function startLevel3() {
  l3Items = [...level3Steps].sort(() => Math.random() - 0.5);
  l3ClickedIdx = null;
  l3Attempts = 0;
  renderL3();
  goToScene('scene-l3');
}

function renderL3() {
  const scene = document.getElementById('scene-l3');
  scene.innerHTML = `
    <div class="level-spacer"></div>
    <div class="l3-container">
      <div class="l3-header">
        <span class="pixel-text" style="color:#6dfc9b">♦</span>
        <h2 class="pixel-text l3-title">SISTEMA IN ORDINE CRONOLOGICO QUESTI PASSAGGI DA FARE IN LABORATORIO</h2>
      </div>
      <div class="l3-list" id="l3-list">
        ${l3Items.map((item, idx) => `
          <div class="l3-item"
               draggable="true"
               data-idx="${idx}"
               style="background-color:${item.color}"
               ondragstart="l3DragStart(event,${idx})"
               ondragover="l3DragOver(event)"
               ondrop="l3Drop(event,${idx})"
               onclick="l3Click(${idx})">
            <span class="l3-num">${idx + 1}</span>
            <span class="l3-text">${item.text}</span>
          </div>
        `).join('')}
      </div>
      <p class="pixel-text l3-hint">↕ Trascina o clicca 2 elementi per scambiarli</p>
      <button class="start-btn pixel-text" onclick="confirmL3()">▶ CONFERMA ORDINE</button>
    </div>
  `;
}

function l3Click(idx) {
  const items = document.querySelectorAll('.l3-item');

  if (l3ClickedIdx === null) {
    l3ClickedIdx = idx;
    items[idx].classList.add('l3-selected');
  } else if (l3ClickedIdx === idx) {
    items[idx].classList.remove('l3-selected');
    l3ClickedIdx = null;
  } else {
    // Swap
    const temp = l3Items[l3ClickedIdx];
    l3Items[l3ClickedIdx] = l3Items[idx];
    l3Items[idx] = temp;
    items[l3ClickedIdx].classList.remove('l3-selected');
    l3ClickedIdx = null;
    renderL3();
  }
}

function l3DragStart(event, idx) {
  l3DraggedIdx = idx;
  event.dataTransfer.effectAllowed = 'move';
}

function l3DragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function l3Drop(event, idx) {
  event.preventDefault();
  if (l3DraggedIdx === null || l3DraggedIdx === idx) return;
  const temp = l3Items[l3DraggedIdx];
  l3Items[l3DraggedIdx] = l3Items[idx];
  l3Items[idx] = temp;
  l3DraggedIdx = null;
  renderL3();
}

function confirmL3() {
  const correctOrder = level3Steps.map(i => i.id);
  const playerOrder = l3Items.map(i => i.id);

  let correctCount = 0;
  for (let i = 0; i < 8; i++) {
    if (playerOrder[i] === correctOrder[i]) correctCount++;
  }

  if (correctCount < 8) {
    l3Attempts++;
    if (l3Attempts % 2 === 0) {
      // Lose a heart every 2 failed attempts
      state.lives = Math.max(0, state.lives - 1);
      updateHUD();
    }
    showFeedback(`${correctCount}/8 passi nell'ordine giusto!<br>Riordina e riprova!`, false, () => {});
    return;
  }

  // Perfect!
  state.gems += 8;
  updateHUD();
  setTimeout(() => goToScene('scene-win'), 600);
}

// ============================================
// FEEDBACK OVERLAY
// ============================================

function showFeedback(message, success, callback) {
  const overlay = document.getElementById('feedback-overlay');
  const msg = document.getElementById('feedback-msg');

  overlay.style.display = 'flex';
  overlay.className = 'feedback-overlay ' + (success ? 'feedback-ok' : 'feedback-err');
  msg.innerHTML = message;

  setTimeout(() => {
    overlay.style.display = 'none';
    if (callback) callback();
  }, 2200);
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('playerName');
  if (saved) {
    state.playerName = saved;
    const inp = document.getElementById('player-name');
    if (inp) inp.value = saved;
  }
  goToScene('scene-0');
});
