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
InstancedMesh,
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

import { RenderingGroupId } from "./RenderingGroupId";
import { CameraLayerMask } from "./CameraLayerMask";
import { Unit } from "./Unit";

export class Ground {
	private _groundShaderMaterial: ShaderMaterial;
    
    public constructor(scene: Scene, currentUrl: string, maxRevealers: number, maxUnits: number, mapSidelength: number) {
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
                    "unitsCurrentCount",
                    "unitsX",
                    "unitsZ",
                    "unitsRadius",
                    "unitsType",
                    "unitsColor",
                ],
                defines: [
                    "#define MAX_REVEALERS " + maxRevealers,
                    "#define MAX_UNITS " + maxUnits,
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

	public updateRevealerPositions(units: Unit[]) {
        const revealersX = [];
        const revealersZ = [];
        const revealersRadius = [];
        for(let i = 0; i < units.length; i++) {
            revealersX.push(units[i].mesh.position.x);
            revealersZ.push(units[i].mesh.position.z);
            revealersRadius.push(units[i].radius);
        }
        this._groundShaderMaterial.setInt("revealersCurrentCount", units.length);
        this._groundShaderMaterial.setFloats("revealersX", revealersX);
        this._groundShaderMaterial.setFloats("revealersZ", revealersZ);
        this._groundShaderMaterial.setFloats("revealersRadius", revealersRadius);
	}

	public updateSelectedPositions(units: Unit[]) {
        const unitsX = [];
        const unitsZ = [];
        const unitsRadius = [];
        const unitsType = [];
        const unitsColor = [];
        for(let i = 0; i < units.length; i++) {
            unitsX.push(units[i].mesh.position.x);
            unitsZ.push(units[i].mesh.position.z);
            unitsRadius.push(units[i].radius / 5.0);
            unitsType.push(1);
            unitsColor.push(new Color4(0.5, 0.5, 0.2, 0.6));
        }
        this._groundShaderMaterial.setInt("unitsCurrentCount", units.length);
        this._groundShaderMaterial.setFloats("unitsX", unitsX);
        this._groundShaderMaterial.setFloats("unitsZ", unitsZ);
        this._groundShaderMaterial.setFloats("unitsRadius", unitsRadius);
        this._groundShaderMaterial.setFloats("unitsType", unitsType);
        this._groundShaderMaterial.setColor4Array("unitsColor", unitsColor);
	}
}