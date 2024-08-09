import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class Skybox {
    public constructor(scene: BABYLON.Scene, currentUrl: string) {
        let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 100000.0 }, scene);
        let skyboxMaterial = new BABYLON.StandardMaterial("skyBoxStandardMaterial", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(currentUrl + "assets/img/skybox/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        skybox.renderingGroupId = SOA.RenderingGroupId.SKYBOX;
        skybox.layerMask = SOA.CameraLayerMask.MAIN;
    }
}