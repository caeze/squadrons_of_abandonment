import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { BoxParticleEmitter, NoiseProceduralTexture, DirectionalLight, AbstractMesh, PointLight, Camera, VolumetricLightScatteringPostProcess, SphereParticleEmitter, Color4, Constants, ParticleHelper, ParticleSystemSet, TransformNode, ParticleSystem, Engine, Scene, ArcRotateCamera, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, InstancedMesh, StandardMaterial, Texture, Vector2, Vector4 , Color3, SceneLoader, AssetsManager, ArcRotateCameraPointersInput, CubeTexture, RegisterMaterialPlugin, MaterialPluginBase, PostProcess, PassPostProcess, Effect, ShaderMaterial, RenderTargetTexture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button } from '@babylonjs/gui/2D';

export class Gui {
    // TODO: minimap is part of this
    // define necessary buttons as blanks
    // place them correctly and update on window resize
    public createGui(currentUrl: string) {
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("Gui");
        advancedTexture.isForeground = true;
        
        var button = Button.CreateImageWithCenterTextButton("but", "Click me!", "textures/grass.png");
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
        advancedTexture.addControl(button); 
        
        

        var button1 = Button.CreateSimpleButton("but1", "Click Me");
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
        advancedTexture.addControl(button1); 
    }
}