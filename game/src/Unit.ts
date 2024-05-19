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

import { Entity } from "./Entity";
import { RenderingGroupId } from "./RenderingGroupId";

export class Unit extends Entity {
    public radius: number;
    
    public constructor(scene: Scene, initialPosition: Vector3, name: string, radius: number) {
        super(scene, MeshBuilder.CreateBox(name, {size: 0.5}, scene));
        this.radius = radius;
        this.mesh.renderingGroupId = RenderingGroupId.EVERYTHING;
        this.mesh.position = initialPosition;
    }
}