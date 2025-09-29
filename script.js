// ===== CLICK SOUND =====
document.querySelectorAll('.get-script, .showcase').forEach(button => {
  button.addEventListener('click', () => {
    let audio = new Audio('settings/click.mp3');
    audio.volume = 0.5;
    audio.play();
  });
});

// ===== DISABLE RIGHT-CLICK =====
document.addEventListener('contextmenu', event => event.preventDefault());

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.getElementById('searchInput');
const cards = Array.from(document.querySelectorAll('.card'));
const noResults = document.getElementById('noResults');

function filterCards(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    cards.forEach(c => c.style.display = '');
    noResults.style.display = 'none';
    return;
  }

  let visibleCount = 0;
  cards.forEach(card => {
    const name = (card.getAttribute('data-name') || '').toLowerCase();
    const desc = (card.querySelector('.description')?.textContent || '').toLowerCase();
    const combined = name + ' ' + desc;
    if (combined.includes(q)) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  noResults.style.display = visibleCount === 0 ? '' : 'none';
}

searchInput.addEventListener('input', e => filterCards(e.target.value));
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    searchInput.value = '';
    filterCards('');
    searchInput.blur();
  }
});

// ===== SCROLL REVEAL =====
const animatedCards = document.querySelectorAll('.animate');
function showOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  animatedCards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom) {
      card.classList.add('show');
    }
  });
}
window.addEventListener('scroll', showOnScroll);
window.addEventListener('load', showOnScroll);

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particlesArray;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  let numberOfParticles = (canvas.width * canvas.height) / 15000;
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// ===== TABS =====
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");

    if (btn.dataset.tab === "favoritesTab") {
      updateFavoritesTab();
    }
  });
});

// ===== FAVORITES SYSTEM =====
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function toggleFavorite(e) {
  const card = e.target.closest(".card");
  if (!card) return;
  const name = card.dataset.name;

  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
  } else {
    favorites.push(name);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoriteButtons();
  updateFavoritesTab();
}

function updateFavoritesTab() {
  const favList = document.getElementById("favoritesList");
  const noFav = document.getElementById("noFavorites");
  favList.innerHTML = "";

  if (favorites.length === 0) {
    noFav.style.display = "block";
    return;
  } else {
    noFav.style.display = "none";
  }

  favorites.forEach(name => {
    const originalCard = document.querySelector(`.card[data-name="${name}"]`);
    if (originalCard) {
      const clone = originalCard.cloneNode(true);
      clone.classList.add("animate");
      const btn = clone.querySelector(".favorite-btn");
      if (btn) {
        btn.textContent = "⭐";
        btn.onclick = toggleFavorite;
      }
      favList.appendChild(clone);
    }
  });

  showOnScroll();
}

function updateFavoriteButtons() {
  document.querySelectorAll(".card").forEach(card => {
    let btn = card.querySelector(".favorite-btn");
    if (!btn) {
      btn = document.createElement("div");
      btn.classList.add("favorite-btn");
      card.appendChild(btn);
    }
    const name = card.dataset.name;
    btn.textContent = favorites.includes(name) ? "⭐" : "❏";
    btn.onclick = toggleFavorite;
  });
}

window.addEventListener("load", () => {
  favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  updateFavoriteButtons();
  updateFavoritesTab();
});// ====== DETERMINISTIC FAKE VIEWS (updated ranges: base 100-9k, rare big spikes 9k-50k) ======

const VIEWS_CONFIG = {
  startDate: '2023-01-01',    // earlier start so numbers have grown visibly
  baseMin: 100,               // base starting range min
  baseMax: 9000,              // base starting range max
  dailyMin: 5,                // normal per-day growth min
  dailyMax: 100,              // normal per-day growth max
  spikeMin: 9000,             // spike min (when a spike happens)
  spikeMax: 50000,            // spike max
  spikeChance: 0.01           // 1% chance per day for a big spike
};

// hash string -> uint32
function hashStringToInt(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

// xorshift32 PRNG factory
function xorshift32(seed) {
  let x = seed >>> 0;
  return function() {
    x ^= (x << 13) >>> 0;
    x ^= x >>> 17;
    x ^= (x << 5) >>> 0;
    return (x >>> 0) / 4294967295;
  };
}

// number of UTC days since startDate
function daysSinceStart(startISO) {
  const start = new Date(startISO + 'T00:00:00Z');
  const now = new Date();
  const utcStart = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((todayUTC - utcStart) / msPerDay);
}

// deterministic daily increment (may be normal or a big spike)
function dailyIncrementFor(cardSeedInt, dayIndex) {
  // mix seed with dayIndex to produce a per-day deterministic seed
  const mix = (cardSeedInt ^ (dayIndex * 2654435761)) >>> 0;
  const rand = xorshift32(mix);
  const r = rand();

  // spike?
  if (r < VIEWS_CONFIG.spikeChance) {
    // produce spike size in [spikeMin, spikeMax]
    // use another deterministic rand call so spikes vary per day
    const r2 = rand();
    const spike = Math.floor(r2 * (VIEWS_CONFIG.spikeMax - VIEWS_CONFIG.spikeMin + 1)) + VIEWS_CONFIG.spikeMin;
    return spike;
  }

  // normal daily addition in [dailyMin, dailyMax]
  const normal = Math.floor(r * (VIEWS_CONFIG.dailyMax - VIEWS_CONFIG.dailyMin + 1)) + VIEWS_CONFIG.dailyMin;
  return normal;
}

// compute deterministic base between baseMin..baseMax from name seed
function baseForName(nameSeed) {
  return (nameSeed % (VIEWS_CONFIG.baseMax - VIEWS_CONFIG.baseMin + 1)) + VIEWS_CONFIG.baseMin;
}

// compute cumulative views for a card by name
function computeViewsForCardName(name) {
  const trimmed = (name || 'script').trim();
  const seed = hashStringToInt(trimmed);
  const base = baseForName(seed);
  const days = daysSinceStart(VIEWS_CONFIG.startDate);
  let total = base;
  // sum daily increments (inclusive of day 0)
  for (let d = 0; d <= days; d++) {
    total += dailyIncrementFor(seed, d);
  }
  return total;
}

// format with commas
function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// render all views on page
function renderAllViews() {
  document.querySelectorAll('.card').forEach(card => {
    const name = card.getAttribute('data-name') || (card.querySelector('h2')?.textContent) || 'script';
    const el = card.querySelector('.views-count');
    if (!el) return;
    const v = computeViewsForCardName(name);
    el.textContent = formatNumber(v);
  });
}

// -- INTEGRATION NOTES --
// 1) Call renderAllViews() on load and after you clone/update cards (favorites).
//    e.g., in your existing window.load block, ensure:
//      renderAllViews();
//    and at the end of updateFavoritesTab() also call renderAllViews();
//
// 2) If you want the number to animate up on display, you can add a small number-tween
//    routine — lmk and I'll add it.
//
// Example: add this to your window.load block (if not already):
// window.addEventListener('load', () => {
//   favorites = JSON.parse(localStorage.getItem("favorites")) || [];
//   updateFavoriteButtons();
//   updateFavoritesTab();
//   renderAllViews(); // <-- make sure this runs
// });
