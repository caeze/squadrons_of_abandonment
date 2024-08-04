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

import { RenderingGroupId } from "./RenderingGroupId";
import { CameraLayerMask } from "./CameraLayerMask";

export class Minimap {
    public minimapCamera: UniversalCamera;

    public constructor(scene: Scene, camera: Camera, engine: Engine, currentUrl: string, mapSidelength: number) {
        this.minimapCamera = new UniversalCamera("minimapCamera", new Vector3(0, 20, 0), scene);
        this.minimapCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
        this.minimapCamera.minZ = 0.1;
        this.minimapCamera.setTarget(Vector3.Zero());
        let minimapCameraViewportMarginFactor = 1.05;
        let minimapCameraViewport = mapSidelength / 2.0 * minimapCameraViewportMarginFactor;
        this.minimapCamera.orthoTop = -minimapCameraViewport;
        this.minimapCamera.orthoBottom = minimapCameraViewport;
        this.minimapCamera.orthoLeft = minimapCameraViewport;
        this.minimapCamera.orthoRight = -minimapCameraViewport;
        this.minimapCamera.layerMask = CameraLayerMask.MINIMAP;
        this.resize(window.innerWidth, window.innerHeight);
        let minimapBackgroundLayer = new Layer("minimapBackgroundLayer", currentUrl + "/assets/img/minimapBackground.png", scene, true);
        minimapBackgroundLayer.layerMask = CameraLayerMask.MINIMAP;
    }
    
    public resize(windowInnerWidthPx: number, windowInnerHeightPx: number) {
        let targetWidthPx = 300;
        let targetHeightPx = 300;
        this.minimapCamera.viewport = new Viewport(0.0, 0.0, targetWidthPx / windowInnerWidthPx, targetHeightPx / windowInnerHeightPx);
    }
}