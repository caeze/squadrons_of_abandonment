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

export class FogOfWarGround {
    public constructor(currentUrl: string, maxRevealers: number, maxRevealers: number) {
        let mapSidelength = 1000.0;
        let ground = MeshBuilder.CreatePlane("ground", {size: mapSidelength});
        let groundShaderMaterial = new ShaderMaterial(
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
                    "CurrentCount",
                    "revealersX",
                    "revealersZ",
                    "revealersRadius",
                    "mapSidelength"
                ],
                defines: ["#define MAX_REVEALERS " + int(maxRevealers)],
            }
        );
        ground.renderingGroupId = renderingGroupId_ground;
        ground.alphaIndex = 1;
        ground.rotation = new Vector3(Math.PI / 2, 0, 0);
        ground.material = groundShaderMaterial;
        ground.material.forceDepthWrite = true;
        ground.material.transparencyMode = Material.MATERIAL_ALPHABLEND;
        ground.material.alpha = 0.0;
        
        

        scene.registerBeforeRender(() => {
            entitys[0].mesh.position.x += 0.005;
            entitys[0].mesh.rotation.x += 0.005;
            entitys[0].mesh.rotation.y += 0.005;
            entitys[1].mesh.position.x -= 0.005;
            entitys[1].mesh.rotation.x += 0.005;
            entitys[1].mesh.rotation.y += 0.005;
            
            const revealersX = []
            const revealersZ = []
            const revealersRadius = []
            for(let i=0; i<entitys.length; ++i) {
                revealersX.push(entitys[i].mesh.position.x);
                revealersZ.push(entitys[i].mesh.position.z);
                revealersRadius.push(entitys[i].revealersRadius);
            }
            groundShaderMaterial.setFloats("revealersX", revealersX);
            groundShaderMaterial.setFloats("revealersZ", revealersZ);
            groundShaderMaterial.setFloats("revealersRadius", revealersRadius);
            groundShaderMaterial.setFloat("mapSidelength", mapSidelength);
    }
}