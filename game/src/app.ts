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
InstancedMesh,
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
import { FogOfWarGround } from "./FogOfWarGround";
import { Entity } from "./Entity";
import { Unit } from "./Unit";

function populateScene(canvas: HTMLElement, engine: Engine, scene: Scene, camera: Camera, currentUrl: string): Unit[] {
    
    let sun = new Sun(scene, camera, engine, currentUrl);
    
    const initialPositions = [new Vector3(2, 0, 2), new Vector3(-1, 0, -1)];
    let units = new Array<Unit>;
    for(let i = 0; i < initialPositions.length; ++i) {
        let unit = new Unit(scene, initialPositions[i], "box" + i, 5.0);
        units.push(unit);
    }
    scene.registerBeforeRender(() => {
        units[0].mesh.position.x += 0.005;
        units[0].mesh.rotation.x += 0.005;
        units[0].mesh.rotation.y += 0.005;
        units[1].mesh.position.x -= 0.005;
        units[1].mesh.rotation.x += 0.005;
        units[1].mesh.rotation.y += 0.005;
    });

    
    
    const assetsManager = new AssetsManager(scene);
    const particleFile = assetsManager.addTextFileTask("rocket_particle_system", currentUrl + "/assets/particle_definitions/systems/rocket_exhaust.json");
    assetsManager.load();
    
    assetsManager.onFinish = function (task) {

        // prepare to parse particle system files
        const particleJSON = JSON.parse(particleFile.text);
        
        
        for(let i=0; i<units.length; ++i) {
            const particleSystem = ParticleSystem.Parse(particleJSON, scene, "", false, 1000);
        

            let exhaust = new TransformNode("exaust");
            exhaust.parent = units[i].mesh;
            exhaust.position.y = -1.1;


            particleSystem.emitter = units[i].mesh;
            particleSystem.isLocal = true;
            particleSystem.start();
        }
    }
    
    
    

    
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 10000.0 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture(currentUrl + "/assets/img/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    
    let originSphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
    originSphere.renderingGroupId = RenderingGroupId.EVERYTHING;
    
    let xSphere: Mesh = MeshBuilder.CreateSphere("xsphere", { diameter: 0.1 }, scene);
    let xSphereMaterial = new StandardMaterial("mat", scene);
    xSphereMaterial.alpha = 1;
    xSphereMaterial.diffuseColor = new Color3(1, 0, 0);
    xSphere.material = xSphereMaterial;
    xSphere.position = new Vector3(1, 0, 0);
    xSphere.isPickable = true;
    xSphere.renderingGroupId = RenderingGroupId.EVERYTHING;
    
    let ySphere: Mesh = MeshBuilder.CreateSphere("ysphere", { diameter: 0.1 }, scene);
    let ySphereMaterial = new StandardMaterial("mat", scene);
    ySphereMaterial.alpha = 1;
    ySphereMaterial.diffuseColor = new Color3(0, 1, 0);
    ySphere.material = ySphereMaterial;
    ySphere.position = new Vector3(0, 1, 0);
    ySphere.isPickable = true;
    ySphere.renderingGroupId = RenderingGroupId.EVERYTHING;
    
    let zSphere: Mesh = MeshBuilder.CreateSphere("zsphere", { diameter: 0.1 }, scene);
    let zSphereMaterial = new StandardMaterial("mat", scene);
    zSphereMaterial.alpha = 1;
    zSphereMaterial.diffuseColor = new Color3(0, 0, 1);
    zSphere.material = zSphereMaterial;
    zSphere.position = new Vector3(0, 0, 1);
    zSphere.isPickable = true;
    zSphere.renderingGroupId = RenderingGroupId.EVERYTHING;
    
    
    
    /*let spheresMeshGlb = MeshBuilder.CreateSphere("spheresMeshGlb", { diameter: 0.1 }, scene);
    SceneLoader.ImportMesh(
        "",
        currentUrl + "/assets/models/",
        "PBR_Spheres.glb",
        scene,
        function(objects: AbstractMesh[]) {
            for(let i=0; i<objects.length; ++i) {
                objects[i].renderingGroupId = RenderingGroupId.EVERYTHING;
            }
        }
    );*/
    /*let jupiter = MeshBuilder.CreateSphere("jupiter", { diameter: 3 }, scene);
    SceneLoader.ImportMesh(
        "",
        currentUrl + "/assets/models/",
        "jupiter.glb",
        scene,
        function(objects: AbstractMesh[]) {
            console.log(objects);
            jupiter = (<Mesh> objects[1]);
            for(let i=0; i<objects.length; ++i) {
                objects[i].renderingGroupId = RenderingGroupId.EVERYTHING;
            }
        }
    );*/
    
    
    /*let highlightLayer = new HighlightLayer("SphereHighlight", scene,
    { 
        // alphaBlendingMode: 0, 
        blurTextureSizeRatio : 0.25
    });
    highlightLayer.addMesh(zSphere, Color3.Blue());
    
    const importPromise = SceneLoader.ImportMeshAsync(
        null,
        currentUrl + "/assets/models/",
        "jupiter.glb",
        scene
    );
    importPromise.then((result: any) => {
        highlightLayer.addMesh(result.meshes[1], Color3.Blue());
        result.meshes[1].renderingGroupId = RenderingGroupId.EVERYTHING;
    });
    
    const importPromiseFlag = SceneLoader.ImportMeshAsync(
        null,
        currentUrl + "/assets/models/",
        "flag.glb",
        scene
    );
    importPromiseFlag.then((result: any) => {
        console.log(result);
        for(let i = 0; i < result.meshes.length; i++) {
            result.meshes[i].renderingGroupId = RenderingGroupId.EVERYTHING;
            //result.meshes[i].scaling.x = 0.25;
            //result.meshes[i].scaling.y = 0.25;
            //result.meshes[i].scaling.z = 0.25;
        }
        //highlightLayer.addMesh(result.meshes[1], Color3.Blue());
        //result.meshes[1].renderingGroupId = RenderingGroupId.EVERYTHING;
    });*/
    
    return units;
};

class SquadronsOfAbandonement {
    public constructor() {
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
        
        ParticleHelper.BaseAssetsUrl = "./assets/particle_definitions";
        ParticleSystemSet.BaseAssetsUrl = "./assets/particle_definitions";
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
        let scene = new Scene(engine);
    
        let gui = new Gui();
        gui.createGui(currentUrl);
        let mouseSelectionBox = new MouseSelectionBox();
        mouseSelectionBox.createMouseSelectionBox(scene, gui.getGui());
        
        
        let mainCamera = new MainCamera(canvas, scene);
        let camera = mainCamera.camera;
        scene.registerBeforeRender(() => {
            mainCamera.runBeforeRender();
        });
        
        let pipeline = new RenderingPipeline(scene, camera);
        
        let revealers = populateScene(canvas, engine, scene, camera, currentUrl);

        let keyboardInputManager = new KeyboardInputManager(scene);
        //let minimap = new Minimap(scene, camera, engine);
        let spaceshipTrailParent = MeshBuilder.CreateSphere("sphere", {diameter: 0.1}, scene);
        let spaceshipTrail = new SpaceshipTrail("spaceshipTrail0", spaceshipTrailParent, scene, camera, 0.1);
        let spaceshipTrailShaderMaterial = new ShaderMaterial(
            "spaceshipTrailShaderMaterial",
            scene,
            currentUrl + "/assets/shaders/spaceshipTrail", // searches for spaceshipTrail.vertex.fx and spaceshipTrail.fragment.fx
            {
                attributes: ["position"],
                uniforms: ["worldViewProjection", "color"],
                defines: ["#define MAX_REVEALERS " + 2],
            }
        );
        spaceshipTrailShaderMaterial.setFloats("color", [0.5, 0.0, 0.0, 0.5]);
        spaceshipTrailShaderMaterial.forceDepthWrite = true;
        spaceshipTrailShaderMaterial.transparencyMode = Material.MATERIAL_ALPHABLEND;
        spaceshipTrailShaderMaterial.alpha = 0.0;
        spaceshipTrail.renderingGroupId = RenderingGroupId.EVERYTHING;
        spaceshipTrail.alphaIndex = 1;
        spaceshipTrail.material = spaceshipTrailShaderMaterial;
    
        
        let fogOfWarGround = new FogOfWarGround(scene, currentUrl, 128);
        scene.registerBeforeRender(() => {
            fogOfWarGround.updateRevealerPositions(revealers);
        });
        
        
        /*let material = new StandardMaterial(
            "material",
            scene
        );
        //material.specularColor.copyFromFloats(0.2, 0.2, 0.2);
        //material.diffuseColor.copyFromFloats(0.9, 0.9, 0.9);
        material.disableLighting = true;
        material.emissiveTexture = new Texture('https://i.ibb.co/FYywNM9/light-Mat-Emissive.png' , scene);*/
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
        
        

        scene.onPointerDown = function (evt, pickResult) {
            // We try to pick an object
            if (pickResult.hit && pickResult.pickedMesh != null) {
                console.log(pickResult.pickedMesh.name);
            }
        };
        
        window.addEventListener("resize", function() {
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            engine.resize();
        });
        
        
        engine.runRenderLoop(() => {
            // here all updating stuff must be updated

            let displacement = 0.025 * camera.radius;
            let cameraPosition = camera.position;
            let cameraTarget = camera.getTarget();
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
            let cameraAngleDegrees = Tools.ToDegrees(camera.alpha) % 360.0 + 90.0;
            while (cameraAngleDegrees < 0.0) {
                cameraAngleDegrees += 360.0;
            }
            let cameraQuaternion = Quaternion.FromEulerAngles(0.0, 0.0, Tools.ToRadians(cameraAngleDegrees));
            let matrix = new Matrix();
            cameraQuaternion.toRotationMatrix(matrix);
            let displacementVec2 = Vector2.Transform(new Vector2(displacementX, displacementZ), matrix);
            displacementX = displacementVec2.x;
            displacementZ = displacementVec2.y;
            
            camera.position = new Vector3(cameraPosition.x + displacementX, cameraPosition.y, cameraPosition.z + displacementZ);
            camera.setTarget(new Vector3(cameraTarget.x + displacementX, cameraTarget.y, cameraTarget.z + displacementZ));
            
            scene.render();
        });
        
        keyboardInputManager.registerCallback("KeyF", "launchFullscreenCaller", this.nop, this.launchFullscreen, null);
        keyboardInputManager.registerCallback("KeyI", "toggleDebugLayerCaller", this.nop, this.toggleDebugLayer, scene);
    }
    
    private launchFullscreen(data: any) {
        document.documentElement.requestFullscreen();
    }
    
    private toggleDebugLayer(data: any) {
        if (data.debugLayer.isVisible()) {
            data.debugLayer.hide();
        } else {
            data.debugLayer.show();
        }
    }
    
    private nop(data: any) {
    }
}

new SquadronsOfAbandonement();