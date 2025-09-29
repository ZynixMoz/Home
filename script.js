// ===== Click Sound =====
document.querySelectorAll('.get-script, .showcase').forEach(button => {
  button.addEventListener('click', () => {
    let audio = new Audio('settings/click.mp3');
    audio.volume = 0.5;
    audio.play();
  });
});

// 🚫 Disable right-click
document.addEventListener('contextmenu', event => event.preventDefault());

// ===== Search Functionality =====
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
    if (combined.indexOf(q) > -1) {
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

// ===== Scroll Reveal =====
const animatedCards = document.querySelectorAll('.animate');
function showOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  animatedCards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom) card.classList.add('show');
  });
}
window.addEventListener('scroll', showOnScroll);
window.addEventListener('load', showOnScroll);

// ===== Particle Background =====
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
  for (let i = 0; i < numberOfParticles; i++) particlesArray.push(new Particle());
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// ===== Tab Switching =====
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");
tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ===== Favorites System =====
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function toggleFavorite(e) {
  const card = e.target.closest(".card");
  const name = card.dataset.name;

  if (favorites.includes(name)) favorites = favorites.filter(f => f !== name);
  else favorites.push(name);

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavorites();
  updateFavoriteButtons();
}

function updateFavorites() {
  const favList = document.getElementById("favoritesList");
  favList.innerHTML = "";
  favorites.forEach(name => {
    const card = document.querySelector(`.card[data-name="${name}"]`);
    if (card) {
      const clone = card.cloneNode(true);
      const btn = clone.querySelector(".favorite-btn");
      btn.addEventListener("click", toggleFavorite);
      btn.innerHTML = `<img src="favon.png" style="width:20px;height:20px;">`;
      favList.appendChild(clone);
    }
  });
}

function updateFavoriteButtons() {
  document.querySelectorAll(".card").forEach(card => {
    const btn = card.querySelector(".favorite-btn");
    if (!btn) return;
    const name = card.dataset.name;
    btn.innerHTML = favorites.includes(name)
      ? `<img src="favon.png" style="width:20px;height:20px;">`
      : `<img src="favoff.png" style="width:20px;height:20px;">`;
  });
}

// Add favorite buttons to cards
document.querySelectorAll(".card").forEach(card => {
  const favBtn = document.createElement("div");
  favBtn.classList.add("favorite-btn");
  favBtn.style.cursor = "pointer";
  favBtn.innerHTML = `<img src="favoff.png" style="width:20px;height:20px;">`;
  card.appendChild(favBtn);
  favBtn.addEventListener("click", toggleFavorite);
});

// Initial load
updateFavorites();
updateFavoriteButtons();
