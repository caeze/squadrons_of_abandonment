import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class AssetsLoader {
    public loadAssets(scene: BABYLON.Scene, currentUrl: string, glbFileNames: string[], particleSystemFileNames: string[], textFileNames: string[], onProgressFunction: (remainingCount: number, totalCount: number, lastFinishedTask: any) => void, onFinishFunction: (meshAssetContainers: Record<string, BABYLON.AssetContainer>, particleSystemAssetContainers: Record<string, BABYLON.ParticleSystem>, textFileAssetContainers: Record<string, string>) => void) {
        let assetsManager = new BABYLON.AssetsManager(scene);
        let meshAssetContainers: Record<string, BABYLON.AssetContainer> = {};
        let particleSystemAssetContainers: Record<string, BABYLON.ParticleSystem> = {};
        let textFileAssetContainers: Record<string, string> = {};

        for (let i = 0; i < glbFileNames.length; i++) {
            let meshTask = assetsManager.addMeshTask("meshTask" + i, "", currentUrl + "assets/models/", glbFileNames[i]);
            meshTask.onSuccess = function (task: BABYLON.MeshAssetTask) {
                let assetContainer = new BABYLON.AssetContainer(scene);
                let loadedMeshes = task.loadedMeshes;
                let loadedMeshName = task.sceneFilename.toString().replace(".glb", "");
                for (let j = 0; j < loadedMeshes.length; j++) {
                    loadedMeshes[j].name = loadedMeshName + "_" + j;
                    loadedMeshes[j].renderingGroupId = SOA.RenderingGroupId.MAIN;
                    loadedMeshes[j].layerMask = SOA.CameraLayerMask.MAIN;
                    loadedMeshes[j].isPickable = false;
                    assetContainer.meshes.push(loadedMeshes[j]);
                }
                assetContainer.removeAllFromScene();
                meshAssetContainers[loadedMeshName] = assetContainer;
            };
            meshTask.onError = function (task: BABYLON.MeshAssetTask, message: any, exception: any) {
                alert("meshTask.onError" + "\n" + message + "\n" + exception + "\n" + i);
            };
        }


        for (let i = 0; i < particleSystemFileNames.length; i++) {
            let particleSystemTask = assetsManager.addTextFileTask("particleSystemTask" + i, currentUrl + "assets/particle_definitions/systems/" + particleSystemFileNames[i]);
            let particleSystemName = particleSystemFileNames[i].replace(".json", "");
            particleSystemTask.onSuccess = function (task: BABYLON.TextFileAssetTask) {
                let assetContainer = new BABYLON.AssetContainer(scene);
                let particleSystem = BABYLON.ParticleSystem.Parse(JSON.parse(task.text), scene, "", false, 1000);
                particleSystem.emitter = new BABYLON.TransformNode("particleSystemTaskTransformNode" + i) as BABYLON.AbstractMesh;
                particleSystemAssetContainers[particleSystemName] = particleSystem;
            };
            particleSystemTask.onError = function (task: BABYLON.TextFileAssetTask, message: any, exception: any) {
                alert("particleSystemTask.onError" + "\n" + message + "\n" + exception);
            };
        }

        for (let i = 0; i < textFileNames.length; i++) {
            let textFileTask = assetsManager.addTextFileTask("rocketParticleSystemTask", currentUrl + "assets/" + textFileNames[i]);
            textFileTask.onSuccess = function (task: BABYLON.TextFileAssetTask) {
                textFileAssetContainers[textFileNames[i]] = task.text;
            };
            textFileTask.onError = function (task: BABYLON.TextFileAssetTask, message: any, exception: any) {
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