import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class Ground {
    private _ground: BABYLON.Mesh;
    private _groundShaderMaterial: BABYLON.ShaderMaterial;

    public constructor(scene: BABYLON.Scene, currentUrl: string, maxRevealers: number, maxEntities: number, mapSidelength: number) {
        this._ground = BABYLON.MeshBuilder.CreatePlane("ground", { size: mapSidelength });
        this._groundShaderMaterial = new BABYLON.ShaderMaterial(
            "groundShaderMaterial",
            scene,
            currentUrl + "assets/shaders/ground", // searches for ground.vertex.fx and ground.fragment.fx
            {
                attributes: ["position"],
                uniforms: [
                    "worldViewProjection",
                    "world",
                    "mapSidelength",
                    "revealersCurrentCount",
                    "revealersX",
                    "revealersZ",
                    "revealersRadius",
                    "entitiesCurrentCount",
                    "entitiesX",
                    "entitiesZ",
                    "entitiesRadius",
                    "entitiesType",
                ],
                defines: [
                    "#define MAX_REVEALERS " + maxRevealers,
                    "#define MAX_ENTITIES " + maxEntities,
                ],
            }
        );
        this._ground.renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._ground.layerMask = SOA.CameraLayerMask.MAIN;
        this._ground.alphaIndex = 1;
        this._ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        this._ground.material = this._groundShaderMaterial;
        this._ground.material.forceDepthWrite = true;
        this._ground.material.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
        this._ground.material.alpha = 0.0;
        this._groundShaderMaterial.setFloat("mapSidelength", mapSidelength);
    }

    public getGroundMesh(): BABYLON.Mesh {
        return this._ground;
    }

    public updateRevealerPositions(entities: SOA.Entity[]) {
        const revealersX: number[] = [];
        const revealersZ: number[] = [];
        const revealersRadius: number[] = [];
        for (let i = 0; i < entities.length; i++) {
            revealersX.push(entities[i].mesh.position.x);
            revealersZ.push(entities[i].mesh.position.z);
            revealersRadius.push(entities[i].radius);
        }
        this._groundShaderMaterial.setInt("revealersCurrentCount", entities.length);
        this._groundShaderMaterial.setFloats("revealersX", revealersX);
        this._groundShaderMaterial.setFloats("revealersZ", revealersZ);
        this._groundShaderMaterial.setFloats("revealersRadius", revealersRadius);
    }

    public updateSelectedPositions(entities: SOA.Entity[]) {
        const entitiesX: number[] = [];
        const entitiesZ: number[] = [];
        const entitiesRadius: number[] = [];
        const entitiesType: number[] = [];
        for (let i = 0; i < entities.length; i++) {
            entitiesX.push(entities[i].mesh.position.x);
            entitiesZ.push(entities[i].mesh.position.z);
            entitiesRadius.push(entities[i].radius / 5.0);
            entitiesType.push(i);
        }
        this._groundShaderMaterial.setInt("entitiesCurrentCount", entities.length);
        this._groundShaderMaterial.setFloats("entitiesX", entitiesX);
        this._groundShaderMaterial.setFloats("entitiesZ", entitiesZ);
        this._groundShaderMaterial.setFloats("entitiesRadius", entitiesRadius);
        this._groundShaderMaterial.setFloats("entitiesType", entitiesType);
    }
}