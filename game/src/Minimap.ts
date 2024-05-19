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
VolumetricLightScatteringPostProcess,
WebGPUEngine,
} from "@babylonjs/core";
// ----------- global imports end -----------

export class Minimap {
    public constructor(scene: Scene, camera: Camera, engine: Engine) {
        /*
        
        let cameraMinimap: ArcRotateCamera = new ArcRotateCamera("MinimapCamera", 0, 0, 1, Vector3.Zero(), scene);
        cameraMinimap.position = new Vector3(0, 50, 0);
        cameraMinimap.layerMask = 2;
        //cameraMinimap.mode = Camera.ORTHOGRAPHIC_CAMERA;
        // cameraMinimap.viewport = new Viewport(0.0, 0.4, 1.0, 0.2);
        */
        let cameraMinimap = new UniversalCamera("cameraMinimap", new Vector3(0, 20, 0), scene);
        cameraMinimap.mode = Camera.ORTHOGRAPHIC_CAMERA;
        cameraMinimap.minZ = 0.1;
        cameraMinimap.setTarget(Vector3.Zero());
        // cameraMinimap.rotation = new Vector3(Math.PI/2,0,0);
        let cameraMinimapViewport = 300;
        cameraMinimap.orthoTop = -cameraMinimapViewport;
        cameraMinimap.orthoBottom = cameraMinimapViewport;
        cameraMinimap.orthoLeft = cameraMinimapViewport;
        cameraMinimap.orthoRight = -cameraMinimapViewport;
        
        

        const planeSize = 0.5;
        let plane = MeshBuilder.CreatePlane("plane", { size: planeSize }, scene);
        //plane.position.z = 1.001
        //plane.parent = camera;
        plane.position.set(planeSize / 2, planeSize / 2, 0);
        plane.bakeCurrentTransformIntoVertices();
        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
        plane.renderingGroupId = 3;

        const rt_texture = new RenderTargetTexture("minimap_rtt", 1024, scene);
        rt_texture.activeCamera = cameraMinimap;
        rt_texture.renderList = scene.meshes;
        scene.customRenderTargets.push(rt_texture);

        let mon2mat = new StandardMaterial("minimap_texturePlane", scene);
        mon2mat.diffuseColor = new Color3(1, 1, 1);
        mon2mat.diffuseTexture = rt_texture;
        mon2mat.specularColor = Color3.Black();
        mon2mat.diffuseTexture.level = 1.2; // intensity
        mon2mat.emissiveColor = new Color3(1, 1, 1); // backlight
        plane.material = mon2mat;

        scene.onBeforeRenderObservable.add(() => {
            camera.getViewMatrix(); 
            let  invertCameraViewProj = Matrix.Invert(camera.getTransformationMatrix());
            let  screenWidth = scene.getEngine().getRenderWidth(true);
            this.setPositionTop(false, plane, 100, 0, invertCameraViewProj, screenWidth)
        });
        
        /*let sphereMinimap = MeshBuilder.CreateSphere("sphereMinimap", { diameter: 5.0 }, scene);
        sphereMinimap.position = new Vector3(0, 15, 0);
        sphereMinimap.layerMask = 2;
        let materialSphereMinimap = new StandardMaterial("textureSphereMinimap", scene);
        materialSphereMinimap.alpha = 1;
        materialSphereMinimap.diffuseColor = new Color3(0, 0, 1);
        sphereMinimap.material = materialSphereMinimap;
        

        let minimapRenderTargetTexture = new RenderTargetTexture("minimapRenderTargetTexture", 1024, scene, false, false);
        //minimapRenderTargetTexture.coordinatesMode = RenderTargetTexture.EQUIRECTANGULAR_MODE;
        scene.customRenderTargets.push(minimapRenderTargetTexture);
        minimapRenderTargetTexture.activeCamera = cameraMinimap;
        minimapRenderTargetTexture.renderList = [sphereMinimap];
        let minimapPlane = Mesh.CreatePlane("minimapPlane", 4, scene);
        minimapPlane.renderingGroupId = 2;
        minimapPlane.showBoundingBox = false;
        //minimapPlane.scaling = new Vector3(window.innerWidth / window.innerHeight, 1, 1);
        let minimapPlaneMaterial = new StandardMaterial("minimapPlaneMaterial", scene);
        //minimapPlaneMaterial.diffuseColor = new Color3(1,1,1);
        minimapPlaneMaterial.diffuseTexture = minimapRenderTargetTexture;
        minimapPlaneMaterial.specularColor = Color3.Black();
        
        scene.onAfterRenderObservable.add(() => {
            /*const screenPosition = new Vector3(engine.getRenderWidth() / 2, engine.getRenderHeight() / 2, 10.0);
            const positionVector = Vector3.Unproject(
                screenPosition,
                engine.getRenderWidth(),
                engine.getRenderHeight(),
                Matrix.Identity(),
                scene.getViewMatrix(),
                scene.getProjectionMatrix()
            );
            minimapPlane.position.x = -3;
            minimapPlane.position.y = -3;
            minimapPlane.position.z = 10; * / 
            let ray = scene.createPickingRay(0, 0, Matrix.Identity(), camera, false);
            let rayOrigin = ray.origin;
            let rayDirection = ray.direction;
            rayDirection.normalize();
            let minimapPlanePosition = rayDirection.scaleAndAddToRef(10, rayOrigin);
            console.log(camera.position);
            minimapPlane.position.x = minimapPlanePosition.x;
            minimapPlane.position.y = minimapPlanePosition.y;
            minimapPlane.position.z = minimapPlanePosition.z;
           // -7.960090654955585, _y: -2.375073664606663, _z: 5.864826787485438
        })

        /* const forward = camera.position.clone();
        const up = camera.getDirection(Vector3.Up());
        const result = Matrix.Zero();
        Matrix.LookAtLHToRef(Vector3.Zero(), forward, up, result);
        result.invert();
        const q =  Quaternion.FromRotationMatrix(result).normalize();
        cone.rotationQuaternion = q;* /

        //minimapPlaneMaterial.diffuseTexture.scale = 1; // zoom

        //minimapPlaneMaterial.diffuseTexture.level = 1.2; // intensity

        minimapPlaneMaterial.emissiveColor = new Color3(1,1,1); // backlight
        minimapPlane.material = minimapPlaneMaterial;
        minimapPlane.parent = camera;
        // minimapPlane.parent = camera;
        minimapPlane.layerMask = 1;

        // minimapPlane.enableEdgesRendering(epsilon);	 
        minimapPlane.edgesWidth = 5.0;
        minimapPlane.edgesColor = new Color4(1, 1, 1, 1);*/
    }
    
    private setPositionTop(fromLeft: any, mesh: any, meshWidthInPixels: any, spacingWithBorderInPixels: any, invertCameraViewProj: any, screenWidth: any) {
        //spacing from the edges of the screen (left, right)
        let spacingWithBorder = spacingWithBorderInPixels / screenWidth;
        //width of the meshes relative to screen
        let w = meshWidthInPixels / screenWidth / 20;
        //is the offset applied from left or right
        let pOfst = -1 + spacingWithBorder * 4;//fromLeft ? -1 + spacingWithBorder * 2 : 1 - spacingWithBorder * 2;
        //vector in (-1,-1,-1) -> bottom left, near plane
        let p = new Vector3(-1, -1, -1 + 0.0001);
        //same vector, but x coordinate is increased by the width of the mesh we defined in the function
        let q = new Vector3(2 * w, 1, -1 + 0.0001);

        //switch these vectors to camera view by inverting the matrix
        let pt = Vector3.TransformCoordinates(p, invertCameraViewProj);
        let qt = Vector3.TransformCoordinates(q, invertCameraViewProj);
        //subtract these vectors and get the size coeficient 
        let scalingFactor = 0.25;
        let d = qt.subtract(pt).length() * scalingFactor;
        //scale the mesh to the proper size relative to screen
        mesh.scaling = new Vector3(d, d, d);
        //offset the x value of the p vector depending on "fromLeft" letiable (calculated above -> pOfst)
        p.x = pOfst;
        //set position 
        mesh.position = Vector3.TransformCoordinates(p, invertCameraViewProj);
    }
}