import * as THREE from "three";

import { Experience } from "./experience/Experience";
import LoaderShader from "./objects/LoaderPlane";
import Debug from "./utils/Debug";

export default class ThreeExperience {
  experience: Experience;
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  mouse: THREE.Vector2;
  clock: THREE.Clock;
  delta: number;
  elapse: number;
  isMobile: boolean;
  shaderLoader: LoaderShader;
  debug: Debug;

  constructor() {
    this.experience = new Experience();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.delta = 0;
    this.elapse = 0;

    this.isMobile = this.experience.sizes.width < 870 ? true : false;

    this.scene = new THREE.Scene();
    this.debug = this.experience.debug;
    this.createCamera();

    this.canvas = document.getElementById("canvas")! as HTMLCanvasElement;

    this.createRenderer();

    window.addEventListener("mousemove", (e) => this.mouseMove(e));
    this.tick();
  }

  createCamera() {
    // CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.experience.sizes.width / this.experience.sizes.height,
      0.01,
      100
    );
    this.camera.position.set(0, 0, 5);
    this.scene.add(this.camera);
    this.setShaderLoader();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(
      this.experience.sizes.width,
      this.experience.sizes.height
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setClearColor(0xff6347, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  setShaderLoader() {
    this.shaderLoader = new LoaderShader();
    this.shaderLoader.mesh.position.z = 0.01;
    this.scene.add(this.shaderLoader.mesh);
  }

  setModels() {}

  setEnvironment() {
    let envMap = this.experience.resources.items
      .environmentMap as THREE.Texture;
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    const directionalLight = new THREE.DirectionalLight(0xff6347, 1);

    if (this.debug.active) {
      let lightFolder = this.debug.ui.addFolder("DirectionalLight");
      lightFolder.add(directionalLight.position, "x", -20, 20, 0.01);
      lightFolder.add(directionalLight.position, "y", -20, 20, 0.01);
      lightFolder.add(directionalLight.position, "z", -20, 20, 0.01);
    }

    directionalLight.position.set(-1.63, 16.5, 1.81);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    this.scene.environment = envMap;
  }

  mousePosition = (event: MouseEvent) => {
    this.mouse.x = event.clientX / window.innerWidth;
    this.mouse.y = 1 - event.clientY / window.innerHeight;
  };

  mouseMove(event: MouseEvent) {
    this.mousePosition(event);
  }

  onResize() {
    this.camera.aspect =
      this.experience.sizes.width / this.experience.sizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      this.experience.sizes.width,
      this.experience.sizes.height
    );
    this.renderer.setPixelRatio(Math.min(this.experience.sizes.pixelRatio, 2));
  }
  onResourcesLoaded() {
    this.setModels();
    this.setEnvironment();
  }

  tick() {
    this.delta = this.clock.getDelta();
    this.elapse = this.clock.getElapsedTime();
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(() => this.tick());
  }
}
