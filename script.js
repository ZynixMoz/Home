// Play click sound when "Get Script" buttons are clicked
document.querySelectorAll('.get-script').forEach(button => {
  button.addEventListener('click', () => {
    let audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_5f04eab3f4.mp3?filename=click-124467.mp3');
    audio.volume = 0.4;
    audio.play();
  });
});
