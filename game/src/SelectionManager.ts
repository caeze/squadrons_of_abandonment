// ------------- global imports -------------
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
AdvancedDynamicTexture,
Button,
Container,
Control,
InputText,
Rectangle,
TextBlock,
} from "@babylonjs/gui/2D";
import {
AbstractMesh,
ArcRotateCamera,
ArcRotateCameraPointersInput,
AssetContainer,
AssetsManager,
BoundingInfo,
BoxParticleEmitter,
Camera,
Color3,
Color4,
ColorCurves,
Constants,
CSG,
CubeTexture,
DefaultLoadingScreen,
DefaultRenderingPipeline,
DepthOfFieldEffectBlurLevel,
DirectionalLight,
Effect,
Engine,
FreeCamera,
HemisphericLight,
HighlightLayer,
ImageProcessingPostProcess,
InstancedMesh,
IParticleSystem,
Layer,
LensFlare,
LensFlareSystem,
Material,
MaterialPluginBase,
Matrix,
Mesh,
MeshAssetTask,
MeshBuilder,
NoiseProceduralTexture,
ParticleHelper,
ParticleSystem,
ParticleSystemSet,
PassPostProcess,
Plane,
PointLight,
PointerEventTypes,
PostProcess,
Quaternion,
RegisterMaterialPlugin,
RenderTargetTexture,
Scene,
SceneLoader,
ShaderMaterial,
SphereParticleEmitter,
StandardMaterial,
TextFileAssetTask,
Texture,
Tools,
TransformNode,
UniversalCamera,
Vector2,
Vector3,
Vector4,
VertexBuffer,
VertexData,
Viewport,
VolumetricLightScatteringPostProcess,
WebGPUEngine,
} from "@babylonjs/core";
// ----------- global imports end -----------

import { Entity } from "./Entity";
import { MouseSelectionBoxOnGui } from "./MouseSelectionBoxOnGui";
import { SquadronsOfAbandonement } from "./SquadronsOfAbandonement";

export class SelectionManager {
    private _selectedEntitiesCallbackFunction: (entities: Entity[]) => void;
    private _pickInScenePosition: (position: Vector2) => Entity[];
    private _pickInSceneBox: (topLeftPosition: Vector2, bottomRightPosition: Vector2) => Entity[];
    private _mouseSelectionBoxOnGui: MouseSelectionBoxOnGui;
    private _lastMousePosition: Vector2;
    
    public constructor(engine: Engine, scene: Scene, camera: Camera, getAllEntitiesFunction: () => Entity[], selectedEntitiesCallbackFunction: (entities: Entity[]) => void, advancedTexture: AdvancedDynamicTexture) {
        this._selectedEntitiesCallbackFunction = selectedEntitiesCallbackFunction;
        this._pickInScenePosition = (position: Vector2) => {
            return this._pickInScenePositionImpl(scene, camera, position, getAllEntitiesFunction());
        }
        this._pickInSceneBox = (topLeftPosition: Vector2, bottomRightPosition: Vector2) => {
            return this._pickInSceneBoxImpl(engine, camera, topLeftPosition, bottomRightPosition, getAllEntitiesFunction());
        }
        this._mouseSelectionBoxOnGui = new MouseSelectionBoxOnGui(advancedTexture);
        this._lastMousePosition = new Vector2(-1000000, -1000000);
    }
    
    public onMouseMove(newMousePosition: Vector2, eventDataType: PointerEventTypes, mouseButtonId: number) {
        if (eventDataType === PointerEventTypes.POINTERDOWN && mouseButtonId == 0) {
            this._lastMousePosition = newMousePosition;
            this._selectViaClick(newMousePosition);
        } else if (eventDataType === PointerEventTypes.POINTERMOVE) {
            if (this._lastMousePosition.x != -1000000 && this._lastMousePosition.y != -1000000) {
                const minX = Math.min(this._lastMousePosition.x, newMousePosition.x);
                const minY = Math.min(this._lastMousePosition.y, newMousePosition.y);
                const maxX = Math.max(this._lastMousePosition.x, newMousePosition.x);
                const maxY = Math.max(this._lastMousePosition.y, newMousePosition.y);
                let topLeftPosPx = new Vector2(minX, minY);
                let bottomRightPosPx = new Vector2(maxX, maxY);
                this._mouseSelectionBoxOnGui.updateSelectionBoxOnGui(topLeftPosPx, bottomRightPosPx);
                this._selectViaBox(topLeftPosPx, bottomRightPosPx);
            } else {
                this._selectViaPosition(newMousePosition);
            }
        } else if (eventDataType === PointerEventTypes.POINTERUP && mouseButtonId == 0) {
            this._lastMousePosition = new Vector2(-1000000, -1000000);
            this._mouseSelectionBoxOnGui.hideSelectionBoxOnGui();
        }
    }

    private _selectViaClick(mousePosition: Vector2) {
        let entities = this._pickInScenePosition(mousePosition);
        this._selectedEntitiesCallbackFunction(entities);
        //console.log("_selectViaClick", entities);
    }

    private _selectViaPosition(mousePosition: Vector2) {
        let entities = this._pickInScenePosition(mousePosition);
        this._selectedEntitiesCallbackFunction(entities);
        //console.log("_selectViaPosition", entities);
    }
    
    private _selectViaBox(topLeftPosition: Vector2, bottomRightPosition: Vector2) {
        let entities = this._pickInSceneBox(topLeftPosition, bottomRightPosition);
        this._selectedEntitiesCallbackFunction(entities);
        //console.log("_selectViaBox", entities);
    }
    
    private _pickInScenePositionImpl(scene: Scene, camera: Camera, position: Vector2, allEntities: Entity[]): Entity[] {
        let selectedEntities: Entity[] = [];
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
    
    private _pickInSceneBoxImpl(engine: Engine, camera: Camera, topLeftPosition: Vector2, bottomRightPosition: Vector2, allEntities: Entity[]): Entity[] {
        let selectedEntities: Entity[] = [];
        for (let i = 0; i < allEntities.length; i++) {
            let entityMesh = allEntities[i].getMainMesh();
            let boundingBoxCorners = entityMesh.getBoundingInfo().boundingBox.vectorsWorld;
            boundingBoxCorners.push(entityMesh.getBoundingInfo().boundingBox.centerWorld);
            for (let j = 0; j < boundingBoxCorners.length; j++) {
                let [screenPos, depth] = SquadronsOfAbandonement.project(boundingBoxCorners[j], engine, camera);
                if (topLeftPosition.x < screenPos.x && bottomRightPosition.x > screenPos.x && topLeftPosition.y < screenPos.y && bottomRightPosition.y > screenPos.y) {
                    selectedEntities.push(allEntities[i]);
                    break;
                }
            }
        }
        return selectedEntities;
    }
}