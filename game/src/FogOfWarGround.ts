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
VolumetricLightScatteringPostProcess,
WebGPUEngine,
} from "@babylonjs/core";
// ----------- global imports end -----------

import { RenderingGroupId } from "./RenderingGroupId";
import { Unit } from "./Unit";

export class FogOfWarGround {
	private _groundShaderMaterial: ShaderMaterial;
    
    public constructor(scene: Scene, currentUrl: string, maxRevealers: number) {
        let mapSidelength = 1000.0;
        let ground = MeshBuilder.CreatePlane("ground", {size: mapSidelength});
        this._groundShaderMaterial = new ShaderMaterial(
            "fowShaderMaterial",
            scene,
            currentUrl + "/assets/shaders/fow", // searches for fow.vertex.fx and fow.fragment.fx
            {
                attributes: ["position"],
                uniforms: [
                    "worldViewProjection",
                    "world",
                    "revealersCurrentCount",
                    "revealersX",
                    "revealersZ",
                    "revealersRadius",
                    "mapSidelength"
                    //"CurrentCount",
                    //"revealersX",
                    //"revealersZ",
                    //"revealersRadius",
                ],
                defines: ["#define MAX_REVEALERS " + maxRevealers],
            }
        );
        ground.renderingGroupId = RenderingGroupId.GROUND;
        ground.alphaIndex = 1;
        ground.rotation = new Vector3(Math.PI / 2, 0, 0);
        ground.material = this._groundShaderMaterial;
        ground.material.forceDepthWrite = true;
        ground.material.transparencyMode = Material.MATERIAL_ALPHABLEND;
        ground.material.alpha = 0.0;
        this._groundShaderMaterial.setFloat("mapSidelength", mapSidelength);
    }

	public updateRevealerPositions(units: Unit[]) {
        const revealersX = []
        const revealersZ = []
        const revealersRadius = []
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

	public updateSelectedPositions() {
        
	}
}