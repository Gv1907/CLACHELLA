const gate = document.getElementById("gate");
const playButton = document.getElementById("play-button");
const invitation = document.getElementById("invitation");
const confettiLayer = document.getElementById("confetti-layer");
const particleLayer = document.getElementById("particle-layer");
const response = document.getElementById("response");
const musicStatus = document.getElementById("music-status");
const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const songAudio = document.getElementById("song-audio");
const songFile = document.getElementById("song-file");
const songFileLabel = document.getElementById("song-file-label");

const SONG_START_SECONDS = 70;
const LOCKED_VOLUME = 0.2;
let songLoadFailed = false;
let songObjectUrl;
let seekOnMetadata = false;

songAudio.volume = LOCKED_VOLUME;
songAudio.addEventListener("volumechange", () => {
  if (songAudio.volume !== LOCKED_VOLUME) {
    songAudio.volume = LOCKED_VOLUME;
  }
});

songAudio.addEventListener("loadedmetadata", () => {
  if (!seekOnMetadata) return;

  songAudio.currentTime = Math.min(SONG_START_SECONDS, songAudio.duration);
  seekOnMetadata = false;
});

const startSong = () => {
  songAudio.volume = LOCKED_VOLUME;

  if (songAudio.readyState >= HTMLMediaElement.HAVE_METADATA && Number.isFinite(songAudio.duration)) {
    songAudio.currentTime = Math.min(SONG_START_SECONDS, songAudio.duration);
  } else {
    seekOnMetadata = true;
  }

  return songAudio.play();
};

const colors = ["#ff54c8", "#ff168d", "#ff9de1", "#ffd65a", "#fff3f8"];

const createAmbientParticles = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (let index = 0; index < 48; index += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.setProperty("--left", `${Math.random() * 100}%`);
    particle.style.setProperty("--size", `${2 + Math.random() * 4}px`);
    particle.style.setProperty("--duration", `${12 + Math.random() * 14}s`);
    particle.style.setProperty("--delay", `${Math.random() * -24}s`);
    particle.style.setProperty("--drift", `${Math.random() * 120 - 60}px`);
    particle.style.setProperty("--particle-color", colors[Math.floor(Math.random() * colors.length)]);
    particleLayer.appendChild(particle);
  }
};

const createConfetti = (count = 72) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.setProperty("--left", `${Math.random() * 100}%`);
    piece.style.setProperty("--size", `${5 + Math.random() * 7}px`);
    piece.style.setProperty("--duration", `${2.2 + Math.random() * 1.4}s`);
    piece.style.setProperty("--delay", `${Math.random() * 0.45}s`);
    piece.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
    piece.style.setProperty("--particle-color", colors[Math.floor(Math.random() * colors.length)]);
    confettiLayer.appendChild(piece);
    window.setTimeout(() => piece.remove(), 4000);
  }
};

songAudio.addEventListener("error", () => {
  songLoadFailed = true;
  musicStatus.textContent = "";
  songFile.hidden = false;
  songFileLabel.hidden = false;
});

songAudio.addEventListener("playing", () => {
  musicStatus.textContent = "Now playing";
});

songFile.addEventListener("change", () => {
  const file = songFile.files?.[0];
  if (!file) return;

  songLoadFailed = false;
  if (songObjectUrl) URL.revokeObjectURL(songObjectUrl);
  songObjectUrl = URL.createObjectURL(file);
  songAudio.src = songObjectUrl;
  songAudio.load();
  startSong().catch(() => {
    musicStatus.textContent = "The song could not start. Try choosing the MP3 file again.";
  });
});

playButton.addEventListener("click", () => {
  playButton.disabled = true;
  invitation.hidden = false;
  window.requestAnimationFrame(() => invitation.classList.add("is-visible"));
  gate.classList.add("is-leaving");
  createAmbientParticles();
  createConfetti();

  startSong().catch(() => {
    if (!songLoadFailed) {
      musicStatus.textContent = "If the song doesn't start, press play in the music player.";
    }
  });

  window.setTimeout(() => {
    gate.hidden = true;
  }, 600);
});

yesButton.addEventListener("click", () => {
  response.textContent = "i cant wait! See you there";
  yesButton.textContent = "It's a date!";
  yesButton.disabled = true;
  noButton.disabled = true;
  createConfetti(48);
});

noButton.addEventListener("click", () => {
  response.textContent = "No worries at all — thanks for hearing me out.";
  yesButton.disabled = true;
  noButton.disabled = true;
});
