import * as BABYLON from "./import/babylonImports";
import * as SOA from "./import/soaImports";

export class Jupiter {    
    public constructor(assetContainer: BABYLON.AssetContainer) {
        let cloneMaterialsAndDontShareThem = true;
        let instantiatedEntries = assetContainer.instantiateModelsToScene((name) => "p_" + name, cloneMaterialsAndDontShareThem);
        let jupiterMesh = instantiatedEntries.rootNodes[0] as BABYLON.Mesh;
        let scalingFactor = 10000.0;
        jupiterMesh.scaling.x = scalingFactor;
        jupiterMesh.scaling.y = scalingFactor;
        jupiterMesh.scaling.z = scalingFactor;
        jupiterMesh.position.x = scalingFactor * 1.5;
        jupiterMesh.position.y = scalingFactor * -0.35;
        jupiterMesh.position.z = scalingFactor * -1.0;
    }
}