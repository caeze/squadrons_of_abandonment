import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class SelectionManager {
    private _selectedEntitiesCallbackFunction: (entities: SOA.Entity[]) => void;
    private _pickInScenePosition: (position: BABYLON.Vector2) => SOA.Entity[];
    private _pickInSceneBox: (topLeftPosition: BABYLON.Vector2, bottomRightPosition: BABYLON.Vector2) => SOA.Entity[];
    private _mouseSelectionBoxOnGui: SOA.MouseSelectionBoxOnGui;
    private _lastMousePosition: BABYLON.Vector2;

    public constructor(engine: BABYLON.Engine, scene: BABYLON.Scene, camera: BABYLON.Camera, getAllEntitiesFunction: () => SOA.Entity[], selectedEntitiesCallbackFunction: (entities: SOA.Entity[]) => void, advancedTexture: BABYLON_GUI.AdvancedDynamicTexture) {
        this._selectedEntitiesCallbackFunction = selectedEntitiesCallbackFunction;
        this._pickInScenePosition = (position: BABYLON.Vector2) => {
            return this._pickInScenePositionImpl(scene, camera, position, getAllEntitiesFunction());
        }
        this._pickInSceneBox = (topLeftPosition: BABYLON.Vector2, bottomRightPosition: BABYLON.Vector2) => {
            return this._pickInSceneBoxImpl(engine, camera, topLeftPosition, bottomRightPosition, getAllEntitiesFunction());
        }
        this._mouseSelectionBoxOnGui = new SOA.MouseSelectionBoxOnGui(advancedTexture);
        this._lastMousePosition = new BABYLON.Vector2(-1000000, -1000000);
    }

    public onMouseMove(newMousePosition: BABYLON.Vector2, eventDataType: BABYLON.PointerEventTypes, mouseButtonId: number) {
        if (eventDataType === BABYLON.PointerEventTypes.POINTERDOWN && mouseButtonId == 0) {
            this._lastMousePosition = newMousePosition;
            this._selectViaClick(newMousePosition);
        } else if (eventDataType === BABYLON.PointerEventTypes.POINTERMOVE) {
            if (this._lastMousePosition.x != -1000000 && this._lastMousePosition.y != -1000000) {
                const minX = Math.min(this._lastMousePosition.x, newMousePosition.x);
                const minY = Math.min(this._lastMousePosition.y, newMousePosition.y);
                const maxX = Math.max(this._lastMousePosition.x, newMousePosition.x);
                const maxY = Math.max(this._lastMousePosition.y, newMousePosition.y);
                let topLeftPosPx = new BABYLON.Vector2(minX, minY);
                let bottomRightPosPx = new BABYLON.Vector2(maxX, maxY);
                this._mouseSelectionBoxOnGui.updateSelectionBoxOnGui(topLeftPosPx, bottomRightPosPx);
                this._selectViaBox(topLeftPosPx, bottomRightPosPx);
            } else {
                this._selectViaPosition(newMousePosition);
            }
        } else if (eventDataType === BABYLON.PointerEventTypes.POINTERUP && mouseButtonId == 0) {
            this._lastMousePosition = new BABYLON.Vector2(-1000000, -1000000);
            this._mouseSelectionBoxOnGui.hideSelectionBoxOnGui();
        }
    }

    private _selectViaClick(mousePosition: BABYLON.Vector2) {
        let entities = this._pickInScenePosition(mousePosition);
        this._selectedEntitiesCallbackFunction(entities);
        //console.log("_selectViaClick", entities);
    }

    private _selectViaPosition(mousePosition: BABYLON.Vector2) {
        let entities = this._pickInScenePosition(mousePosition);
        this._selectedEntitiesCallbackFunction(entities);
        //console.log("_selectViaPosition", entities);
    }

    private _selectViaBox(topLeftPosition: BABYLON.Vector2, bottomRightPosition: BABYLON.Vector2) {
        let entities = this._pickInSceneBox(topLeftPosition, bottomRightPosition);
        this._selectedEntitiesCallbackFunction(entities);
        //console.log("_selectViaBox", entities);
    }

    private _pickInScenePositionImpl(scene: BABYLON.Scene, camera: BABYLON.Camera, position: BABYLON.Vector2, allEntities: SOA.Entity[]): SOA.Entity[] {
        let selectedEntities: SOA.Entity[] = [];
        let fastCheck = false;
        let pickResult = scene.pick(position.x, position.y, undefined, fastCheck, camera);
        if (pickResult.hit && pickResult.pickedMesh != null) {
            for (let i = 0; i < allEntities.length; i++) {
                let entityMesh = allEntities[i].getMainMesh();
                if (pickResult.pickedMesh.uniqueId == entityMesh.uniqueId) {
                    selectedEntities.push(allEntities[i]);
                    break;
                }
            }
        }
        return selectedEntities;
    }

    private _pickInSceneBoxImpl(engine: BABYLON.Engine, camera: BABYLON.Camera, topLeftPosition: BABYLON.Vector2, bottomRightPosition: BABYLON.Vector2, allEntities: SOA.Entity[]): SOA.Entity[] {
        let selectedEntities: SOA.Entity[] = [];
        for (let i = 0; i < allEntities.length; i++) {
            let entityMesh = allEntities[i].getMainMesh();
            let boundingBoxCorners = entityMesh.getBoundingInfo().boundingBox.vectorsWorld;
            boundingBoxCorners.push(entityMesh.getBoundingInfo().boundingBox.centerWorld);
            for (let j = 0; j < boundingBoxCorners.length; j++) {
                let [screenPos, depth] = SOA.SquadronsOfAbandonement.project(boundingBoxCorners[j], engine, camera);
                if (topLeftPosition.x < screenPos.x && bottomRightPosition.x > screenPos.x && topLeftPosition.y < screenPos.y && bottomRightPosition.y > screenPos.y) {
                    selectedEntities.push(allEntities[i]);
                    break;
                }
            }
        }
        return selectedEntities;
    }
}