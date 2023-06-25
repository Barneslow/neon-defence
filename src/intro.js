// Import signInWithGoogle function
import { collection, doc, getDocs } from "@firebase/firestore";
import { signInWithGoogle } from "./auth";
import { firebaseDB } from "./config/firebase";

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

  // Add event listener to the sign-in form
  // const loginForm = document.getElementById("login-form");
  // loginForm.addEventListener("submit", function (event) {
  //   event.preventDefault();

  //   // Get the input values from the form
  //   const email = document.getElementById("email-input").value;
  //   const password = document.getElementById("password-input").value;

  //   // Call the signIn function with the email and password
  //   signIn(email, password);
  // });

  // Define the signIn function
  function signIn(email, password) {
    // Make an API call to your backend with the email and password
    // Example using fetch:
    fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          // Sign-in successful
          console.log("Sign-in successful");
          // Add code to handle successful sign-in, such as redirecting to another page
        } else {
          // Sign-in failed
          console.log("Sign-in failed");
          // Add code to handle failed sign-in, such as displaying an error message
        }
      })
      .catch((error) => {
        // Error occurred during sign-in
        console.log("Error during sign-in:", error);
        // Add code to handle the error, such as displaying an error message
      });
  }

  // Attach sign-in with Google functionality to the sign-in modal
  attachModalEvents(signInButton, signInModal);
  const googleSignInButton = signInModal.querySelector("#google-signin-btn");
  googleSignInButton.addEventListener("click", signInWithGoogle);
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
