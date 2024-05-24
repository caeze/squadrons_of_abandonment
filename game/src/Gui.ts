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

class ProgressBar {
    public background: Rectangle;
    public foreground: Rectangle;
    public progress: number;
    public progressBarLtrb: Vector4;
    public size: Vector2;
    
    public constructor(background: Rectangle, foreground: Rectangle, progress: number, progressBarLtrb: Vector4, size: Vector2) {
        this.background = background;
        this.foreground = foreground;
        this.progress = progress;
        this.progressBarLtrb = progressBarLtrb;
        this.size = size;
    }
}

export class Gui {
    public advancedTexture: AdvancedDynamicTexture;
    private _buttonData: Record<string, ImageButtonData> = {};
    private _buttons: Record<string, ImageButtonWithOptionalTexts> = {};
    private _abilityProgressBar: ProgressBar;

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
        let abilityProgressBarSize = new Vector2(3 * buttonSize, 20);
        let abilityProgressBarLtrb = new Vector4(470, -1, -1, 50);
        let [abilityProgressBarBackground, abilityProgressBarForeground] = this.createProgressBar("abilityProgressBar2", abilityProgressBarLtrb, "#00ff00", abilityProgressBarSize, canvasWidth, canvasHeight);
        this._abilityProgressBar = new ProgressBar(abilityProgressBarBackground, abilityProgressBarForeground, 0, abilityProgressBarLtrb, abilityProgressBarSize);
        this.setAbilityProgress(0);
        
        // Add the chat box.
    }
    
    public updateGuiPositions(canvasWidth: number, canvasHeight: number) {
        // Update the button positions.
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
        
        // Update the ability progress bar position.
        let progressBarPosition = this.getPosition(this._abilityProgressBar.progressBarLtrb, this._abilityProgressBar.size, canvasWidth, canvasHeight);
        this._abilityProgressBar.background.left = progressBarPosition.x + "px";
        this._abilityProgressBar.background.top = progressBarPosition.y + "px";
        this._abilityProgressBar.foreground.left = progressBarPosition.x + "px";
        this._abilityProgressBar.foreground.top = progressBarPosition.y + "px";
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
        button.zIndex = 10;
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
            textTop.zIndex = 10;
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
            textBottom.zIndex = 10;
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
            textTop.zIndex = 10;
            return new ImageButtonWithOptionalTexts(button, textTop);
        }
        return new ImageButtonWithOptionalTexts(button);
    }
    
    private createProgressBar(progressBarName: string, progressBarLtrb: Vector4, color: string, progressBarSize: Vector2, canvasWidth: number, canvasHeight: number): [Rectangle, Rectangle] {
        let progressBarPosition = this.getPosition(progressBarLtrb, progressBarSize, canvasWidth, canvasHeight);
        let progressBarBackground = new Rectangle(progressBarName + "Background");
        progressBarBackground.width = progressBarSize.x + "px";
        progressBarBackground.height = progressBarSize.y + "px";
        progressBarBackground.left = progressBarPosition.x + "px";
        progressBarBackground.top = progressBarPosition.y + "px";
        progressBarBackground.background = "#555555";
        progressBarBackground.alpha = 1.0;
        progressBarBackground.thickness = 0;
        progressBarBackground.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        progressBarBackground.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        progressBarBackground.zIndex = 10;
        this.advancedTexture.addControl(progressBarBackground);
        let progressBarForeground = new Rectangle(progressBarName + "BarForeground");
        progressBarForeground.width = progressBarSize.x + "px";
        progressBarForeground.height = progressBarSize.y + "px";
        progressBarForeground.left = progressBarPosition.x + "px";
        progressBarForeground.top = progressBarPosition.y + "px";
        progressBarForeground.background = color;
        progressBarForeground.alpha = 1.0;
        progressBarForeground.thickness = 0;
        progressBarForeground.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        progressBarForeground.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        progressBarForeground.zIndex = 10;
        this.advancedTexture.addControl(progressBarForeground);
        return [progressBarBackground, progressBarForeground];
    }
    
    public setAbilityProgress(newProgress: number) {
        this.updateProgressBarProgress(this._abilityProgressBar, newProgress);
    }
    
    public updateProgressBarProgress(progressBar: ProgressBar, newProgress: number) {
        progressBar.progress = Math.min(Math.max(newProgress, 0.0), 1.0);
        progressBar.foreground.width = (progressBar.size.x * progressBar.progress) + "px";
    }
    
    private getButtonPosition(buttonData: ImageButtonData, canvasWidth: number, canvasHeight: number): Vector2 {
        return this.getPosition(new Vector4(buttonData.distanceLeft, buttonData.distanceTop, buttonData.distanceRight, buttonData.distanceBottom), new Vector2(buttonData.size.x, buttonData.size.y), canvasWidth, canvasHeight);
    }
    
    private getTextPosition(buttonData: ImageButtonData, canvasWidth: number, canvasHeight: number, offsetX: number = 4, offsetY: number = 4): [Vector2, Vector2, Vector2] {
        let textPosition = this.getPosition(new Vector4(buttonData.distanceLeft, buttonData.distanceTop, buttonData.distanceRight, buttonData.distanceBottom), new Vector2(buttonData.size.x, buttonData.size.y), canvasWidth, canvasHeight);
        let textPositionTop = new Vector2(textPosition.x + buttonData.size.x + offsetX, textPosition.y + offsetY);
        let textPositionCenter = new Vector2(textPosition.x + buttonData.size.x + offsetX, textPosition.y + offsetY + 10);
        let textPositionBottom = new Vector2(textPosition.x + buttonData.size.x + offsetX, textPosition.y + offsetY + 20);
        return [textPositionTop, textPositionCenter, textPositionBottom];
    }
    
    private getPosition(leftTopRightBottom: Vector4, elementSize: Vector2, canvasWidth: number, canvasHeight: number): Vector2 {
        let positionX = 0;
        let positionY = 0;
        if (leftTopRightBottom.x >= 0) {
            positionX = leftTopRightBottom.x;
        }
        if (leftTopRightBottom.y >= 0) {
            positionY = leftTopRightBottom.y;
        }
        if (leftTopRightBottom.z >= 0) {
            positionX = canvasWidth - leftTopRightBottom.z - elementSize.x;
        }
        if (leftTopRightBottom.w >= 0) {
            positionY = canvasHeight - leftTopRightBottom.w - elementSize.y;
        }
        return new Vector2(positionX, positionY);
    }
}