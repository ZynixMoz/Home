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
