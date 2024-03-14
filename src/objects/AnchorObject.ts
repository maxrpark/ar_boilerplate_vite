import { AnchorInt } from "mindar-image-three";
import * as THREE from "three";
import { Experience } from "../experience/Experience";

interface Props {
  anchor: AnchorInt;
}

export default class AnchorObject {
  experience: Experience;
  anchor: AnchorInt;
  arObject: THREE.Group;

  constructor(props: Props) {
    Object.assign(this, props);

    this.onTargetFound();
    this.onTargetLost();
  }

  setAnchorModel() {
    this.anchor.group.add(this.arObject);
  }

  onTargetFound() {}
  onTargetLost() {}
}
