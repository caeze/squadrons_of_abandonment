// ------------- global imports -------------
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
AdvancedDynamicTexture,
Button,
Container,
Control,
Rectangle,
TextBlock,
} from "@babylonjs/gui/2D";
import {
AbstractMesh,
ArcRotateCamera,
ArcRotateCameraPointersInput,
AssetsManager,
BoxParticleEmitter,
Camera,
Color3,
Color4,
ColorCurves,
Constants,
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
MeshBuilder,
NoiseProceduralTexture,
ParticleHelper,
ParticleSystem,
ParticleSystemSet,
PassPostProcess,
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

export class SelectionManager {
    private _getAllEntitiesFunction: () => Entity[];
    private _selectedEntitiesCallbackFunction: (entities: Entity[]) => void;
    private _pickInScenePosition: (position: Vector2) => Entity[];
    private _pickInSceneBox: (topLeftPosition: Vector2, bottomRightPosition: Vector2) => Entity[];
    private _mouseSelectionBoxOnGui: MouseSelectionBoxOnGui;
    private _lastMousePosition: Vector2;
    
    public constructor(getAllEntitiesFunction: () => Entity[], selectedEntitiesCallbackFunction: (entities: Entity[]) => void, pickInScenePosition: (position: Vector2) => Entity[], pickInSceneBox: (topLeftPosition: Vector2, bottomRightPosition: Vector2) => Entity[], advancedTexture: AdvancedDynamicTexture) {
        this._getAllEntitiesFunction = getAllEntitiesFunction;
        this._selectedEntitiesCallbackFunction = selectedEntitiesCallbackFunction;
        this._pickInScenePosition = pickInScenePosition;
        this._pickInSceneBox = pickInSceneBox;
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
}