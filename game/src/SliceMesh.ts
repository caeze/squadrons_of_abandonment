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
CSG,Plane,
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

import { RenderingGroupId } from "./RenderingGroupId";
import { CameraLayerMask } from "./CameraLayerMask";

export class SliceMesh {

    public constructor() {
    }
    
    /**
     * This function slices a mesh and returns a list of meshes that are the slices.
     *
     * The slices are chosen with respect to the mesh's boundig box center.
     */
    public slice(scene: Scene, mesh: Mesh, subdivisionLevels: number = 4): [Mesh[], Vector3[], Vector3[]] {
        let meshCenter = mesh.getBoundingInfo().boundingSphere.center;
        let initialSlicePoint = new Vector3(meshCenter.x, meshCenter.y, meshCenter.z);
        let meshSlicesList = this.sliceRecursive(scene, mesh, subdivisionLevels, 0);
        for (let i = 0; i < meshSlicesList.length; i++) {
            meshSlicesList[i].renderingGroupId = RenderingGroupId.MAIN;
            meshSlicesList[i].layerMask = CameraLayerMask.MAIN;
            meshSlicesList[i].isPickable = false;
        }
        let explodeMeshMovementDirections = this.getExplodeMeshMovementDirections(initialSlicePoint, meshSlicesList);
        let explodeMeshMovementRotations = this.getExplodeMeshMovementRotations(initialSlicePoint, meshSlicesList);
        return [meshSlicesList, explodeMeshMovementDirections, explodeMeshMovementRotations];
    }
    
    private sliceRecursive(scene: Scene, mesh: Mesh, maxSliceLevel: number, currentSliceLevel: number): Mesh[] {
        let meshSlicesList: Mesh[] = [];
        if (currentSliceLevel == maxSliceLevel) {
            return meshSlicesList;
        }
        let slicePoint = mesh.getBoundingInfo().boundingSphere.center;
        let theta = Math.random() * 2 * Math.PI;
        let z = Math.random() * 2 - 1;
        let x = Math.sqrt(1 - z * z) * Math.cos(theta);
        let y = Math.sqrt(1 - z * z) * Math.sin(theta);
        let sliceNormal = new Vector3(x, y, z);
        let [meshA, meshB] = this.sliceImpl(scene, mesh, slicePoint, sliceNormal);
        if (currentSliceLevel == maxSliceLevel - 1) {
            if (meshA) {
                meshSlicesList.push(meshA);
            }
            if (meshB) {
                meshSlicesList.push(meshB);
            }
        }
        if (meshA) {
            let meshSlicesListA: Mesh[] = this.sliceRecursive(scene, meshA, maxSliceLevel, currentSliceLevel + 1);
            for (let i = 0; i < meshSlicesListA.length; i++) {
                meshSlicesList.push(meshSlicesListA[i]);
            }
        }
        if (meshB) {
            let meshSlicesListB: Mesh[] = this.sliceRecursive(scene, meshB, maxSliceLevel, currentSliceLevel + 1);
            for (let i = 0; i < meshSlicesListB.length; i++) {
                meshSlicesList.push(meshSlicesListB[i]);
            }
        }
        return meshSlicesList;
    }
    
    /*private splitStringAtIndex(s: string, i: number): string[] {
        return [s.substring(0, i), s.substring(i)];
    }
    
    private sliceImpl(scene: Scene, mesh: Mesh): [Mesh, Mesh] {
        let meshStringParts = this.splitStringAtIndex(mesh.s, mesh.s.length / 2);
        return [new Mesh(meshStringParts[0]), new Mesh(meshStringParts[1])];
    }*/
    
    private sliceImpl(scene: Scene, mesh: Mesh, slicePoint: Vector3, sliceNormal: Vector3): [Mesh?, Mesh?] {
        let boxSlicerSize = 100;
        let abstractPlane = Plane.FromPositionAndNormal(slicePoint, sliceNormal);
        let boxSlicer = MeshBuilder.CreatePlane("plane", {sourcePlane: abstractPlane, sideOrientation: Mesh.DOUBLESIDE});
        let meshCSG = CSG.FromMesh(mesh);
        let slicerCSG = CSG.FromMesh(boxSlicer);
        let meshLeft = meshCSG.subtract(slicerCSG).toMesh(mesh.name + "SliceLeft");
        let meshRight = meshCSG.intersect(slicerCSG).toMesh(mesh.name + "SliceRight");
        mesh.dispose();
        boxSlicer.dispose();
        return [meshLeft, meshRight];
    }
    
    private getExplodeMeshMovementDirections(initialSlicePoint: Vector3, meshParts: Mesh[]): Vector3[] {
        let explodeMeshMovementDirections: Vector3[] = [];
        for (let i = 0; i < meshParts.length; i++) {
            let meshCenter = meshParts[i].getBoundingInfo().boundingSphere.center;
            explodeMeshMovementDirections.push(meshCenter.subtract(initialSlicePoint));
        }
        return explodeMeshMovementDirections;
    }
    
    private getExplodeMeshMovementRotations(initialSlicePoint: Vector3, meshParts: Mesh[]): Vector3[] {
        let explodeMeshMovementRotations: Vector3[] = [];
        let rotationSpeedFactor = 0.05;
        for (let i = 0; i < meshParts.length; i++) {
            let rx = Math.random() * 2 * Math.PI * rotationSpeedFactor;
            let ry = Math.random() * 2 * Math.PI * rotationSpeedFactor;
            let rz =  Math.random() * 2 * Math.PI * rotationSpeedFactor;
            explodeMeshMovementRotations.push(new Vector3(rx, ry, rz));
        }
        return explodeMeshMovementRotations;
    }
}