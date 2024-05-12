import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { HighlightLayer, Matrix, Camera, UniversalCamera, Color4, Viewport, Layer, Engine, Scene, ArcRotateCamera, AbstractMesh, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, InstancedMesh, StandardMaterial, Texture, Vector2, Vector4 , Color3, SceneLoader, AssetsManager, ArcRotateCameraPointersInput, CubeTexture, RegisterMaterialPlugin, MaterialPluginBase, PostProcess, PassPostProcess, Effect, ShaderMaterial, RenderTargetTexture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button } from '@babylonjs/gui/2D';

// How to run:
// https://doc.babylonjs.com/guidedLearning/createAGame/gettingSetUp
// install from https://github.com/coreybutler/nvm-windows
// nvm install 14
// npm run build
// npm run start
// http://localhost:8080/

// Things to check:
// minimap
// fog of WAR
// audio
// load assets and textures
// explosions and particles
// load map from file (JSON?)
// 2D UI rescale window
// GIZMOS
// multiple source files
// multi scenes for settings and main menu
// settings overlay?
// ai
// animations of buildings etc
// multiplayer
// camera movement
// 2d unit health bars and icons in 3D view
// unit selection circle and unit surrounding circle (via shader)
// shaders must work on asteroids and on ground plane? or just on ground plane?
// navmesh and multi unit (squad) navigation

// sound playback : https://www.babylonjs-playground.com/#PCY1J#8

// select objects with box: https://playground.babylonjs.com/#2SA7J8#7

// mouse control: https://forum.babylonjs.com/t/arcrotatecamera-and-right-click/4901

// switch scenes: https://doc.babylonjs.com/features/featuresDeepDive/scene/multiScenes

// Squadrons of abandonement music idea lily's theme https://youtu.be/qxrV2pqroDY
// FoW https://playground.babylonjs.com/#BRXZVE#8
// FoW2 https://playground.babylonjs.com/#8WJTJG#9
// Fow3 https://playground.babylonjs.com/#8WJTJG
// Entity selection https://playground.babylonjs.com/#GCNNPT#36

// https://app.meshy.a


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

        // initialize engine and scene
        var engine = new Engine(canvas, true);
        
        Effect.ShadersStore["customVertexShader"]=`
        precision highp float;

        attribute vec3 position;
        attribute vec2 uv;

        uniform mat4 world;
        uniform mat4 worldViewProjection;

        varying vec2 vUV;
        varying vec3 vPositionW;

        void main() {
            gl_Position = worldViewProjection * vec4(position, 1.0);
            vUV = uv;
            vPositionW = vec3(world * vec4(position, 1.0));
        }
        `
        Effect.ShadersStore["customFragmentShader"]=`
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
        uniform float circlesMin[MAXSELECTEDS];
        uniform sampler2D diffuseTextureR;
        uniform sampler2D diffuseTextureG;
        uniform sampler2D diffuseTextureB;

        varying vec2 vUV;
        varying vec3 vPositionW;

        bool circle(vec4 FragColor) {
            for(int i=0; i<MAXSELECTEDS; i++) {
                if(i >= nbSelecteds) {
                    return true;
                }
                float dist = length(vPositionW.xz - vec3(circlesX[i],circlesY[i],circlesZ[i]).xz);
                if(dist <= circlesMax[i] && dist >= circlesMin[i]) {
                    FragColor = vec4(circlesR[i],circlesG[i],circlesB[i],1.);
                    //FragColor = vec4(1000. * ((1. - clamp(dist/circlesMax[i], 0., 1.))-pow( 1. - clamp(dist/circlesMin[i], 0., 1.) , .8)) * vec3(circlesR[i], circlesG[i], circlesB[i]),1.) * texture2D(diffuseTextureB, vUV);
                    return false;
                }
            }
        }

        float getDarkness() {
            for(int i=0; i<MAXSELECTEDS; i++) {
                float dist = length(vPositionW.xz - vec3(circlesX[i],circlesY[i],circlesZ[i]).xz) / 5.0;
                if(dist <= circlesMax[i] && dist >= circlesMin[i]) {
                    return 5.0 - dist;
                }
            }
            return 0.2;
        }

        void main() {
            float darkness = getDarkness();
            vec4 fragColor = texture2D(diffuseTextureB, vUV);
            fragColor.rgb *= vec3(darkness);
            gl_FragColor = fragColor;
        }`
        
        // get current URL
        var currentUrl = "http://localhost:8080";

        var scene = new Scene(engine);
        
        var camera: ArcRotateCamera = new ArcRotateCamera("MainCamera", -Math.PI / 2, Math.PI / 4, 5, Vector3.Zero(), scene);
        camera.upperRadiusLimit = 10;
        camera.lowerRadiusLimit = 0.75;
        camera.angularSensibilityX = 1000;
        camera.angularSensibilityY = 1000;
        camera.wheelDeltaPercentage = 0.1;
        camera.checkCollisions = false;
        camera.inertia = 0.6;
        camera.allowUpsideDown = false;
        (camera.inputs.attached.pointers as ArcRotateCameraPointersInput).buttons = [1];
        camera.inputs.remove(camera.inputs.attached.keyboard);
        camera.minZ = 0.1;
        camera.attachControl(canvas, true);
        camera.layerMask = 1;
        camera.upperBetaLimit = Math.PI / 2 - 0.05;
        
        scene.activeCameras = [];
        scene.activeCameras.push(camera);
        camera.attachControl(canvas, true);
        
        //camera.viewport = new Viewport(0.0, 0.0, 1.0, 1.0);
        //cameraMinimap.viewport = new Viewport(0.0, 0.0, 0.5, 0.5);
        


        //const light = new HemisphericLight('', new Vector3(0, 1, 0), scene)

        const spawns = [new Vector3(2, 0, 2), new Vector3(-2, 0, -2)];
        var entitys = new Array<any>;
        
        
        
        var gridPlaneMaterial = new StandardMaterial("gridPlaneMaterial", scene);
        var gridPlaneTexture = new Texture(currentUrl + "/assets/img/ground_plane_grid/ground_plane_grid.png", scene);
        gridPlaneTexture.uScale = 400;
        gridPlaneTexture.vScale = 200;
        gridPlaneTexture.hasAlpha = true;
        gridPlaneMaterial.diffuseTexture = gridPlaneTexture;
        gridPlaneMaterial.useAlphaFromDiffuseTexture = true;
        gridPlaneMaterial.alpha = 0.5;
        
        const f = new Vector4(0, 0, 0.5, 1); // front image = half the whole image along the width 
        const b = new Vector4(0.5, 0, 1, 1); // back image = second half along the width
        
        const gridPlane = MeshBuilder.CreatePlane("gridPlane", {frontUVs: f, backUVs: b, sideOrientation: Mesh.DOUBLESIDE, size: 1000, width: 200, height: 200});
        gridPlane.rotation = new Vector3(Math.PI / 2, 0, 0);
        gridPlane.material = gridPlaneMaterial;
        gridPlane.isPickable = true;

        var ground = MeshBuilder.CreateGroundFromHeightMap("ground", currentUrl + "/assets/img/heightMap.png", {width:100, height:100, subdivisions:100, minHeight:0, maxHeight:10, updatable:false}, scene)
        ground.layerMask = 2;
        var ground_shader_material = new ShaderMaterial("shader", scene, {
            vertex: "custom",
            fragment: "custom",
            },
            {attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "screenSize", "nbSelecteds", "circlesX", "circlesY", "circlesZ", "circlesMax", "circlesMin", "circlesR", "circlesG", "circlesB" ],
            samplers: ["diffuseTextureR", "diffuseTextureG", "diffuseTextureB"],
            defines: ["#define MAXSELECTEDS " + 127],
            /*needAlphaTesting:true,
            needAlphaBlending:true*/}
        );
        
        ground_shader_material.setVector2("screenSize", new Vector2(engine.getRenderWidth(), engine.getRenderHeight()))
        //const diffuseTextureR = new Texture(currentUrl + "/assets/ground_plane_grid/ground_plane_grid.png", scene);
        //diffuseTextureR.uScale = diffuseTextureR.vScale = 10;
        //ground_shader_material.setTexture("diffuseTextureR", diffuseTextureR);
        //const diffuseTextureG = new Texture(currentUrl + "/assets/img/ground.png", scene);
        //diffuseTextureG.uScale = diffuseTextureG.vScale = 10;
        //ground_shader_material.setTexture("diffuseTextureG", diffuseTextureG);
        //const diffuseTextureB = new Texture(currentUrl + "/assets/img/grass.png", scene);
        //diffuseTextureB.uScale = diffuseTextureB.vScale = 10;
        //ground_shader_material.setTexture("diffuseTextureB", diffuseTextureB);
        
        ground_shader_material.setTexture("diffuseTextureR", gridPlaneTexture);

        let isMeshesMatrixUpdated = false;
        function updateCircles() {
            isMeshesMatrixUpdated = false;
            const circlesX = []
            const circlesY = []
            const circlesZ = []
            const circlesR = []
            const circlesG = []
            const circlesB = []
            const circlesMin = []
            const circlesMax = []
            for(let i=0; i<entitys.length; ++i) {
                circlesMin.push(0);
                circlesMax.push(5.0*entitys[i].maxRadius);
                circlesX.push(entitys[i].root.position.x);
                circlesY.push(entitys[i].root.position.y);
                circlesZ.push(entitys[i].root.position.z);
                circlesR.push(entitys[i].color.r);
                circlesG.push(entitys[i].color.g);
                circlesB.push(entitys[i].color.b);
            }
            ground_shader_material.setFloats('circlesMin', circlesMin);
            ground_shader_material.setFloats('circlesMax', circlesMax);
            ground_shader_material.setFloats('circlesX', circlesX);
            ground_shader_material.setFloats('circlesY', circlesY);
            ground_shader_material.setFloats('circlesZ', circlesZ);
            ground_shader_material.setFloats('circlesR', circlesR);
            ground_shader_material.setFloats('circlesG', circlesG);
            ground_shader_material.setFloats('circlesB', circlesB);
        }
        const unitSize = 0.2;
        for(let i=0; i<spawns.length; ++i) {
            let box = MeshBuilder.CreateBox('box'+i, {size:unitSize}, scene);
            box.layerMask = 1;
            entitys.push({root: box,
                maxRadius: .5*Math.sqrt(Math.pow(unitSize, 2) + Math.pow(unitSize, 2)),
                color: [Color3.Red(), Color3.Yellow()][i]
            })
            
            entitys[i].root.onAfterWorldMatrixUpdateObservable.add(() => {
                isMeshesMatrixUpdated = true;
            })
        }

        scene.registerBeforeRender(() => {
            if(isMeshesMatrixUpdated) {
                updateCircles();
            }
        });

        ground.onMeshReadyObservable.add(() => {
            //for(let i=0; i<entitys.length; ++i) {
            //    entitys[i].root.position.set(spawns[i].x, ground.getHeightAtCoordinates(spawns[i].x,spawns[i].z)+.5*unitSize, spawns[i].z);
            //}

            scene.onBeforeRenderObservable.add(() => {
                entitys[0].root.position.x += 0.01;
            })

            ground_shader_material.setInt('nbSelecteds', entitys.length);
        })
        gridPlane.material = ground_shader_material;
        //camera.lockedTarget = ground;

        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        skybox.layerMask = 1;
        const skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture(currentUrl + "/assets/img/skybox/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        
        var originSphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
        originSphere.layerMask = 1;
        
        var xSphere: Mesh = MeshBuilder.CreateSphere("xsphere", { diameter: 0.1 }, scene);
        xSphere.layerMask = 1;
        var xSphereMaterial = new StandardMaterial("mat", scene);
        xSphereMaterial.alpha = 1;
        xSphereMaterial.diffuseColor = new Color3(1, 0, 0);
        xSphere.material = xSphereMaterial;
        xSphere.position = new Vector3(1, 0, 0);
        xSphere.isPickable = true;
        
        var ySphere: Mesh = MeshBuilder.CreateSphere("ysphere", { diameter: 0.1 }, scene);
        var ySphereMaterial = new StandardMaterial("mat", scene);
        ySphereMaterial.alpha = 1;
        ySphereMaterial.diffuseColor = new Color3(0, 1, 0);
        ySphere.material = ySphereMaterial;
        ySphere.position = new Vector3(0, 1, 0);
        ySphere.isPickable = true;
        
        var zSphere: Mesh = MeshBuilder.CreateSphere("zsphere", { diameter: 0.1 }, scene);
        var zSphereMaterial = new StandardMaterial("mat", scene);
        zSphereMaterial.alpha = 1;
        zSphereMaterial.diffuseColor = new Color3(0, 0, 1);
        zSphere.material = zSphereMaterial;
        zSphere.position = new Vector3(0, 0, 1);
        zSphere.isPickable = true;

        var highlightLayer = new HighlightLayer("SphereHighlight", scene,
        { 
            // alphaBlendingMode: 0, 
            blurTextureSizeRatio : .25
        });
        highlightLayer.addMesh(xSphere, Color3.Blue());
        highlightLayer.addMesh(ySphere, Color3.White());
        highlightLayer.addMesh(zSphere, Color3.Black());
    
        /*var spheresMeshGlb = SceneLoader.ImportMesh(
            "",
            currentUrl + "/assets/models/",
            "PBR_Spheres.glb",
            scene,
        );*/
        
        // IMPORTANT: GIZMOS
        // https://playground.babylonjs.com/#31M2AP#9
        
        var spheresMeshGlb: AbstractMesh;
        SceneLoader.ImportMesh(
            "",
            currentUrl + "/assets/models/",
            "PBR_Spheres.glb",
            scene,
            function(object: AbstractMesh[]) {
                spheresMeshGlb = object[0];
            }
        );

        scene.registerBeforeRender(() => {
            if (spheresMeshGlb != null) {
                spheresMeshGlb.rotation = new Vector3(0.0, 0.0, spheresMeshGlb.rotation.z + 0.01);
            }
        });

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
            let currentTarget = camera.getTarget();
            let stepSize = 0.1;
            if (ev.key === "j") {
                currentTarget.y += stepSize;
            }
            if (ev.key === "w") {
                currentTarget.x += stepSize;
            }
            if (ev.key === "a") {
                currentTarget.x -= stepSize;
            }
            if (ev.key === "s") {
                currentTarget.z += stepSize;
            }
            if (ev.key === "d") {
                currentTarget.z -= stepSize;
            }
            if (ev.key === "f") {
                this.launchFullscreen();
            }
            camera.target.copyFrom(currentTarget);
        });
        
        /*
        
        var cameraMinimap: ArcRotateCamera = new ArcRotateCamera("MinimapCamera", 0, 0, 1, Vector3.Zero(), scene);
        cameraMinimap.position = new Vector3(0, 50, 0);
        cameraMinimap.layerMask = 2;
        //cameraMinimap.mode = Camera.ORTHOGRAPHIC_CAMERA;
        // cameraMinimap.viewport = new Viewport(0.0, 0.4, 1.0, 0.2);
        */
        var cameraMinimap = new UniversalCamera("cameraMinimap", new Vector3(0, 20, 0), scene);
        cameraMinimap.mode = Camera.ORTHOGRAPHIC_CAMERA;
        cameraMinimap.minZ = 0.1;
        cameraMinimap.setTarget(Vector3.Zero());
        // cameraMinimap.rotation = new Vector3(Math.PI/2,0,0);
        let cameraMinimapViewport = 100;
        cameraMinimap.orthoTop = -cameraMinimapViewport;
        cameraMinimap.orthoBottom = cameraMinimapViewport;
        cameraMinimap.orthoLeft = cameraMinimapViewport;
        cameraMinimap.orthoRight = -cameraMinimapViewport;
        
        

        const planeSize = 0.25;
        var plane = MeshBuilder.CreatePlane("plane", { size: planeSize }, scene);
        //plane.position.z = 1.001
        //plane.parent = camera;
        plane.position.set(planeSize / 2, planeSize / 2, 0);
        plane.bakeCurrentTransformIntoVertices();
        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;

        const rt_texture = new RenderTargetTexture("minimap_rtt", 1024, scene);
        rt_texture.activeCamera = cameraMinimap;
        rt_texture.renderList = scene.meshes;
        scene.customRenderTargets.push(rt_texture);

        var mon2mat = new StandardMaterial("minimap_texturePlane", scene);
        mon2mat.diffuseColor = new Color3(1, 1, 1);
        mon2mat.diffuseTexture = rt_texture;
        mon2mat.specularColor = Color3.Black();
        mon2mat.diffuseTexture.level = 1.2; // intensity
        mon2mat.emissiveColor = new Color3(1, 1, 1); // backlight
        plane.material = mon2mat;

        scene.onBeforeRenderObservable.add(() => {
            camera.getViewMatrix(); 
            let  invertCameraViewProj = Matrix.Invert(camera.getTransformationMatrix());
            let  screenWidth = scene.getEngine().getRenderWidth(true);
            setPositionTop(false, plane, 100, 0, invertCameraViewProj, screenWidth)
        });
        
        /*var sphereMinimap = MeshBuilder.CreateSphere("sphereMinimap", { diameter: 5.0 }, scene);
        sphereMinimap.position = new Vector3(0, 15, 0);
        sphereMinimap.layerMask = 2;
        var materialSphereMinimap = new StandardMaterial("textureSphereMinimap", scene);
        materialSphereMinimap.alpha = 1;
        materialSphereMinimap.diffuseColor = new Color3(0, 0, 1);
        sphereMinimap.material = materialSphereMinimap;
        

        var minimapRenderTargetTexture = new RenderTargetTexture("minimapRenderTargetTexture", 1024, scene, false, false);
        //minimapRenderTargetTexture.coordinatesMode = RenderTargetTexture.EQUIRECTANGULAR_MODE;
        scene.customRenderTargets.push(minimapRenderTargetTexture);
        minimapRenderTargetTexture.activeCamera = cameraMinimap;
        minimapRenderTargetTexture.renderList = [sphereMinimap];
        var minimapPlane = Mesh.CreatePlane("minimapPlane", 4, scene);
        minimapPlane.renderingGroupId = 2;
        minimapPlane.showBoundingBox = false;
        //minimapPlane.scaling = new Vector3(window.innerWidth / window.innerHeight, 1, 1);
        var minimapPlaneMaterial = new StandardMaterial("minimapPlaneMaterial", scene);
        //minimapPlaneMaterial.diffuseColor = new Color3(1,1,1);
        minimapPlaneMaterial.diffuseTexture = minimapRenderTargetTexture;
        minimapPlaneMaterial.specularColor = Color3.Black();
        
        scene.onAfterRenderObservable.add(() => {
            /*const screenPosition = new Vector3(engine.getRenderWidth() / 2, engine.getRenderHeight() / 2, 10.0);
            const positionVector = Vector3.Unproject(
                screenPosition,
                engine.getRenderWidth(),
                engine.getRenderHeight(),
                Matrix.Identity(),
                scene.getViewMatrix(),
                scene.getProjectionMatrix()
            );
            minimapPlane.position.x = -3;
            minimapPlane.position.y = -3;
            minimapPlane.position.z = 10; * / 
            var ray = scene.createPickingRay(0, 0, Matrix.Identity(), camera, false);
            var rayOrigin = ray.origin;
            var rayDirection = ray.direction;
            rayDirection.normalize();
            var minimapPlanePosition = rayDirection.scaleAndAddToRef(10, rayOrigin);
            console.log(camera.position);
            minimapPlane.position.x = minimapPlanePosition.x;
            minimapPlane.position.y = minimapPlanePosition.y;
            minimapPlane.position.z = minimapPlanePosition.z;
           // -7.960090654955585, _y: -2.375073664606663, _z: 5.864826787485438
        })

        /* const forward = camera.position.clone();
        const up = camera.getDirection(Vector3.Up());
        const result = Matrix.Zero();
        Matrix.LookAtLHToRef(Vector3.Zero(), forward, up, result);
        result.invert();
        const q =  Quaternion.FromRotationMatrix(result).normalize();
        cone.rotationQuaternion = q;* /

        //minimapPlaneMaterial.diffuseTexture.scale = 1; // zoom

        //minimapPlaneMaterial.diffuseTexture.level = 1.2; // intensity

        minimapPlaneMaterial.emissiveColor = new Color3(1,1,1); // backlight
        minimapPlane.material = minimapPlaneMaterial;
        minimapPlane.parent = camera;
        // minimapPlane.parent = camera;
        minimapPlane.layerMask = 1;

        // minimapPlane.enableEdgesRendering(epsilon);	 
        minimapPlane.edgesWidth = 5.0;
        minimapPlane.edgesColor = new Color4(1, 1, 1, 1);*/
        
        

        // GUI
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.isForeground = true;
        
        var button = Button.CreateImageWithCenterTextButton("but", "Click me!", "textures/grass.png");
            button.width = 0.2;
            button.height = "40px";
            button.left = "-100px";
            button.top = "-100px";
            button.color = "white";
            button.background = "green";
            button.onPointerClickObservable.add(()=>{
                if (button.image != null) {
                    button.image.source = currentUrl + "/assets/img/heightMap.png";
                }
            });
        advancedTexture.addControl(button);    
        
        // run the main render loop
        engine.runRenderLoop(() => {
            // here all updating stuff must be updated
            scene.render();
        });
        
        window.addEventListener("resize", function() {
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            engine.resize();
            //minimapPlane.scaling = new Vector3(window.innerWidth / window.innerHeight, 1, 1);
        
            /*const screenPosition = new Vector3(100, 100, 0.01);
            let viewMatrix = scene.getViewMatrix();
            let projectionMatrix = scene.getProjectionMatrix();

            const screenToWorld = Vector3.Unproject(
                screenPosition,
                engine.getRenderWidth(),
                engine.getRenderHeight(),
                Matrix.Identity(),
                viewMatrix,
                projectionMatrix,
            );
            screenToWorld.z = 20;
            console.log("screenToWorld " + screenToWorld);
            minimapPlane.position.copyFrom(screenToWorld);*/
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

function setPositionTop(fromLeft: any, mesh: any, meshWidthInPixels: any, spacingWithBorderInPixels: any, invertCameraViewProj: any, screenWidth: any) {
    //spacing from the edges of the screen (left, right)
    let spacingWithBorder = spacingWithBorderInPixels / screenWidth;
    //width of the meshes relative to screen
    let w = meshWidthInPixels / screenWidth / 20;
    //is the offset applied from left or right
    let pOfst = -1 + spacingWithBorder * 4;//fromLeft ? -1 + spacingWithBorder * 2 : 1 - spacingWithBorder * 2;
    //vector in (-1,-1,-1) -> bottom left, near plane
    let p = new Vector3(-1, -1, -1 + 0.0001);
    //same vector, but x coordinate is increased by the width of the mesh we defined in the function
    let q = new Vector3(2 * w, 1, -1 + 0.0001);

    //switch these vectors to camera view by inverting the matrix
    let pt = Vector3.TransformCoordinates(p, invertCameraViewProj);
    let qt = Vector3.TransformCoordinates(q, invertCameraViewProj);
    //subtract these vectors and get the size coeficient 
    let scalingFactor = 0.25;
    let d = qt.subtract(pt).length() * scalingFactor;
    //scale the mesh to the proper size relative to screen
    mesh.scaling = new Vector3(d, d, d);
    //offset the x value of the p vector depending on "fromLeft" variable (calculated above -> pOfst)
    p.x = pOfst;
    //set position 
    mesh.position = Vector3.TransformCoordinates(p, invertCameraViewProj);
}

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