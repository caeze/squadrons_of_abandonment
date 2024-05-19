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
InstancedMesh,
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

export class Gui {
    private advancedTexture: AdvancedDynamicTexture;

    public constructor() {
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("Gui");
        if (this.advancedTexture._layerToDispose) {
            this.advancedTexture._layerToDispose.layerMask = CameraLayerMask.MAIN;
        }
    }
    
    public getGui(): AdvancedDynamicTexture {
        return this.advancedTexture;
    }
    
    // TODO: minimap is part of this
    // define necessary buttons as blanks
    // place them correctly and update on window resize
    public createGui(currentUrl: string) {
        this.advancedTexture.isForeground = true;
        
        let button = Button.CreateImageWithCenterTextButton("but", "Click me!", currentUrl + "/assets/img/heightMap.png");
            button.width = 0.2;
            button.height = "40px";
            button.left = "-500px";
            button.top = "-500px";
            button.color = "white";
            button.background = "green";
            button.onPointerClickObservable.add(()=>{
                if (button.image != null) {
                    button.image.source = currentUrl + "/assets/img/heightMap.png";
                }
            });
            button.onPointerEnterObservable.add(()=>{
                if (button.image != null) {
                    button.image.source = currentUrl + "/assets/img/someTexture.png";
                }
            });
            button.onPointerOutObservable.add(()=>{
                if (button.image != null) {
                    button.image.source = currentUrl + "/assets/img/grass.png";
                }
            });
        this.advancedTexture.addControl(button); 
        
        

        let button1 = Button.CreateSimpleButton("but1", "Click Me");
        button1.left = "1000px";
        button1.top = "500px";
        button1.width = "150px";
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function() {
            alert("you did it!");
        });
        this.advancedTexture.addControl(button1); 
    }
}