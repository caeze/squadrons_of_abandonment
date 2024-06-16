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

import { Entity } from "./Entity";
import { RenderingGroupId } from "./RenderingGroupId";
import { CameraLayerMask } from "./CameraLayerMask";

export class Unit extends Entity {
    public radius: number;
    
    public constructor(scene: Scene, initialPosition: Vector3, name: string, radius: number, currentUrl: string, mesh: Mesh) {
    
    
    
        // also use class ColorHighlightLayer
    
    
        /*let spheresMeshGlb = MeshBuilder.CreateSphere("spheresMeshGlb", { diameter: 0.1 }, scene);
        SceneLoader.ImportMesh(
            "",
            currentUrl + "/assets/models/",
            "PBR_Spheres.glb",
            scene,
            function(objects: AbstractMesh[]) {
                for(let i=0; i<objects.length; ++i) {
                    objects[i].renderingGroupId = RenderingGroupId.MAIN;
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
                    objects[i].renderingGroupId = RenderingGroupId.MAIN;
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
            result.meshes[1].renderingGroupId = RenderingGroupId.MAIN;
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
                result.meshes[i].renderingGroupId = RenderingGroupId.MAIN;
                //result.meshes[i].scaling.x = 0.25;
                //result.meshes[i].scaling.y = 0.25;
                //result.meshes[i].scaling.z = 0.25;
            }
            //highlightLayer.addMesh(result.meshes[1], Color3.Blue());
            //result.meshes[1].renderingGroupId = RenderingGroupId.MAIN;
        });*/
    
    
    
        /*let importPromise = SceneLoader.ImportMeshAsync(null, currentUrl + "/assets/models/", glbFileName, scene);
        importPromise.then((result: any) => {
            for(let i = 0; i < result.meshes.length; i++) {
                result.meshes[i].renderingGroupId = RenderingGroupId.MAIN;
                result.meshes[i].layerMask = CameraLayerMask.MAIN;
                result.meshes[i].position = initialPosition;
                result.meshes[i].isPickable = true;
            }
            meshes = result.meshes;
        });*/
        /*SceneLoader.ImportMesh(
            "",
            currentUrl + "/assets/models/",
            "jupiter.glb",
            scene,
            function(objects: AbstractMesh[]) {
                console.log(objects);
                jupiter = (<Mesh> objects[1]);
                for(let i=0; i<objects.length; ++i) {
                    objects[i].renderingGroupId = RenderingGroupId.MAIN;
                }
            }
        );*/
        super(scene, mesh);
        
        //let result = await this._loadMeshes(scene, currentUrl, glbFileName);
        //let meshes = result.meshes;
        //let allMeshes = meshes.getChildMeshes();
        this.mesh.renderingGroupId = RenderingGroupId.MAIN;
        this.mesh.layerMask = CameraLayerMask.MAIN;
        this.mesh.position = initialPosition;
        this.mesh.isPickable = true;
        
        this.radius = radius;
        /*this.mesh.renderingGroupId = RenderingGroupId.MAIN;
        this.mesh.layerMask = CameraLayerMask.MAIN;
        this.mesh.position = initialPosition;
        this.mesh.isPickable = true;*/
        
        let minimapIconMesh = MeshBuilder.CreateSphere(name + "minimapIconMesh", {diameter: 20}, scene);
        minimapIconMesh.renderingGroupId = RenderingGroupId.MAIN;
        minimapIconMesh.layerMask = CameraLayerMask.MINIMAP;
        minimapIconMesh.position = new Vector3(0.0, 0.0, 0.0);
        let minimapIconMeshShaderMaterial = new ShaderMaterial(
            "minimapIconMeshShaderMaterial",
            scene,
            currentUrl + "/assets/shaders/solidColor", // searches for solidColor.vertex.fx and solidColor.fragment.fx
            {
                attributes: ["position"],
                uniforms: ["worldViewProjection", "color"],
            }
        );
        minimapIconMeshShaderMaterial.setFloats("color", [1.0, 1.0, 1.0, 1.0]);
        minimapIconMeshShaderMaterial.forceDepthWrite = true;
        minimapIconMeshShaderMaterial.transparencyMode = Material.MATERIAL_ALPHABLEND;
        minimapIconMeshShaderMaterial.alpha = 0.0;
        minimapIconMesh.alphaIndex = 1;
        minimapIconMesh.material = minimapIconMeshShaderMaterial;
        minimapIconMesh.isPickable = false;
        minimapIconMesh.parent = this.mesh;
    }
}