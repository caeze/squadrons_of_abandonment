import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { BoxParticleEmitter, NoiseProceduralTexture, DirectionalLight, AbstractMesh, PointLight, Camera, VolumetricLightScatteringPostProcess, SphereParticleEmitter, Color4, Constants, ParticleHelper, ParticleSystemSet, TransformNode, ParticleSystem, Engine, Scene, ArcRotateCamera, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, InstancedMesh, StandardMaterial, Texture, Vector2, Vector4 , Color3, SceneLoader, AssetsManager, ArcRotateCameraPointersInput, CubeTexture, RegisterMaterialPlugin, MaterialPluginBase, PostProcess, PassPostProcess, Effect, ShaderMaterial, RenderTargetTexture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button } from '@babylonjs/gui/2D';

export class MainCamera {
    private camera: ArcRotateCamera;
    private prevRadius: number;

    public constructor(canvas: HTMLElement, scene: Scene) {
        this.camera = new ArcRotateCamera("MainCamera", -Math.PI / 2, Math.PI / 4, 4, Vector3.Zero(), scene);
        this.camera.allowUpsideDown = false;
        this.camera.lowerBetaLimit = 0.0;
        this.camera.upperBetaLimit = Math.PI / 2.0 - 0.01;
        this.camera.lowerRadiusLimit = 1.0;
        this.camera.upperRadiusLimit = 100.0;
        this.camera.angularSensibilityX = 2500.0; // mouse camera rotate speed
        this.camera.angularSensibilityY = 2500.0;
        this.camera.panningSensibility = 4000.0; // mouse move camera speed
        this.camera.wheelDeltaPercentage = 0.0;
        this.camera.inertia = 0.7;
        this.camera.minZ = 0.5;
        this.camera.checkCollisions = true;
        this.camera.setTarget(Vector3.Zero());
        (this.camera.inputs.attached.pointers as ArcRotateCameraPointersInput).buttons = [1];
        this.camera.inputs.remove(this.camera.inputs.attached.keyboard);
        this.prevRadius = this.camera.radius;
        this.camera.wheelPrecision = 20.0;
        this.camera.attachControl(canvas, true);
        this.camera.checkCollisions = true;
    }
    
    public getCamera(): ArcRotateCamera {
        return this.camera;
    }
    
    public runBeforeRender() {
        if (this.prevRadius != this.camera.radius) {
            let ratio = this.prevRadius / this.camera.radius;
            this.prevRadius = this.camera.radius;
            this.camera.panningSensibility *= ratio;
            this.camera.wheelPrecision *= ratio;
        }
    }
}