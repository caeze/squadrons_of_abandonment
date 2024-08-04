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

import { RenderingGroupId } from "./RenderingGroupId";
import { CameraLayerMask } from "./CameraLayerMask";
import { Entity } from "./Entity";

export class Ground {
	private _groundShaderMaterial: ShaderMaterial;
    
    public constructor(scene: Scene, currentUrl: string, maxRevealers: number, maxEntities: number, mapSidelength: number) {
        let ground = MeshBuilder.CreatePlane("ground", {size: mapSidelength});
        this._groundShaderMaterial = new ShaderMaterial(
            "groundShaderMaterial",
            scene,
            currentUrl + "/assets/shaders/ground", // searches for ground.vertex.fx and ground.fragment.fx
            {
                attributes: ["position"],
                uniforms: [
                    "worldViewProjection",
                    "world",
                    "mapSidelength",
                    "revealersCurrentCount",
                    "revealersX",
                    "revealersZ",
                    "revealersRadius",
                    "entitiesCurrentCount",
                    "entitiesX",
                    "entitiesZ",
                    "entitiesRadius",
                    "entitiesType",
                ],
                defines: [
                    "#define MAX_REVEALERS " + maxRevealers,
                    "#define MAX_ENTITIES " + maxEntities,
                ],
            }
        );
        ground.renderingGroupId = RenderingGroupId.GROUND;
        ground.layerMask = CameraLayerMask.MAIN;
        ground.alphaIndex = 1;
        ground.rotation = new Vector3(Math.PI / 2, 0, 0);
        ground.material = this._groundShaderMaterial;
        ground.material.forceDepthWrite = true;
        ground.material.transparencyMode = Material.MATERIAL_ALPHABLEND;
        ground.material.alpha = 0.0;
        this._groundShaderMaterial.setFloat("mapSidelength", mapSidelength);
    }

	public updateRevealerPositions(entities: Entity[]) {
        const revealersX = [];
        const revealersZ = [];
        const revealersRadius = [];
        for(let i = 0; i < entities.length; i++) {
            revealersX.push(entities[i].mesh.position.x);
            revealersZ.push(entities[i].mesh.position.z);
            revealersRadius.push(entities[i].radius);
        }
        this._groundShaderMaterial.setInt("revealersCurrentCount", entities.length);
        this._groundShaderMaterial.setFloats("revealersX", revealersX);
        this._groundShaderMaterial.setFloats("revealersZ", revealersZ);
        this._groundShaderMaterial.setFloats("revealersRadius", revealersRadius);
	}

	public updateSelectedPositions(entities: Entity[]) {
        const entitiesX = [];
        const entitiesZ = [];
        const entitiesRadius = [];
        const entitiesType = [];
        const entitiesColor = [];
        for(let i = 0; i < entities.length; i++) {
            entitiesX.push(entities[i].mesh.position.x);
            entitiesZ.push(entities[i].mesh.position.z);
            entitiesRadius.push(entities[i].radius / 5.0);
            entitiesType.push(i);
        }
        this._groundShaderMaterial.setInt("entitiesCurrentCount", entities.length);
        this._groundShaderMaterial.setFloats("entitiesX", entitiesX);
        this._groundShaderMaterial.setFloats("entitiesZ", entitiesZ);
        this._groundShaderMaterial.setFloats("entitiesRadius", entitiesRadius);
        this._groundShaderMaterial.setFloats("entitiesType", entitiesType);
	}
}