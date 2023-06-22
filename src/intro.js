document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("start-button");
  const menu = document.getElementById("menu");

  // Add event listener to the start button
  startButton.addEventListener("click", function (event) {
    event.preventDefault();
    menu.style.display = "grid";
    document.getElementById("introHeader").style.display = "none";
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

// Music / Music Button
const music = document.getElementById("music");
const audio = document.getElementById("synthwave-track");

const musicToggle = () => {
  if (music.classList.contains("playing")) {
    music.classList.remove("playing");
    audio.pause();
  } else {
    music.classList.add("playing");
    audio.play();
  }
};

music.addEventListener("pointerdown", () => musicToggle());
music.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "Enter") {
    musicToggle();
  }
});

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

const attachModalEvents = (buttonElement, modalElement) => {
  const closeButton = modalElement.querySelector(".close-button");

  buttonElement.addEventListener("click", () => {
    modalElement.setAttribute("open", "");
  });

  closeButton.addEventListener("click", () => {
    modalElement.removeAttribute("open");
  });
};

// Leaderboard:
const leaderboardButton = document.getElementById("leaderboard-button");
const modalLeaderboard = document.getElementById("modalLeaderboard");
attachModalEvents(leaderboardButton, modalLeaderboard);

// How to play:
const howToPlayButton = document.getElementById("how-to-play-button");
const modalHowToPlay = document.getElementById("modalHowToPlay");
attachModalEvents(howToPlayButton, modalHowToPlay);

// Credits:
const creditsButton = document.getElementById("credits-button");
const modalCredits = document.getElementById("modalCredits");
attachModalEvents(creditsButton, modalCredits);

// Sign in:
const signInButton = document.getElementById("signin-btn");
const signInModal = document.getElementById("modalSignin");
attachModalEvents(signInButton, signInModal);