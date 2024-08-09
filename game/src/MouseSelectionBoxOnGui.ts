import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class MouseSelectionBoxOnGui {
    private _selectionRectangle: BABYLON_GUI.Rectangle;

    public constructor(advancedTexture: BABYLON_GUI.AdvancedDynamicTexture) {
        this._selectionRectangle = new BABYLON_GUI.Rectangle();
        this._selectionRectangle.width = "40px";
        this._selectionRectangle.height = "40px";
        this._selectionRectangle.color = "#00ff0000";
        this._selectionRectangle.thickness = 3;
        this._selectionRectangle.zIndex = 1;
        this._selectionRectangle.verticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this._selectionRectangle.horizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        advancedTexture.addControl(this._selectionRectangle);
    }

    public updateSelectionBoxOnGui(topLeft: BABYLON.Vector2, bottomRight: BABYLON.Vector2) {
        let left = topLeft.x;
        let top = topLeft.y;
        let width = bottomRight.x - left;
        let height = bottomRight.y - top;
        this._selectionRectangle.color = "#00ff00ff";
        this._selectionRectangle.left = `${left}px`;
        this._selectionRectangle.top = `${top}px`;
        this._selectionRectangle.width = `${width}px`;
        this._selectionRectangle.height = `${height}px;`;
    }

    public hideSelectionBoxOnGui() {
        this._selectionRectangle.color = "#00ff0000";
    }
}