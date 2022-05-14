const playPauseBtn = document.querySelector(".play-pause-btn");
const videoContainer = document.querySelector(".video-contianer");
const video = document.querySelector("video");

playPauseBtn.addEventListener("click", togglePlay);

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
  videoContainer.classList.add("paused");
});
