// ------------- global imports -------------
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
AdvancedDynamicTexture,
Button,
Container,
Control,
InputText,
Rectangle,
TextBlock,
} from "@babylonjs/gui/2D";
import {
AbstractMesh,
ArcRotateCamera,
ArcRotateCameraPointersInput,
AssetContainer,
AssetsManager,
BoundingInfo,
BoxParticleEmitter,
Camera,
Color3,
Color4,
ColorCurves,
Constants,
CSG,
CubeTexture,
DefaultLoadingScreen,
DefaultRenderingPipeline,
DepthOfFieldEffectBlurLevel,
DirectionalLight,
Effect,
Engine,
FreeCamera,
HemisphericLight,
HighlightLayer,
ImageProcessingPostProcess,
InstancedMesh,
IParticleSystem,
Layer,
LensFlare,
LensFlareSystem,
Material,
MaterialPluginBase,
Matrix,
Mesh,
MeshAssetTask,
MeshBuilder,
NoiseProceduralTexture,
ParticleHelper,
ParticleSystem,
ParticleSystemSet,
PassPostProcess,
Plane,
PointLight,
PointerEventTypes,
PostProcess,
Quaternion,
RegisterMaterialPlugin,
RenderTargetTexture,
Scene,
SceneLoader,
ShaderMaterial,
SphereParticleEmitter,
StandardMaterial,
TextFileAssetTask,
Texture,
Tools,
TransformNode,
UniversalCamera,
Vector2,
Vector3,
Vector4,
VertexBuffer,
VertexData,
Viewport,
VolumetricLightScatteringPostProcess,
WebGPUEngine,
} from "@babylonjs/core";
// ----------- global imports end -----------

// let SPECTOR = require("spectorjs");
// let spector = new SPECTOR.Spector();
// spector.displayUI();

export * from "./AmbientLight";
export * from "./AssetsLoader";
export * from "./Building";
export * from "./CameraLayerMask";
export * from "./ColorHighlightLayer";
export * from "./ConsoleFunctions";
export * from "./Emplacement";
export * from "./Entity";
export * from "./ExplosionEffect";
export * from "./Ground";
export * from "./Gui";
export * from "./Jupiter";
export * from "./KeyboardInputManager";
export * from "./MainCamera";
export * from "./MapLoader";
export * from "./Minimap";
export * from "./MouseSelectionBoxOnGui";
export * from "./MoveMarker";
export * from "./RenderingGroupId";
export * from "./RenderingPipeline";
export * from "./RepairIcon";
export * from "./SelectionManager";
export * from "./Skybox";
export * from "./SliceMesh";
export * from "./SpaceshipTrail";
export * from "./SquadronsOfAbandonement";
export * from "./Sun";
export * from "./Unit";

import { SquadronsOfAbandonement } from "./SquadronsOfAbandonement";

new SquadronsOfAbandonement();
