declare module "mindar-face-three" {
  import * as THREE from "three";

  export interface AnchorInt {
    group: THREE.Group;
    targetIndex: number;
    visible: boolean;
    onTargetFound: () => void;
    onTargetLost: () => void;
  }

  interface MaterialWithTexture extends THREE.Material {
    map: THREE.Texture;
  }

  export class MindARThree {
    constructor(options: { container: HTMLElement });

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    addFaceMesh: () => THREE.Mesh<THREE.BufferGeometry, MaterialWithTexture>;
    addAnchor(index: number): AnchorInt;
    addAnchor(index: number): AnchorInt;
    start(): Promise<void>;
    stop(): Promise<void>;
    anchors: AnchorInt[];
  }

  export default MindARThree;
}
