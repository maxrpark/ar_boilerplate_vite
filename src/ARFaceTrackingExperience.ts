import * as THREE from "three";

import { Experience } from "./experience/Experience";
import Resources from "./experience/Resources";
import BoxObject from "./objects/BoxObject";
import { MindARThree } from "mindar-face-three";

export class ARFaceTrackingExperience {
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

  async setARExperience() {
    this.mindarThree = await new MindARThree({
      container: document.querySelector(".ar-session-wrapper")!,
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
    console.log("max");

    // Only for testing
    this.box = new BoxObject({ anchor: this.mindarThree.addAnchor(6) });
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
