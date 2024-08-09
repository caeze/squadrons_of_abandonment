import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class MainCamera {
    public camera: BABYLON.ArcRotateCamera;
    private prevRadius: number;
    private shakeIterationCounter: number;

    public constructor(canvas: HTMLElement, scene: BABYLON.Scene) {
        this.camera = new BABYLON.ArcRotateCamera("MainCamera", -Math.PI / 2, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene);
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
        this.camera.maxZ = 100000;
        this.camera.checkCollisions = true;
        this.camera.setTarget(BABYLON.Vector3.Zero());
        (this.camera.inputs.attached.pointers as BABYLON.ArcRotateCameraPointersInput).buttons = [1];
        this.camera.inputs.remove(this.camera.inputs.attached.keyboard);
        this.camera.wheelPrecision = 20.0;
        this.camera.attachControl(canvas, true);
        this.camera.checkCollisions = true;
        this.camera.layerMask = SOA.CameraLayerMask.MAIN;
        this.prevRadius = this.camera.radius;
        this.shakeIterationCounter = 0;
    }

    public runBeforeRender() {
        if (this.prevRadius != this.camera.radius) {
            let ratio = this.prevRadius / this.camera.radius;
            this.prevRadius = this.camera.radius;
            this.camera.panningSensibility *= ratio;
            this.camera.wheelPrecision *= ratio;
        }
    }

    public static shake(mainCamera: MainCamera) {
        let shakeDurationMs = 400;
        let shakeIntervalTimeMs = 20;
        mainCamera.shakeIterationCounter = 0;
        let timerId = setInterval(MainCamera.shakeImplementation, shakeIntervalTimeMs, mainCamera);
        setTimeout(MainCamera.cancelCameraShake, shakeDurationMs, timerId);
    }

    private static shakeImplementation(mainCamera: MainCamera) {
        mainCamera.shakeIterationCounter++;
        let maxDisplacement = mainCamera.camera.radius * 0.025 * 1 / mainCamera.shakeIterationCounter;
        let displacementX = maxDisplacement * (Math.random() - 0.5);
        let displacementY = 0.0;
        let displacementZ = maxDisplacement * (Math.random() - 0.5);
        let cameraPosition = new BABYLON.Vector3(mainCamera.camera.position.x, mainCamera.camera.position.y, mainCamera.camera.position.z);
        let cameraTarget = new BABYLON.Vector3(mainCamera.camera.getTarget().x, mainCamera.camera.getTarget().y, mainCamera.camera.getTarget().z);
        mainCamera.camera.position = new BABYLON.Vector3(cameraPosition.x + displacementX, cameraPosition.y + displacementY, cameraPosition.z + displacementZ);
        mainCamera.camera.setTarget(new BABYLON.Vector3(cameraTarget.x + displacementX, cameraTarget.y + displacementY, cameraTarget.z + displacementZ));
    }

    private static cancelCameraShake(timerId: number) {
        clearTimeout(timerId);
    }
}