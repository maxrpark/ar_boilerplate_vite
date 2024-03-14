import { SourceInt } from "../experience/Resources";

export default [
  {
    type: "rgbeLoader",
    name: "environmentMap",
    path: "/environments/bg_map_2.hdr",
  },
  {
    type: "textureLoader",
    name: "noiseTexture",
    path: "/noise_rgb.png",
  },
  {
    type: "gltfLoader",
    path: "/models/model.glb",
    name: "model",
    modelData: {},
  },
] as SourceInt[];
