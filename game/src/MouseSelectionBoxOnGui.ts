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

export class MouseSelectionBoxOnGui {
    private _selectionRectangle: Rectangle;
    
    public constructor(advancedTexture: AdvancedDynamicTexture) {
        this._selectionRectangle = new Rectangle();
        this._selectionRectangle.width = "40px";
        this._selectionRectangle.height = "40px";
        this._selectionRectangle.color = "#00ff0000";
        this._selectionRectangle.thickness = 3;
        this._selectionRectangle.zIndex = 1;
        this._selectionRectangle.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._selectionRectangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        advancedTexture.addControl(this._selectionRectangle);
    }
    
    public updateSelectionBoxOnGui(topLeft: Vector2, bottomRight: Vector2) {
        let left = topLeft.x;
        let top = topLeft.y;
        let width = bottomRight.x - left;
        let height = bottomRight.y - top;
        this._selectionRectangle.color = "#00ff00ff";
        this._selectionRectangle.left = `${left}px`;
        this._selectionRectangle.top = `${top}px`;
        this._selectionRectangle.width = `${width}px`;
        this._selectionRectangle.height = `${height}px;`;
    }
    
    public hideSelectionBoxOnGui() {
        this._selectionRectangle.color = "#00ff0000";
    }
}