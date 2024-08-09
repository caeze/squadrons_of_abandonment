import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class ColorHighlightLayer {
    private _highlightLayer: BABYLON.HighlightLayer;

    public constructor(scene: BABYLON.Scene) {
        this._highlightLayer = new BABYLON.HighlightLayer("colorHighlightLayer", scene, { blurTextureSizeRatio: 0.25 });
    }

    public addMeshToHighlightLayer(mesh: BABYLON.Mesh, color: BABYLON.Color3) {
        this._highlightLayer.addMesh(mesh, color);
    }
}