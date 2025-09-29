const startDate = new Date("2025-07-01T00:00:00Z");

const cardViewSettings = {
  "Speedrun Timer": { base: 1600, interval: 60 },
  "Coming Soon": { base: 0, boost: true },
};

function getViewsForCard(settings, seconds) {
  if (settings.boost) {
    if (seconds < 5) return 0;
    if (seconds < 60) return 100;
    return 1000 + Math.floor((seconds - 60) / 120);
  } else {
    return settings.base + Math.floor(seconds / settings.interval);
  }
}

function updateViews() {
  const now = new Date();
  const seconds = Math.floor((now - startDate) / 1000);

  document.querySelectorAll(".card").forEach(card => {
    const name = card.getAttribute("data-name");
    const viewsEl = card.querySelector(".views-count");

    const settings = cardViewSettings[name];
    if (!settings) return;

    const views = getViewsForCard(settings, seconds);
    viewsEl.textContent = views.toLocaleString();
  });
}

updateViews();
setInterval(updateViews, 1000);
