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

enum ExplosionType {
  EXPLOSION = "EXPLOSION",
  FIRE = "FIRE",
  ORB_SPHERE = "ORB_SPHERE",
}

export class ExplosionEffect {
	private _currentUrl: string;
	private _camera: Camera;
    
    public constructor(camera: Camera, currentUrl: string) {
        this._camera = camera;
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
        let postProcess = new PostProcess("shockwavePostProcess", this._currentUrl + "/assets/shaders/shockwave", ["time", "center"], null, 1, this._camera);

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