// ------------- global imports -------------
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
AdvancedDynamicTexture,
Button,
Container,
Control,
Rectangle,
TextBlock,
} from "@babylonjs/gui/2D";
import {
AbstractMesh,
ArcRotateCamera,
ArcRotateCameraPointersInput,
AssetContainer,
AssetsManager,
BoxParticleEmitter,
Camera,
Color3,
Color4,
ColorCurves,
Constants,
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

import { Sun } from "./Sun";
import { Gui } from "./Gui";
import { Minimap } from "./Minimap";
import { RenderingPipeline } from "./RenderingPipeline";
import { MouseSelectionBox } from "./MouseSelectionBox";
import { KeyboardInputManager } from "./KeyboardInputManager";
import { MainCamera } from "./MainCamera";
import { SpaceshipTrail } from "./SpaceshipTrail";
import { RenderingGroupId } from "./RenderingGroupId";
import { Ground } from "./Ground";
import { Entity } from "./Entity";
import { Unit } from "./Unit";
import { CameraLayerMask } from "./CameraLayerMask";
import { AmbientLight } from "./AmbientLight";
import { Skybox } from "./Skybox";
import { ExplosionEffect, ShockwaveEffectHandler } from "./ExplosionEffect";
import { SliceMesh } from "./SliceMesh";

function populateScene(canvas: HTMLElement, engine: Engine, scene: Scene, camera: Camera, currentUrl: string, meshes: Mesh[]): Unit[] {
    
    let sun = new Sun(scene, camera, engine, currentUrl);
    
    let units = new Array<Unit>;
    for (let i = 0; i < meshes.length; i++) {
        let unit = new Unit(scene, new Vector3(0, 0, 0), "box" + i, 5.0, currentUrl, meshes[i]);
        units.push(unit);
    }
    scene.registerBeforeRender(() => {
        units[0].mesh.position.x -= 0.005;
        //units[0].mesh.rotation.x += 0.005;
        //units[0].mesh.rotation.y += 0.005;
        units[1].mesh.position.x += 0.005;
        //units[1].mesh.rotation.x += 0.005;
        //units[1].mesh.rotation.y += 0.005;
        units[0].mesh.rotationQuaternion = null;
        units[1].mesh.rotationQuaternion = null;
    });

    
    
    const assetsManager = new AssetsManager(scene);
    const particleFile = assetsManager.addTextFileTask("rocket_particle_system", currentUrl + "/assets/particle_definitions/systems/rocket_exhaust.json");
    assetsManager.load();
    
    assetsManager.onFinish = function (task) {

        // prepare to parse particle system files
        const particleJSON = JSON.parse(particleFile.text);
        
        
        for(let i = 0; i < units.length; i++) {
            const exhaustParticleSystem = ParticleSystem.Parse(particleJSON, scene, "", false, 1000);
        

            let exhaustTransformNode = new TransformNode(units[i].mesh.name + "ExhaustTransformNode");
            exhaustTransformNode.parent = units[i].mesh;
            exhaustTransformNode.position.x = -0.6;
            exhaustTransformNode.position.y = 0.05;
            exhaustTransformNode.rotation.z = -Math.PI / 2;

            exhaustParticleSystem.emitter = exhaustTransformNode as AbstractMesh;
            exhaustParticleSystem.isLocal = true;
            exhaustParticleSystem.renderingGroupId = RenderingGroupId.MAIN;
            exhaustParticleSystem.layerMask = CameraLayerMask.MAIN;
            exhaustParticleSystem.minSize = 0.4;
            exhaustParticleSystem.maxSize = 0.4;
            exhaustParticleSystem.color1 = new Color4(1, 0.5, 0.5, 0.8);
            exhaustParticleSystem.color2 = new Color4(1, 0, 0, 1);
            exhaustParticleSystem.start();
            console.log(exhaustParticleSystem);
        }
    }
    
    
    

    
    
    let originSphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
    originSphere.renderingGroupId = RenderingGroupId.MAIN;
    originSphere.layerMask = CameraLayerMask.MAIN;
    originSphere.isPickable = true;
    
    let xSphere: Mesh = MeshBuilder.CreateSphere("xsphere", { diameter: 0.1 }, scene);
    let xSphereMaterial = new StandardMaterial("mat", scene);
    xSphereMaterial.alpha = 1;
    xSphereMaterial.diffuseColor = new Color3(1, 0, 0);
    xSphere.material = xSphereMaterial;
    xSphere.position = new Vector3(1, 0, 0);
    xSphere.isPickable = true;
    xSphere.renderingGroupId = RenderingGroupId.MAIN;
    xSphere.layerMask = CameraLayerMask.MAIN;
    
    let ySphere: Mesh = MeshBuilder.CreateSphere("ysphere", { diameter: 0.1 }, scene);
    let ySphereMaterial = new StandardMaterial("mat", scene);
    ySphereMaterial.alpha = 1;
    ySphereMaterial.diffuseColor = new Color3(0, 1, 0);
    ySphere.material = ySphereMaterial;
    ySphere.position = new Vector3(0, 1, 0);
    ySphere.isPickable = true;
    ySphere.renderingGroupId = RenderingGroupId.MAIN;
    ySphere.layerMask = CameraLayerMask.MAIN;
    
    let zSphere: Mesh = MeshBuilder.CreateSphere("zsphere", { diameter: 0.1 }, scene);
    let zSphereMaterial = new StandardMaterial("mat", scene);
    zSphereMaterial.alpha = 1;
    zSphereMaterial.diffuseColor = new Color3(0, 0, 1);
    zSphere.material = zSphereMaterial;
    zSphere.position = new Vector3(0, 0, 1);
    zSphere.isPickable = true;
    zSphere.renderingGroupId = RenderingGroupId.MAIN;
    zSphere.layerMask = CameraLayerMask.MAIN;
    
    
    
    
    
    return units;
};

class SquadronsOfAbandonement {
	public constructor() {
        let thisPtr = this;
        let currentUrl = window.location.href;
        
        let loadingScreenDiv = document.getElementById("loadingScreenDiv");
        if (loadingScreenDiv != null) {
            loadingScreenDiv.style.display = "none";
        }
        
        let canvas = document.createElement("canvas");
        /*let gl = canvas.getContext("webgl");
        if (gl != null) {
            gl.getParameter(gl.RENDERER);
        }*/
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);
        document.body.style.cssText = "margin: 0; padding: 0; height: 100%; overflow: hidden;";
        
        ParticleHelper.BaseAssetsUrl = currentUrl + "/assets/particle_definitions";
        ParticleSystemSet.BaseAssetsUrl = currentUrl + "/assets/particle_definitions";
        DefaultLoadingScreen.DefaultLogoUrl = currentUrl + "/assets/img/squadronsOfAbandonementLogo.png";

        /*let engineType = "webgpu";
        let engine: Engine;
        if (engineType === "webgpu") {
            let engine2 = new WebGPUEngine(canvas);
            engine2.initAsync();
        } else {
            engine = new Engine(canvas, true);
        }*/
        let engine = new Engine(canvas, true);
        engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
        let scene = new Scene(engine);
        
        this._loadMeshesAndShowScene(canvas, engine, scene, currentUrl, ["redSpaceFighter.glb", "redStation.glb", "spaceShuttle.glb"]);
    }
    
    private _loadMeshesAndShowScene(canvas: HTMLElement, engine: Engine, scene: Scene, currentUrl: string, glbFileNames: string[]) {
        let thisPtr = this;
        let assetsManager = new AssetsManager(scene);
        let assetContainers: Record<string, AssetContainer> = {};
        
        for(let i = 0; i < glbFileNames.length; i++) {
            let meshTask = assetsManager.addMeshTask("meshTask" + i, "", currentUrl + "/assets/models/", glbFileNames[i]);
            meshTask.onSuccess = function (task) {
                let assetContainer = new AssetContainer(scene);
                let loadedMeshes = task.loadedMeshes;
                let loadedMeshName = task.sceneFilename.toString().replace(".glb", "");
                for(let j = 0; j < loadedMeshes.length; j++) {
                    loadedMeshes[j].name = loadedMeshName + "_" + j;
                    loadedMeshes[j].renderingGroupId = RenderingGroupId.MAIN;
                    loadedMeshes[j].layerMask = CameraLayerMask.MAIN;
                    loadedMeshes[j].isPickable = true;
                    assetContainer.meshes.push(loadedMeshes[j]);
                }
                assetContainer.removeAllFromScene();
                assetContainers[loadedMeshName] = assetContainer;
            };
            meshTask.onError = function (task, message, exception) {
                alert("meshTask.onError" + "\n" + message + "\n" + exception + "\n" + i);
            };
        }
        
        assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
            let percent = Math.floor((totalCount - remainingCount) / totalCount * 100.0);
            engine.loadingUIText = "LOADING MODELS " + percent + "%";
            engine.loadingUIBackgroundColor = "#000000";
        };
        assetsManager.onFinish = function (tasks) {
            /*for (let i = 0; i < assetContainer.meshes.length; i++) {
                let mesh = assetContainer.meshes[i];
                let meshNameWithoutSuffix = mesh.name.substring(0, mesh.name.lastIndexOf("_"));
                if (!(meshNameWithoutSuffix in meshesInAssetContainer)) {
                    meshesInAssetContainer[meshNameWithoutSuffix] = [];
                }
                meshesInAssetContainer[meshNameWithoutSuffix].push(mesh);
            }*/
            thisPtr._showScene(canvas, engine, scene, currentUrl, assetContainers);
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
    
    private _showScene(canvas: HTMLElement, engine: Engine, scene: Scene, currentUrl: string, meshesInAssetContainers: Record<string, AssetContainer>) {
        let mapSidelength = 1000.0;
        
        let skybox = new Skybox(scene, currentUrl);
        let ambientLight = new AmbientLight(scene);
        let gui = new Gui(currentUrl, window.innerWidth, window.innerHeight);
        let mouseSelectionBox = new MouseSelectionBox();
        mouseSelectionBox.createMouseSelectionBox(scene, gui.advancedTexture);
        
        let mainCamera = new MainCamera(canvas, scene);
        scene.registerBeforeRender(() => {
            mainCamera.runBeforeRender();
        });
        let minimap = new Minimap(scene, mainCamera.camera, engine, currentUrl, mapSidelength);
        scene.activeCameras = [];
        scene.activeCameras.push(mainCamera.camera);
        scene.activeCameras.push(minimap.minimapCamera);
        scene.cameraToUseForPointers = mainCamera.camera;
    
        let ground = new Ground(scene, currentUrl, 128, 128, mapSidelength);
        scene.registerBeforeRender(() => {
            ground.updateRevealerPositions(revealers);
            ground.updateSelectedPositions(revealers);
        });
        
        let pipeline = new RenderingPipeline(scene, mainCamera.camera);
        
        let meshes: Mesh[] = [];
        for (let meshName in meshesInAssetContainers) {
            let assetContainer = meshesInAssetContainers[meshName];
            let cloneMaterialsAndDontShareThem = true;
            let instantiatedEntries = assetContainer.instantiateModelsToScene((name) => "p_" + name, cloneMaterialsAndDontShareThem);
            meshes.push(instantiatedEntries.rootNodes[0] as Mesh);
        }
        
        let revealers = populateScene(canvas, engine, scene, mainCamera.camera, currentUrl, meshes);

        let keyboardInputManager = new KeyboardInputManager(scene);
        keyboardInputManager.registerCallback("KeyF", "launchFullscreenCaller", this._nop, this._launchFullscreen, null);
        keyboardInputManager.registerCallback("KeyI", "toggleDebugLayerCaller", this._nop, this._toggleDebugLayer, scene);
        
        /*let unitToSlice = new Unit(scene, new Vector3(0.0, 0.0, 0.0), "unitToSlice", 5.0, currentUrl, MeshBuilder.CreateBox("boxForSlicing", {size: 0.5}, scene));
        let sliceMesh = new SliceMesh();
        let [meshParts, explodeMeshMovementDirections, explodeMeshMovementRotations] = sliceMesh.slice(scene, unitToSlice.mesh, 6);
        let explosionMovementStrengthFactor = 0.05;
        scene.registerBeforeRender(() => {
            for (let i = 0; i < meshParts.length; i++) {
                meshParts[i].position.x += explodeMeshMovementDirections[i].x * explosionMovementStrengthFactor;
                meshParts[i].position.y += explodeMeshMovementDirections[i].y * explosionMovementStrengthFactor;
                meshParts[i].position.z += explodeMeshMovementDirections[i].z * explosionMovementStrengthFactor;
                meshParts[i].rotation.x += explodeMeshMovementRotations[i].x * explosionMovementStrengthFactor;
                meshParts[i].rotation.y += explodeMeshMovementRotations[i].y * explosionMovementStrengthFactor;
                meshParts[i].rotation.z += explodeMeshMovementRotations[i].z * explosionMovementStrengthFactor;
            }
        });*/
        
        let explosionEffect = new ExplosionEffect(mainCamera.camera, scene, currentUrl);
        explosionEffect.createExplosionWithShockwave("shockwaveEffect0", new Vector3(0.0, 0.0, 0.0), scene, mainCamera, window.innerWidth, window.innerHeight, this._project);
        
        let spaceshipTrailParent = MeshBuilder.CreateSphere("sphere", {diameter: 0.1}, scene);
        let spaceshipTrail = new SpaceshipTrail("spaceshipTrail0", spaceshipTrailParent, scene, mainCamera.camera, 0.1);
        let spaceshipTrailShaderMaterial = new ShaderMaterial(
            "spaceshipTrailShaderMaterial",
            scene,
            currentUrl + "/assets/shaders/solidColor", // searches for solidColor.vertex.fx and solidColor.fragment.fx
            {
                attributes: ["position"],
                uniforms: ["worldViewProjection", "color"],
            }
        );
        spaceshipTrailShaderMaterial.setFloats("color", [0.5, 0.0, 0.0, 0.5]);
        spaceshipTrailShaderMaterial.forceDepthWrite = true;
        spaceshipTrailShaderMaterial.transparencyMode = Material.MATERIAL_ALPHABLEND;
        spaceshipTrailShaderMaterial.alpha = 0.0;
        spaceshipTrail.renderingGroupId = RenderingGroupId.MAIN;
        spaceshipTrail.layerMask = CameraLayerMask.MAIN;
        spaceshipTrail.alphaIndex = 1;
        spaceshipTrail.material = spaceshipTrailShaderMaterial;
        let k = 0;
        let p = [
            Math.random() * 180 + 20,
            Math.random() * 180 + 20,
            Math.random() * 180 + 20,
            Math.random() * 180 + 20,
            Math.random() * 180 + 20,
            Math.random() * 180 + 20,
        ]
        scene.onBeforeRenderObservable.add(
            () => {
                spaceshipTrailParent.position.x = 5 * (Math.sin(k / p[0]) + Math.cos(k / p[3]));
                spaceshipTrailParent.position.y = 5 * (Math.sin(k / p[1]) + Math.cos(k / p[4]));
                spaceshipTrailParent.position.z = 5 * (Math.sin(k / p[2]) + Math.cos(k / p[5]));
                k++;
            }
        )

        scene.onPointerDown = function (evt: any, pickResult: any) {
            if (pickResult.hit && pickResult.pickedMesh != null) {
                console.log(pickResult);
                console.log(pickResult.pickedPoint);
                console.log(pickResult.pickedMesh.name);
            }
        };
        document.addEventListener("click", (e: Event) => {
            console.log(e);
        });
        
        window.addEventListener("resize", function() {
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            minimap.resize(window.innerWidth, window.innerHeight);
            gui.updateGuiPositions(window.innerWidth, window.innerHeight);
            engine.resize();
        });
        
        let divFps = document.getElementById("fps");
        
        let i = 0;
        engine.runRenderLoop(() => {
            // here all updating stuff must be updated
            i += 0.001;
            //gui.setAbilityProgress(i);l
            if (divFps) {
                divFps.innerHTML = engine.getFps().toFixed() + " fps";
            }

            let displacement = 0.025 * mainCamera.camera.radius;
            let cameraPosition = mainCamera.camera.position;
            let cameraTarget = mainCamera.camera.getTarget();
            let displacementX = 0.0;
            let displacementZ = 0.0;
            if (keyboardInputManager.isPressed("KeyW")) {
                displacementZ += displacement;
            }
            if (keyboardInputManager.isPressed("KeyA")) {
                displacementX -= displacement;
            }
            if (keyboardInputManager.isPressed("KeyS")) {
                displacementZ -= displacement;
            }
            if (keyboardInputManager.isPressed("KeyD")) {
                displacementX += displacement;
            }
            let cameraAngleDegrees = Tools.ToDegrees(mainCamera.camera.alpha) % 360.0 + 90.0;
            while (cameraAngleDegrees < 0.0) {
                cameraAngleDegrees += 360.0;
            }
            let cameraQuaternion = Quaternion.FromEulerAngles(0.0, 0.0, Tools.ToRadians(cameraAngleDegrees));
            let matrix = new Matrix();
            cameraQuaternion.toRotationMatrix(matrix);
            let displacementVec2 = Vector2.Transform(new Vector2(displacementX, displacementZ), matrix);
            displacementX = displacementVec2.x;
            displacementZ = displacementVec2.y;
            
            mainCamera.camera.position = new Vector3(cameraPosition.x + displacementX, cameraPosition.y, cameraPosition.z + displacementZ);
            mainCamera.camera.setTarget(new Vector3(cameraTarget.x + displacementX, cameraTarget.y, cameraTarget.z + displacementZ));
            
            scene.render();
        });
    }
    
    private _launchFullscreen(data: any) {
        document.documentElement.requestFullscreen();
    }
    
    private _toggleDebugLayer(data: any) {
        if (data.debugLayer.isVisible()) {
            data.debugLayer.hide();
        } else {
            data.debugLayer.show();
        }
    }
    
    private _nop(data: any) {
    }
    
    private _project(worldPosition: Vector3, scene: Scene, canvasWidth: number, canvasHeight: number): [Vector2, number] {
        // Coordinate system is from screen_top_left = [0, 0]
        // to screen_bottom_right = [screen_width, screen_height]
        let vector3 = Vector3.Project(
            worldPosition,
            Matrix.Identity(),
            scene.getTransformMatrix(),
            new Viewport(0.0, 0.0, canvasWidth, canvasHeight),
        );
        let screenPos = new Vector2(vector3.x, vector3.y);
        let depth = vector3.z;
        return [screenPos, depth];
    }
    
    private _unproject(screenPosition: Vector2, depth: number, engine: Engine, scene: Scene): Vector3 {
        // TODO: test if this works
        return Vector3.Unproject(
            new Vector3(screenPosition.x, screenPosition.y, depth),
            engine.getRenderWidth(),
            engine.getRenderHeight(),
            Matrix.Identity(),
            scene.getViewMatrix(),
            scene.getProjectionMatrix()
        );
    }
    
    
}

new SquadronsOfAbandonement();