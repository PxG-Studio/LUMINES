export interface UnityProject {
  id: string;
  name: string;
  version: string;
  unityVersion: string;
  path: string;
  settings: UnityProjectSettings;
  scenes: UnityScene[];
  packages: UnityPackage[];
  metadata: Record<string, any>;
}

export interface UnityProjectSettings {
  companyName: string;
  productName: string;
  defaultIcon?: string;
  defaultCursor?: string;
  cursorHotspot?: { x: number; y: number };
  splashScreen?: UnitySplashScreen;
  playerSettings: UnityPlayerSettings;
  qualitySettings: UnityQualitySettings;
  graphicsSettings: UnityGraphicsSettings;
}

export interface UnitySplashScreen {
  show: boolean;
  backgroundColor: string;
  logos: Array<{ texture: string; duration: number }>;
}

export interface UnityPlayerSettings {
  bundleIdentifier: string;
  bundleVersion: string;
  apiCompatibilityLevel: 'NET_4_6' | 'NET_Standard_2_0' | 'NET_Standard_2_1';
  scriptingBackend: 'Mono' | 'IL2CPP';
  targetArchitectures: string[];
  optimization: 'None' | 'Size' | 'Speed';
  stripEngineCode: boolean;
  managedStrippingLevel: 'Disabled' | 'Low' | 'Medium' | 'High';
}

export interface UnityQualitySettings {
  levels: UnityQualityLevel[];
  defaultLevel: number;
}

export interface UnityQualityLevel {
  name: string;
  pixelLightCount: number;
  shadows: 'Disabled' | 'HardOnly' | 'All';
  shadowResolution: 'Low' | 'Medium' | 'High' | 'VeryHigh';
  shadowProjection: 'CloseFit' | 'StableFit';
  shadowDistance: number;
  shadowCascades: 0 | 2 | 4;
  antiAliasing: 0 | 2 | 4 | 8;
  vSyncCount: 0 | 1 | 2;
  anisotropicTextures: 'Disabled' | 'PerTexture' | 'ForceEnable';
  realtimeReflectionProbes: boolean;
}

export interface UnityGraphicsSettings {
  renderPipeline: 'BuiltIn' | 'URP' | 'HDRP';
  colorSpace: 'Gamma' | 'Linear';
  lightmapEncoding: 'Normal' | 'HighQuality';
  hdrMode: 'Off' | 'FP16' | 'R11G11B10';
  tier1: UnityGraphicsTier;
  tier2: UnityGraphicsTier;
  tier3: UnityGraphicsTier;
}

export interface UnityGraphicsTier {
  renderingPath: 'Forward' | 'Deferred' | 'VertexLit';
  hdrMode: 'Off' | 'FP16' | 'R11G11B10';
  realtimeGICPUUsage: 'Low' | 'Medium' | 'High' | 'Unlimited';
}

export interface UnityScene {
  guid: string;
  path: string;
  name: string;
  buildIndex: number;
  enabled: boolean;
}

export interface UnityPackage {
  name: string;
  version: string;
  displayName: string;
  description?: string;
  dependencies?: Record<string, string>;
}

export interface UnityAssetMetadata {
  guid: string;
  path: string;
  type: UnityAssetType;
  fileFormatVersion: number;
  importer?: string;
  importerSettings?: Record<string, any>;
  dependencies?: string[];
  userData?: string;
  assetBundleName?: string;
  assetBundleVariant?: string;
}

export type UnityAssetType =
  | 'Prefab'
  | 'Scene'
  | 'ScriptableObject'
  | 'Material'
  | 'Shader'
  | 'Texture'
  | 'Model'
  | 'Audio'
  | 'Animation'
  | 'AnimatorController'
  | 'Script'
  | 'Font'
  | 'Video'
  | 'Compute'
  | 'RenderTexture'
  | 'LightingData'
  | 'Unknown';

export interface UnityBuildTarget {
  platform: UnityBuildPlatform;
  architecture: string;
  scriptingBackend: 'Mono' | 'IL2CPP';
  developmentBuild: boolean;
  scriptDebugging: boolean;
  compressionMethod: 'Default' | 'LZ4' | 'LZ4HC';
  buildOptions: string[];
}

export type UnityBuildPlatform =
  | 'StandaloneWindows'
  | 'StandaloneWindows64'
  | 'StandaloneOSX'
  | 'StandaloneLinux64'
  | 'iOS'
  | 'Android'
  | 'WebGL'
  | 'PS5'
  | 'XboxOne'
  | 'Switch';

export interface UnityEditorCommand {
  type: 'batch' | 'executeMethod' | 'buildPlayer' | 'quit';
  method?: string;
  args?: string[];
  logFile?: string;
  projectPath: string;
}

export interface UnityEditorResponse {
  success: boolean;
  exitCode: number;
  output: string;
  error?: string;
  duration: number;
}

export interface UnityPlayModeState {
  isPlaying: boolean;
  isPaused: boolean;
  frameCount: number;
  time: number;
  timeScale: number;
  targetFrameRate: number;
  vSyncCount: number;
}

export interface UnityPlayModeCommand {
  action: 'play' | 'pause' | 'step' | 'stop';
  params?: {
    timeScale?: number;
    targetFrameRate?: number;
  };
}

export interface UnityProfilerFrame {
  frameIndex: number;
  timestamp: number;
  cpu: UnityProfilerCPU;
  gpu: UnityProfilerGPU;
  memory: UnityProfilerMemory;
  rendering: UnityProfilerRendering;
  physics: UnityProfilerPhysics;
  audio: UnityProfilerAudio;
}

export interface UnityProfilerCPU {
  totalTime: number;
  renderTime: number;
  scriptsTime: number;
  physicsTime: number;
  animationTime: number;
  garbageCollectionTime: number;
  vsyncTime: number;
  mainThreadTime: number;
  renderThreadTime: number;
}

export interface UnityProfilerGPU {
  totalTime: number;
  drawCalls: number;
  batchesRendered: number;
  triangles: number;
  vertices: number;
  setPassCalls: number;
  shadowCasters: number;
}

export interface UnityProfilerMemory {
  totalAllocated: number;
  totalReserved: number;
  gcAllocated: number;
  gcReserved: number;
  textureMemory: number;
  meshMemory: number;
  audioMemory: number;
  totalUnityAllocations: number;
}

export interface UnityProfilerRendering {
  batches: number;
  dynamicBatches: number;
  staticBatches: number;
  instancedBatches: number;
  drawCalls: number;
  triangles: number;
  vertices: number;
  visibleSkinMeshRenderers: number;
  visibleRenderers: number;
  culledLights: number;
  visibleLights: number;
}

export interface UnityProfilerPhysics {
  activeRigidbodies: number;
  activeDynamicBodies: number;
  activeKinematicBodies: number;
  activeColliders: number;
  contactsCount: number;
  physicsTime: number;
}

export interface UnityProfilerAudio {
  activeSources: number;
  totalSources: number;
  playingVoices: number;
  totalVoices: number;
  audioTime: number;
  dspTime: number;
}

export interface UnityImportSettings {
  textures: UnityTextureImportSettings;
  models: UnityModelImportSettings;
  audio: UnityAudioImportSettings;
}

export interface UnityTextureImportSettings {
  textureType: 'Default' | 'NormalMap' | 'Sprite' | 'Cursor' | 'Lightmap' | 'SingleChannel';
  textureShape: '2D' | 'Cube' | '2DArray' | '3D';
  sRGBTexture: boolean;
  alphaSource: 'None' | 'FromInput' | 'FromGrayScale';
  alphaIsTransparency: boolean;
  npotScale: 'None' | 'ToNearest' | 'ToLarger' | 'ToSmaller';
  readable: boolean;
  mipmaps: boolean;
  maxTextureSize: 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192;
  compressionQuality: number;
  textureCompression: 'Uncompressed' | 'Compressed' | 'CompressedHQ' | 'CompressedLQ';
  platformSettings?: Record<string, UnityTexturePlatformSettings>;
}

export interface UnityTexturePlatformSettings {
  maxTextureSize: number;
  format: string;
  textureCompression: string;
  compressionQuality: number;
  crunchedCompression: boolean;
  allowsAlphaSplitting: boolean;
  overridden: boolean;
}

export interface UnityModelImportSettings {
  fileScale: number;
  meshCompression: 'Off' | 'Low' | 'Medium' | 'High';
  importBlendShapes: boolean;
  importVisibility: boolean;
  importCameras: boolean;
  importLights: boolean;
  swapUVChannels: boolean;
  generateSecondaryUV: boolean;
  normalImportMode: 'Import' | 'Calculate' | 'None';
  normalCalculationMode: 'Unweighted' | 'Weighted' | 'MikkTSpace';
  tangentImportMode: 'Import' | 'Calculate' | 'None';
  importMaterials: boolean;
  materialLocation: 'External' | 'InPrefab';
  importAnimation: boolean;
  animationType: 'None' | 'Legacy' | 'Generic' | 'Humanoid';
  optimizeGameObjects: boolean;
}

export interface UnityAudioImportSettings {
  forceToMono: boolean;
  normalize: boolean;
  preloadAudioData: boolean;
  loadInBackground: boolean;
  ambisonic: boolean;
  sampleRateSetting: 'PreserveSampleRate' | 'OptimizeSampleRate' | 'OverrideSampleRate';
  sampleRateOverride?: number;
  compressionFormat: 'PCM' | 'Vorbis' | 'ADPCM' | 'MP3';
  quality: number;
}
