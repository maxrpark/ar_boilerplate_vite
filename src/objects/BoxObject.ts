import * as THREE from "three";
import AnchorObject from "./AnchorObject";
import { AnchorInt } from "mindar-image-three";
import vertexShader from "../shaders/cubeShader/vertexShader.glsl";
import fragmentShader from "../shaders/cubeShader/fragmentShader.glsl";

interface Props {
  anchor: AnchorInt;
}

export default class BoxObject extends AnchorObject {
  arObject: THREE.Group;
  box: THREE.Mesh;
  constructor(props: Props) {
    super({ anchor: props.anchor });

    this.box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,

        uniforms: {
          uTime: { value: 0 },
          resolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
        },
      })
    );

    this.arObject = new THREE.Group();
    this.arObject.add(this.box);
    this.setAnchorModel();
  }
  onUpdate(time: number) {
    (this.box.material as THREE.ShaderMaterial).uniforms.uTime.value += time;

    this.arObject.rotation.x += time * 0.2;
    this.arObject.rotation.y += time * 0.2;
  }
}
