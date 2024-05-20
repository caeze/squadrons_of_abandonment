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

import { CameraLayerMask } from "./CameraLayerMask";

class ImageButtonData {
    public onClick: () => void;
    public size: Vector2;
    public imageFilePath: string;
    public distanceLeft: number;
    public distanceTop: number;
    public distanceRight: number;
    public distanceBottom: number;
    public clickable: boolean;
    public textLineTop: string;
    public textLineBottom: string;
    
    public constructor(onClick: () => void, size: Vector2, imageFilePath: string, distanceLeft: number, distanceTop: number, distanceRight: number, distanceBottom: number, clickable: boolean = true, textLineTop: string = "", textLineBottom: string = "") {
        this.onClick = onClick;
        this.size = size;
        this.imageFilePath = imageFilePath;
        this.distanceLeft = distanceLeft;
        this.distanceTop = distanceTop;
        this.distanceRight = distanceRight;
        this.distanceBottom = distanceBottom;
        this.clickable = clickable;
        this.textLineTop = textLineTop;
        this.textLineBottom = textLineBottom;
    }
}

class ImageButtonWithOptionalTexts {
    public button: Button;
    public textTop?: TextBlock;
    public textBottom?: TextBlock;
    
    public constructor(button: Button, textTop?: TextBlock, textBottom?: TextBlock) {
        this.button = button;
        this.textTop = textTop;
        this.textBottom = textBottom;
    }
}

export class Gui {
    public advancedTexture: AdvancedDynamicTexture;
    private _buttonData: Record<string, ImageButtonData> = {};
    private _buttons: Record<string, ImageButtonWithOptionalTexts> = {};

    public constructor(currentUrl: string, canvasWidth: number, canvasHeight: number, buttonSize: number = 50, minimapSize: number = 300) {
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("Gui", undefined, undefined, Texture.NEAREST_NEAREST);
        this.advancedTexture.rootContainer.scaleX = window.devicePixelRatio;
        this.advancedTexture.rootContainer.scaleY = window.devicePixelRatio;
        if (this.advancedTexture._layerToDispose) {
            this.advancedTexture._layerToDispose.layerMask = CameraLayerMask.MAIN;
        }
        this.advancedTexture.isForeground = true;
        
        // Define the menu section.
        let onClickMenuImageButton = function () {
            alert("onClickMenuImageButton");
        };
        let menuImageButtonData = new ImageButtonData(onClickMenuImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", -1, 0, 0, -1);
        this._buttonData["menu"] = menuImageButtonData;
        
        // Define the info messages section.
        let onClickInfoMessage0ImageButton = function () {
            alert("onClickInfoMessage0ImageButton");
        };
        let infoMessage0ImageButtonData = new ImageButtonData(onClickInfoMessage0ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", 0, buttonSize * 4 + 100, -1, -1, true, "infoMessageTop0", "infoMessageBottom0");
        this._buttonData["infoMessage0"] = infoMessage0ImageButtonData;
        
        let onClickInfoMessage1ImageButton = function () {
            alert("onClickInfoMessage1ImageButton");
        };
        let infoMessage1ImageButtonData = new ImageButtonData(onClickInfoMessage1ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", 0, buttonSize * 3 + 100, -1, -1, true, "infoMessageTop1", "infoMessageBottom1");
        this._buttonData["infoMessage1"] = infoMessage1ImageButtonData;
        
        let onClickInfoMessage2ImageButton = function () {
            alert("onClickInfoMessage2ImageButton");
        };
        let infoMessage2ImageButtonData = new ImageButtonData(onClickInfoMessage2ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", 0, buttonSize * 2 + 100, -1, -1, true, "infoMessageTop2", "infoMessageBottom2");
        this._buttonData["infoMessage2"] = infoMessage2ImageButtonData;
        
        let onClickInfoMessage3ImageButton = function () {
            alert("onClickInfoMessage3ImageButton");
        };
        let infoMessage3ImageButtonData = new ImageButtonData(onClickInfoMessage3ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", 0, buttonSize + 100, -1, -1, true, "infoMessageTop3", "infoMessageBottom3");
        this._buttonData["infoMessage3"] = infoMessage3ImageButtonData;
        
        let onClickInfoMessage4ImageButton = function () {
            alert("onClickInfoMessage4ImageButton");
        };
        let infoMessage4ImageButtonData = new ImageButtonData(onClickInfoMessage4ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", 0, 100, -1, -1, true, "infoMessageTop4", "infoMessageBottom4");
        this._buttonData["infoMessage4"] = infoMessage4ImageButtonData;
        
        // Define the battlegroups section.
        let onClickBattlegroup0ImageButton = function () {
            alert("onClickBattlegroup0ImageButton");
        };
        let battlegroup0ImageButtonData = new ImageButtonData(onClickBattlegroup0ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", -1, buttonSize * 6 + 150, 0, -1);
        this._buttonData["battlegroup0"] = battlegroup0ImageButtonData;
        
        let onClickBattlegroup1ImageButton = function () {
            alert("onClickBattlegroup1ImageButton");
        };
        let battlegroup1ImageButtonData = new ImageButtonData(onClickBattlegroup1ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", -1, buttonSize * 5 + 150, 0, -1);
        this._buttonData["battlegroup1"] = battlegroup1ImageButtonData;
        
        let onClickBattlegroup2ImageButton = function () {
            alert("onClickBattlegroup2ImageButton");
        };
        let battlegroup2ImageButtonData = new ImageButtonData(onClickBattlegroup2ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", -1, buttonSize * 4 + 150, 0, -1);
        this._buttonData["battlegroup2"] = battlegroup2ImageButtonData;
        
        let onClickBattlegroup3ImageButton = function () {
            alert("onClickBattlegroup3ImageButton");
        };
        let battlegroup3ImageButtonData = new ImageButtonData(onClickBattlegroup3ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", -1, buttonSize * 3 + 150, 0, -1);
        this._buttonData["battlegroup3"] = battlegroup3ImageButtonData;
        
        let onClickBattlegroup4ImageButton = function () {
            alert("onClickBattlegroup4ImageButton");
        };
        let battlegroup4ImageButtonData = new ImageButtonData(onClickBattlegroup4ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", -1, buttonSize * 2 + 150, 0, -1);
        this._buttonData["battlegroup4"] = battlegroup4ImageButtonData;
        
        let onClickBattlegroup5ImageButton = function () {
            alert("onClickBattlegroup5ImageButton");
        };
        let battlegroup5ImageButtonData = new ImageButtonData(onClickBattlegroup5ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", -1, buttonSize + 150, 0, -1);
        this._buttonData["battlegroup5"] = battlegroup5ImageButtonData;
        
        let onClickBattlegroup6ImageButton = function () {
            alert("onClickBattlegroup6ImageButton");
        };
        let battlegroup6ImageButtonData = new ImageButtonData(onClickBattlegroup6ImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", -1, 150, 0, -1);
        this._buttonData["battlegroup6"] = battlegroup6ImageButtonData;
        
        // Define the map options section.
        let onClickOpenMapImageButton = function () {
            alert("onClickOpenMapImageButton");
        };
        let openMapImageButtonData = new ImageButtonData(onClickOpenMapImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", 0, -1, -1, minimapSize);
        this._buttonData["openMap"] = openMapImageButtonData;
        
        let onClickSetMarkerImageButton = function () {
            alert("onClickSetMarkerImageButton");
        };
        let setMarkerImageButtonData = new ImageButtonData(onClickSetMarkerImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", 0, -1, -1, minimapSize + buttonSize);
        this._buttonData["setMarker"] = setMarkerImageButtonData;
        
        let onClickChatImageButton = function () {
            alert("onClickChatImageButton");
        };
        let chatImageButtonData = new ImageButtonData(onClickChatImageButton, new Vector2(buttonSize, buttonSize), currentUrl + "/assets/img/buttons/undefined.png", 0, -1, -1, minimapSize + 2 * buttonSize, false);
        this._buttonData["chat"] = chatImageButtonData;
        
        // Add all buttons to the UI.
        this._buttons = this.createAllButtons(this._buttonData, canvasWidth, canvasHeight);
        
        // Add the ability progress bar.
        
        let progressBar = new Rectangle("abilityProgressBar");
        progressBar.background = 'black';
        progressBar.width = 20 + "px";
        progressBar.height = 20 + "px";
        progressBar.left = 20 + "px";
        progressBar.top = 20 + "px";
        progressBar.alpha = 1.0;
        progressBar.thickness = 0;
        progressBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        progressBar.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.advancedTexture.addControl(progressBar);
    }
    
    public updateGuiPositions(canvasWidth: number, canvasHeight: number) {
        for (let buttonName in this._buttons) {
            let buttonPosition = this.getButtonPosition(this._buttonData[buttonName], canvasWidth, canvasHeight);
            this._buttons[buttonName].button.left = buttonPosition.x + "px";
            this._buttons[buttonName].button.top = buttonPosition.y + "px";
            let textTop = this._buttons[buttonName].textTop;
            let textBottom = this._buttons[buttonName].textBottom;
            let [textPositionTop, textPositionCenter, textPositionBottom] = this.getTextPosition(this._buttonData[buttonName], canvasWidth, canvasHeight);
            if (textTop != undefined && textBottom != undefined) {
                textTop.left = textPositionTop.x + "px";
                textTop.top = textPositionTop.y + "px";
                textBottom.left = textPositionBottom.x + "px";
                textBottom.top = textPositionBottom.y + "px";
            } else if (textTop != undefined) {
                textTop.left = textPositionCenter.x + "px";
                textTop.top = textPositionCenter.y + "px";
            } 
        }
    }
    
    private createAllButtons(buttonData: Record<string, ImageButtonData>, canvasWidth: number, canvasHeight: number): Record<string, ImageButtonWithOptionalTexts> {
        let buttons: Record<string, ImageButtonWithOptionalTexts> = {}
        for (let buttonName in buttonData) {
            let button = this.createButtonFromButtonData(buttonName, buttonData[buttonName], canvasWidth, canvasHeight);
            this.advancedTexture.addControl(button.button);
            if (button.textTop) {
                this.advancedTexture.addControl(button.textTop);
            }
            if (button.textBottom) {
                this.advancedTexture.addControl(button.textBottom);
            }
            buttons[buttonName] = button;
        }
        return buttons;
    }
    
    private createButtonFromButtonData(buttonName: string, buttonData: ImageButtonData, canvasWidth: number, canvasHeight: number): ImageButtonWithOptionalTexts {
        let button = Button.CreateImageOnlyButton(buttonName, buttonData.imageFilePath);
        let buttonPosition = this.getButtonPosition(buttonData, canvasWidth, canvasHeight);
        button.width = buttonData.size.x + "px";
        button.height = buttonData.size.y + "px";
        button.left = buttonPosition.x + "px";
        button.top = buttonPosition.y + "px";
        button.thickness = 0;
        button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        if (buttonData.clickable) {
            button.onPointerEnterObservable.add(()=>{
                button.alpha = 0.75;
            });
            button.onPointerOutObservable.add(()=>{
                button.alpha = 1.0;
            });
            button.onPointerClickObservable.add(()=>{
                button.alpha = 1.0;
                buttonData.onClick();
            });
        } else {
            button.onPointerEnterObservable.clear();
            button.onPointerOutObservable.clear();
            button.onPointerClickObservable.clear();
        }
        let [textPositionTop, textPositionCenter, textPositionBottom] = this.getTextPosition(buttonData, canvasWidth, canvasHeight);
        if (buttonData.textLineTop != "" && buttonData.textLineBottom != "") {
            let textTop = new TextBlock();
            textTop.text = buttonData.textLineTop;
            textTop.left = textPositionTop.x + "px";
            textTop.top = textPositionTop.y + "px";
            textTop.color = "#ffffff";
            textTop.shadowColor = "#000000";
            textTop.shadowBlur = 4;
            textTop.shadowOffsetX = 1;
            textTop.shadowOffsetY = 1;
            textTop.fontSize = 18;
            textTop.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            textTop.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            let textBottom = new TextBlock();
            textBottom.text = buttonData.textLineBottom;
            textBottom.left = textPositionBottom.x + "px";
            textBottom.top = textPositionBottom.y + "px";
            textBottom.color = "#999999";
            textBottom.shadowColor = "#000000";
            textBottom.shadowBlur = 4;
            textBottom.shadowOffsetX = 1;
            textBottom.shadowOffsetY = 1;
            textBottom.fontSize = 18;
            textBottom.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            textBottom.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            return new ImageButtonWithOptionalTexts(button, textTop, textBottom);
        } else if (buttonData.textLineTop != "") {
            let textTop = new TextBlock();
            textTop.text = buttonData.textLineTop;
            textTop.left = textPositionCenter.x + "px";
            textTop.top = textPositionCenter.y + "px";
            textTop.color = "#ffffff";
            textTop.shadowColor = "#000000";
            textTop.shadowBlur = 4;
            textTop.shadowOffsetX = 1;
            textTop.shadowOffsetY = 1;
            textTop.fontSize = 18;
            textTop.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            textTop.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
            return new ImageButtonWithOptionalTexts(button, textTop);
        }
        return new ImageButtonWithOptionalTexts(button);
    }
    
    private getButtonPosition(buttonData: ImageButtonData, canvasWidth: number, canvasHeight: number): Vector2 {
        let buttonPositionX = 0;
        let buttonPositionY = 0;
        if (buttonData.distanceLeft >= 0) {
            buttonPositionX = buttonData.distanceLeft;
        }
        if (buttonData.distanceTop >= 0) {
            buttonPositionY = buttonData.distanceTop;
        }
        if (buttonData.distanceRight >= 0) {
            buttonPositionX = canvasWidth - buttonData.distanceRight - buttonData.size.x;
        }
        if (buttonData.distanceBottom >= 0) {
            buttonPositionY = canvasHeight - buttonData.distanceBottom - buttonData.size.y;
        }
        return new Vector2(buttonPositionX, buttonPositionY);
    }
    
    private getTextPosition(buttonData: ImageButtonData, canvasWidth: number, canvasHeight: number, offsetX: number = 4, offsetY: number = 4): [Vector2, Vector2, Vector2] {
        let textPositionX = 0;
        let textPositionY = 0;
        if (buttonData.distanceLeft >= 0) {
            textPositionX = buttonData.distanceLeft;
        }
        if (buttonData.distanceTop >= 0) {
            textPositionY = buttonData.distanceTop;
        }
        if (buttonData.distanceRight >= 0) {
            textPositionX = canvasWidth - buttonData.distanceRight - buttonData.size.x;
        }
        if (buttonData.distanceBottom >= 0) {
            textPositionY = canvasHeight - buttonData.distanceBottom - buttonData.size.y;
        }
        let textPositionTop = new Vector2(textPositionX + buttonData.size.x + offsetX, textPositionY + offsetY);
        let textPositionCenter = new Vector2(textPositionX + buttonData.size.x + offsetX, textPositionY + offsetY + 10);
        let textPositionBottom = new Vector2(textPositionX + buttonData.size.x + offsetX, textPositionY + offsetY + 20);
        return [textPositionTop, textPositionCenter, textPositionBottom];
    }
}