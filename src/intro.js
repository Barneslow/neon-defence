// Import signInWithGoogle function
import { collection, getDocs } from "@firebase/firestore";
import { signInWithGoogle } from "./auth";
import { firebaseDB } from "./config/firebase";

if (!localStorage.getItem("difficulty")) {
  localStorage.setItem("difficulty", "easy");
}

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("start-button");
  const menu = document.getElementById("menu");

  // Add event listener to the start button
  startButton.addEventListener("click", function (event) {
    event.preventDefault();
    menu.style.display = "grid";
    document.getElementById("introHeader").style.display = "none";
  });

  // Add event listener to the sign-in button
  signInButton.addEventListener("click", function () {
    signInModal.setAttribute("open", "");
  });

  // Attach sign-in with Google functionality to the sign-in modal
  attachModalEvents(signInButton, signInModal);
  const googleSignInButton = signInModal.querySelector("#google-signin-btn");
  googleSignInButton.addEventListener("click", signInWithGoogle);
});

let value;

const difficultySelection = document.getElementById("dropdown");

// @ts-ignore
value = "1";
localStorage.setItem("difficulty", value);

difficultySelection.addEventListener("change", () => {
  // @ts-ignore
  const selectedValue = difficultySelection.value;

  if (selectedValue === "easy") {
    value = "1";
  }
  if (selectedValue === "medium") {
    value = "2";
  }
  if (selectedValue === "hard") {
    value = "4";
  }

  localStorage.setItem("difficulty", value);
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
// const dropdownButton = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");

const toggleDropdown = () => {
  dropdownContent.classList.toggle("show");
};

const attachModalEvents = (buttonElement, modalElement) => {
  const closeButton = modalElement.querySelector(".close-button");

  buttonElement.addEventListener("click", () => {
    modalElement.setAttribute("open", "");
  });

  closeButton.addEventListener("click", () => {
    modalElement.removeAttribute("open");
  });
};

// Dynaically render leaderboard
async function renderLeaderBoardScores() {
  const leaderboardContainer = document.getElementById("leaderboard");
  leaderboardContainer.innerHTML = "";

  // Adding a loader while fetching
  const loader = document.createElement("div");
  loader.id = "loader";
  leaderboardContainer.appendChild(loader);

  try {
    const usersSnapshot = await getDocs(collection(firebaseDB, "users"));
    leaderboardContainer.removeChild(loader);
    const totalUsers = [];
    usersSnapshot.forEach((userDoc) => totalUsers.push(userDoc.data()));

    totalUsers.sort((a, b) => b.highScore - a.highScore);

    totalUsers.forEach((user) => {
      const scoreElement = document.createElement("div");
      scoreElement.classList.add("leaderboard-score");

      const html = `
      <h3>${user.userName}</h3>
      <h3>${user.highScore}</h3>`;

      scoreElement.innerHTML = html;

      leaderboardContainer.appendChild(scoreElement);
    });
  } catch (error) {
    console.log(error);
  }
}

// Leaderboard:
const leaderboardButton = document.getElementById("leaderboard-button");
const modalLeaderboard = document.getElementById("modalLeaderboard");
attachModalEvents(leaderboardButton, modalLeaderboard);
leaderboardButton.addEventListener("click", renderLeaderBoardScores);

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

// Warning to rorate screen for Mobile Portrait mode
window.addEventListener("orientationchange", function () {
  if (window.orientation === 0 || window.orientation === 180) {
    // Portrait mode
    document.getElementById("warning-message").style.display = "block";
  } else {
    // Landscape mode
    document.getElementById("warning-message").style.display = "none";
  }
});
