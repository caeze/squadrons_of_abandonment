import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

class ImageButtonData {
    public onClick: () => void;
    public size: BABYLON.Vector2;
    public imageFilePath: string;
    public distanceLeft: number;
    public distanceTop: number;
    public distanceRight: number;
    public distanceBottom: number;
    public clickable: boolean;
    public textLineTop: string;
    public textLineBottom: string;

    public constructor(onClick: () => void, size: BABYLON.Vector2, imageFilePath: string, distanceLeft: number, distanceTop: number, distanceRight: number, distanceBottom: number, clickable: boolean = true, textLineTop: string = "", textLineBottom: string = "") {
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
    public button: BABYLON_GUI.Button;
    public textTop?: BABYLON_GUI.TextBlock;
    public textBottom?: BABYLON_GUI.TextBlock;

    public constructor(button: BABYLON_GUI.Button, textTop?: BABYLON_GUI.TextBlock, textBottom?: BABYLON_GUI.TextBlock) {
        this.button = button;
        this.textTop = textTop;
        this.textBottom = textBottom;
    }
}

class ProgressBar {
    public background: BABYLON_GUI.Rectangle;
    public foreground: BABYLON_GUI.Rectangle;
    public progress: number;
    public progressBarLtrb: BABYLON.Vector4;
    public size: BABYLON.Vector2;

    public constructor(background: BABYLON_GUI.Rectangle, foreground: BABYLON_GUI.Rectangle, progress: number, progressBarLtrb: BABYLON.Vector4, size: BABYLON.Vector2) {
        this.background = background;
        this.foreground = foreground;
        this.progress = progress;
        this.progressBarLtrb = progressBarLtrb;
        this.size = size;
    }
}

export class Gui {
    public advancedTexture: BABYLON_GUI.AdvancedDynamicTexture;
    private _buttonData: Record<string, ImageButtonData> = {};
    private _buttons: Record<string, ImageButtonWithOptionalTexts> = {};
    private _abilityProgressBar: ProgressBar;
    private _chatInputText: BABYLON_GUI.InputText;

    public constructor(currentUrl: string, canvasWidth: number, canvasHeight: number, buttonSize: number = 50, minimapSize: number = 300) {
        this.advancedTexture = BABYLON_GUI.AdvancedDynamicTexture.CreateFullscreenUI("Gui", undefined, undefined, BABYLON.Texture.NEAREST_NEAREST);
        this.advancedTexture.rootContainer.scaleX = window.devicePixelRatio;
        this.advancedTexture.rootContainer.scaleY = window.devicePixelRatio;
        if (this.advancedTexture._layerToDispose) {
            this.advancedTexture._layerToDispose.layerMask = SOA.CameraLayerMask.MAIN;
        }
        this.advancedTexture.isForeground = true;

        // Define the menu section.
        let onClickMenuImageButton = function () {
            alert("onClickMenuImageButton");
        };
        let menuImageButtonData = new ImageButtonData(onClickMenuImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", -1, 0, 0, -1);
        this._buttonData["menu"] = menuImageButtonData;

        // Define the info messages section.
        let onClickInfoMessage0ImageButton = function () {
            alert("onClickInfoMessage0ImageButton");
        };
        let infoMessage0ImageButtonData = new ImageButtonData(onClickInfoMessage0ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", 0, buttonSize * 4 + 100, -1, -1, true, "infoMessageTop0", "infoMessageBottom0");
        this._buttonData["infoMessage0"] = infoMessage0ImageButtonData;

        let onClickInfoMessage1ImageButton = function () {
            alert("onClickInfoMessage1ImageButton");
        };
        let infoMessage1ImageButtonData = new ImageButtonData(onClickInfoMessage1ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", 0, buttonSize * 3 + 100, -1, -1, true, "infoMessageTop1", "infoMessageBottom1");
        this._buttonData["infoMessage1"] = infoMessage1ImageButtonData;

        let onClickInfoMessage2ImageButton = function () {
            alert("onClickInfoMessage2ImageButton");
        };
        let infoMessage2ImageButtonData = new ImageButtonData(onClickInfoMessage2ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", 0, buttonSize * 2 + 100, -1, -1, true, "infoMessageTop2", "infoMessageBottom2");
        this._buttonData["infoMessage2"] = infoMessage2ImageButtonData;

        let onClickInfoMessage3ImageButton = function () {
            alert("onClickInfoMessage3ImageButton");
        };
        let infoMessage3ImageButtonData = new ImageButtonData(onClickInfoMessage3ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", 0, buttonSize + 100, -1, -1, true, "infoMessageTop3", "infoMessageBottom3");
        this._buttonData["infoMessage3"] = infoMessage3ImageButtonData;

        let onClickInfoMessage4ImageButton = function () {
            alert("onClickInfoMessage4ImageButton");
        };
        let infoMessage4ImageButtonData = new ImageButtonData(onClickInfoMessage4ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", 0, 100, -1, -1, true, "infoMessageTop4", "infoMessageBottom4");
        this._buttonData["infoMessage4"] = infoMessage4ImageButtonData;

        // Define the battlegroups section.
        let onClickBattlegroup0ImageButton = function () {
            alert("onClickBattlegroup0ImageButton");
        };
        let battlegroup0ImageButtonData = new ImageButtonData(onClickBattlegroup0ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", -1, buttonSize * 6 + 150, 0, -1);
        this._buttonData["battlegroup0"] = battlegroup0ImageButtonData;

        let onClickBattlegroup1ImageButton = function () {
            alert("onClickBattlegroup1ImageButton");
        };
        let battlegroup1ImageButtonData = new ImageButtonData(onClickBattlegroup1ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", -1, buttonSize * 5 + 150, 0, -1);
        this._buttonData["battlegroup1"] = battlegroup1ImageButtonData;

        let onClickBattlegroup2ImageButton = function () {
            alert("onClickBattlegroup2ImageButton");
        };
        let battlegroup2ImageButtonData = new ImageButtonData(onClickBattlegroup2ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", -1, buttonSize * 4 + 150, 0, -1);
        this._buttonData["battlegroup2"] = battlegroup2ImageButtonData;

        let onClickBattlegroup3ImageButton = function () {
            alert("onClickBattlegroup3ImageButton");
        };
        let battlegroup3ImageButtonData = new ImageButtonData(onClickBattlegroup3ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", -1, buttonSize * 3 + 150, 0, -1);
        this._buttonData["battlegroup3"] = battlegroup3ImageButtonData;

        let onClickBattlegroup4ImageButton = function () {
            alert("onClickBattlegroup4ImageButton");
        };
        let battlegroup4ImageButtonData = new ImageButtonData(onClickBattlegroup4ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", -1, buttonSize * 2 + 150, 0, -1);
        this._buttonData["battlegroup4"] = battlegroup4ImageButtonData;

        let onClickBattlegroup5ImageButton = function () {
            alert("onClickBattlegroup5ImageButton");
        };
        let battlegroup5ImageButtonData = new ImageButtonData(onClickBattlegroup5ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", -1, buttonSize + 150, 0, -1);
        this._buttonData["battlegroup5"] = battlegroup5ImageButtonData;

        let onClickBattlegroup6ImageButton = function () {
            alert("onClickBattlegroup6ImageButton");
        };
        let battlegroup6ImageButtonData = new ImageButtonData(onClickBattlegroup6ImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", -1, 150, 0, -1);
        this._buttonData["battlegroup6"] = battlegroup6ImageButtonData;

        // Define the map options section.
        let onClickOpenMapImageButton = function () {
            alert("onClickOpenMapImageButton");
        };
        let openMapImageButtonData = new ImageButtonData(onClickOpenMapImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", 0, -1, -1, minimapSize);
        this._buttonData["openMap"] = openMapImageButtonData;

        let onClickSetMarkerImageButton = function () {
            alert("onClickSetMarkerImageButton");
        };
        let setMarkerImageButtonData = new ImageButtonData(onClickSetMarkerImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", 0, -1, -1, minimapSize + buttonSize);
        this._buttonData["setMarker"] = setMarkerImageButtonData;

        let onClickChatImageButton = function () {
            alert("onClickChatImageButton");
        };
        let chatImageButtonData = new ImageButtonData(onClickChatImageButton, new BABYLON.Vector2(buttonSize, buttonSize), currentUrl + "assets/img/buttons/undefined.png", 0, -1, -1, minimapSize + 2 * buttonSize, false);
        this._buttonData["chat"] = chatImageButtonData;

        // Add all buttons to the UI.
        this._buttons = this.createAllButtons(this._buttonData, canvasWidth, canvasHeight);

        // Add the ability progress bar.
        let abilityProgressBarSize = new BABYLON.Vector2(3 * buttonSize, 20);
        let abilityProgressBarLtrb = new BABYLON.Vector4(470, -1, -1, 50);
        let [abilityProgressBarBackground, abilityProgressBarForeground] = this.createProgressBar("abilityProgressBar2", abilityProgressBarLtrb, "#00ff00", abilityProgressBarSize, canvasWidth, canvasHeight);
        this._abilityProgressBar = new ProgressBar(abilityProgressBarBackground, abilityProgressBarForeground, 0, abilityProgressBarLtrb, abilityProgressBarSize);
        this.setAbilityProgress(0.3);

        // Add the chat box.
        this._chatInputText = this.createInputText("chatInputText", new BABYLON.Vector4(0, -1, -1, minimapSize + 4 * buttonSize), "#ffffff", new BABYLON.Vector2(300, 20), canvasWidth, canvasHeight);
        let chatLine0 = this.createText("chatLine0", "ASD", new BABYLON.Vector4(0, -1, -1, minimapSize + 5 * buttonSize), "#999999", new BABYLON.Vector2(300, 20), canvasWidth, canvasHeight);
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
        let button = BABYLON_GUI.Button.CreateImageOnlyButton(buttonName, buttonData.imageFilePath);
        let buttonPosition = this.getButtonPosition(buttonData, canvasWidth, canvasHeight);
        button.width = buttonData.size.x + "px";
        button.height = buttonData.size.y + "px";
        button.left = buttonPosition.x + "px";
        button.top = buttonPosition.y + "px";
        button.thickness = 0;
        button.verticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_TOP;
        button.horizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        button.zIndex = 10;
        if (buttonData.clickable) {
            button.onPointerEnterObservable.add(() => {
                button.alpha = 0.75;
            });
            button.onPointerOutObservable.add(() => {
                button.alpha = 1.0;
            });
            button.onPointerClickObservable.add(() => {
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
            let textTop = new BABYLON_GUI.TextBlock();
            textTop.text = buttonData.textLineTop;
            textTop.left = textPositionTop.x + "px";
            textTop.top = textPositionTop.y + "px";
            textTop.color = "#ffffff";
            textTop.shadowColor = "#000000";
            textTop.shadowBlur = 4;
            textTop.shadowOffsetX = 1;
            textTop.shadowOffsetY = 1;
            textTop.fontSize = 18;
            textTop.textHorizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            textTop.textVerticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_TOP;
            textTop.zIndex = 10;
            let textBottom = new BABYLON_GUI.TextBlock();
            textBottom.text = buttonData.textLineBottom;
            textBottom.left = textPositionBottom.x + "px";
            textBottom.top = textPositionBottom.y + "px";
            textBottom.color = "#999999";
            textBottom.shadowColor = "#000000";
            textBottom.shadowBlur = 4;
            textBottom.shadowOffsetX = 1;
            textBottom.shadowOffsetY = 1;
            textBottom.fontSize = 18;
            textBottom.textHorizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            textBottom.textVerticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_TOP;
            textBottom.zIndex = 10;
            return new ImageButtonWithOptionalTexts(button, textTop, textBottom);
        } else if (buttonData.textLineTop != "") {
            let textTop = new BABYLON_GUI.TextBlock();
            textTop.text = buttonData.textLineTop;
            textTop.left = textPositionCenter.x + "px";
            textTop.top = textPositionCenter.y + "px";
            textTop.color = "#ffffff";
            textTop.shadowColor = "#000000";
            textTop.shadowBlur = 4;
            textTop.shadowOffsetX = 1;
            textTop.shadowOffsetY = 1;
            textTop.fontSize = 18;
            textTop.textHorizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            textTop.textVerticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_TOP;
            textTop.zIndex = 10;
            return new ImageButtonWithOptionalTexts(button, textTop);
        }
        return new ImageButtonWithOptionalTexts(button);
    }

    private createProgressBar(progressBarName: string, progressBarLtrb: BABYLON.Vector4, color: string, progressBarSize: BABYLON.Vector2, canvasWidth: number, canvasHeight: number): [BABYLON_GUI.Rectangle, BABYLON_GUI.Rectangle] {
        let progressBarPosition = this.getPosition(progressBarLtrb, progressBarSize, canvasWidth, canvasHeight);
        let progressBarBackground = new BABYLON_GUI.Rectangle(progressBarName + "Background");
        progressBarBackground.width = progressBarSize.x + "px";
        progressBarBackground.height = progressBarSize.y + "px";
        progressBarBackground.left = progressBarPosition.x + "px";
        progressBarBackground.top = progressBarPosition.y + "px";
        progressBarBackground.background = "#555555";
        progressBarBackground.alpha = 1.0;
        progressBarBackground.thickness = 0;
        progressBarBackground.verticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_TOP;
        progressBarBackground.horizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        progressBarBackground.zIndex = 10;
        this.advancedTexture.addControl(progressBarBackground);
        let progressBarForeground = new BABYLON_GUI.Rectangle(progressBarName + "BarForeground");
        progressBarForeground.width = progressBarSize.x + "px";
        progressBarForeground.height = progressBarSize.y + "px";
        progressBarForeground.left = progressBarPosition.x + "px";
        progressBarForeground.top = progressBarPosition.y + "px";
        progressBarForeground.background = color;
        progressBarForeground.alpha = 1.0;
        progressBarForeground.thickness = 0;
        progressBarForeground.verticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_TOP;
        progressBarForeground.horizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        progressBarForeground.zIndex = 10;
        this.advancedTexture.addControl(progressBarForeground);
        return [progressBarBackground, progressBarForeground];
    }

    private createInputText(inputTextName: string, inputTextLtrb: BABYLON.Vector4, color: string, inputTextSize: BABYLON.Vector2, canvasWidth: number, canvasHeight: number): BABYLON_GUI.InputText {
        let inputTextPosition = this.getPosition(inputTextLtrb, inputTextSize, canvasWidth, canvasHeight);
        let inputText = new BABYLON_GUI.InputText(inputTextName);
        inputText.width = inputTextSize.x + "px";
        inputText.height = inputTextSize.y + "px";
        inputText.maxWidth = inputTextSize.x + "px";
        inputText.left = inputTextPosition.x + "px";
        inputText.top = inputTextPosition.y + "px";
        inputText.verticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_TOP;
        inputText.horizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        inputText.text = "This is a very long text used to test how the cursor works within the BABYLON_GUI.InputText control.";
        inputText.color = color;
        inputText.background = "#00000000";
        inputText.thickness = 0;
        inputText.shadowColor = "#000000";
        inputText.shadowBlur = 4;
        inputText.shadowOffsetX = 1;
        inputText.shadowOffsetY = 1;
        inputText.zIndex = 100;
        this.advancedTexture.addControl(inputText);
        return inputText;
    }

    private createText(textName: string, textContent: string, textLtrb: BABYLON.Vector4, color: string, textSize: BABYLON.Vector2, canvasWidth: number, canvasHeight: number): BABYLON_GUI.TextBlock {
        let textPosition = this.getPosition(textLtrb, textSize, canvasWidth, canvasHeight);
        let text = new BABYLON_GUI.TextBlock(textName);
        text.text = textContent;
        text.left = textPosition.x + "px";
        text.top = textPosition.y + "px";
        text.color = color;
        text.shadowColor = "#000000";
        text.shadowBlur = 4;
        text.shadowOffsetX = 1;
        text.shadowOffsetY = 1;
        text.fontSize = 18;
        text.textHorizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        text.textVerticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_TOP;
        text.zIndex = 10;
        this.advancedTexture.addControl(text);
        return text;
    }

    public setAbilityProgress(newProgress: number) {
        this.updateProgressBarProgress(this._abilityProgressBar, newProgress);
    }

    public updateProgressBarProgress(progressBar: ProgressBar, newProgress: number) {
        progressBar.progress = Math.min(Math.max(newProgress, 0.0), 1.0);
        progressBar.foreground.width = (progressBar.size.x * progressBar.progress) + "px";
    }

    private getButtonPosition(buttonData: ImageButtonData, canvasWidth: number, canvasHeight: number): BABYLON.Vector2 {
        return this.getPosition(new BABYLON.Vector4(buttonData.distanceLeft, buttonData.distanceTop, buttonData.distanceRight, buttonData.distanceBottom), new BABYLON.Vector2(buttonData.size.x, buttonData.size.y), canvasWidth, canvasHeight);
    }

    private getTextPosition(buttonData: ImageButtonData, canvasWidth: number, canvasHeight: number, offsetX: number = 4, offsetY: number = 4): [BABYLON.Vector2, BABYLON.Vector2, BABYLON.Vector2] {
        let textPosition = this.getPosition(new BABYLON.Vector4(buttonData.distanceLeft, buttonData.distanceTop, buttonData.distanceRight, buttonData.distanceBottom), new BABYLON.Vector2(buttonData.size.x, buttonData.size.y), canvasWidth, canvasHeight);
        let textPositionTop = new BABYLON.Vector2(textPosition.x + buttonData.size.x + offsetX, textPosition.y + offsetY);
        let textPositionCenter = new BABYLON.Vector2(textPosition.x + buttonData.size.x + offsetX, textPosition.y + offsetY + 10);
        let textPositionBottom = new BABYLON.Vector2(textPosition.x + buttonData.size.x + offsetX, textPosition.y + offsetY + 20);
        return [textPositionTop, textPositionCenter, textPositionBottom];
    }

    private getPosition(leftTopRightBottom: BABYLON.Vector4, elementSize: BABYLON.Vector2, canvasWidth: number, canvasHeight: number): BABYLON.Vector2 {
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
        return new BABYLON.Vector2(positionX, positionY);
    }
}
