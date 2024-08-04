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

import { Sun } from "./Sun";
import { Gui } from "./Gui";
import { Minimap } from "./Minimap";
import { RenderingPipeline } from "./RenderingPipeline";
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
import { ConsoleFunctions } from "./ConsoleFunctions";
import { SelectionManager } from "./SelectionManager";

export class EntityLoader {
	public populateScene(canvas: HTMLElement, engine: Engine, scene: Scene, camera: Camera, currentUrl: string, meshes: Mesh[]): Unit[] {
        let sun = new Sun(scene, camera, engine, currentUrl);
        
        let units: Unit[] = [];
        for (let i = 0; i < meshes.length; i++) {
            let unit = new Unit(scene, new Vector3(0, 0, 0), "box" + i, 5.0, currentUrl, meshes[i]);
            units.push(unit);
        }
        scene.registerBeforeRender(() => {
            units[0].mesh.position.x -= 0.005;
            units[0].mesh.rotation.x += 0.005;
            //units[0].mesh.rotation.y += 0.005;
            units[1].mesh.position.x += 0.005;
            //units[1].mesh.rotation.x += 0.005;
            //units[1].mesh.rotation.y += 0.005;
            units[0].mesh.rotationQuaternion = null;
            //units[1].mesh.rotationQuaternion = null;
        });
        
        const assetsManager = new AssetsManager(scene);
        const particleFile = assetsManager.addTextFileTask("rocket_particle_system", currentUrl + "/assets/particle_definitions/systems/rocket_exhaust.json");
        assetsManager.load();
        
        assetsManager.onFinish = function (task) {
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
    }
}