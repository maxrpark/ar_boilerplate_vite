import { Experience } from "../experience/Experience";
import * as THREE from "three";
import GUI from "lil-gui";
import Debug from "../utils/Debug";
//@ts-ignore
import { gsap } from "gsap";
import EventEmitter from "../experience/EventEmitter";

export default class LoaderShader extends EventEmitter {
  experience: Experience;
  material: THREE.ShaderMaterial;
  geometry: THREE.PlaneGeometry;
  mesh: THREE.Mesh;
  vertexShader: string;
  fragmentShader: string;
  debug: Debug;
  debugFolder: GUI;

  loadingScreen: HTMLDivElement;
  btnLoader: HTMLButtonElement;
  progressText: HTMLParagraphElement;

  constructor() {
    super();

    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.vertexShader = this.createVertexShader();
    this.fragmentShader = this.createFragmentShader();
    this.createMesh();

    this.loadingScreen = document.querySelector("#loaderScreen")!;
    this.btnLoader = document.querySelector("#btnLoader")!;
    this.progressText = document.querySelector("#loadingProgress")!;

    this.btnLoader.addEventListener("click", () => {
      this.animateProgress();
    });

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("shader loader");
      this.debugFolder.add(
        this.material.uniforms.uProgress!,
        "value",
        0,
        10,
        0.01
      );
    }
  }

  updateProgress() {
    let progress =
      (this.experience.resources.uploaded /
        this.experience.resources.toUpload) *
      100;

    this.progressText.innerHTML = `${progress.toFixed()}%`;

    if (progress === 100) {
      gsap
        .timeline()
        .to(this.progressText, {
          yPercent: -20,
          opacity: 0,
        })
        .fromTo(
          this.btnLoader,
          {
            opacity: 0,
            yPercent: 10,
          },
          {
            opacity: 1,
            yPercent: -50,
          }
        );
    }
  }
  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent: true,

      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 10 },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uMultiplayer: { value: 0.0001 },
      },
    });
  }

  createVertexShader() {
    return `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;

        float PI = 3.141592653589793;

        void main(){
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;

          
          // gl_Position = projectedPosition;

          gl_Position = vec4(position, 1.0);


          vUv = uv;
          vNormal = (modelMatrix * vec4(normal,0)).xyz;
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      }`;
  }
  createFragmentShader() {
    return `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float uTime;
        uniform float uProgress;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

vec3 hash( vec3 p ) // replace this by something better
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
            dot(p,vec3(269.5,183.3,246.1)),
            dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec3 p )
{
  vec3 i = floor( p );
  vec3 f = fract( p );
	
	vec3 u = f*f*(3.0-2.0*f);

  return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                        dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                        dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
              mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                        dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                        dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
  }

  float fbm(vec3 p, int octaves, float persistence, float lacunarity) {
    float amplitude = 0.5;
    float frequency = 1.0;
    float total = 0.0;
    float normalization = 0.0;

    for (int i = 0; i < octaves; ++i) {
      float noiseValue = noise(p * frequency);
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    total /= normalization;

    return total;
  }        

void main(){
vec2 uv = vUv;
vec3 baseColor = vec3(1, 0.38, 0.27);
vec3 coords = vec3(uv *10., uProgress);

float noiseSample = 0.0;

noiseSample = remap(noise(coords), -1.0, 1.0, 0.0, 1.0);
float alpha = remap(uProgress, 0.0, 10.0, 0.0, 1.0) ; 
vec3 color = baseColor;

// Use noiseSample to reveal the underlying content based on uProgress
if (alpha < 1.0) {
    // color = mix(color, vec3(noiseSample), alpha);
    color = mix(color, mix(baseColor, vec3(1.0), noiseSample), alpha) ;
}

gl_FragColor = vec4(color,alpha);   
}`;
  }

  createMesh() {
    this.createMaterial();
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 10, 10),
      this.material
    );
  }

  animateProgress() {
    gsap
      .timeline()
      .to(this.btnLoader, {
        yPercent: -100,
        opacity: 0,
        duration: 1,
      })
      .set(this.loadingScreen, {
        display: "none",
      })
      .to(this.material.uniforms.uProgress, {
        value: 0,
        duration: 1,
        ease: "none",
      })
      .set("#canvas", {
        zIndex: -1,
      });
  }
}
