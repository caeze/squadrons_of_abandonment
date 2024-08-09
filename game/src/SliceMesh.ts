import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class SliceMesh {

    public slice(scene: BABYLON.Scene, mesh: BABYLON.Mesh, subdivisionLevels: number = 4): [BABYLON.Mesh[], BABYLON.Vector3[], BABYLON.Vector3[]] {
        let meshCenter = mesh.getBoundingInfo().boundingSphere.center;
        let initialSlicePoint = new BABYLON.Vector3(meshCenter.x, meshCenter.y, meshCenter.z);
        let meshSlicesList = this.sliceRecursive(scene, mesh, subdivisionLevels, 0);
        for (let i = 0; i < meshSlicesList.length; i++) {
            meshSlicesList[i].renderingGroupId = SOA.RenderingGroupId.MAIN;
            meshSlicesList[i].layerMask = SOA.CameraLayerMask.MAIN;
            meshSlicesList[i].isPickable = false;
        }
        let explodeMeshMovementDirections = this.getExplodeMeshMovementDirections(initialSlicePoint, meshSlicesList);
        let explodeMeshMovementRotations = this.getExplodeMeshMovementRotations(meshSlicesList);
        return [meshSlicesList, explodeMeshMovementDirections, explodeMeshMovementRotations];
    }

    private sliceRecursive(scene: BABYLON.Scene, mesh: BABYLON.Mesh, maxSliceLevel: number, currentSliceLevel: number): BABYLON.Mesh[] {
        let meshSlicesList: BABYLON.Mesh[] = [];
        if (currentSliceLevel == maxSliceLevel) {
            return meshSlicesList;
        }
        let slicePoint = mesh.getBoundingInfo().boundingSphere.center;
        let theta = Math.random() * 2 * Math.PI;
        let z = Math.random() * 2 - 1;
        let x = Math.sqrt(1 - z * z) * Math.cos(theta);
        let y = Math.sqrt(1 - z * z) * Math.sin(theta);
        let sliceNormal = new BABYLON.Vector3(x, y, z);
        let [meshA, meshB] = this.sliceImpl(mesh, slicePoint, sliceNormal);
        if (currentSliceLevel == maxSliceLevel - 1) {
            if (meshA) {
                meshSlicesList.push(meshA);
            }
            if (meshB) {
                meshSlicesList.push(meshB);
            }
        }
        if (meshA) {
            let meshSlicesListA: BABYLON.Mesh[] = this.sliceRecursive(scene, meshA, maxSliceLevel, currentSliceLevel + 1);
            for (let i = 0; i < meshSlicesListA.length; i++) {
                meshSlicesList.push(meshSlicesListA[i]);
            }
        }
        if (meshB) {
            let meshSlicesListB: BABYLON.Mesh[] = this.sliceRecursive(scene, meshB, maxSliceLevel, currentSliceLevel + 1);
            for (let i = 0; i < meshSlicesListB.length; i++) {
                meshSlicesList.push(meshSlicesListB[i]);
            }
        }
        return meshSlicesList;
    }

    private sliceImpl(mesh: BABYLON.Mesh, slicePoint: BABYLON.Vector3, sliceNormal: BABYLON.Vector3): [BABYLON.Mesh?, BABYLON.Mesh?] {
        let abstractPlane = BABYLON.Plane.FromPositionAndNormal(slicePoint, sliceNormal);
        let boxSlicer = BABYLON.MeshBuilder.CreatePlane("plane", { sourcePlane: abstractPlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
        let meshCSG = BABYLON.CSG.FromMesh(mesh);
        let slicerCSG = BABYLON.CSG.FromMesh(boxSlicer);
        let meshLeft = meshCSG.subtract(slicerCSG).toMesh(mesh.name + "SliceLeft");
        let meshRight = meshCSG.intersect(slicerCSG).toMesh(mesh.name + "SliceRight");
        mesh.dispose();
        boxSlicer.dispose();
        return [meshLeft, meshRight];
    }

    private getExplodeMeshMovementDirections(initialSlicePoint: BABYLON.Vector3, meshParts: BABYLON.Mesh[]): BABYLON.Vector3[] {
        let explodeMeshMovementDirections: BABYLON.Vector3[] = [];
        for (let i = 0; i < meshParts.length; i++) {
            let meshCenter = meshParts[i].getBoundingInfo().boundingSphere.center;
            explodeMeshMovementDirections.push(meshCenter.subtract(initialSlicePoint));
        }
        return explodeMeshMovementDirections;
    }

    private getExplodeMeshMovementRotations(meshParts: BABYLON.Mesh[]): BABYLON.Vector3[] {
        let explodeMeshMovementRotations: BABYLON.Vector3[] = [];
        let rotationSpeedFactor = 0.05;
        for (let i = 0; i < meshParts.length; i++) {
            let rx = Math.random() * 2 * Math.PI * rotationSpeedFactor;
            let ry = Math.random() * 2 * Math.PI * rotationSpeedFactor;
            let rz = Math.random() * 2 * Math.PI * rotationSpeedFactor;
            explodeMeshMovementRotations.push(new BABYLON.Vector3(rx, ry, rz));
        }
        return explodeMeshMovementRotations;
    }
}