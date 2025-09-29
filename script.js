// Play click sound when "Get Script" or "Showcase" buttons are clicked
document.querySelectorAll('.get-script, .showcase').forEach(button => {
  button.addEventListener('click', () => {
    let audio = new Audio('settings/click.mp3');
    audio.volume = 0.5;
    audio.play();
  });
});

// 🚫 Disable right-click / hold menu
document.addEventListener('contextmenu', event => event.preventDefault());

// ===== Search functionality (case-insensitive) =====
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

searchInput.addEventListener('input', e => {
  filterCards(e.target.value);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    searchInput.value = '';
    filterCards('');
    searchInput.blur();
  }
});

// ===== Scroll reveal animation =====
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
