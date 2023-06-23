import { defineConfig } from "vite";
const { resolve } = require("path");

export default defineConfig({
  plugins: [],
  server: { host: "https://neon-defence.netlify.app/", port: 8000 },
  clearScreen: false,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        game: resolve(__dirname, "game.html"),
      },
    },
  },
});
// https://neon-defence.netlify.app/
