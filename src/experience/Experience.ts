import sources from "../sources/sources";
import { mockWithImage } from "../utils/helperFunctions";
import { ARImageExperience } from "../ARImageExperience";
import ThreeExperience from "../ThreeExperience";
import Debug from "../utils/Debug";
import { Time } from "./Time";
import Resources from "./Resources";
import { ARFaceTrackingExperience } from "../ARFaceTrackingExperience";
import LoaderShader from "../objects/LoaderPlane";
const USING_TEST_IMG = false;

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
  arExperience: ARFaceTrackingExperience | ARImageExperience;
  threeExperience: ThreeExperience;
  arExperienceOn: boolean;
  isMobile: boolean;
  debug: Debug;
  time: Time;

  shaderLoader: LoaderShader;
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
    this.arExperienceOn = false;

    this.resources = new Resources(sources);

    this.createExperiences();

    this.resources.on("loaded", () => this.setResources());

    window.addEventListener("resize", () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;
      (this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)),
        (this.isMobile = this.sizes.width < 870 ? true : false);
      // if (this.arExperience) this.threeExperience.onResize();
    });
  }
  createExperiences() {
    // this.threeExperience = new ThreeExperience();
    // this.arExperience = new ARFaceTrackingExperience();
    this.arExperience = new ARImageExperience();
    this.setShaderLoader();
  }
  setResources() {
    // this.threeExperience.onResourcesLoaded();
    this.arExperience.onResourcesLoaded();
    this.createEvents();
  }

  setShaderLoader() {
    this.shaderLoader = new LoaderShader();
    this.shaderLoader.mesh.position.z = 0.01;
    this.arExperience.scene.add(this.shaderLoader.mesh);
  }

  createEvents() {
    const modal = document.querySelector(".modal")!;
    const arButton = document.querySelector("#arButton")!;
    const stopARBtn = document.querySelector("#stopARBtn")!;

    arButton.addEventListener("click", () => {
      this.arExperienceOn = true;
      modal.classList.add("show");
      if (USING_TEST_IMG) {
        mockWithImage("/example_image_2.jpg");
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
