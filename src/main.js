import Phaser from "phaser";
import MapScene from "../src/Map";
import { checkAuthState } from "./auth";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 1024,
  height: 768,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [MapScene],
};

export default new Phaser.Game(config);

// cursor change

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

checkAuthState();

window.addEventListener("resize", () => requestAnimationFrame(render));


// Get the buttons and the modal dialog
const attachModalEvents = (buttonElement, modalElement) => {
  const closeButton = modalElement.querySelector(".close-button");

  buttonElement.addEventListener("click", () => {
    modalElement.setAttribute("open", "");
  });

  closeButton.addEventListener("click", () => {
    modalElement.removeAttribute("open");
  });
};

// Setting's:
const settingsButton = document.getElementById("settings");
const modalSettings = document.getElementById("modalSettings");
attachModalEvents(settingsButton, modalSettings);

// Mute sound:
const muteSoundButton = document.getElementById("mute-sound");
let soundMuted = false;

muteSoundButton.addEventListener("click", () => {
  soundMuted = !soundMuted;

  if (soundMuted) {
    muteSoundButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-71.5-56C569.8 400.2 576 384.7 576 368V104 32c0-10.1-4.8-19.6-12.9-25.7s-18.6-7.9-28.3-5l-320 96c-12.7 3.8-21.6 14.9-22.7 27.9L38.8 5.1zM300.7 210.4L512 147V292.6c-10-2.9-20.8-4.6-32-4.6c-22.2 0-42.6 6.3-58.8 16.8L300.7 210.4zM192 247.3V356.6c-10-3-20.8-4.6-32-4.6c-53 0-96 35.8-96 80s43 80 96 80s96-35.8 96-80V297.7l-64-50.4z"/></svg>';
  } else {
    muteSoundButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/></svg>';
  }
});

// Music button:
const musicButton = document.getElementById("music");
let musicMuted = false;

musicButton.addEventListener("click", () => {
  musicMuted = !musicMuted;

  if (musicMuted) {
    musicButton.innerHTML = `
      <svg class="muted" xmlns="http://www.w3.org/2000/svg" width="24.996" height="19.992" viewBox="0 0 24.996 19.992">
        <path d="M1.891-16.922,1.148-17.5,0-16.016l.742.574L23.105,1.922l.742.574L25,1.016,24.254.441,21.238-1.9A7.48,7.48,0,0,0,23.75-7.5a7.491,7.491,0,0,0-3-6L19.625-12a5.615,5.615,0,0,1,2.25,4.5a5.611,5.611,0,0,1-2.152,4.426L15-6.742V-16.25H13.125l-4.836,4.3-6.4-4.969ZM2.5-11.25v7.5h5l5.625,5H15V-1.934L3.172-11.25H2.5Zm16,6.75a3.745,3.745,0,0,0,1.5-3,3.745,3.745,0,0,0-1.5-3L17.375-9a1.87,1.87,0,0,1,.75,1.5,1.87,1.87,0,0,1-.75,1.5Z" transform="translate(0 17.496)" fill="var(--labs-sys-color-volume)"></path>
      </svg>
    `;
  } else {
    musicButton.innerHTML = `
      <svg class="play" xmlns="http://www.w3.org/2000/svg" width="21.25" height="17.5" viewBox="0 0 21.25 17.5">
        <path d="M1.25-11.25v7.5h5l5.625,5H13.75v-17.5H11.875l-5.625,5Zm16,6.75a3.745,3.745,0,0,0,1.5-3,3.745,3.745,0,0,0-1.5-3L16.125-9a1.87,1.87,0,0,1,.75,1.5,1.87,1.87,0,0,1-.75,1.5Zm2.25,3a7.491,7.491,0,0,0,3-6,7.491,7.491,0,0,0-3-6L18.375-12a5.615,5.615,0,0,1,2.25,4.5A5.615,5.615,0,0,1,18.375-3L19.5-1.5Z" transform="translate(-1.25 16.25)" fill="var(--labs-sys-color-volume)"></path>
      </svg>
    `;
  }
});