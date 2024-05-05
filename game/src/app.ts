import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Sun } from "./Sun";
import { BoxParticleEmitter, NoiseProceduralTexture, DirectionalLight, AbstractMesh, PointLight, Camera, VolumetricLightScatteringPostProcess, SphereParticleEmitter, Color4, Constants, ParticleHelper, ParticleSystemSet, TransformNode, ParticleSystem, Engine, Scene, ArcRotateCamera, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, InstancedMesh, StandardMaterial, Texture, Vector2, Vector4 , Color3, SceneLoader, AssetsManager, ArcRotateCameraPointersInput, CubeTexture, RegisterMaterialPlugin, MaterialPluginBase, PostProcess, PassPostProcess, Effect, ShaderMaterial, RenderTargetTexture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button } from '@babylonjs/gui/2D';

// How to run:
// https://doc.babylonjs.com/guidedLearning/createAGame/gettingSetUp
// npm run build
// npm run start
// npm update  - after updating dependencies in package.json
// http://localhost:8080/

// sound playback : https://www.babylonjs-playground.com/#PCY1J#8

// select objects with box: https://playground.babylonjs.com/#2SA7J8#7

// mouse control: https://forum.babylonjs.com/t/arcrotatecamera-and-right-click/4901

// switch scenes: https://doc.babylonjs.com/features/featuresDeepDive/scene/multiScenes

// trail for spaceship: https://playground.babylonjs.com/#Z07JE1#2

// explosions: https://playground.babylonjs.com/#VS5XS7#0

// Squadrons of abandonement music Lily's Theme https://youtu.be/qxrV2pqroDY
// FoW https://playground.babylonjs.com/#BRXZVE#8
// FoW2 https://playground.babylonjs.com/#8WJTJG#9
// Fow3 https://playground.babylonjs.com/#8WJTJG
// Entity selection https://playground.babylonjs.com/#GCNNPT#36

// sun with sun flares: https://github.com/jelster/space-truckers/blob/develop/src/systems/solar-flare.json

// supernova explosion: https://playground.babylonjs.com/#QZTX7A#5

// https://app.meshy.a

// blue orb effect https://playground.babylonjs.com/#MVPZHQ

// wave effect with pixels https://playground.babylonjs.com/#UI95UC#2011

// three lava rock balls https://playground.babylonjs.com/#DFQVK5

var renderingGroupId_everything = 3;
var renderingGroupId_ground = 0;

// custom handling of materials for render target pass
var createScene = function (engine: Engine, canvas: any): [Scene, ArcRotateCamera] {
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

    //bool circle(vec4 FragColor) {
    //    for(int i=0; i<MAXSELECTEDS; i++) {
    //        if(i >= nbSelecteds) {
    //            return true;
    //        }
    //        float dist = length(vPositionW.xz - vec3(circlesX[i],circlesY[i],circlesZ[i]).xz);
    //        if(dist <= circlesMax[i] && dist >= circlesMin[i]) {
    //            FragColor = vec4(circlesR[i],circlesG[i],circlesB[i],1.);
    //            //FragColor = vec4(1000. * ((1. - clamp(dist/circlesMax[i], 0., 1.))-pow( 1. - clamp(dist/circlesMin[i], 0., 1.) , .8)) * vec3(circlesR[i], circlesG[i], circlesB[i]),1.) * texture2D(diffuseTextureB, vUV);
    //            return false;
    //        }
    //    }
    //}

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
        frag_color.a = get_alpha();
        frag_color.r = get_alpha() / 3.0;
        if (int(vUV.x * 2000.0) % 2 == int(vUV.y * 1000.0) % 2) {
            frag_color.r = 0.0;
        }
        gl_FragColor = frag_color;
    }`
    
    // get current URL
    var currentUrl = "http://localhost:8080";

    var scene = new Scene(engine);
    //var camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2 - Math.PI / 4, 10, Vector3.Zero(), scene);
    //camera.attachControl(canvas, true);
    //camera.checkCollisions = true;
    //camera.maxZ = 100000.0;
    //camera.minZ = 1.0;
    // const light = new PointLight("sunLight", new Vector3(1, 10, 1), scene);
    //const ligh1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    var camera: ArcRotateCamera = new ArcRotateCamera("MainCamera", -Math.PI / 2, Math.PI / 4, 4, Vector3.Zero(), scene);
    /*camera.upperRadiusLimit = 10;
    camera.lowerRadiusLimit = 0.01;
    camera.angularSensibilityX = 1000;
    camera.angularSensibilityY = 1000;
    camera.wheelDeltaPercentage = 0.1;
    camera.checkCollisions = true;
    camera.inertia = 0.6;
    camera.allowUpsideDown = false;
    (camera.inputs.attached.pointers as ArcRotateCameraPointersInput).buttons = [1];
    camera.inputs.remove(camera.inputs.attached.keyboard);
    camera.minZ = 0.1;*/
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    
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
    /*for(let i=0; i<spawns.length; ++i) {
        var box_mesh=MeshBuilder.CreateBox('box'+i, {size:unitSize}, scene);
        entitys.push({root:box_mesh,
            maxRadius: .5*Math.sqrt(Math.pow(unitSize, 2) + Math.pow(unitSize, 2)),
            color: [Color3.Red(), Color3.Yellow()][i]
        })
        
        
        
        var particleSystem = ParticleSystem.Parse("rocket_exhaust.json", scene, '', true);

        var exhaust = new TransformNode('exaust');
        exhaust.parent = box_mesh;
        exhaust.position.y = -1.1;


        particleSystem.emitter = box_mesh;
        particleSystem.isLocal = true;
        particleSystem.start();
            
        entitys[i].root.onAfterWorldMatrixUpdateObservable.add(() => {
            isMeshesMatrixUpdated = true;
        })
    }*/
    
    
    
    
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
    camera.lockedTarget = ground
    
    
    
    
    
    
    

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
        console.log(t);
        effect.setFloat("time", t);
        let centerX = Math.sin(3.14 / 2 + t * 100.0) / 2.0 + 0.5;
        let centerY = Math.cos(3.14 / 2 + t * 100.0) / 2.0 + 0.5;
        effect.setVector2("center", new Vector2(centerX, centerY));
    };
    
    
    var postProcess2 = new PostProcess("shockwavePostProcess2", "shockwave", ["time", "center"], null, 1, camera);

    let t2 = 0.3;
    postProcess.onApply = function (effect) {
        t2 += 0.001;
        console.log(t2);
        effect.setFloat("time", t2);
        let centerX = 0.5;
        let centerY = 0.5;
        effect.setVector2("center", new Vector2(centerX, centerY));
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    return [scene, camera];
};


class App {
    private name: string;
    public constructor(name: string) {
        // assign parameters
        this.name = name;
        
        // TODO: describe
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
        
        // get current URL
        var currentUrl = "http://localhost:8080";
        
        ParticleHelper.BaseAssetsUrl = "./assets/particle_definitions";
        ParticleSystemSet.BaseAssetsUrl = "./assets/particle_definitions";
        //Constants.PARTICLES_BaseAssetsUrl = "./assets/particle_definitions";

        // initialize engine and scene
        var engine = new Engine(canvas, true);
        var [scene, camera] = createScene(engine, canvas);

        
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
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
        
        
        
        /*var spaceShuttle: AbstractMesh;
        SceneLoader.ImportMesh(
            "",
            currentUrl + "/assets/models/",
            "spaceShuttle.glb",
            scene,
            function(objects: AbstractMesh[]) {
                for(let i=0; i<objects.length; ++i) {
                    objects[i].renderingGroupId = renderingGroupId_everything;
                }
            }
        );
        var jupiter: AbstractMesh;
        SceneLoader.ImportMesh(
            "",
            currentUrl + "/assets/models/",
            "jupiter.glb",
            scene,
            function(objects: AbstractMesh[]) {
                for(let i=0; i<objects.length; ++i) {
                    objects[i].renderingGroupId = renderingGroupId_everything;
                }
            }
        );
        var spheresMeshGlb: AbstractMesh;
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


        
        var mat = new StandardMaterial("mat", scene);
        //var texture = new Texture(currentUrl + "/assets/img/ground_plane_grid/ground_plane_grid.png", scene);
        //texture.uScale = 40;
        //texture.vScale = 20;
        //texture.hasAlpha = true;
        //mat.diffuseTexture = texture;
        //mat.useAlphaFromDiffuseTexture = true;
        mat.alpha = 0.0;
        
        const f = new Vector4(0, 0, 0.5, 1); // front image = half the whole image along the width 
        const b = new Vector4(0.5, 0, 1, 1); // back image = second half along the width
        
        const plane = MeshBuilder.CreatePlane("plane", {frontUVs: f, backUVs: b, sideOrientation: Mesh.DOUBLESIDE, size: 1000, width: 200, height: 200});
        plane.rotation = new Vector3(Math.PI / 2, 0, 0);
        plane.material = mat;
        plane.isPickable = true;

        /**
         * INSTANTIATE FOG OF WAR PLUGIN
         */
        /*RegisterMaterialPlugin("FogOfWar", (material) => {
            //material.fogofwar = new FogOfWarPluginMaterial(material);
            //return material.fogofwar;
            return new FogOfWarPluginMaterial(material);
        });*/
        

        scene.onPointerDown = function (evt, pickResult) {
            // We try to pick an object
            if (pickResult.hit && pickResult.pickedMesh != null) {
                console.log(pickResult.pickedMesh.name);
            }
        };
        
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === "i") {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
            if (ev.key === "i") {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
            if (ev.key === "j") {
                camera.setTarget(new Vector3(camera.getTarget().x, camera.getTarget().y + 0.01, camera.getTarget().z));
            }
            if (ev.key === "w") {
                camera.setTarget(new Vector3(camera.getTarget().x + 0.01, camera.getTarget().y, camera.getTarget().z));
            }
            if (ev.key === "a") {
                camera.setTarget(new Vector3(camera.getTarget().x - 0.01, camera.getTarget().y, camera.getTarget().z));
            }
            if (ev.key === "s") {
                camera.setTarget(new Vector3(camera.getTarget().x, camera.getTarget().y, camera.getTarget().z + 0.01));
            }
            if (ev.key === "d") {
                camera.setTarget(new Vector3(camera.getTarget().x, camera.getTarget().y, camera.getTarget().z - 0.01));
            }
            if (ev.key === "f") {
                this.launchFullscreen();
            }
        });
        
        window.addEventListener("resize", function() {
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            engine.resize();
        });

        // GUI
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var button1 = Button.CreateSimpleButton("but1", "Click Me");
        button1.left = "1000px";
        button1.top = "500px";
        button1.width = "150px";
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function() {
            alert("you did it!");
        });
        advancedTexture.addControl(button1);  
        
        // run the main render loop
        engine.runRenderLoop(() => {
            // here all updating stuff must be updated
            scene.render();
        });
    }
    
    private someRandomMethod(name: string): string {
        return name;
    }
    
    private launchFullscreen() {
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
    }
}

/*class FogOfWarPluginMaterial extends MaterialPluginBase {
    constructor(material) {
        // last parameter is a priority, which lets you define the order multiple plugins are run.
        super(material, "FogOfWar", 200, { "FogOfWar": false });

        // let's enable it by default
        this.isEnabled = true;
    }

    static fogCenter = new Vector3(1, 1, 0);

    get isEnabled() {
        return this._isEnabled;
    }

    set isEnabled(enabled) {
        if (this._isEnabled === enabled) {
            return;
        }
        this._isEnabled = enabled;
        this.markAllDefinesAsDirty();
        this._enable(this._isEnabled);
    }

    _isEnabled = false;

    // Also, you should always associate a define with your plugin because the list of defines (and their values) 
    // is what triggers a recompilation of the shader: a shader is recompiled only if a value of a define changes.
    prepareDefines(defines, scene, mesh) {
        defines["FogOfWar"] = this._isEnabled;
    }

    getClassName() {
        return "FogOfWarPluginMaterial";
    }

    getUniforms() {
        return {
            "ubo": [
                { name: "fogCenter", size: 3, type: "vec3" },
            ],
            "fragment":
                `#ifdef FogOfWar
                    uniform vec3 fogCenter;
                #endif`,
        };
    }

    bindForSubMesh(uniformBuffer, scene, engine, subMesh) {
        if (this._isEnabled) {
            uniformBuffer.updateVector3("fogCenter", FogOfWarPluginMaterial.fogCenter);
        }
    }

    getCustomCode(shaderType) {
        if (shaderType === "vertex") {
            return {
                CUSTOM_VERTEX_DEFINITIONS: `
                    varying vec3 vWorldPos;
                `,
                CUSTOM_VERTEX_MAIN_END: `
                    vWorldPos = worldPos.xyz; 
                `
            }
        }
        if (shaderType === "fragment") {
            // we're adding this specific code at the end of the main() function
            return {
                CUSTOM_FRAGMENT_DEFINITIONS: `
                    varying vec3 vWorldPos;
                `,
                CUSTOM_FRAGMENT_MAIN_END: `
                    float d = length(vWorldPos.xyz - fogCenter);
                    d = (10.0 - d)/10.0;
                    gl_FragColor.rgb *= vec3(d);
                `
            };
        }
        // for other shader types we're not doing anything, return null
        return null;
    }
}*/

new App("");



// move camera:


/*


//Scroll down to createScene() for usage
class KeyboardPanningInput extends ArcRotateCameraKeyboardMoveInput {
    constructor(matrix, vector) {
        super();

        this.matrix = matrix;
        this.displacement = vector;
    }

    checkInputs() {
        if(this._onKeyboardObserver) {
            const camera = this.camera;
            const m = this.matrix;

            this.camera.absoluteRotation.toRotationMatrix(m);

            for(let index = 0; index < this._keys.length; index++) {
                const keyCode = this._keys[index];

                if (this.keysReset.indexOf(keyCode) !== -1) {
                    if (camera.useInputToRestoreState) {
                        camera.restoreState();
                        continue;
                    }
                }                
				//Matrix magic see https://www.3dgep.com/understanding-the-view-matrix/ and
				//   https://forum.babylonjs.com/t/arc-rotate-camera-panning-on-button-click/15428/6 
                else if (this.keysLeft.indexOf(keyCode) !== -1) {
                    this.displacement.set(-m.m[0], -m.m[1], -m.m[2]);
                } 
                
                else if (this.keysUp.indexOf(keyCode) !== -1) {
                    this.displacement.set(m.m[8], 0, m.m[10]);
                } 
                
                else if (this.keysRight.indexOf(keyCode) !== -1) {
                    this.displacement.set(m.m[0], m.m[1], m.m[2]);
                } 
                
                else if (this.keysDown.indexOf(keyCode) !== -1) {
                    this.displacement.set(-m.m[8], 0, -m.m[10]);
                } 
                
                this.camera.target.addInPlace(this.displacement);
                this.camera.position.addInPlace(this.displacement);
                this.displacement.setAll(0);                
            }
        }
    }
}


function buildLevelMeshes() {
	const ground = Mesh.CreateGround("ground", 10, 10, 0);
    ground_shader_material = new StandardMaterial("groundMat");
    ground_shader_material.diffuseColor = new Color3(0.5,0,5,0.5);	
	
	const player = MeshBuilder.CreateBox("p", {size: 1});	
	player.position = new Vector3(-2,0.5,-2);
	player.material = new StandardMaterial("p");	
	player.material.diffuseColor = new Color3(0,1,0);	
	
	const enemy = MeshBuilder.CreateBox("e", {size: 1});	
	enemy.position = new Vector3(3,0.5,3);
	enemy.material = new StandardMaterial("e");	
	enemy.material.diffuseColor = new Color3(1,0,0);	
	
	return {ground, player, enemy};
}

function babylonInit() {
    var scene = new Scene(engine);
	
    var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

	return {scene};
}

var createScene = function () {
	const {scene} = babylonInit();
	const {ground, player, enemy} = buildLevelMeshes();
	

	const camera = new ArcRotateCamera("StrategicCamera", Math.PI/3, Math.PI/3, 32, Vector3.Zero(), scene);
	 
	//adapt accordingly, escpecially panningSensibility
	camera.allowUpsideDown = false;
	camera.lowerBetaLimit = 0
	camera.upperBetaLimit = Math.PI/3		
	camera.lowerRadiusLimit = 2;
	camera.upperRadiusLimit = 48;
	camera.angularSensibility = 16000;
	camera.panningSensibility = 4000;   	
	//-
	
	//IMPORTANT
	camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
	camera.inputs.add(new KeyboardPanningInput(new Matrix(), Vector3.Zero()));	 	
	//-
	
	const w = 87;
	const s = 83;
	const d = 68;
	const a = 65;
	
	camera.keysUp.push(w); 
	camera.keysDown.push(s);            
	camera.keysRight.push(d);
	camera.keysLeft.push(a);
	
	camera.attachControl(canvas, true);
	
	return scene;
}



*/