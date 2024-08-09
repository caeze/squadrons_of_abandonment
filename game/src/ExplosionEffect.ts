import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

enum ExplosionType {
    EXPLOSION = "EXPLOSION",
    FIRE = "FIRE",
    ORB_SPHERE = "ORB_SPHERE",
}

export class ShockwaveEffectHandler {
    private _ticksCtr: number;
    private _tickFunction: (effect: any, time: number) => void;
    private _timeScale: number;

    public constructor(tickFunction: (effect: any, time: number) => void, timeScale: number = 0.005) {
        // TODO: scale effect by camera radius
        this._ticksCtr = 17;
        this._tickFunction = tickFunction;
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
    private _camera: BABYLON.Camera;
    private _explosionParticleEffect?: BABYLON.ParticleSystemSet;

    public constructor(camera: BABYLON.Camera, scene: BABYLON.Scene, currentUrl: string) {
        this._camera = camera;
        this._currentUrl = currentUrl;
        BABYLON.ParticleHelper.CreateAsync("explosion", scene).then((p) => {
            this._explosionParticleEffect = p;
        })
    }

    public createExplosionWithShockwave(name: string, position: BABYLON.Vector3, engine: BABYLON.Engine, mainCamera: SOA.MainCamera, projectionFunction: (worldPosition: BABYLON.Vector3, engine: BABYLON.Engine, camera: BABYLON.Camera) => [BABYLON.Vector2, number], disposeAfterMs: number = 2500) {
        let explosionTick = function (effect: any, time: number) {
            let [screenPos, depth] = projectionFunction(position, engine, mainCamera.camera);
            let screenPosRelative = new BABYLON.Vector2(screenPos.x / window.innerWidth, 1.0 - (screenPos.y / window.innerHeight));
            effect.setVector2("center", screenPosRelative);
        };
        this.createShockwave(name, mainCamera.camera, new ShockwaveEffectHandler(explosionTick));
        this.createExplosion(position);
        SOA.MainCamera.shake(mainCamera);
    }

    public createExplosion(position: BABYLON.Vector3) {
        if (this._explosionParticleEffect) {
            let particleSystems: BABYLON.IParticleSystem[] = this._explosionParticleEffect.systems;
            for (let i = 0; i < particleSystems.length; i++) {
                particleSystems[i].emitter = new BABYLON.Vector3(position.x, position.y, position.z);
                particleSystems[i].renderingGroupId = SOA.RenderingGroupId.MAIN;
                particleSystems[i].layerMask = SOA.CameraLayerMask.MAIN;
                particleSystems[i].blendMode = BABYLON.ParticleSystem.BLENDMODE_MULTIPLYADD;
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

    public createShockwave(name: string, camera: BABYLON.Camera, shockwaveEffectHandler: ShockwaveEffectHandler, disposeAfterMs: number = 2500) {
        // Coordinate system is from screen_bottom_left = [0, 0]
        // to screen_top_right = [1, 1]
        let postProcess = new BABYLON.PostProcess(name, this._currentUrl + "assets/shaders/shockwave", ["time", "center"], null, 1, this._camera);
        postProcess.onApply = function (effect: any) {
            shockwaveEffectHandler.tick(effect);
        };
        let disposeFunction = function () {
            postProcess.dispose(camera);
        };
        setTimeout(disposeFunction, disposeAfterMs);
    }
}