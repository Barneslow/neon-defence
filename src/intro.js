import { signInWithGoogle } from "./auth";

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("start-button");
  const howToPlayButton = document.getElementById("how-to-play-button");
  const soundButton = document.getElementById("sound-button");
  const musicButton = document.getElementById("music-button");
  const creditsButton = document.getElementById("credits-button");
  const signInButton = document.getElementById("sign-in");

  const menu = document.getElementById("menu");

  signInButton.addEventListener("click", signInWithGoogle);

  // Add event listener to the start button
  startButton.addEventListener("click", function (event) {
    event.preventDefault();
    menu.style.display = "grid";
    document.getElementById("introHeader").style.display = "none";
  });

  // Add event listener to the how to play button
  howToPlayButton.addEventListener("click", function (event) {
    event.preventDefault();
    // Show the how to play popup
    // Implement the desired behavior, such as showing a modal or displaying content on the page
    console.log("How to Play button clicked");
  });

  // Add event listener to the sound button
  soundButton.addEventListener("click", function (event) {
    event.preventDefault();
    const soundButtonText = soundButton.textContent.trim();
    if (soundButtonText === "Sound: ON") {
      soundButton.textContent = "Sound: OFF";
      // Turn off the sound
      console.log("Sound turned off");
    } else {
      soundButton.textContent = "Sound: ON";
      // Turn on the sound
      console.log("Sound turned on");
    }
  });

  // Add event listener to the music button
  musicButton.addEventListener("click", function (event) {
    event.preventDefault();
    const musicButtonText = musicButton.textContent.trim();
    if (musicButtonText === "Music: ON") {
      musicButton.textContent = "Music: OFF";
      // Turn off the music
      console.log("Music turned off");
    } else {
      musicButton.textContent = "Music: ON";
      // Turn on the music
      console.log("Music turned on");
    }
  });

  // Add event listener to the credits button
  creditsButton.addEventListener("click", function (event) {
    event.preventDefault();
    // Show the credits popup
    // Implement the desired behavior, such as showing a modal or displaying content on the page
    console.log("Credits button clicked");
  });
});

// Stars Background
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

const stars = document.getElementById("stars");

const render = () => {
  // Create stars ✨
  stars.innerHTML = "";
  const w = window.innerWidth;
  const h = window.innerHeight;
  const starCount = getRandomInt(42, 100);

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    const x = getRandomInt(0, w);
    const y = getRandomInt(0, h);
    star.style.setProperty("--x", `${x}px`);
    star.style.setProperty("--y", `${y}px`);
    stars.appendChild(star);
  }
};

requestAnimationFrame(render);
window.addEventListener("resize", () => requestAnimationFrame(render));

// Music / Volume Button
const volume = document.getElementById("volume");
const audio = document.getElementById("synthwave-track");
const musicButton = document.getElementById("music-button");

const volumeToggle = () => {
  if (volume.classList.contains("playing")) {
    volume.classList.remove("playing");
    audio.pause();
    musicButton.textContent = "Music: OFF";
  } else {
    volume.classList.add("playing");
    audio.play();
    musicButton.textContent = "Music: ON";
  }
};

volume.addEventListener("pointerdown", () => volumeToggle());
volume.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "Enter") {
    volumeToggle();
  }
});

musicButton.addEventListener("click", () => volumeToggle());

// Dropdown
const dropdownButton = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");

const toggleDropdown = () => {
  dropdownContent.classList.toggle("show");
};

dropdownButton.addEventListener("click", toggleDropdown);

// Close dropdown when clicking outside
window.addEventListener("click", (event) => {
  if (!event.target.matches(".dropbtn")) {
    dropdownContent.classList.remove("show");
  }
});

// Function to open a modal
const openModal = (modalElement) => {
  modalElement.setAttribute("open", "");
};

// Function to close a modal
const closeModal = (modalElement) => {
  modalElement.removeAttribute("open");
};

// Attach event listeners to the buttons
const attachModalEvents = (buttonElement, modalElement) => {
  const closeButton = modalElement.querySelector(".close-button");

  buttonElement.addEventListener("click", () => openModal(modalElement));
  closeButton.addEventListener("click", () => closeModal(modalElement));
};

// Usage example:
const howToPlayButton = document.getElementById("how-to-play-button");
const modalHowToPlay = document.getElementById("modalHowToPlay");
attachModalEvents(howToPlayButton, modalHowToPlay);

const creditsButton = document.getElementById("credits-button");
const modalCredits = document.getElementById("modalCredits");
attachModalEvents(creditsButton, modalCredits);
