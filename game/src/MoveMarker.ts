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
Angle,
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

export class MoveMarker {

    private _moveMarker0Mesh: Mesh;
    private _moveMarker1Mesh: Mesh;
    private _moveMarker2Mesh: Mesh;
    private _moveMarkerTransformNode: TransformNode;
    private _glowLayer: GlowLayer;
    private _ticksCounter: number;
    
	public constructor(scene: Scene, currentUrl: string, meshAssetContainers: Record<string, AssetContainer>) {
        let moveMarkerAssetName = "moveMarkerCircularArrow";
        let assetContainer = meshAssetContainers[moveMarkerAssetName];
        let cloneMaterialsAndDontShareThem = true;
        let instantiatedEntries0 = assetContainer.instantiateModelsToScene((name) => "moveMarker0" + name, cloneMaterialsAndDontShareThem);
        this._moveMarker0Mesh = instantiatedEntries0.rootNodes[0] as Mesh;
        let instantiatedEntries1 = assetContainer.instantiateModelsToScene((name) => "moveMarker0" + name, cloneMaterialsAndDontShareThem);
        this._moveMarker1Mesh = instantiatedEntries1.rootNodes[0] as Mesh;
        let instantiatedEntries2 = assetContainer.instantiateModelsToScene((name) => "moveMarker0" + name, cloneMaterialsAndDontShareThem);
        this._moveMarker2Mesh = instantiatedEntries2.rootNodes[0] as Mesh;
        
        let moveMarkerColor = new Color4(0.0, 1.0, 0.0, 1.0);
        
        let shaderMaterial = new ShaderMaterial(
            name + "ShaderMaterial",
            scene,
            currentUrl + "assets/shaders/solidColor", // searches for solidColor.vertex.fx and solidColor.fragment.fx
            {
                attributes: ["position"],
                uniforms: ["worldViewProjection", "color"],
            }
        );
        shaderMaterial.setFloats("color", [moveMarkerColor.r, moveMarkerColor.g, moveMarkerColor.b, moveMarkerColor.a]);
        shaderMaterial.forceDepthWrite = true;
        shaderMaterial.transparencyMode = Material.MATERIAL_ALPHABLEND;
        shaderMaterial.alpha = 0.0;
        this._getMainMesh0().alphaIndex = 0;
        this._getMainMesh0().material = shaderMaterial;
        this._getMainMesh0().renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._getMainMesh0().layerMask = SOA.CameraLayerMask.MAIN;
        this._getMainMesh1().alphaIndex = 0;
        this._getMainMesh1().material = shaderMaterial;
        this._getMainMesh1().renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._getMainMesh1().layerMask = SOA.CameraLayerMask.MAIN;
        this._getMainMesh2().alphaIndex = 0;
        this._getMainMesh2().material = shaderMaterial;
        this._getMainMesh2().renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._getMainMesh2().layerMask = SOA.CameraLayerMask.MAIN;
        this._moveMarker0Mesh.alphaIndex = 0;
        this._moveMarker0Mesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._moveMarker0Mesh.layerMask = SOA.CameraLayerMask.MAIN;
        this._moveMarker1Mesh.alphaIndex = 0;
        this._moveMarker1Mesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._moveMarker1Mesh.layerMask = SOA.CameraLayerMask.MAIN;
        this._moveMarker2Mesh.alphaIndex = 0;
        this._moveMarker2Mesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._moveMarker2Mesh.layerMask = SOA.CameraLayerMask.MAIN;
        
        this._glowLayer = new GlowLayer("moveMarkerGlowLayer", scene);
        this._glowLayer.customEmissiveColorSelector = function (mesh, subMesh, material, result) {
            result.set(moveMarkerColor.r, moveMarkerColor.g, moveMarkerColor.b, 0.6);
        };
        this._glowLayer.addIncludedOnlyMesh(this._getMainMesh0());
        this._glowLayer.addIncludedOnlyMesh(this._getMainMesh1());
        this._glowLayer.addIncludedOnlyMesh(this._getMainMesh2());
        this._glowLayer.renderingGroupId = SOA.RenderingGroupId.MAIN;
        
        let scalingFactor = 0.3;
        this._moveMarker0Mesh.scaling.x = scalingFactor;
        this._moveMarker0Mesh.scaling.y = scalingFactor;
        this._moveMarker0Mesh.scaling.z = scalingFactor;
        this._moveMarker1Mesh.scaling.x = scalingFactor;
        this._moveMarker1Mesh.scaling.y = scalingFactor;
        this._moveMarker1Mesh.scaling.z = scalingFactor;
        this._moveMarker2Mesh.scaling.x = scalingFactor;
        this._moveMarker2Mesh.scaling.y = scalingFactor;
        this._moveMarker2Mesh.scaling.z = scalingFactor;
        
        this._moveMarkerTransformNode = new TransformNode("moveMarkerTransformNode");
        
        let moveMarker0TransformNode = new TransformNode("moveMarker0TransformNode");
        moveMarker0TransformNode.rotation.y = Angle.FromDegrees(0.0).radians();
        moveMarker0TransformNode.parent = this._moveMarkerTransformNode;
        this._moveMarker0Mesh.parent = moveMarker0TransformNode;
        
        let moveMarker1TransformNode = new TransformNode("moveMarker1TransformNode");
        moveMarker1TransformNode.rotation.y = Angle.FromDegrees(120.0).radians();
        moveMarker1TransformNode.parent = this._moveMarkerTransformNode;
        this._moveMarker1Mesh.parent = moveMarker1TransformNode;
        
        let moveMarker2TransformNode = new TransformNode("moveMarker2TransformNode");
        moveMarker2TransformNode.rotation.y = Angle.FromDegrees(240.0).radians();
        moveMarker2TransformNode.parent = this._moveMarkerTransformNode;
        this._moveMarker2Mesh.parent = moveMarker2TransformNode;
        
        this._ticksCounter = 0;
        
        this.hideMoveMarker();
    }
    
	public showMoveMarker(position: Vector3) {
        this._moveMarkerTransformNode.position.x = position.x;
        this._moveMarkerTransformNode.position.y = position.y;
        this._moveMarkerTransformNode.position.z = position.z;
        let offset = -0.1;
        this._moveMarker0Mesh.position.x = offset;
        this._moveMarker1Mesh.position.x = offset;
        this._moveMarker2Mesh.position.x = offset;
        this._getMainMesh0().setEnabled(true);
        this._moveMarker0Mesh.setEnabled(true);
        this._getMainMesh1().setEnabled(true);
        this._moveMarker1Mesh.setEnabled(true);
        this._getMainMesh2().setEnabled(true);
        this._moveMarker2Mesh.setEnabled(true);
        
        this._ticksCounter = 0;
    }
    
	public hideMoveMarker() {
        this._getMainMesh0().setEnabled(false);
        this._moveMarker0Mesh.setEnabled(false);
        this._getMainMesh1().setEnabled(false);
        this._moveMarker1Mesh.setEnabled(false);
        this._getMainMesh2().setEnabled(false);
        this._moveMarker2Mesh.setEnabled(false);
        
        this._ticksCounter = 0;
    }
    
	public tick() {
        let dt = 0.15;
        this._moveMarkerTransformNode.rotation.y += dt;
        this._moveMarker0Mesh.position.x += 0.003;
        this._moveMarker1Mesh.position.x += 0.003;
        this._moveMarker2Mesh.position.x += 0.003;
        
        //TODO: make this time-based to decouple from fps
        if (this._ticksCounter == 40) {
            this.hideMoveMarker();
        }
        this._ticksCounter++;
    }
    
	private _getMainMesh0(): Mesh {
        return this._moveMarker0Mesh.getChildren()[0] as Mesh;
    }
    
	private _getMainMesh1(): Mesh {
        return this._moveMarker1Mesh.getChildren()[0] as Mesh;
    }
    
	private _getMainMesh2(): Mesh {
        return this._moveMarker2Mesh.getChildren()[0] as Mesh;
    }
}
