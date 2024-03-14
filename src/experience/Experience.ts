import sources from "../sources/sources.js";
import Resources from "./Resources.js";

import { mockWithImage } from "../utils/helperFunctions.js";
import { ARExperience } from "../ARExperience.js";
import ThreeExperience from "../ThreeExperience.js";
import Debug from "../utils/Debug.js";
import { Time } from "./Time.js";
const USING_TEST_IMG = true;

declare global {
  interface Window {
    experience: Experience;
  }
}

export interface ExperienceInt {
  resources: Resources;
}

let instance: Experience | null = null;

export class Experience implements ExperienceInt {
  resources: Resources;
  arExperience: ARExperience;
  threeExperience: ThreeExperience;
  arExperienceOn: boolean;
  isMobile: boolean;
  debug: Debug;
  time: Time;

  sizes: {
    width: number;
    height: number;
    pixelRatio: number;
  };

  constructor() {
    if (instance) {
      return instance;
    }

    this.debug = new Debug();
    this.time = new Time();

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    };

    this.isMobile = this.sizes.width < 870 ? true : false;

    instance = this;

    window.experience = this;
    //@ts-ignore
    this.threeExperience = new ThreeExperience();
    this.resources = new Resources(sources);
    this.arExperienceOn = false;

    this.resources.on("itemLoaded", () => {
      this.threeExperience.shaderLoader.updateProgress();
    });

    this.resources.on("loaded", () => {
      this.arExperience = new ARExperience();
      this.threeExperience.onResourcesLoaded();
      this.createEvents();
    });

    window.addEventListener("resize", () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;
      (this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)),
        (this.isMobile = this.sizes.width < 870 ? true : false);
      if (this.arExperience) this.threeExperience.onResize();
    });
  }

  createEvents() {
    const modal = document.querySelector(".modal")!;
    const arButton = document.querySelector("#arButton")!;
    const stopARBtn = document.querySelector("#stopARBtn")!;

    arButton.addEventListener("click", () => {
      this.arExperienceOn = true;
      modal.classList.add("show");
      if (USING_TEST_IMG) {
        mockWithImage("/example_image_1.jpg");
      }
      this.arExperience.startArExperience();
    });

    stopARBtn.addEventListener("click", () => {
      this.arExperienceOn = false;
      modal.classList.remove("show");
      this.arExperience.stopARExperience();
    });
  }
}
