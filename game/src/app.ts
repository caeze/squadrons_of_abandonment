// var SPECTOR = require("spectorjs");
// var spector = new SPECTOR.Spector();
// spector.displayUI();

import { Sun } from "./Sun";
import { Gui } from "./Gui";
import { Minimap } from "./Minimap";
import { RenderingPipeline } from "./RenderingPipeline";
import { MouseSelectionBox } from "./MouseSelectionBox";
import { LoadingScreen } from "./LoadingScreen";
import { KeyboardInputManager } from "./KeyboardInputManager";
import { MainCamera } from "./MainCamera";
import { SpaceshipTrail } from "./SpaceshipTrail";

import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { TextBlock, Control, Container, Rectangle, AdvancedDynamicTexture, Button } from "@babylonjs/gui/2D";
import { DepthOfFieldEffectBlurLevel, DefaultRenderingPipeline, Material, DefaultLoadingScreen, Quaternion, Tools, WebGPUEngine, Matrix, HighlightLayer, BoxParticleEmitter, NoiseProceduralTexture, DirectionalLight, AbstractMesh, PointLight, Camera, VolumetricLightScatteringPostProcess, SphereParticleEmitter, Color4, Constants, ParticleHelper, ParticleSystemSet, TransformNode, ParticleSystem, Engine, Scene, ArcRotateCamera, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, InstancedMesh, StandardMaterial, Texture, Vector2, Vector4 , Color3, SceneLoader, AssetsManager, ArcRotateCameraPointersInput, CubeTexture, RegisterMaterialPlugin, MaterialPluginBase, PostProcess, PassPostProcess, Effect, ShaderMaterial, RenderTargetTexture } from "@babylonjs/core";

var renderingGroupId_everything = 3;
var renderingGroupId_ground = 0;
var keyboard = 0;

// custom handling of materials for render target pass
function populateScene(canvas: HTMLElement, engine: Engine, scene: Scene, camera: Camera, currentUrl: string) {
    
    var sun = new Sun(scene, camera, engine, currentUrl);
    
    
    /*ParticleHelper.CreateAsync("explosion", scene).then((a) => {
        a.start();
    });
    ParticleHelper.CreateAsync("fire", scene).then((a) => {
        a.start();
    });
    ParticleHelper.CreateAsync("smoke", scene).then((a) => {
        //a.position.y = 2;
        a.start();
    });*/

    var mapSidelength = 1000.0;
    var ground = MeshBuilder.CreatePlane("ground", {size: mapSidelength});
    var groundShaderMaterial = new ShaderMaterial(
        "fowShaderMaterial",
        scene,
        currentUrl + "/assets/shaders/fow", // searches for fow.vertex.fx and fow.fragment.fx
        {
            attributes: ["position"],
            uniforms: ["worldViewProjection", "world", "revealersX", "revealersZ", "revealersRadius", "mapSidelength"],
            defines: ["#define MAX_REVEALERS " + 2],
        }
    );
    ground.renderingGroupId = renderingGroupId_ground;
    ground.alphaIndex = 1;
    ground.rotation = new Vector3(Math.PI / 2, 0, 0);
    ground.material = groundShaderMaterial;
    ground.material.forceDepthWrite = true;
    ground.material.transparencyMode = Material.MATERIAL_ALPHABLEND;
    ground.material.alpha = 0.0;
    
    const spawns = [new Vector3(2, 0, 2), new Vector3(-1, 0, -1)];
    var entitys = new Array<any>;
    for(let i = 0; i < spawns.length; ++i) {
        var boxMesh = MeshBuilder.CreateBox("box" + i, {size: 0.5}, scene);
        boxMesh.renderingGroupId = renderingGroupId_everything;
        entitys.push({
            mesh: boxMesh,
            revealersRadius: 3.0,
        });
        boxMesh.position.set(spawns[i].x, spawns[i].y, spawns[i].z);
    }

    scene.registerBeforeRender(() => {
        entitys[0].mesh.position.x += 0.005;
        entitys[0].mesh.rotation.x += 0.005;
        entitys[0].mesh.rotation.y += 0.005;
        entitys[1].mesh.position.x -= 0.005;
        entitys[1].mesh.rotation.x += 0.005;
        entitys[1].mesh.rotation.y += 0.005;
        
        const revealersX = []
        const revealersZ = []
        const revealersRadius = []
        for(let i=0; i<entitys.length; ++i) {
            revealersX.push(entitys[i].mesh.position.x);
            revealersZ.push(entitys[i].mesh.position.z);
            revealersRadius.push(entitys[i].revealersRadius);
        }
        groundShaderMaterial.setFloats("revealersX", revealersX);
        groundShaderMaterial.setFloats("revealersZ", revealersZ);
        groundShaderMaterial.setFloats("revealersRadius", revealersRadius);
        groundShaderMaterial.setFloat("mapSidelength", mapSidelength);
    });
    
    const assetsManager = new AssetsManager(scene);
    const particleFile = assetsManager.addTextFileTask("rocket_particle_system", currentUrl + "/assets/particle_definitions/systems/rocket_exhaust.json");
    assetsManager.load();
    
    assetsManager.onFinish = function (task) {
        console.log("loading particle system successful", task);

        // prepare to parse particle system files
        const particleJSON = JSON.parse(particleFile.text);
        
        
        for(let i=0; i<entitys.length; ++i) {
            const particleSystem = ParticleSystem.Parse(particleJSON, scene, "", false, 1000);
        

            var exhaust = new TransformNode("exaust");
            exhaust.parent = entitys[i].mesh;
            exhaust.position.y = -1.1;


            particleSystem.emitter = entitys[i].mesh;
            particleSystem.isLocal = true;
            particleSystem.start();
        }
    }
    
    var postProcess = new PostProcess("shockwavePostProcess", currentUrl + "/assets/shaders/shockwave", ["time", "center"], null, 1, camera);

    let t = 0.0;
    postProcess.onApply = function (effect) {
        t += 0.001;
        effect.setFloat("time", t);
        let centerX = Math.sin(3.14 / 2 + t * 100.0) / 2.0 + 0.5;
        let centerY = Math.cos(3.14 / 2 + t * 100.0) / 2.0 + 0.5;
        effect.setVector2("center", new Vector2(centerX, centerY));
    };
    
    
    /*var postProcess2 = new PostProcess("shockwavePostProcess2", "shockwave", ["time", "center"], null, 1, camera);

    let t2 = 0.3;
    postProcess.onApply = function (effect) {
        t2 += 0.001;
        effect.setFloat("time", t2);
        let centerX = 0.5;
        let centerY = 0.5;
        effect.setVector2("center", new Vector2(centerX, centerY));
    };*/
    
    
    

    
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 10000.0 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture(currentUrl + "/assets/img/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    
    var originSphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
    originSphere.renderingGroupId = renderingGroupId_everything;
    
    var xSphere: Mesh = MeshBuilder.CreateSphere("xsphere", { diameter: 0.1 }, scene);
    var xSphereMaterial = new StandardMaterial("mat", scene);
    xSphereMaterial.alpha = 1;
    xSphereMaterial.diffuseColor = new Color3(1, 0, 0);
    xSphere.material = xSphereMaterial;
    xSphere.position = new Vector3(1, 0, 0);
    xSphere.isPickable = true;
    xSphere.renderingGroupId = renderingGroupId_everything;
    
    var ySphere: Mesh = MeshBuilder.CreateSphere("ysphere", { diameter: 0.1 }, scene);
    var ySphereMaterial = new StandardMaterial("mat", scene);
    ySphereMaterial.alpha = 1;
    ySphereMaterial.diffuseColor = new Color3(0, 1, 0);
    ySphere.material = ySphereMaterial;
    ySphere.position = new Vector3(0, 1, 0);
    ySphere.isPickable = true;
    ySphere.renderingGroupId = renderingGroupId_everything;
    
    var zSphere: Mesh = MeshBuilder.CreateSphere("zsphere", { diameter: 0.1 }, scene);
    var zSphereMaterial = new StandardMaterial("mat", scene);
    zSphereMaterial.alpha = 1;
    zSphereMaterial.diffuseColor = new Color3(0, 0, 1);
    zSphere.material = zSphereMaterial;
    zSphere.position = new Vector3(0, 0, 1);
    zSphere.isPickable = true;
    zSphere.renderingGroupId = renderingGroupId_everything;
    
    
    
    /*var spheresMeshGlb = MeshBuilder.CreateSphere("spheresMeshGlb", { diameter: 0.1 }, scene);
    SceneLoader.ImportMesh(
        "",
        currentUrl + "/assets/models/",
        "PBR_Spheres.glb",
        scene,
        function(objects: AbstractMesh[]) {
            for(let i=0; i<objects.length; ++i) {
                objects[i].renderingGroupId = renderingGroupId_everything;
            }
        }
    );*/
    /*var jupiter = MeshBuilder.CreateSphere("jupiter", { diameter: 3 }, scene);
    SceneLoader.ImportMesh(
        "",
        currentUrl + "/assets/models/",
        "jupiter.glb",
        scene,
        function(objects: AbstractMesh[]) {
            console.log(objects);
            jupiter = (<Mesh> objects[1]);
            for(let i=0; i<objects.length; ++i) {
                objects[i].renderingGroupId = renderingGroupId_everything;
            }
        }
    );*/
    
    
    /*var highlightLayer = new HighlightLayer("SphereHighlight", scene,
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
        result.meshes[1].renderingGroupId = renderingGroupId_everything;
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
            result.meshes[i].renderingGroupId = renderingGroupId_everything;
            //result.meshes[i].scaling.x = 0.25;
            //result.meshes[i].scaling.y = 0.25;
            //result.meshes[i].scaling.z = 0.25;
        }
        //highlightLayer.addMesh(result.meshes[1], Color3.Blue());
        //result.meshes[1].renderingGroupId = renderingGroupId_everything;
    });*/
};

class SquadronsOfAbandonement {
    private currentUrl: string;
    private scene: Scene;
    
    public constructor() {
        this.currentUrl = window.location.href;
        
        var loadingScreenDiv = document.getElementById("loadingScreenDiv");
        if (loadingScreenDiv != null) {
            loadingScreenDiv.style.display = "none";
        }
        
        var canvas = document.createElement("canvas");
        /*var gl = canvas.getContext("webgl");
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
        DefaultLoadingScreen.DefaultLogoUrl = this.currentUrl + "/assets/img/squadronsOfAbandonementLogo.png";

        /*var engineType = "webgpu";
        var engine: Engine;
        if (engineType === "webgpu") {
            var engine2 = new WebGPUEngine(canvas);
            engine2.initAsync();
        } else {
            engine = new Engine(canvas, true);
        }*/
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);
        
        this.scene = scene;
    
        var gui = new Gui();
        gui.createGui(this.currentUrl);
        
        
        var mainCamera = new MainCamera(canvas, scene);
        var camera = mainCamera.getCamera();
        scene.registerBeforeRender(() => {
            mainCamera.runBeforeRender();
        });
        
        var pipeline = new RenderingPipeline(scene, camera);
        
        populateScene(canvas, engine, scene, camera, this.currentUrl);

        var keyboardInputManager = new KeyboardInputManager(this.scene);
        var minimap = new Minimap();
        minimap.createMinimap(this.scene, camera, engine);
        var mouseSelectionBox = new MouseSelectionBox();
        mouseSelectionBox.createMouseSelectionBox(this.scene, gui.getGui());
        let spaceshipTrailParent = MeshBuilder.CreateSphere("sphere", {diameter: 0.1}, scene);
        var spaceshipTrail = new SpaceshipTrail("spaceshipTrail0", spaceshipTrailParent, scene, camera, 0.1);
        var spaceshipTrailShaderMaterial = new ShaderMaterial(
            "spaceshipTrailShaderMaterial",
            scene,
            this.currentUrl + "/assets/shaders/spaceshipTrail", // searches for spaceshipTrail.vertex.fx and spaceshipTrail.fragment.fx
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
        spaceshipTrail.renderingGroupId = renderingGroupId_everything;
        spaceshipTrail.alphaIndex = 1;
        spaceshipTrail.material = spaceshipTrailShaderMaterial;
    
        
        
        
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
        
        

        this.scene.onPointerDown = function (evt, pickResult) {
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
            var cameraQuaternion = Quaternion.FromEulerAngles(0.0, 0.0, Tools.ToRadians(cameraAngleDegrees));
            var matrix = new Matrix();
            cameraQuaternion.toRotationMatrix(matrix);
            var displacementVec2 = Vector2.Transform(new Vector2(displacementX, displacementZ), matrix);
            displacementX = displacementVec2.x;
            displacementZ = displacementVec2.y;
            
            camera.position = new Vector3(cameraPosition.x + displacementX, cameraPosition.y, cameraPosition.z + displacementZ);
            camera.setTarget(new Vector3(cameraTarget.x + displacementX, cameraTarget.y, cameraTarget.z + displacementZ));
            
            this.scene.render();
        });
        
        keyboardInputManager.registerCallback("KeyF", "launchFullscreenCaller", this.nop, this.launchFullscreen, null);
        keyboardInputManager.registerCallback("KeyI", "toggleDebugLayerCaller", this.nop, this.toggleDebugLayer, this.scene);
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