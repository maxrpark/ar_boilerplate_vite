import { SourceInt } from "../experience/Resources";

export default [
  {
    type: "rgbeLoader",
    name: "environmentMap",
    path: "/environments/bg_map_2.hdr",
  },
  // {
  //   type: "gltfLoader",
  //   path: "/models/model.glb",
  //   name: "model",
  //   modelData: {},
  // },
  {
    type: "gltfLoader",
    path: "/models/glasses/scene.gltf",
    name: "glasses",
    modelData: {},
  },
  {
    type: "gltfLoader",
    path: "/models/occluder/headOccluder.glb",
    name: "headOccluder",
    modelData: {},
  },
] as SourceInt[];
