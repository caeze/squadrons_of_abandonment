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

import * as SOA from "./app";

export class Jupiter {    
    public constructor(assetContainer: AssetContainer) {
        let cloneMaterialsAndDontShareThem = true;
        let instantiatedEntries = assetContainer.instantiateModelsToScene((name) => "p_" + name, cloneMaterialsAndDontShareThem);
        let jupiterMesh = instantiatedEntries.rootNodes[0] as Mesh;
        let scalingFactor = 10000.0;
        jupiterMesh.scaling.x = scalingFactor;
        jupiterMesh.scaling.y = scalingFactor;
        jupiterMesh.scaling.z = scalingFactor;
        jupiterMesh.position.x = scalingFactor * 1.5;
        jupiterMesh.position.y = scalingFactor * -0.35;
        jupiterMesh.position.z = scalingFactor * -1.0;
    }
}