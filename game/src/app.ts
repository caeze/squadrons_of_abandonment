import { Sun } from "./Sun";
import { Gui } from "./Gui";
import { Minimap } from "./Minimap";
import { MouseSelectionBox } from "./MouseSelectionBox";
import { LoadingScreen } from "./LoadingScreen";
import { KeyboardInputManager } from "./KeyboardInputManager";

import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { AdvancedDynamicTexture, Button } from '@babylonjs/gui/2D';
import { Quaternion, Tools, WebGPUEngine, Matrix, HighlightLayer, BoxParticleEmitter, NoiseProceduralTexture, DirectionalLight, AbstractMesh, PointLight, Camera, VolumetricLightScatteringPostProcess, SphereParticleEmitter, Color4, Constants, ParticleHelper, ParticleSystemSet, TransformNode, ParticleSystem, Engine, Scene, ArcRotateCamera, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, InstancedMesh, StandardMaterial, Texture, Vector2, Vector4 , Color3, SceneLoader, AssetsManager, ArcRotateCameraPointersInput, CubeTexture, RegisterMaterialPlugin, MaterialPluginBase, PostProcess, PassPostProcess, Effect, ShaderMaterial, RenderTargetTexture } from "@babylonjs/core";



var renderingGroupId_everything = 3;
var renderingGroupId_ground = 0;
var keyboard = 0;

// custom handling of materials for render target pass
var createScene = function (engine: Engine, canvas: any, currentUrl: string): [Scene, ArcRotateCamera] {
    Effect.ShadersStore["fowVertexShader"]=`
    precision highp float;

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 world;
    uniform mat4 worldViewProjection;

    varying vec2 vUV;
    varying vec3 vPositionW;
    varying vec4 fragmentPosition;

    void main() {
        gl_Position = worldViewProjection * vec4(position, 1.0);
        vUV = uv;
        vPositionW = vec3(world * vec4(position, 1.0));
        fragmentPosition = gl_Position;
    }
    `
    Effect.ShadersStore["fowFragmentShader"]=`
    precision highp float;

    uniform vec2 screenSize;
    uniform int nbSelecteds;
    uniform float circlesX[MAXSELECTEDS];
    uniform float circlesY[MAXSELECTEDS];
    uniform float circlesZ[MAXSELECTEDS];
    uniform float circlesR[MAXSELECTEDS];
    uniform float circlesG[MAXSELECTEDS];
    uniform float circlesB[MAXSELECTEDS];
    uniform float circlesMax[MAXSELECTEDS];
    uniform sampler2D diffuseTextureR;
    uniform sampler2D diffuseTextureG;
    uniform sampler2D diffuseTextureB;

    varying vec2 vUV;
    varying vec3 vPositionW;
    varying vec4 fragmentPosition;

    float get_alpha() {
        float revealed_alpha = 0.0;
        float fow_alpha = 0.5;
        float soft_border_width = 3.0;
        float ret_val = fow_alpha;
        for (int i = 0; i < MAXSELECTEDS; i++) {
            if (ret_val == revealed_alpha) {
                return ret_val;
            }
            float radius = circlesMax[i];
            float dist = length(vPositionW.xz - vec3(circlesX[i], circlesY[i], circlesZ[i]).xz);
            float lower = radius - soft_border_width / 2.0;
            float upper = radius + soft_border_width / 2.0;
            if (dist <= radius) {
                if (dist <= lower) {
                    ret_val = revealed_alpha;
                } else if (lower < dist && dist <= upper) {
                    float dist_fraction = (dist - lower) / (upper - lower) * 2.0;
                    float new_val = dist_fraction * (fow_alpha - revealed_alpha) + revealed_alpha;
                    if (new_val < ret_val) {
                        ret_val = new_val;
                    }
                } else {
                    ret_val = fow_alpha;
                }
            }
        }
        return ret_val;
    }
 
    void main() {
        vec4 frag_color = vec4(0.0, 0.0, 0.0, 1.0);
        float alpha = get_alpha();
        float gray = get_alpha() / 3.0;
        frag_color.a = alpha;
        frag_color.r = gray;
        frag_color.g = gray;
        frag_color.b = gray;
        if (int(vUV.x * 2000.0) % 2 == int(vUV.y * 1000.0) % 2) {
            discard;
        }
        gl_FragColor = frag_color;
    }`

    var scene = new Scene(engine);
    
    var camera: ArcRotateCamera = new ArcRotateCamera("MainCamera", -Math.PI / 2, Math.PI / 4, 4, Vector3.Zero(), scene);
	camera.allowUpsideDown = false;
	camera.lowerBetaLimit = 0.0;
	camera.upperBetaLimit = Math.PI / 2.0 - 0.01;
	camera.lowerRadiusLimit = 1.0;
	camera.upperRadiusLimit = 100.0;
	camera.angularSensibilityX = 2500.0; // mouse camera rotate speed
	camera.angularSensibilityY = 2500.0;
	camera.panningSensibility = 4000.0; // mouse move camera speed
    camera.wheelDeltaPercentage = 0.0;
    camera.inertia = 0.7;
    camera.checkCollisions = true;
    camera.setTarget(Vector3.Zero());
    (camera.inputs.attached.pointers as ArcRotateCameraPointersInput).buttons = [1];
    camera.inputs.remove(camera.inputs.attached.keyboard);
    
    
    var prevRadius = camera.radius;
    
    camera.wheelPrecision = 20.0;

    scene.beforeRender = () => {
        if (prevRadius != camera.radius) {
            let ratio = prevRadius / camera.radius;
            prevRadius = camera.radius;

            camera.panningSensibility *= ratio;
            camera.wheelPrecision *= ratio;
        }
    };
	
	
	camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    //camera.lockedTarget = ground;
    
    var sun = new Sun("ASD");
    sun.createSun(scene, camera, engine);
    
    
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

    const unitSize = 2;
    const spawns = [new Vector3(2, 0, 2), new Vector3(-2, 0, -2)];
    var entitys = new Array<any>;

    //var ground = MeshBuilder.CreateGroundFromHeightMap("ground", currentUrl + "/assets/img/ground_plane_grid/ground_plane_grid.png", {width:100, height:100, subdivisions:100, minHeight:0, maxHeight:10, updatable:false}, scene)
    const f = new Vector4(0, 0, 0.5, 1); // front image = half the whole image along the width 
    const b = new Vector4(0.5, 0, 1, 1); // back image = second half along the width
    
    const ground = MeshBuilder.CreatePlane("ground", {frontUVs: f, backUVs: b, sideOrientation: Mesh.DOUBLESIDE, size: 1000, width: 200, height: 200});
    
    ground.renderingGroupId = renderingGroupId_ground;
    ground.rotation = new Vector3(Math.PI / 2, 0, 0);
    var ground_shader_material = new ShaderMaterial("shader", scene, {
        vertex: "fow",
        fragment: "fow",
	    },
        {attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "screenSize", "nbSelecteds", "circlesX", "circlesY", "circlesZ", "circlesMax", "circlesR", "circlesG", "circlesB" ],
        samplers: ["diffuseTextureR", "diffuseTextureG", "diffuseTextureB"],
        defines: ["#define MAXSELECTEDS " + 2],
        /*needAlphaTesting:true,
        needAlphaBlending:true*/}
    );
    ground.alphaIndex = 1;
    
    ground_shader_material.setVector2("screenSize", new Vector2(engine.getRenderWidth(), engine.getRenderHeight()))
    //const diffuseTextureR = new Texture(currentUrl + "/assets/img/ground_plane_grid/ground_plane_grid.png", scene);
    //diffuseTextureR.uScale = diffuseTextureR.vScale = 10;
    //ground_shader_material.setTexture("diffuseTextureR", diffuseTextureR);
    const diffuseTextureG = new Texture(currentUrl + "/assets/img/ground_plane_grid/ground_plane_grid.png", scene);
    diffuseTextureG.uScale = diffuseTextureG.vScale = 10;
    ground_shader_material.setTexture("diffuseTextureG", diffuseTextureG);
    //const diffuseTextureB = new Texture(currentUrl + "/assets/img/ground_plane_grid/ground_plane_grid.png", scene);
    //diffuseTextureB.uScale = diffuseTextureB.vScale = 10;
    //ground_shader_material.setTexture("diffuseTextureB", diffuseTextureB);

    let isMeshesMatrixUpdated = false;
    function updateCircles() {
        isMeshesMatrixUpdated = false;
        const circlesX = []
        const circlesY = []
        const circlesZ = []
        const circlesR = []
        const circlesG = []
        const circlesB = []
        const circlesMax = []
        for(let i=0; i<entitys.length; ++i) {
            circlesMax.push(5.0*entitys[i].maxRadius);
            circlesX.push(entitys[i].root.position.x);
            circlesY.push(entitys[i].root.position.y);
            circlesZ.push(entitys[i].root.position.z);
            circlesR.push(entitys[i].color.r);
            circlesG.push(entitys[i].color.g);
            circlesB.push(entitys[i].color.b);
        }
        ground_shader_material.setFloats('circlesMax', circlesMax);
        ground_shader_material.setFloats('circlesX', circlesX);
        ground_shader_material.setFloats('circlesY', circlesY);
        ground_shader_material.setFloats('circlesZ', circlesZ);
        ground_shader_material.setFloats('circlesR', circlesR);
        ground_shader_material.setFloats('circlesG', circlesG);
        ground_shader_material.setFloats('circlesB', circlesB);
    }
    
    
    for(let i=0; i<spawns.length; ++i) {
        var box_mesh=MeshBuilder.CreateBox('box'+i, {size:unitSize}, scene);
        box_mesh.renderingGroupId = renderingGroupId_everything;
        entitys.push({root:box_mesh,
            maxRadius: .5*Math.sqrt(Math.pow(unitSize, 2) + Math.pow(unitSize, 2)),
            color: [Color3.Red(), Color3.Yellow()][i]
        });
            
        entitys[i].root.onAfterWorldMatrixUpdateObservable.add(() => {
            isMeshesMatrixUpdated = true;
        });
    }
    const assetsManager = new AssetsManager(scene);
    const particleFile = assetsManager.addTextFileTask("rocket_particle_system", currentUrl + "/assets/particle_definitions/systems/rocket_exhaust.json");
    assetsManager.load();
    
    assetsManager.onFinish = function (task) {
        console.log("loading particle system successful", task);

        // prepare to parse particle system files
        const particleJSON = JSON.parse(particleFile.text);
        
        
        for(let i=0; i<entitys.length; ++i) {
            const particleSystem = ParticleSystem.Parse(particleJSON, scene, "", false, 1000);
        

            var exhaust = new TransformNode('exaust');
            exhaust.parent = entitys[i].root;
            exhaust.position.y = -1.1;


            particleSystem.emitter = entitys[i].root;
            particleSystem.isLocal = true;
            particleSystem.start();
        }
    }

    scene.registerBeforeRender(() => {
        if(isMeshesMatrixUpdated) {
            updateCircles();
        }
    })

    ground.onMeshReadyObservable.add(() => {
        for(let i=0; i<entitys.length; ++i) {
            entitys[i].root.position.set(spawns[i].x, spawns[i].y, spawns[i].z);
        }

        scene.onBeforeRenderObservable.add(() => {
            entitys[0].root.position.x += 0.005;
            entitys[0].root.rotation.x += 0.005;
            entitys[0].root.rotation.y += 0.005;
            entitys[1].root.position.x -= 0.005;
            entitys[1].root.rotation.x += 0.005;
            entitys[1].root.rotation.y += 0.005;
        })

        ground_shader_material.setInt('nbSelecteds', entitys.length);
    })
    ground.material = ground_shader_material;
    ground.material.forceDepthWrite = true;
    ground.material.transparencyMode = 2;
    ground.material.alpha = 0.5;
	//ground.material.wireframe = true;
    //ground.transparent.isEnabled = true;
    
    
    
    
    
    
    

    Effect.ShadersStore["shockwaveFragmentShader"] = `
    #ifdef GL_ES
        precision highp float;
    #endif

    // Samplers
    varying vec2 vUV;
    uniform sampler2D textureSampler;

    // Parameters
    uniform float time;
    uniform vec2 center;

    void main(void) {
        // Define the effect parameters.
        float ellipticity = 3.0;
        float effectStrength = 200.0;
        float torusDiameter = 1.2;
        float effectTorusWidth = 0.05;
        
        // Get the uv coordinates to work with.
        vec2 uv = vUV.xy;
        
        // Store the original color.
	    vec4 c = texture2D(textureSampler, uv);
        
        // Measure the distance to the center.
        float dist = distance(uv, center);

        if (time > 0.0 && time < 1.0 && time - effectTorusWidth <= dist && dist <= time + effectTorusWidth) {
            // The pixel offset distance is based on the input parameters.
            float diff = (dist - time);
            float diffPow = (1.0 - pow(abs(diff * effectStrength), torusDiameter));
            float diffTime = (diff  * diffPow);

            // Calculate the direction of the distortion.
            vec2 dir = normalize(uv - center);
            
            // Perform the distortion and reduce the effect over time.
            uv += ((dir * diffTime) / (time * dist * 80.0));
            
            // Grab color for the new coord
            c = texture2D(textureSampler, uv);
	    }
    
	    gl_FragColor = c;
    }
    `;
    
    // https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/postProcessRenderPipeline
    var postProcess = new PostProcess("shockwavePostProcess", "shockwave", ["time", "center"], null, 1, camera);

    let t = 0.0;
    postProcess.onApply = function (effect) {
        t += 0.001;
        effect.setFloat("time", t);
        let centerX = Math.sin(3.14 / 2 + t * 100.0) / 2.0 + 0.5;
        let centerY = Math.cos(3.14 / 2 + t * 100.0) / 2.0 + 0.5;
        effect.setVector2("center", new Vector2(centerX, centerY));
    };
    
    
    var postProcess2 = new PostProcess("shockwavePostProcess2", "shockwave", ["time", "center"], null, 1, camera);

    let t2 = 0.3;
    postProcess.onApply = function (effect) {
        t2 += 0.001;
        effect.setFloat("time", t2);
        let centerX = 0.5;
        let centerY = 0.5;
        effect.setVector2("center", new Vector2(centerX, centerY));
    };
    
    
    

    
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
    
    
    
    var spheresMeshGlb = MeshBuilder.CreateSphere("spheresMeshGlb", { diameter: 0.1 }, scene);
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
    );
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
    
    
    
    
    
    
    
    
    
    
    
    

    return [scene, camera];
};


class SquadronsOfAbandonement {
    private currentUrl: string;
    private scene: Scene;
    
    public constructor() {
        this.currentUrl = "http://localhost:8080";
        
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

        /*var engineType = "webgpu";
        var engine: Engine;
        if (engineType === "webgpu") {
            var engine2 = new WebGPUEngine(canvas);
            engine2.initAsync();
        } else {
            engine = new Engine(canvas, true);
        }*/
        var engine = new Engine(canvas, true);
        
    
        engine.loadingScreen = new LoadingScreen();
        engine.displayLoadingUI();
        var [scene, camera] = createScene(engine, canvas, this.currentUrl);
        this.scene = scene;
        engine.hideLoadingUI();

        var keyboardInputManager = new KeyboardInputManager(this.scene);
        var gui = new Gui();
        gui.createGui(this.currentUrl);
        var minimap = new Minimap();
        minimap.createMinimap(this.scene, camera, engine);
        var mouseSelectionBox = new MouseSelectionBox();
        mouseSelectionBox.createMouseSelectionBox(this.scene, gui.getGui());
        

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

            /*v1.normalize();

            let angle = Math.acos(BABYLON.Vector3.Dot(v0, v1));
            let angleInDegree = BABYLON.Tools.ToDegrees(angle)*/
            
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