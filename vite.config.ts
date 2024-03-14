import glsl from "vite-plugin-glsl";

// vite.config.js
export default {
  // config options

  resolve: {
    alias: {
      // three: "https://unpkg.com/three@0.160.0/build/three.module.js",
      // "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
      "mindar-image-three":
        "https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-image-three.prod.js",
    },
  },
  assetsInclude: ["**/*.mind"],
  plugins: [glsl()],
};
