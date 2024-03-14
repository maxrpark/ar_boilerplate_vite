import { Experience } from "../experience/Experience";
import * as THREE from "three";
import GUI from "lil-gui";
import Debug from "../utils/Debug";
import { gsap } from "gsap";
import EventEmitter from "../experience/EventEmitter";
import vertexShader from "../shaders/loaderShader/vertexShader.glsl";
import fragmentShader from "../shaders/loaderShader/fragmentShader.glsl";

export default class LoaderShader extends EventEmitter {
  experience: Experience;
  material: THREE.ShaderMaterial;
  geometry: THREE.PlaneGeometry;
  mesh: THREE.Mesh;
  debug: Debug;
  debugFolder: GUI;

  loadingScreen: HTMLDivElement;
  btnLoader: HTMLButtonElement;
  progressText: HTMLParagraphElement;

  constructor() {
    super();

    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.createMesh();

    this.loadingScreen = document.querySelector("#loaderScreen")!;
    // this.btnLoader = document.querySelector("#btnLoader")!;
    this.progressText = document.querySelector("#loadingProgress")!;

    // this.btnLoader.addEventListener("click", () => {
    //   this.animateProgress();
    // });

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("shader loader");
      this.debugFolder.add(
        this.material.uniforms.uProgress!,
        "value",
        0,
        10,
        0.01
      );
    }
  }

  updateProgress() {
    let progress =
      (this.experience.resources.uploaded /
        this.experience.resources.toUpload) *
      100;

    this.progressText.innerHTML = `${progress.toFixed()}%`;

    if (progress === 100) {
      // this.onAllLoaded()

      gsap
        .timeline()
        .set(this.loadingScreen, {
          display: "none",
        })
        .to(this.material.uniforms.uProgress, {
          value: 0,
          duration: 1,
          ease: "none",
        })
        .set(
          "#canvas",
          {
            zIndex: -1,
          },
          0
        );
    }
  }
  onAllLoaded() {
    gsap
      .timeline()
      .to(this.progressText, {
        yPercent: -20,
        opacity: 0,
      })
      .fromTo(
        this.btnLoader,
        {
          opacity: 0,
          yPercent: 10,
        },
        {
          opacity: 1,
          yPercent: -50,
        }
      );
  }
  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,

      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 10 },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uMultiplayer: { value: 0.0001 },
      },
    });
  }

  createMesh() {
    this.createMaterial();
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 10, 10),
      this.material
    );
  }

  animateProgress() {
    gsap
      .timeline()
      .to(this.btnLoader, {
        yPercent: -100,
        opacity: 0,
        duration: 1,
      })
      .set(this.loadingScreen, {
        display: "none",
      })
      .to(this.material.uniforms.uProgress, {
        value: 0,
        duration: 1,
        ease: "none",
      })
      .set("#canvas", {
        zIndex: -1,
      });
  }
}
