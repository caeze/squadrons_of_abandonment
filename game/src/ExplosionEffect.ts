// ------------- global imports -------------
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { TextBlock, Control, Container, Rectangle, AdvancedDynamicTexture, Button } from "@babylonjs/gui/2D";
import { DepthOfFieldEffectBlurLevel, DefaultRenderingPipeline, Material, DefaultLoadingScreen, Quaternion, Tools, WebGPUEngine, Matrix, HighlightLayer, BoxParticleEmitter, NoiseProceduralTexture, DirectionalLight, AbstractMesh, PointLight, Camera, VolumetricLightScatteringPostProcess, SphereParticleEmitter, Color4, Constants, ParticleHelper, ParticleSystemSet, TransformNode, ParticleSystem, Engine, Scene, ArcRotateCamera, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, InstancedMesh, StandardMaterial, Texture, Vector2, Vector4 , Color3, SceneLoader, AssetsManager, ArcRotateCameraPointersInput, CubeTexture, RegisterMaterialPlugin, MaterialPluginBase, PostProcess, PassPostProcess, Effect, ShaderMaterial, RenderTargetTexture } from "@babylonjs/core";
// ----------- global imports end -----------

enum ExplosionType {
  EXPLOSION = "EXPLOSION",
  FIRE = "FIRE",
  ORB_SPHERE = "ORB_SPHERE",
}

export class ExplosionEffect {
	private _currentUrl: string;
    
    public constructor(currentUrl: string) {
        this._currentUrl = currentUrl;
    }

	public createExplosion() {
        /*ParticleHelper.CreateAsync("explosion", scene).then((a) => {
            a.start();
        });*/
	}

	public createFire() {
        /*ParticleHelper.CreateAsync("fire", scene).then((a) => {
            a.start();
        });
        ParticleHelper.CreateAsync("smoke", scene).then((a) => {
            //a.position.y = 2;
            a.start();
        });*/
	}

	public createOrb() {
	}

	public createShockwave() {
        let postProcess = new PostProcess("shockwavePostProcess", this._currentUrl + "/assets/shaders/shockwave", ["time", "center"], null, 1, camera);

        let t = 0.0;
        postProcess.onApply = function (effect) {
            t += 0.001;
            effect.setFloat("time", t);
            let centerX = Math.sin(3.14 / 2 + t * 100.0) / 2.0 + 0.5;
            let centerY = Math.cos(3.14 / 2 + t * 100.0) / 2.0 + 0.5;
            effect.setVector2("center", new Vector2(centerX, centerY));
        };
        
        
        /*let postProcess2 = new PostProcess("shockwavePostProcess2", this._currentUrl + "/assets/shaders/shockwave", ["time", "center"], null, 1, camera);

        let t2 = 0.3;
        postProcess.onApply = function (effect) {
            t2 += 0.001;
            effect.setFloat("time", t2);
            let centerX = 0.5;
            let centerY = 0.5;
            effect.setVector2("center", new Vector2(centerX, centerY));
        };*/
	}
}