import glsl from "vite-plugin-glsl";

// vite.config.js
export default {
  // config options

  resolve: {
    alias: {
      "mindar-image-three":
        "https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-image-three.prod.js",
      "mindar-face-three":
        "https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-face-three.prod.js",
    },
  },
  assetsInclude: ["**/*.mind"],
  plugins: [glsl()],
};
