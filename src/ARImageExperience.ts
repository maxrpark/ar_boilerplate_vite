import * as THREE from "three";

import { Experience } from "./experience/Experience";
import Resources from "./experience/Resources";
import BoxObject from "./objects/BoxObject";
import { MindARThree } from "mindar-image-three";

export class ARImageExperience {
  mindarThree: any;
  experience: Experience;
  resources: Resources;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  box: BoxObject;

  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.setARExperience();
  }

  createLoaders() {
    const loaders = document.createElement("div");

    loaders.innerHTML = `<div class="ui-screen ui-screen__loading" id="screenLoading">
        <div class="assets-loader"></div>
      </div>
      <div class="ui-screen ui-screen__scanning" id="screenScanning">
        <div class="scanning">
          <div class="scan-wrapper">
            <img class="img-scan" src="/max_logo.png" />
            <div class="inner">
              <div class="scaneline"></div>
            </div>
          </div>
        </div>
      </div>`;

    document.querySelector(".modal")!.appendChild(loaders);
  }

  async setARExperience() {
    this.createLoaders();
    this.mindarThree = await new MindARThree({
      container: document.querySelector(".ar-session-wrapper")!,
      imageTargetSrc: "/targets/target.mind",
      filterMinCF: 0.0001,
      filterBeta: 0.001,
      uiLoading: "#screenLoading",
      uiScanning: "#screenScanning",
    });

    const { renderer, scene, camera } = this.mindarThree;

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    // RENDERER
    this.renderer.outputColorSpace;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    setTimeout(() => {
      this.setModels();
    }, 1000);
    this.setRecourses();
  }
  setModels() {
    // Only for testing
    this.box = new BoxObject({ anchor: this.mindarThree.addAnchor(0) });
  }

  setRecourses() {
    // SCENE

    let envMap = this.resources.items.environmentMap as THREE.Texture;
    envMap!.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.environment = envMap;
  }

  async startArExperience() {
    try {
      await this.mindarThree.start();
      this.update();
    } catch (error) {
      console.log(error);
    }
  }
  async stopARExperience() {
    await this.mindarThree.stop();
  }

  update() {
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
      this.box.onUpdate(this.experience.time.delta);
    });
  }
}
