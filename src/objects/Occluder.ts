import * as THREE from "three";
import AnchorObject from "./AnchorObject";
import { AnchorInt } from "mindar-image-three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

interface Props {
  anchor: AnchorInt;
  model: GLTF;
}

export default class Occluder extends AnchorObject {
  arObject: THREE.Group;
  model: GLTF;
  constructor(props: Props) {
    super({ anchor: props.anchor });
    this.model = props.model;

    // ocluder
    const occluderMaterial = new THREE.MeshBasicMaterial({
      colorWrite: false,
    });
    this.model.scene.traverse((item) => {
      if (item instanceof THREE.Mesh) {
        item.material = occluderMaterial;
      }
    });
    this.model.scene.renderOrder = 0;
    this.model.scene.scale.set(0.065, 0.065, 0.065);
    this.model.scene.position.set(0.0, -0.3, 0.15);

    this.arObject = new THREE.Group();
    this.arObject.add(this.model.scene);
    this.setAnchorModel();
  }
}
