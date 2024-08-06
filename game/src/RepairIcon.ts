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
GlowLayer,
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

export class RepairIcon {

    private _wrenchMesh: Mesh;
    private _wrenchTransformNode: TransformNode;
    private _glowLayer: GlowLayer;
    
	public constructor(scene: Scene, currentUrl: string, parentMesh: Mesh, meshAssetContainers: Record<string, AssetContainer>) {
        let wrenchAssetName = "wrench";
        let assetContainer = meshAssetContainers[wrenchAssetName];
        let cloneMaterialsAndDontShareThem = true;
        let instantiatedEntries = assetContainer.instantiateModelsToScene((name) => parentMesh.name + "_" + name, cloneMaterialsAndDontShareThem);
        this._wrenchMesh = instantiatedEntries.rootNodes[0] as Mesh;
        
        let wrenchColor = new Color4(0.0, 1.0, 1.0, 1.0);
        
        let shaderMaterial = new ShaderMaterial(
            name + "ShaderMaterial",
            scene,
            currentUrl + "assets/shaders/solidColor", // searches for solidColor.vertex.fx and solidColor.fragment.fx
            {
                attributes: ["position"],
                uniforms: ["worldViewProjection", "color"],
            }
        );
        shaderMaterial.setFloats("color", [wrenchColor.r, wrenchColor.g, wrenchColor.b, wrenchColor.a]);
        shaderMaterial.forceDepthWrite = true;
        shaderMaterial.transparencyMode = Material.MATERIAL_ALPHABLEND;
        shaderMaterial.alpha = 0.0;
        this._getMainMesh().alphaIndex = 0;
        this._getMainMesh().material = shaderMaterial;
        this._getMainMesh().renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._getMainMesh().layerMask = SOA.CameraLayerMask.MAIN;
        this._wrenchMesh.alphaIndex = 0;
        this._wrenchMesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._wrenchMesh.layerMask = SOA.CameraLayerMask.MAIN;
        
        this._glowLayer = new GlowLayer(parentMesh.name + "WrenchGlowLayer", scene);
        this._glowLayer.customEmissiveColorSelector = function (mesh, subMesh, material, result) {
            result.set(wrenchColor.r, wrenchColor.g, wrenchColor.b, 0.6);
        };
        this._glowLayer.addIncludedOnlyMesh(this._getMainMesh());
        this._glowLayer.renderingGroupId = SOA.RenderingGroupId.MAIN;
        
        this._wrenchTransformNode = new TransformNode(parentMesh.name + "WrenchTransformNode");
        this._wrenchTransformNode.parent = parentMesh;
        this._wrenchTransformNode.position.y = 0.5;
        this._wrenchTransformNode.rotation.x = -Math.PI / 4.0;
        this._wrenchTransformNode.rotation.z = -Math.PI / 2.0;
        let scalingFactor = 0.3;
        this._wrenchMesh.scaling.x = scalingFactor;
        this._wrenchMesh.scaling.y = scalingFactor;
        this._wrenchMesh.scaling.z = scalingFactor;
        this._wrenchMesh.parent = this._wrenchTransformNode;
        
        this.hideRepairIcon();
    }
    
	public showRepairIcon() {
        this._getMainMesh().setEnabled(true);
        this._wrenchMesh.setEnabled(true);
    }
    
	public hideRepairIcon() {
        this._getMainMesh().setEnabled(false);
        this._wrenchMesh.setEnabled(false);
    }
    
	public tick() {
        let dt = 0.03;
        this._wrenchTransformNode.rotation.y -= dt;
    }
    
	private _getMainMesh(): Mesh {
        return this._wrenchMesh.getChildren()[0] as Mesh;
    }
    
    
}
