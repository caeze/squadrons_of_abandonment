import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { PointerEventTypes, BoxParticleEmitter, NoiseProceduralTexture, DirectionalLight, AbstractMesh, PointLight, Camera, VolumetricLightScatteringPostProcess, SphereParticleEmitter, Color4, Constants, ParticleHelper, ParticleSystemSet, TransformNode, ParticleSystem, Engine, Scene, ArcRotateCamera, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, InstancedMesh, StandardMaterial, Texture, Vector2, Vector4 , Color3, SceneLoader, AssetsManager, ArcRotateCameraPointersInput, CubeTexture, RegisterMaterialPlugin, MaterialPluginBase, PostProcess, PassPostProcess, Effect, ShaderMaterial, RenderTargetTexture } from "@babylonjs/core";
import { Rectangle, AdvancedDynamicTexture, Button } from '@babylonjs/gui/2D';

/*class GradientRectangle extends Rectangle {
    private _gradientStart: string;
    private _gradientEnd: string;
    private _gradientVertical: boolean;
    
    public constructor(name: string){
        super(name);
        this._gradientStart = "black";
        this._gradientEnd = "white"
        this._gradientVertical = true;
    }
    set gradientStart(value) {
        this._gradientStart = value;
    }
    get gradientStart() {
        return this._gradientStart;
    }
    set gradientEnd(value) {
        this._gradientEnd = value;
    }
    get gradientEnd() {
        return this._gradientEnd;
    }
    set gradientVertical(value) {
        this._gradientVertical = value ? true : false;
    }
    get gradientVertical() {
        return this._gradientVertical;
    }

    _localDraw(context: CanvasRenderingContext2D) {
        context.save();

        if (this.shadowBlur || this.shadowOffsetX || this.shadowOffsetY) {
            context.shadowColor = this.shadowColor;
            context.shadowBlur = this.shadowBlur;
            context.shadowOffsetX = this.shadowOffsetX;
            context.shadowOffsetY = this.shadowOffsetY;
        }

        if (this._gradientStart && this._gradientEnd) {
            if(this._gradientVertical){
                this._gradient = context.createLinearGradient(0, this._currentMeasure.top, 0, this._currentMeasure.top + this._currentMeasure.height);
            }
            else {
                this._gradient = context.createLinearGradient(this._currentMeasure.left, 0, this._currentMeasure.left + this._currentMeasure.width, 0);
            }
            
            this._gradient.addColorStop(0, this._gradientStart);
            this._gradient.addColorStop(1, this._gradientEnd);

            context.fillStyle = this._gradient;

            if (this._cornerRadius) {
                this._drawRoundedRect(context, this._thickness / 2);
                context.fill();
            } else {
                context.fillRect(this._currentMeasure.left, this._currentMeasure.top, this._currentMeasure.width, this._currentMeasure.height);
            }
        }

        if (this._thickness) {
            if (this.shadowBlur || this.shadowOffsetX || this.shadowOffsetY) {
                context.shadowBlur = 0;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
            }

            if (this.color) {
                context.strokeStyle = this.color;
            }
            context.lineWidth = this._thickness;

            if (this._cornerRadius) {
                this._drawRoundedRect(context, this._thickness / 2);
                context.stroke();
            } else {
                context.strokeRect(this._currentMeasure.left + this._thickness / 2, this._currentMeasure.top + this._thickness / 2,
                    this._currentMeasure.width - this._thickness, this._currentMeasure.height - this._thickness);
            }
        }

        context.restore();
    }
}*/

export class MouseSelectionBox {
    public createMouseSelectionBox(scene: Scene, advancedTexture: AdvancedDynamicTexture) {
        var selectionRectangle = new Rectangle();
        selectionRectangle.width = "40px";
        selectionRectangle.height = "40px";
        selectionRectangle.color = "#00ff0000";
        selectionRectangle.thickness = 3;
        advancedTexture.addControl(selectionRectangle);
        
        var lastPointerPositionX = -1000000;
        var lastPointerPositionY = -1000000;
        
        scene.onPointerObservable.add((eventData) => {
            const mousePosX = scene.pointerX - window.innerWidth / 2.0;
            const mousePosY = scene.pointerY - window.innerHeight / 2.0;
            
            if (eventData.type === PointerEventTypes.POINTERDOWN && eventData.event.button == 0) {
                lastPointerPositionX = mousePosX;
                lastPointerPositionY = mousePosY;
            } else if (eventData.type === PointerEventTypes.POINTERMOVE) {
                if (lastPointerPositionX != -1000000 && lastPointerPositionY != -1000000) {
                    const minX = Math.min(lastPointerPositionX, mousePosX);
                    const minY = Math.min(lastPointerPositionY, mousePosY);
                    const maxX = Math.max(lastPointerPositionX, mousePosX);
                    const maxY = Math.max(lastPointerPositionY, mousePosY);
                    
                    selectionRectangle.color = "#00ff00ff";
                    selectionRectangle.left = `${minX + (maxX - minX) / 2.0}px`;
                    selectionRectangle.top = `${minY + (maxY - minY) / 2.0}px`;
                    selectionRectangle.width = `${maxX - minX}px`;
                    selectionRectangle.height = `${maxY - minY}px;`;
                }
            } else if (eventData.type === PointerEventTypes.POINTERUP && eventData.event.button == 0) {
                if (lastPointerPositionX != -1000000 && lastPointerPositionY != -1000000) {
                    // TODO: determine affected meshes
                    
                    /*// set endPointerPosition with pointer up event
                    const endPointerPosition = { x: mousePosX, y: mousePosY }
                    // select spheres using array filter method
                    const selectedSpheres = spheres.filter((sphere) => isTargetIn(lastPointerPosition, endPointerPosition, sphere.getAbsolutePosition(), camera))
                    
                    // initialize lastPointerPosition with null
                    lastPointerPosition = defaultPointerPosition;
                    // initialize dragBox's style with default one wich doesn't include width and height
                    dragBox.style = defStyle;
                    
                    // log selected spheres
                    console.log('selectedSpheres: ', selectedSpheres)
                    // alert with selected spheres counts
                    alert(`${selectedSpheres.length} ${selectedSpheres.length > 1 ? 'spheres are' : 'sphere is'} selected!`)*/
                }
                
                selectionRectangle.color = "#00ff0000";
                lastPointerPositionX = -1000000;
                lastPointerPositionY = -1000000;
            }
        })
    }
}