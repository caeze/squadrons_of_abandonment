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

import { SquadronsOfAbandonement } from "./SquadronsOfAbandonement";

new SquadronsOfAbandonement();