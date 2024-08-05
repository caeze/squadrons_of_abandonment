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

export class MapLoader {
	public populateScene(canvas: HTMLElement, engine: Engine, scene: Scene, camera: Camera, currentUrl: string, meshAssetContainers: Record<string, AssetContainer>, particleSystemAssetContainers: Record<string, ParticleSystem>, textFileAssetContainers: Record<string, string>, meshToExclude: Mesh): SOA.Unit[] {
	    // TODO: pull out jupiter and sun from here, only load map related stuff!
        let sun = new SOA.Sun(scene, camera, engine, currentUrl, meshToExclude);
        let jupiter = new SOA.Jupiter(meshAssetContainers["jupiter"]);
        
        let entityMeshes = ["strangeObject", "redSpaceFighter", "redStation"];
        let meshes: Mesh[] = [];
        for (let i = 0; i < entityMeshes.length; i++) {
            let assetContainer = meshAssetContainers[entityMeshes[i]];
            let cloneMaterialsAndDontShareThem = true;
            let instantiatedEntries = assetContainer.instantiateModelsToScene((name) => "p_" + name, cloneMaterialsAndDontShareThem);
            meshes.push(instantiatedEntries.rootNodes[0] as Mesh);
        }
        
        let particleSystems: ParticleSystem[] = [];
        for (let particleSystemName in particleSystemAssetContainers) {
            particleSystems.push(particleSystemAssetContainers[particleSystemName]);
        }
        
        let units: SOA.Unit[] = [];
        for (let i = 0; i < meshes.length; i++) {
            let unit = new SOA.Unit(scene, new Vector3(0, 0, 0), "box" + i, 5.0, currentUrl, meshes[i]);
            let exhaustTransformNode = new TransformNode(unit.mesh.name + "ExhaustTransformNode");
            exhaustTransformNode.parent = unit.mesh;
            exhaustTransformNode.position.x = -0.6;
            exhaustTransformNode.position.y = 0.05;
            exhaustTransformNode.rotation.z = -Math.PI / 2;
            let exhaustParticleSystem = particleSystems[0].clone(unit.mesh.name + "ExhaustParticleSystem", exhaustTransformNode);
            exhaustParticleSystem.emitter = exhaustTransformNode as AbstractMesh;
            exhaustParticleSystem.isLocal = true;
            exhaustParticleSystem.renderingGroupId = SOA.RenderingGroupId.MAIN;
            exhaustParticleSystem.layerMask = SOA.CameraLayerMask.MAIN;
            exhaustParticleSystem.minSize = 0.4;
            exhaustParticleSystem.maxSize = 0.4;
            exhaustParticleSystem.color1 = new Color4(1, 0.5, 0.5, 0.8);
            exhaustParticleSystem.color2 = new Color4(1, 0, 0, 1);
            exhaustParticleSystem.start();
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
        
        let originSphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
        originSphere.renderingGroupId = SOA.RenderingGroupId.MAIN;
        originSphere.layerMask = SOA.CameraLayerMask.MAIN;
        originSphere.isPickable = true;
        
        let xSphere: Mesh = MeshBuilder.CreateSphere("xsphere", { diameter: 0.1 }, scene);
        let xSphereMaterial = new StandardMaterial("mat", scene);
        xSphereMaterial.alpha = 1;
        xSphereMaterial.diffuseColor = new Color3(1, 0, 0);
        xSphere.material = xSphereMaterial;
        xSphere.position = new Vector3(1, 0, 0);
        xSphere.isPickable = true;
        xSphere.renderingGroupId = SOA.RenderingGroupId.MAIN;
        xSphere.layerMask = SOA.CameraLayerMask.MAIN;
        
        let ySphere: Mesh = MeshBuilder.CreateSphere("ysphere", { diameter: 0.1 }, scene);
        let ySphereMaterial = new StandardMaterial("mat", scene);
        ySphereMaterial.alpha = 1;
        ySphereMaterial.diffuseColor = new Color3(0, 1, 0);
        ySphere.material = ySphereMaterial;
        ySphere.position = new Vector3(0, 1, 0);
        ySphere.isPickable = true;
        ySphere.renderingGroupId = SOA.RenderingGroupId.MAIN;
        ySphere.layerMask = SOA.CameraLayerMask.MAIN;
        
        let zSphere: Mesh = MeshBuilder.CreateSphere("zsphere", { diameter: 0.1 }, scene);
        let zSphereMaterial = new StandardMaterial("mat", scene);
        zSphereMaterial.alpha = 1;
        zSphereMaterial.diffuseColor = new Color3(0, 0, 1);
        zSphere.material = zSphereMaterial;
        zSphere.position = new Vector3(0, 0, 1);
        zSphere.isPickable = true;
        zSphere.renderingGroupId = SOA.RenderingGroupId.MAIN;
        zSphere.layerMask = SOA.CameraLayerMask.MAIN;
        
        return units;
    }
}
