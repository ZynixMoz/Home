<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Moz Scripts 📜</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<canvas id="particles"></canvas>

<header>
<img src="images/main.png" alt="Moz Scripts Logo" class="main-logo">
<h1>Moz Scripts 📜</h1>
</header>

<div class="tabs">
  <button class="tab-button active" data-tab="scriptsTab">Scripts</button>
  <button class="tab-button" data-tab="favoritesTab">Favorites ⭐</button>
</div>

<section id="scriptsTab" class="tab-content active">
  <div class="scripts">
    <div class="search-wrap">
      <input id="searchInput" type="search" placeholder="Search scripts..." aria-label="Search scripts">
    </div>

    <div class="card animate" data-name="Speedrun Timer">
      <img src="images/thumb1.png" alt="Script Thumbnail" class="thumbnail">
      <h2>Speedrun Timer ⚡</h2>
      <p class="description">Track your speedruns with precision.</p>
      <a href="https://link-unlock.com/prefenix8292" target="_blank" class="get-script">Get Script</a>
      <a href="https://jumpshare.com/s/NTxmsfAeoYN7SLwy4n9g" target="_blank" class="showcase">Showcase</a>
    </div>

    <div class="card animate" data-name="Coming Soon">
      <img src="images/thumb2.png" alt="Script Thumbnail" class="thumbnail">
      <h2>Coming Soon 👀</h2>
      <p class="description">Soon.</p>
      <a href="#" target="_blank" class="get-script">Coming Soon</a>
      <a href="#" target="_blank" class="showcase">Coming Soon</a>
    </div>

    <div class="card animate" data-name="Coming Soon">
      <img src="images/thumb3.png" alt="Script Thumbnail" class="thumbnail">
      <h2>Coming Soon 💸</h2>
      <p class="description">Soon.</p>
      <a href="#" target="_blank" class="get-script">Coming Soon</a>
      <a href="#" target="_blank" class="showcase">Coming Soon</a>
    </div>

    <div class="card animate" data-name="Coming Soon">
      <img src="images/thumb4.png" alt="Script Thumbnail" class="thumbnail">
      <h2>Coming Soon ⚡</h2>
      <p class="description">Soon.</p>
      <a href="#" target="_blank" class="get-script">Coming Soon</a>
      <a href="#" target="_blank" class="showcase">Coming Soon</a>
    </div>

    <div class="card animate" data-name="Coming Soon">
      <img src="images/thumb5.png" alt="Script Thumbnail" class="thumbnail">
      <h2>Coming Soon 💀</h2>
      <p class="description">Soon.</p>
      <a href="#" target="_blank" class="get-script">Coming Soon</a>
      <a href="#" target="_blank" class="showcase">Coming Soon</a>
    </div>

    <div id="noResults" class="no-results" style="display:none;">No scripts found.</div>
  </div>
</section>

<section id="favoritesTab" class="tab-content">
  <div id="favoritesList"></div>
  <div id="noFavorites" class="no-results" style="display:none;">No favorites yet.</div>
</section>

<div class="socials">
  <a href="https://discord.gg/wchns7Bcnq" target="_blank" class="social help">Help?</a>
</div>

<script src="script.js"></script>
<script>
window.addEventListener("load", () => {
  document.querySelector(".tab-content.active").style.display = "block";
  document.querySelectorAll(".animate").forEach(el => el.classList.add("show"));
});
</script>
</body>
</html>
