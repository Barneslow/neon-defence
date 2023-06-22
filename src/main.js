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
