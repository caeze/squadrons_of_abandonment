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
    
    public constructor(onClick: () => void, size: Vector2, imageFilePath: string, distanceLeft: number, distanceTop: number, distanceRight: number, distanceBottom: number) {
        this.onClick = onClick;
        this.size = size;
        this.imageFilePath = imageFilePath;
        this.distanceLeft = distanceLeft;
        this.distanceTop = distanceTop;
        this.distanceRight = distanceRight;
        this.distanceBottom = distanceBottom;
    }
}


export class Gui {
    public advancedTexture: AdvancedDynamicTexture;
    private _buttonData: Record<string, ImageButtonData> = {};
    private _buttons: Record<string, Button> = {};

    public constructor(currentUrl: string, canvasWidth: number, canvasHeight: number) {
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("Gui", undefined, undefined, Texture.NEAREST_NEAREST);
        this.advancedTexture.rootContainer.scaleX = window.devicePixelRatio;
        this.advancedTexture.rootContainer.scaleY = window.devicePixelRatio;
        if (this.advancedTexture._layerToDispose) {
            this.advancedTexture._layerToDispose.layerMask = CameraLayerMask.MAIN;
        }
        this.advancedTexture.isForeground = true;
        
        let onClickButton0 = function () {
            alert("ASD0");
        };
        let buttonName0 = "button0";
        let buttonData0 = new ImageButtonData(onClickButton0, new Vector2(50, 50), currentUrl + "/assets/img/minimapBackground.png", 300, -1, -1, 0);
        this._buttonData[buttonName0] = buttonData0;
        
        let onClickButton1 = function () {
            alert("ASD1");
        };
        let buttonName1 = "button1";
        let buttonData1 = new ImageButtonData(onClickButton1, new Vector2(50, 50), currentUrl + "/assets/img/minimapBackground.png", 350, -1, -1, 0);
        this._buttonData[buttonName1] = buttonData1;
        
        this._buttons = this.createAllButtons(this._buttonData, canvasWidth, canvasHeight);
        
        
        
        
        
        
        
        
        
        
        
        /*let button = Button.CreateImageWithCenterTextButton("but", "Click me!", currentUrl + "/assets/img/minimapBackground.png");
            button.width = "50px";
            button.height = "50px";
            button.left = "0px";
            button.top = "0px";
            button.color = "white";
            button.background = "green";
            button.thickness = 0;
            button.onPointerClickObservable.add(()=>{
                if (button.image != null) {
                    button.image.source = currentUrl + "/assets/img/minimapBackground.png";
                }
            });
            button.onPointerEnterObservable.add(()=>{
                if (button.image != null) {
                    button.image.source = currentUrl + "/assets/img/minimapBackground.png";
                }
            });
            button.onPointerOutObservable.add(()=>{
                if (button.image != null) {
                    button.image.source = currentUrl + "/assets/img/minimapBackground.png";
                }
            });
        this.advancedTexture.addControl(button); 
        
        

        let button1 = Button.CreateSimpleButton("but1", "Click Me");
        button1.left = "100px";
        button1.top = "50px";
        button1.width = "150px";
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function() {
            alert("you did it!");
        });
        this.advancedTexture.addControl(button1); 

        let button2 = Button.CreateSimpleButton("but1", "Click Me");
        button2.left = "-650px";
        button2.top = "200px";
        button2.width = "150px";
        button2.height = "40px";
        button2.color = "white";
        button2.background = "#00000000";
        this.advancedTexture.addControl(button2); */
    }
    
    public updateButtonPositions(canvasWidth: number, canvasHeight: number) {
        for (let buttonName in this._buttons) {
            let position = this.getButtonPosition(this._buttonData[buttonName], canvasWidth, canvasHeight);
            this._buttons[buttonName].left = position.x + "px";
            this._buttons[buttonName].top = position.y + "px";
        }
    }
    
    private createAllButtons(buttonData: Record<string, ImageButtonData>, canvasWidth: number, canvasHeight: number): Record<string, Button> {
        let buttons: Record<string, Button> = {}
        for (let buttonName in buttonData) {
            let button = this.createButtonFromButtonData(buttonName, buttonData[buttonName], canvasWidth, canvasHeight);
            this.advancedTexture.addControl(button);
            buttons[buttonName] = button;
        }
        return buttons;
    }
    
    private createButtonFromButtonData(buttonName: string, buttonData: ImageButtonData, canvasWidth: number, canvasHeight: number) {
        let button = Button.CreateImageOnlyButton(buttonName, buttonData.imageFilePath);
        let position = this.getButtonPosition(buttonData, canvasWidth, canvasHeight);
        button.width = buttonData.size.x + "px";
        button.height = buttonData.size.y + "px";
        button.left = position.x + "px";
        button.top = position.y + "px";
        button.thickness = 0;
        button.onPointerClickObservable.add(()=>{
            buttonData.onClick();
        });
        return button
            /*button.onPointerClickObservable.add(()=>{
                if (button.image != null) {
                    button.image.source = currentUrl + "/assets/img/minimapBackground.png";
                }
            });
            button.onPointerEnterObservable.add(()=>{
                if (button.image != null) {
                    button.image.source = currentUrl + "/assets/img/minimapBackground.png";
                }
            });
            button.onPointerOutObservable.add(()=>{
                if (button.image != null) {
                    button.image.source = currentUrl + "/assets/img/minimapBackground.png";
                }
            });*/
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
        let buttonTopLeft = new Vector2(buttonPositionX + buttonData.size.x / 2, buttonPositionY + buttonData.size.y / 2);
        return this.screenToGuiPosition(buttonTopLeft, canvasWidth, canvasHeight);
    }
    
    private screenToGuiPosition(screenPosition: Vector2, canvasWidth: number, canvasHeight: number): Vector2 {
        // Screen coordinate system is from screen_top_left = [0, 0]
        // to screen_bottom_right = [screen_width, screen_height]
        // Gui coordinate system is from screen_center = [0, 0]
        // to screen_bottom_right = [screen_width / 2, screen_height / 2]
        let xPos = screenPosition.x - canvasWidth / 2;
        let yPos = screenPosition.y - canvasHeight / 2;
        return new Vector2(xPos, yPos);
    }
}