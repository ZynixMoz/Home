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
});
// ====== FAKE VIEWS (deterministic per-card, same across devices) ======

// CONFIG: adjust these if you want different behavior
const VIEWS_CONFIG = {
  startDate: '2024-01-01', // ISO date when counting begins (UTC). pick any past date.
  baseMinPerDay: 5,
  baseMaxPerDay: 100,
  spikeValue: 1000,
  spikeChance: 0.02, // 2% chance per day to be a spike (1k)
};

// simple hash to turn string into integer seed
function hashStringToInt(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

// xorshift32 PRNG (deterministic, fast)
function xorshift32(seed) {
  let x = seed >>> 0;
  return function() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967295;
  };
}

// days since UTC epoch defined by startDate
function daysSinceStart(startISO) {
  const start = new Date(startISO + 'T00:00:00Z'); // explicit UTC midnight
  const now = new Date(); // local time, but we'll compare by UTC date below
  // compute difference in days by UTC
  const utcStart = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((todayUTC - utcStart) / msPerDay);
}

// deterministic daily increment for a card for a particular day index
function dailyIncrementFor(cardSeedInt, dayIndex) {
  // combine seed + dayIndex -> new seed
  const seed = (cardSeedInt ^ (dayIndex * 2654435761)) >>> 0;
  const rand = xorshift32(seed);
  const r = rand();
  // spike?
  if (r < VIEWS_CONFIG.spikeChance) {
    return VIEWS_CONFIG.spikeValue;
  }
  // else uniform between min and max inclusive
  const min = VIEWS_CONFIG.baseMinPerDay;
  const max = VIEWS_CONFIG.baseMaxPerDay;
  const val = Math.floor(r * (max - min + 1)) + min;
  return val;
}

// compute cumulative views for a card based on its "name" string
function computeViewsForCardName(name) {
  const nameSeed = hashStringToInt(name || 'unknown');
  // base starting views derived from nameSeed so different cards start at different offsets
  const base = (nameSeed % 4000) + 100; // base between 100 and 4099 (feel free to tweak)
  const days = daysSinceStart(VIEWS_CONFIG.startDate);
  let total = base;
  for (let d = 0; d <= days; d++) {
    total += dailyIncrementFor(nameSeed, d);
  }
  return total;
}

// format number with commas
function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// attach views counts to DOM
function renderAllViews() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const name = card.getAttribute('data-name') || card.querySelector('h2')?.textContent || 'script';
    const viewsCountEl = card.querySelector('.views-count');
    if (!viewsCountEl) return;
    const views = computeViewsForCardName(name.trim());
    viewsCountEl.textContent = formatNumber(views);
  });
}

// run on load and whenever cards may change (e.g., after search or cloning)
window.addEventListener('load', () => {
  // initial render
  renderAllViews();

  // re-render after favorites tab updates (cloning might duplicate counts)
  // you already call updateFavoritesTab(); so call renderAllViews at end of that function
});

// If you want, call renderAllViews() at ends of functions that mutate cards:
// e.g., add this line at the end of updateFavoritesTab() and updateFavoriteButtons()
// renderAllViews();
