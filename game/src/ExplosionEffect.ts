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
import { MainCamera } from "./MainCamera";

enum ExplosionType {
  EXPLOSION = "EXPLOSION",
  FIRE = "FIRE",
  ORB_SPHERE = "ORB_SPHERE",
}

export class ShockwaveEffectHandler {
	private _ticksCtr: number;
	private _tickFunction: (effect: any, time: number) => void;
	private _camera: Camera;
	private _timeScale: number;
    
    public constructor(tickFunction: (effect: any, time: number) => void, camera: Camera, timeScale: number = 0.005) {
        // TODO: scale effect by camera radius
        this._ticksCtr = 17;
        this._tickFunction = tickFunction;
        this._camera = camera;
        this._timeScale = timeScale;
    }
    
    public tick(effect: any) {
        this._ticksCtr++;
        effect.setFloat("time", this._ticksCtr * this._timeScale);
        this._tickFunction(effect, this._ticksCtr * this._timeScale);
    }
}

export class ExplosionEffect {
	private _currentUrl: string;
	private _camera: Camera;
	private _explosionParticleEffect?: ParticleSystemSet;
    
    public constructor(camera: Camera, scene: Scene, currentUrl: string) {
        this._camera = camera;
        this._currentUrl = currentUrl;
        ParticleHelper.CreateAsync("explosion", scene).then((p) => {
            this._explosionParticleEffect = p;
        })
    }
    
	public createExplosionWithShockwave(name: string, position: Vector3, engine: Engine, mainCamera: MainCamera, projectionFunction: (worldPosition: Vector3, engine: Engine, camera: Camera) => [Vector2, number], disposeAfterMs: number = 2500) {
        let explosionTick = function (effect: any, time: number) {
            let [screenPos, depth] = projectionFunction(position, engine, mainCamera.camera);
            let screenPosRelative = new Vector2(screenPos.x / window.innerWidth, 1.0 - (screenPos.y / window.innerHeight));
            effect.setVector2("center", screenPosRelative);
        };
        this.createShockwave(name, mainCamera.camera, new ShockwaveEffectHandler(explosionTick, mainCamera.camera));
        this.createExplosion(position);
        MainCamera.shake(mainCamera);
	}

	public createExplosion(position: Vector3) {
        if (this._explosionParticleEffect) {
            let particleSystems: IParticleSystem[] = this._explosionParticleEffect.systems;
            for (let i = 0; i < particleSystems.length; i++) {
                particleSystems[i].emitter = new Vector3(position.x, position.y, position.z);
                particleSystems[i].renderingGroupId = RenderingGroupId.MAIN;
                particleSystems[i].layerMask = CameraLayerMask.MAIN;
                particleSystems[i].blendMode = ParticleSystem.BLENDMODE_MULTIPLYADD;
            }
            this._explosionParticleEffect.start();
        }
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

	public createShockwave(name: string, camera: Camera, shockwaveEffectHandler: ShockwaveEffectHandler, disposeAfterMs: number = 2500) {
        // Coordinate system is from screen_bottom_left = [0, 0]
        // to screen_top_right = [1, 1]
        let postProcess = new PostProcess(name, this._currentUrl + "/assets/shaders/shockwave", ["time", "center"], null, 1, this._camera);
        postProcess.onApply = function (effect: any) {
            shockwaveEffectHandler.tick(effect);
        };
        let disposeFunction = function () {
            postProcess.dispose(camera);
        };
        setTimeout(disposeFunction, disposeAfterMs);
	}
}