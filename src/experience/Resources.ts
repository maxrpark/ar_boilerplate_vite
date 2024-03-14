import * as THREE from "three";

import EventEmitter from "./EventEmitter.js";
import {
  DRACOLoader,
  GLTFLoader,
  RGBELoader,
  GLTF,
} from "three/examples/jsm/Addons.js";

export interface modelData {
  id: number;
  name: string;
  //@ts-ignore
  model: GLTF;
  arModel: THREE.Group;
}

export interface SourceInt {
  type: LoaderType;
  path: string & string[];
  name: string;
  modelData?: modelData;
}

export enum Loader {
  RGBE_LOADER = "rgbeLoader",
  GLTF_LOADER = "gltfLoader",
  TEXTURE_LOADER = "textureLoader",
}

export type LoaderType =
  | Loader.GLTF_LOADER
  | Loader.RGBE_LOADER
  | Loader.TEXTURE_LOADER;

interface LoadersInt {
  [Loader.GLTF_LOADER]: GLTFLoader;
  [Loader.RGBE_LOADER]: RGBELoader;
  [Loader.TEXTURE_LOADER]: THREE.TextureLoader;
}
// export interface SourceInt {
//   type: LoaderType;
//   name: string;
//   path: string;
// }

type ItemType = GLTF | THREE.Texture | THREE.CubeTexture;

export interface ResourceItemsInt {
  [key: string]: ItemType;
}

export default class Resources extends EventEmitter {
  sources: SourceInt[];
  items: ResourceItemsInt;
  toUpload: number;
  uploaded: number;
  loaders: LoadersInt;
  glbModels: modelData[];

  constructor(sources: SourceInt[]) {
    super();

    this.sources = sources;
    this.toUpload = this.sources.length;
    this.uploaded = 0;
    this.items = {};
    this.glbModels = [];

    this.loaders = {
      [Loader.GLTF_LOADER]: new GLTFLoader(),
      [Loader.RGBE_LOADER]: new RGBELoader(),
      [Loader.TEXTURE_LOADER]: new THREE.TextureLoader(),
    };

    this.startLoading();
  }
  startLoading() {
    for (const source of this.sources) {
      if (this.loaders[source.type] instanceof GLTFLoader) {
        // Setup DracoLoader
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        //@ts-ignore
        this.loaders[source.type].setDRACOLoader(dracoLoader);
      }
      // TODO any
      this.loaders[source.type].load(source.path, (file: any) => {
        this.loadSource(source, file);
      });
    }
  }
  loadSource(source: SourceInt, file: LoaderType) {
    if (source.type !== Loader.GLTF_LOADER) {
      //@ts-ignore

      this.items[source.name] = file;
    } else {
      this.setRecourses(source, file);
    }

    this.uploaded++;

    this.trigger("itemLoaded");

    if (this.uploaded === this.toUpload) {
      this.trigger("loaded");
    }
  }

  setRecourses(source: SourceInt, file: LoaderType) {
    let id = 0;

    let item = {
      id: 0,
      name: source.name,
      //@ts-ignore
      model: file,
      //@ts-ignore
      arModel: file.scene!.clone(),
    };
    id++;
    //@ts-ignore

    this.glbModels.push(item);
  }
}
