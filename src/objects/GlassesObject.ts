import * as THREE from "three";
import AnchorObject from "./AnchorObject";
import { AnchorInt } from "mindar-image-three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

interface Props {
  anchor: AnchorInt;
  model: GLTF;
}

export default class Glasses extends AnchorObject {
  arObject: THREE.Group;
  model: GLTF;
  constructor(props: Props) {
    super({ anchor: props.anchor });
    this.model = props.model;

    this.model.scene.position.y = 0.05;
    this.model.scene.rotation.x = 0.2;
    this.model.scene.scale.set(0.009, 0.009, 0.009);
    this.model.scene.renderOrder = 1;

    this.arObject = new THREE.Group();
    this.arObject.add(this.model.scene);
    this.setAnchorModel();
  }
  onUpdate(_: number) {}
}
