import * as THREE from "three";

import { Experience } from "./experience/Experience";
import Resources from "./experience/Resources";
import BoxObject from "./objects/BoxObject";
import { MindARThree } from "mindar-face-three";
import Glasses from "./objects/GlassesObject";
import Occluder from "./objects/Occluder";

export class ARFaceTrackingExperience {
  mindarThree: any;
  experience: Experience;
  resources: Resources;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  box: BoxObject;
  glasses: Glasses;
  occluder: Occluder;

  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.setARExperience();
  }

  setARExperience() {
    this.mindarThree = new MindARThree({
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
  }
  onResourcesLoaded() {
    this.setModels();
    this.setResources();
  }

  setModels() {
    const glassesModel = this.resources.glbModels.find(
      (el) => el.name === "glasses"
    )!;
    const headOccluderModel = this.resources.glbModels.find(
      (el) => el.name === "headOccluder"
    )!;

    this.occluder = new Occluder({
      anchor: this.mindarThree.addAnchor(6),
      model: headOccluderModel.model,
    });

    // this.box = new BoxObject({ anchor: this.mindarThree.addAnchor(6) });
    this.glasses = new Glasses({
      anchor: this.mindarThree.addAnchor(6),
      model: glassesModel.model,
    });
  }

  setResources() {
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
      // this.box.onUpdate(this.experience.time.delta);
    });
  }
}
