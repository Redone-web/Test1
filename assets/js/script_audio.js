const playIcon = document.getElementById('playIcon');
const stopIcon = document.getElementById('stopIcon');
const audioPlayer = document.getElementById('audioPlayer');
let isPlaying = false;

function togglePlayStop() {
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.style.display = 'block';
        stopIcon.style.display = 'none';
    } else {
        audioPlayer.play();
        playIcon.style.display = 'none';
        stopIcon.style.display = 'block';
    }
    isPlaying = !isPlaying;
}
