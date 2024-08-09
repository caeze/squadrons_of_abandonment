import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class Planet {
    public constructor(assetContainer: BABYLON.AssetContainer, position: BABYLON.Vector3 = new BABYLON.Vector3(1.5, -0.35, -1.0), scalingFactor: number = 10000.0) {
        let cloneMaterialsAndDontShareThem = true;
        let instantiatedEntries = assetContainer.instantiateModelsToScene((name) => "p_" + name, cloneMaterialsAndDontShareThem);
        let planetMesh = instantiatedEntries.rootNodes[0] as BABYLON.Mesh;
        planetMesh.scaling.x = scalingFactor;
        planetMesh.scaling.y = scalingFactor;
        planetMesh.scaling.z = scalingFactor;
        planetMesh.position.x = scalingFactor * position.x;
        planetMesh.position.y = scalingFactor * position.y;
        planetMesh.position.z = scalingFactor * position.z;
    }
}