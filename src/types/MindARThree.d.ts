declare module "mindar-image-three" {
  import * as THREE from "three";

  export interface AnchorInt {
    group: THREE.Group;
    targetIndex: number;
    visible: boolean;
    onTargetFound: () => void;
    onTargetLost: () => void;
  }

  export class MindARThree {
    constructor(options: {
      container: HTMLElement;
      imageTargetSrc: string;
      filterMinCF?: number;
      filterBeta?: number;
      uiLoading?: string;
      uiScanning?: string;
    });

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    addAnchor(index: number): AnchorInt;
    start(): Promise<void>;
    stop(): Promise<void>;
    anchors: AnchorInt[];

    // Add other methods and properties as needed
  }

  export default MindARThree;
}
