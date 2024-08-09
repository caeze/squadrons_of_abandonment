import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";


import { Entity } from "./Entity";
export class Emplacement extends Entity {
    public constructor(scene: BABYLON.Scene, initialPosition: BABYLON.Vector3, name: string, radius: number, currentUrl: string, mesh: BABYLON.Mesh) {
        super(mesh, radius);
        //super(mesh, SOA.EntityId.EMPLACEMENT, radius);
        this.mesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
        this.mesh.layerMask = SOA.CameraLayerMask.MAIN;
        this.mesh.position = initialPosition;
        this.mesh.isPickable = true;

        let minimapIconMesh = BABYLON.MeshBuilder.CreateBox(name + "minimapIconMesh", { size: 20 }, scene);
        minimapIconMesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
        minimapIconMesh.layerMask = SOA.CameraLayerMask.MINIMAP;
        minimapIconMesh.position = new BABYLON.Vector3(0.0, 0.0, 0.0);
        let minimapIconMeshShaderMaterial = new BABYLON.ShaderMaterial(
            "minimapIconMeshShaderMaterial",
            scene,
            currentUrl + "assets/shaders/solidColor", // searches for solidColor.vertex.fx and solidColor.fragment.fx
            {
                attributes: ["position"],
                uniforms: ["worldViewProjection", "color"],
            }
        );
        minimapIconMeshShaderMaterial.setFloats("color", [1.0, 1.0, 1.0, 1.0]);
        minimapIconMeshShaderMaterial.forceDepthWrite = true;
        minimapIconMeshShaderMaterial.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
        minimapIconMeshShaderMaterial.alpha = 0.0;
        minimapIconMesh.alphaIndex = 1;
        minimapIconMesh.material = minimapIconMeshShaderMaterial;
        minimapIconMesh.isPickable = false;
        minimapIconMesh.parent = this.mesh;
    }
}