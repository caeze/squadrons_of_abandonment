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

export class AssetsLoader {
    public loadAssets(scene: Scene, currentUrl: string, glbFileNames: string[], particleSystemFileNames: string[], textFileNames: string[], onProgressFunction: (remainingCount: number, totalCount: number, lastFinishedTask: any) => void, onFinishFunction: (meshAssetContainers: Record<string, AssetContainer>, particleSystemAssetContainers: Record<string, ParticleSystem>, textFileAssetContainers: Record<string, string>) => void) {
        let assetsManager = new AssetsManager(scene);
        let meshAssetContainers: Record<string, AssetContainer> = {};
        let particleSystemAssetContainers: Record<string, ParticleSystem> = {};
        let textFileAssetContainers: Record<string, string> = {};
        
        for(let i = 0; i < glbFileNames.length; i++) {
            let meshTask = assetsManager.addMeshTask("meshTask" + i, "", currentUrl + "assets/models/", glbFileNames[i]);
            meshTask.onSuccess = function (task: MeshAssetTask) {
                let assetContainer = new AssetContainer(scene);
                let loadedMeshes = task.loadedMeshes;
                let loadedMeshName = task.sceneFilename.toString().replace(".glb", "");
                for(let j = 0; j < loadedMeshes.length; j++) {
                    loadedMeshes[j].name = loadedMeshName + "_" + j;
                    loadedMeshes[j].renderingGroupId = SOA.RenderingGroupId.MAIN;
                    loadedMeshes[j].layerMask = SOA.CameraLayerMask.MAIN;
                    loadedMeshes[j].isPickable = true;
                    assetContainer.meshes.push(loadedMeshes[j]);
                }
                assetContainer.removeAllFromScene();
                meshAssetContainers[loadedMeshName] = assetContainer;
            };
            meshTask.onError = function (task: MeshAssetTask, message: any, exception: any) {
                alert("meshTask.onError" + "\n" + message + "\n" + exception + "\n" + i);
            };
        }
        
        
        for(let i = 0; i < particleSystemFileNames.length; i++) {
            let particleSystemTask = assetsManager.addTextFileTask("particleSystemTask" + i, currentUrl + "assets/particle_definitions/systems/" + particleSystemFileNames[i]);
            let particleSystemName = particleSystemFileNames[i].replace(".json", "");
            particleSystemTask.onSuccess = function (task: TextFileAssetTask) {
                let assetContainer = new AssetContainer(scene);
                let particleSystem = ParticleSystem.Parse(JSON.parse(task.text), scene, "", false, 1000);
                particleSystem.emitter = new TransformNode("particleSystemTaskTransformNode" + i) as AbstractMesh;
                particleSystemAssetContainers[particleSystemName] = particleSystem;
            };
            particleSystemTask.onError = function (task: TextFileAssetTask, message: any, exception: any) {
                alert("particleSystemTask.onError" + "\n" + message + "\n" + exception);
            };
        }
        
        for(let i = 0; i < textFileNames.length; i++) {
            let textFileTask = assetsManager.addTextFileTask("rocketParticleSystemTask", currentUrl + "assets/" + textFileNames[i]);
            textFileTask.onSuccess = function (task: TextFileAssetTask) {
                textFileAssetContainers[textFileNames[i]] = task.text;
            };
            textFileTask.onError = function (task: TextFileAssetTask, message: any, exception: any) {
                alert("textFileTask.onError" + "\n" + message + "\n" + exception);
            };
        }
        
        assetsManager.onProgress = onProgressFunction;
        assetsManager.onFinish = function (tasks: any) {
            onFinishFunction(meshAssetContainers, particleSystemAssetContainers, textFileAssetContainers);
        };
        /*assetsManager.onTaskSuccess = function (task) {
            console.log("assetsManager.onTaskSuccess", task);
        };*/
        assetsManager.onTaskError = function (task) {
            alert("assetsManager.onTaskError" + "\n" + task);
        };
        
        /*assetsManager.onTaskSuccessObservable.add(function (task) {
            console.log("assetsManager.onTaskSuccessObservable", task);
        });
        assetsManager.onTaskErrorObservable.add(function (task) {
            console.log("assetsManager.onTaskErrorObservable", task, task.errorObject.message, task.errorObject.exception);
        });
        assetsManager.onProgressObservable.add(function (task) {
            console.log("assetsManager.onProgressObservable", task);
        });
        assetsManager.onTasksDoneObservable.add(function (task) {
            console.log("assetsManager.onTasksDoneObservable ", task);
        });*/
        
        assetsManager.load();
    }
}