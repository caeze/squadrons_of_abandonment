import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class AmbientLight {
    public constructor(scene: BABYLON.Scene, intensity: number = 0.35, position: BABYLON.Vector3 = new BABYLON.Vector3(-3000, -3000, -3000)) {
        let hemisphericLight = new BABYLON.HemisphericLight("hemisphericLight", position, scene);
        hemisphericLight.intensity = intensity;
        hemisphericLight.range = 100000.0;
    }
}