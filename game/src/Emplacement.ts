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

import { Entity } from "./Entity";
import { RenderingGroupId } from "./RenderingGroupId";
import { CameraLayerMask } from "./CameraLayerMask";

export class Emplacement extends Entity {    
    public constructor(scene: Scene, initialPosition: Vector3, name: string, radius: number, currentUrl: string, mesh: Mesh) {
        super(scene, mesh, radius);
        this.mesh.renderingGroupId = RenderingGroupId.MAIN;
        this.mesh.layerMask = CameraLayerMask.MAIN;
        this.mesh.position = initialPosition;
        this.mesh.isPickable = true;
        
        let minimapIconMesh = MeshBuilder.CreateBox(name + "minimapIconMesh", {size: 20}, scene);
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