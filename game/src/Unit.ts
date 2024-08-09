import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";


import { Entity } from "./Entity";
export class Unit extends Entity {
    public constructor(scene: BABYLON.Scene, initialPosition: BABYLON.Vector3, name: string, radius: number, currentUrl: string, mesh: BABYLON.Mesh) {



        // also use class ColorHighlightLayer


        /*let spheresMeshGlb = MeshBuilder.CreateSphere("spheresMeshGlb", { diameter: 0.1 }, scene);
        SceneLoader.ImportMesh(
            "",
            currentUrl + "assets/models/",
            "PBR_Spheres.glb",
            scene,
            function(objects: AbstractMesh[]) {
                for(let i=0; i<objects.length; ++i) {
                    objects[i].renderingGroupId = RenderingGroupId.MAIN;
                }
            }
        );*/
        /*let jupiter = MeshBuilder.CreateSphere("jupiter", { diameter: 3 }, scene);
        SceneLoader.ImportMesh(
            "",
            currentUrl + "assets/models/",
            "jupiter.glb",
            scene,
            function(objects: AbstractMesh[]) {
                console.log(objects);
                jupiter = (<Mesh> objects[1]);
                for(let i=0; i<objects.length; ++i) {
                    objects[i].renderingGroupId = RenderingGroupId.MAIN;
                }
            }
        );*/


        /*let highlightLayer = new HighlightLayer("SphereHighlight", scene,
        { 
            // alphaBlendingMode: 0, 
            blurTextureSizeRatio : 0.25
        });
        highlightLayer.addMesh(zSphere, Color3.Blue());
        
        const importPromise = SceneLoader.ImportMeshAsync(
            null,
            currentUrl + "assets/models/",
            "jupiter.glb",
            scene
        );
        importPromise.then((result: any) => {
            highlightLayer.addMesh(result.meshes[1], Color3.Blue());
            result.meshes[1].renderingGroupId = RenderingGroupId.MAIN;
        });
        
        const importPromiseFlag = SceneLoader.ImportMeshAsync(
            null,
            currentUrl + "assets/models/",
            "flag.glb",
            scene
        );
        importPromiseFlag.then((result: any) => {
            console.log(result);
            for(let i = 0; i < result.meshes.length; i++) {
                result.meshes[i].renderingGroupId = RenderingGroupId.MAIN;
                //result.meshes[i].scaling.x = 0.25;
                //result.meshes[i].scaling.y = 0.25;
                //result.meshes[i].scaling.z = 0.25;
            }
            //highlightLayer.addMesh(result.meshes[1], Color3.Blue());
            //result.meshes[1].renderingGroupId = RenderingGroupId.MAIN;
        });*/



        /*let importPromise = SceneLoader.ImportMeshAsync(null, currentUrl + "assets/models/", glbFileName, scene);
        importPromise.then((result: any) => {
            for(let i = 0; i < result.meshes.length; i++) {
                result.meshes[i].renderingGroupId = RenderingGroupId.MAIN;
                result.meshes[i].layerMask = CameraLayerMask.MAIN;
                result.meshes[i].position = initialPosition;
                result.meshes[i].isPickable = true;
            }
            meshes = result.meshes;
        });*/
        /*SceneLoader.ImportMesh(
            "",
            currentUrl + "assets/models/",
            "jupiter.glb",
            scene,
            function(objects: AbstractMesh[]) {
                console.log(objects);
                jupiter = (<Mesh> objects[1]);
                for(let i=0; i<objects.length; ++i) {
                    objects[i].renderingGroupId = RenderingGroupId.MAIN;
                }
            }
        );*/
        super(mesh, radius);
        //super(mesh, SOA.EntityId.UNIT, radius);

        //let result = await this._loadMeshes(scene, currentUrl, glbFileName);
        //let meshes = result.meshes;
        //let allMeshes = meshes.getChildMeshes();
        this.mesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
        this.mesh.layerMask = SOA.CameraLayerMask.MAIN;
        this.mesh.position = initialPosition;
        this.mesh.isPickable = true;
        this.getMainMesh().isPickable = true;

        /*this.mesh.renderingGroupId = RenderingGroupId.MAIN;
        this.mesh.layerMask = CameraLayerMask.MAIN;
        this.mesh.position = initialPosition;
        this.mesh.isPickable = true;*/

        let minimapIconMesh = BABYLON.MeshBuilder.CreateSphere(name + "minimapIconMesh", { diameter: 20 }, scene);
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