import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class Entity {
    public mesh: BABYLON.Mesh;
    public entityId: SOA.EntityId;
    public radius: number;

    public constructor(mesh: BABYLON.Mesh, radius: number) {
        this.mesh = mesh;
        this.entityId = SOA.EntityId.BUILDING;
        this.radius = radius;
    }

    public getMainMesh(): BABYLON.Mesh {
        return this.mesh.getChildren()[0] as BABYLON.Mesh;
    }
}