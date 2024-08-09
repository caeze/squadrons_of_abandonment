import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class Minimap {
    public minimapCamera: BABYLON.UniversalCamera;

    public constructor(scene: BABYLON.Scene, camera: BABYLON.Camera, engine: BABYLON.Engine, currentUrl: string, mapSidelength: number) {
        this.minimapCamera = new BABYLON.UniversalCamera("minimapCamera", new BABYLON.Vector3(0, 20, 0), scene);
        this.minimapCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this.minimapCamera.minZ = 0.1;
        this.minimapCamera.setTarget(BABYLON.Vector3.Zero());
        let minimapCameraViewportMarginFactor = 1.05;
        let minimapCameraViewport = mapSidelength / 2.0 * minimapCameraViewportMarginFactor;
        this.minimapCamera.orthoTop = -minimapCameraViewport;
        this.minimapCamera.orthoBottom = minimapCameraViewport;
        this.minimapCamera.orthoLeft = minimapCameraViewport;
        this.minimapCamera.orthoRight = -minimapCameraViewport;
        this.minimapCamera.layerMask = SOA.CameraLayerMask.MINIMAP;
        this.resize(window.innerWidth, window.innerHeight);
        let minimapBackgroundLayer = new BABYLON.Layer("minimapBackgroundLayer", currentUrl + "assets/img/minimapBackground.png", scene, true);
        minimapBackgroundLayer.layerMask = SOA.CameraLayerMask.MINIMAP;
    }

    public resize(windowInnerWidthPx: number, windowInnerHeightPx: number) {
        let targetWidthPx = 300;
        let targetHeightPx = 300;
        this.minimapCamera.viewport = new BABYLON.Viewport(0.0, 0.0, targetWidthPx / windowInnerWidthPx, targetHeightPx / windowInnerHeightPx);
    }
}