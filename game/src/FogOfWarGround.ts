// ------------- global imports -------------
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { TextBlock, Control, Container, Rectangle, AdvancedDynamicTexture, Button } from "@babylonjs/gui/2D";
import { DepthOfFieldEffectBlurLevel, DefaultRenderingPipeline, Material, DefaultLoadingScreen, Quaternion, Tools, WebGPUEngine, Matrix, HighlightLayer, BoxParticleEmitter, NoiseProceduralTexture, DirectionalLight, AbstractMesh, PointLight, Camera, VolumetricLightScatteringPostProcess, SphereParticleEmitter, Color4, Constants, ParticleHelper, ParticleSystemSet, TransformNode, ParticleSystem, Engine, Scene, ArcRotateCamera, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, InstancedMesh, StandardMaterial, Texture, Vector2, Vector4 , Color3, SceneLoader, AssetsManager, ArcRotateCameraPointersInput, CubeTexture, RegisterMaterialPlugin, MaterialPluginBase, PostProcess, PassPostProcess, Effect, ShaderMaterial, RenderTargetTexture } from "@babylonjs/core";
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