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

import { CameraLayerMask } from "./CameraLayerMask";

export class MainCamera {
    public camera: ArcRotateCamera;
    private prevRadius: number;
    private shakeIterationCounter: number;

    public constructor(canvas: HTMLElement, scene: Scene) {
        this.camera = new ArcRotateCamera("MainCamera", -Math.PI / 2, Math.PI / 4, 4, Vector3.Zero(), scene);
        this.camera.allowUpsideDown = false;
        this.camera.lowerBetaLimit = 0.0;
        this.camera.upperBetaLimit = Math.PI / 2.0 - 0.01;
        this.camera.lowerRadiusLimit = 1.0;
        this.camera.upperRadiusLimit = 100.0;
        this.camera.angularSensibilityX = 2500.0; // mouse camera rotate speed
        this.camera.angularSensibilityY = 2500.0;
        this.camera.panningSensibility = 4000.0; // mouse move camera speed
        this.camera.wheelDeltaPercentage = 0.0;
        this.camera.inertia = 0.7;
        this.camera.minZ = 0.5;
        this.camera.maxZ = 100000;
        this.camera.checkCollisions = true;
        this.camera.setTarget(Vector3.Zero());
        (this.camera.inputs.attached.pointers as ArcRotateCameraPointersInput).buttons = [1];
        this.camera.inputs.remove(this.camera.inputs.attached.keyboard);
        this.camera.wheelPrecision = 20.0;
        this.camera.attachControl(canvas, true);
        this.camera.checkCollisions = true;
        this.camera.layerMask = CameraLayerMask.MAIN;
        this.prevRadius = this.camera.radius;
        this.shakeIterationCounter = 0;
    }
    
    public runBeforeRender() {
        if (this.prevRadius != this.camera.radius) {
            let ratio = this.prevRadius / this.camera.radius;
            this.prevRadius = this.camera.radius;
            this.camera.panningSensibility *= ratio;
            this.camera.wheelPrecision *= ratio;
        }
    }
    
    public static shake(mainCamera: MainCamera) {
        let shakeDurationMs = 400;
        let shakeIntervalTimeMs = 20;
        mainCamera.shakeIterationCounter = 0;
        let timerId = setInterval(MainCamera.shakeImplementation, shakeIntervalTimeMs, mainCamera);
        setTimeout(MainCamera.cancelCameraShake, shakeDurationMs, timerId);
    }
    
    private static shakeImplementation(mainCamera: MainCamera) {
        mainCamera.shakeIterationCounter++;
        let maxDisplacement = mainCamera.camera.radius * 0.025 * 1 / mainCamera.shakeIterationCounter;
        let displacementX = maxDisplacement * (Math.random() - 0.5);
        let displacementY = 0.0;
        let displacementZ = maxDisplacement * (Math.random() - 0.5);
        let cameraPosition = new Vector3(mainCamera.camera.position.x, mainCamera.camera.position.y, mainCamera.camera.position.z);
        let cameraTarget = new Vector3(mainCamera.camera.getTarget().x, mainCamera.camera.getTarget().y, mainCamera.camera.getTarget().z);
        mainCamera.camera.position = new Vector3(cameraPosition.x + displacementX, cameraPosition.y + displacementY, cameraPosition.z + displacementZ);
        mainCamera.camera.setTarget(new Vector3(cameraTarget.x + displacementX, cameraTarget.y + displacementY, cameraTarget.z + displacementZ));
    }
    
    private static cancelCameraShake(timerId: number) {
        clearTimeout(timerId);
    }
}