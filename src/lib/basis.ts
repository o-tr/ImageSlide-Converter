import BASIS, {
  type BasisEncoder,
  type BasisFile,
} from "@/_lib/basis/basis_encoder";
let encoder: new () => BasisEncoder;
let file: new (data: Uint8Array) => BasisFile;
let init: () => void;
export const initPromise: Promise<void> = BASIS().then((b) => {
  encoder = b.BasisEncoder;
  file = b.BasisFile;
  init = b.initializeBasis;
});

export { encoder as BasisEncoder, file as BasisFile, init as initializeBasis };

export const BASIS_FORMAT = {
  cTFETC1: 0,
  cTFETC2: 1,
  cTFBC1: 2,
  cTFBC3: 3,
  cTFBC4: 4,
  cTFBC5: 5,
  cTFBC7: 6,
  cTFPVRTC1_4_RGB: 8,
  cTFPVRTC1_4_RGBA: 9,
  cTFASTC_4x4: 10,
  cTFATC_RGB: 11,
  cTFATC_RGBA_INTERPOLATED_ALPHA: 12,
  cTFRGBA32: 13,
  cTFRGB565: 14,
  cTFBGR565: 15,
  cTFRGBA4444: 16,
  cTFFXT1_RGB: 17,
  cTFPVRTC2_4_RGB: 18,
  cTFPVRTC2_4_RGBA: 19,
  cTFETC2_EAC_R11: 20,
  cTFETC2_EAC_RG11: 21,
};
