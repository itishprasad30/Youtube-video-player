const playPauseBtn = document.querySelector(".play-pause-btn");
const theaterBtn = document.querySelector(".theater-btn");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const miniPlayerBtn = document.querySelector(".mini-play-btn");
const muteBtn = document.querySelector(".mute-btn");
const currentTime = document.querySelector(".current-time");
const totalTime = document.querySelector(".total-time");
const volumeSlider = document.querySelector(".volume-slider");
const captionBtn = document.querySelector(".caption-btn");
const speedBtn = document.querySelector(".speed-btn");
const previewImg = document.querySelector(".preview-img");
const thumbnailImg = document.querySelector(".thumbnail-img");
const videoContainer = document.querySelector(".video-container");
const timelineContainer = document.querySelector(".timeline-container");
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

// Timeline

timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
timelineContainer.addEventListener("mousedown", toggleScrubbing);
document.addEventListener("mouseup", (e) => {
  if (isScrubbing) toggleScrubbing(e);
});
document.addEventListener("mousemove", (e) => {
  if (isScrubbing) handleTimelineUpdate(e);
});

let isScrubbing = false;
let wasPaused;
function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  isScrubbing = (e.buttons & 1) === 1;
  videoContainer.classList.toggle("scrubbing", isScrubbing);
  if (isScrubbing) {
    wasPaused = video.paused;
    video.pause();
  } else {
    video.currentTime = percent * video.duration;
    if (!wasPaused) video.play();
  }

  handleTimelineUpdate(e);
}

function handleTimelineUpdate(e) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  const previewImgNumber = Math.max(
    1,
    Math.floor((percent * video.duration) / 10)
  );
  // const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`;
  // previewImg.src = previewImgSrc;
  timelineContainer.style.setProperty("--preview-position", percent);

  if (isScrubbing) {
    e.preventDefault();
    // thumbnailImg.src = previewImgSrc;
    timelineContainer.style.setProperty("--progress-position", percent);
  }
}
// playback speed

speedBtn.addEventListener("click", changePlaybackSpeed);

function changePlaybackSpeed() {
  let newPlayBackRate = video.playbackRate + 0.25;
  if (newPlayBackRate > 2) newPlayBackRate = 0.25;
  video.playbackRate = newPlayBackRate;

  speedBtn.textContent = `${newPlayBackRate}x`;
}
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
  const percent = video.currentTime / video.duration;
  timelineContainer.style.setProperty("--progress-position", percent);
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
