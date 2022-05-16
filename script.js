const playPauseBtn = document.querySelector(".play-pause-btn");
const theaterBtn = document.querySelector(".theater-btn");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const miniPlayerBtn = document.querySelector(".mini-play-btn");
const muteBtn = document.querySelector(".mute-btn");
const currentTime = document.querySelector(".current-time");
const totalTime = document.querySelector(".total-time");
const volumeSlider = document.querySelector(".volume-slider");
const captionBtn = document.querySelector(".caption-btn");
const videoContainer = document.querySelector(".video-container");
const video = document.querySelector("video");

document.addEventListener("keydown", (e) => {
  const tagName = document.activeElement.tagName.toLowerCase();

  if (tagName === "input") return;

  switch (e.key.toLowerCase()) {
    case "":
      if (tagName === "button") return;
    case "k":
      togglePlay();
      break;

    case "f":
      toogleFullScreenMode();
      break;
    case "i":
      toogleMiniPlayerMode();
      break;

    case "t":
      toggleTheaterMode();
      break;
    case "m":
      toggleMute();
      break;

    case "arrowleft":
    case "j":
      skip(-5);
      break;

    case "arrowright":
    case "l":
      skip(5);
      break;

    case "c":
      toggleCaption();
      break;
  }
});

// caption
const caption = video.textTracks[0];

caption.mode = "hidden";

captionBtn.addEventListener("click", toggleCaption);

function toggleCaption() {
  const isHidden = caption.mode === "hidden";

  caption.mode = isHidden ? "showing" : "hidden";

  videoContainer.classList.toggle("captions", isHidden);
}
// Duration

video.addEventListener("timeupdate", () => {
  currentTime.textContent = formartDuration(video.currentTime);
});

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});

video.addEventListener("loadeddata", () => {
  totalTime.textContent = formartDuration(video.duration);
});

function formartDuration(time) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;

  const hours = Math.floor(time / 3600);

  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  }
}

function skip(duration) {
  video.currentTime += duration;
}
//volume controls

muteBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", (e) => {
  video.volume = e.target.value;
  video.muted = e.target.value === 0;
});

function toggleMute() {
  video.muted != video.muted;
}

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume;
  let volumeLevel;
  if (video.muted || video.volume === 0) {
    volumeSlider.value = 0;
    volumeLevel = "muted";
  } else if (video.volume >= 0.5) {
    volumeLevel = "high";
  } else {
    volumeLevel = "low";
  }

  videoContainer.dataset.volumeLevel = volumeLevel;

  video.muted, video.volume;
});

// different modes

theaterBtn.addEventListener("click", toggleTheaterMode);
fullScreenBtn.addEventListener("click", toogleFullScreenMode);
miniPlayerBtn.addEventListener("click", toogleMiniPlayerMode);

function toggleTheaterMode() {
  videoContainer.classList.toggle("theater");
}
function toogleFullScreenMode() {
  if (document.fullscreenElement == null) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
function toogleMiniPlayerMode() {
  if (videoContainer.classList.contains("mini-player")) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
}

document.addEventListener("fullscreenchange", () => {
  videoContainer.classList.toggle("full-screen", document.fullscreenElement);
});

video.addEventListener("enterpictureinpicture", () => {
  videoContainer.classList.add("mini-player");
});

video.addEventListener("leavepictureinpicture", () => {
  videoContainer.classList.remove("mini-player");
});

//  Play pause funtionality
playPauseBtn.addEventListener("click", togglePlay);

video.addEventListener("click", togglePlay);

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
  videoContainer.classList.add("paused");
});
