declare class BasisEncoder{
  constructor();
  encode: (image: Uint8Array) => number;
  setSliceSourceImage: (slice_index: number, image: Uint8Array, width: number, height: number, isPng: boolean) => boolean;
  setUASTC: (uastc: boolean) => void;
  setYFlip: (yFlip: boolean) => void;
  setDebug: (debug: boolean) => void;
  setPerceptual: (perceptual: boolean) => void;
  setCheckForAlpha: (checkForAlpha: boolean) => void;
  setForceAlpha: (forceAlpha: boolean) => void;
  setSwizzle: (red: number, green: number, blue: number, alpha: number) => void;
  setRenormalize: (renormalize: boolean) => void;
  setMaxEndpointClusters: (max_endpoint_clusters: number) => void;
  setMaxSelectorClusters: (max_selector_clusters: number) => void;
  setQualityLevel: (quality_level: number) => void;
  setCompressionLevel: (compression_level: number) => void;
  setNormalMap: ()=>void;
  setSelectorRDOThresh: (selector_rdo_thresh: number) => void;
  setEndpointRDOThresh: (endpoint_rdo_thresh: number) => void;
  setCreateKTX2File: (create_ktx2_file: boolean) => void;
  setKTX2UASTCSupercompression: (ktx2_uastc_supercompression: boolean) => void;
  setKTX2SRGBTransferFunc: (ktx2_srgb_transfer_func: boolean) => void;
  setMipGen: (mip_gen: boolean) => void;
  setMipScale: (mip_scale: number) => void;
  setMipFilter: (mip_filter: number) => void;
  setMipSRGB: (mip_srgb: boolean) => void;
  setMipRenormalize: (mip_renormalize: boolean) => void;
  setMipWrapping: (mip_wrapping: boolean) => void;
  setMipSmallestDimension: (mip_smallest_dimension: number) => void;
  setTexType: (tex_type: number) => void;
  setUserData0: (userData0: number) => void;
  setUserData1: (userData1: number) => void;
  setPackUASTCFlags: (pack_uastc_flags: number) => void;
  setRDOUASTC: (rdo_uastc: boolean) => void;
  setRDOUASTCQualityScalar: (rdo_uastc_quality_scalar: number) => void;
  setRDOUASTCDictSize: (rdo_uastc_dict_size: number) => void;
  setRDOUASTCMaxAllowedRMSIncreaseRatio: (rdo_uastc_max_allowed_rms_increase_ratio: number) => void;
  setRDOUASTCSkipBlockRMSThresh: (rdo_uastc_skip_block_rms_thresh: number) => void;
  setNoSelectorRDO: (no_selector_rdo: boolean) => void;
  setNoEndpointRDO: (no_endpoint_rdo: boolean) => void;
  setComputeStats: (compute_stats: boolean) => void;
  setDebugImages: (debug_images: boolean) => void;
  delete: () => void;
}

declare class BasisFile{
  constructor(data: Uint8Array);
  close: () => void;
  getHasAlpha: () => boolean;
  isUASTC: () => boolean;
  getNumImages: () => number;
  getNumLevels: (image_index: number) => number;
  getImageWidth: (image_index: number, level_index: number) => number;
  getImageHeight: (image_index: number, level_index: number) => number;
  getImageTranscodedSizeInBytes: (image_index: number, level_index: number, format: number) => number;
  startTranscoding: () => number;
  transcodeImage: (dst: Uint8Array, image_index: number, level_index: number, format: number, unused: number, getAlphaForOpaqueFormats: number) => number;
  getFileDesc: () => BasisFileDesc;
  getImageDesc: (image_index: number) => BasisImageDesc;
  getImageLevelDesc: (image_index: number, level_index: number) => BasisImageLevelDesc;
  delete: () => void;
}

declare class BasisFileDesc{
  version: number;
  usPerFrame: number;
  totalImages: number;
  userdata0 : number;
  userdata1 : number;
  texFormat: number;
  yFlipped: boolean;
  hasAlphaSlices: boolean;
  numEndpoints: number;
  endpointPaletteOfs: number;
  endpointPaletteLen: number;
  numSelectors: number;
  selectorPaletteOfs: number;
  selectorPaletteLen: number;
  tablesOfs: number;
  tablesLen: number;
}

declare class BasisImageDesc{
  origWidth: number;
  origHeight: number;
  numBlocksX: number;
  numBlocksY: number;
  numLevels: number;
  alphaFlag: boolean;
  iframeFlag: boolean;
}

declare class BasisImageLevelDesc{
  rgbFileOfs: number;
  rgbFileLen: number;
  alphaFileOfs: number;
  alphaFileLen: number;
}

declare type InitResult = {
  BasisEncoder: new () => BasisEncoder;
  BasisFile: new (data: Uint8Array) => BasisFile;
  initializeBasis: () => void;
};

declare const BASIS: () => Promise<InitResult>;

export { BasisEncoder, BasisFile, type InitResult };

export default BASIS;
