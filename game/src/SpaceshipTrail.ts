import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class SpaceshipTrail {
    private _trailMesh: BABYLON.Mesh;
    private _mainCamera: BABYLON.Camera;
    private _radius: number;
    private _length: number;
    private _points: BABYLON.Vector3[] = [];

    public constructor(name: string, scene: BABYLON.Scene, mainCamera: BABYLON.Camera, initialPosition: BABYLON.Vector3, currentUrl: string, color: BABYLON.Color4, radius: number = 1, length: number = 60) {
        this._trailMesh = new BABYLON.Mesh(name, scene);
        this._mainCamera = mainCamera;
        this._radius = radius;
        this._length = length;
        this._createMesh(initialPosition);
        let shaderMaterial = new BABYLON.ShaderMaterial(
            name + "ShaderMaterial",
            scene,
            currentUrl + "assets/shaders/solidColor", // searches for solidColor.vertex.fx and solidColor.fragment.fx
            {
                attributes: ["position"],
                uniforms: ["worldViewProjection", "color"],
            }
        );
        shaderMaterial.setFloats("color", [color.r, color.g, color.b, color.a]);
        shaderMaterial.forceDepthWrite = true;
        shaderMaterial.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
        shaderMaterial.alpha = 0.0;
        this._trailMesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._trailMesh.layerMask = SOA.CameraLayerMask.MAIN;
        this._trailMesh.alphaIndex = 0;
        this._trailMesh.material = shaderMaterial;
    }

    public destroy(): void {
        this._trailMesh.dispose();
    }

    private _createMesh(initialPosition: BABYLON.Vector3) {
        let data: BABYLON.VertexData = new BABYLON.VertexData();
        let positions: Array<number> = [];
        let indices: Array<number> = [];
        let index = 0;
        let initialPositionArray = initialPosition.asArray();
        for (let i = 0; i < this._length - 1; i++) {
            positions.push(...initialPositionArray);
            positions.push(...initialPositionArray);
            indices.push(index, index + 1, index + 3);
            indices.push(index, index + 3, index + 2);
            index += 2;
        }
        positions.push(...initialPositionArray);
        positions.push(...initialPositionArray);

        data.positions = positions;
        data.indices = indices;
        data.normals = [];
        BABYLON.VertexData.ComputeNormals(data.positions, data.indices, data.normals);
        data.applyToMesh(this._trailMesh, true);
    }

    public update(newPosition: BABYLON.Vector3) {
        let newPositionArray = newPosition.asArray();
        this._points.push(newPosition.clone());
        while (this._points.length > this._length) {
            this._points.splice(0, 1);
        }
        let positions: number[] = [];
        let normals: number[] = [];
        for (let i = 0; i < this._length; i++) {
            if (this._points[i]) {
                let dir = this._points[Math.min(i + 1, this._points.length - 1)].clone();
                dir.subtractInPlace(this._points[Math.max(i - 1, 0)]);
                let camDir = this._points[i].subtract(this._mainCamera.position);
                let norm = BABYLON.Vector3.Cross(dir, camDir).normalize();
                positions.push(...(this._points[i].add(norm.scale(- this._radius * i / this._length)).asArray()));
                positions.push(...(this._points[i].add(norm.scale(this._radius * i / this._length)).asArray()));
                normals.push(...norm.asArray(), ...norm.asArray());
            }
            else {
                positions.push(...newPositionArray);
                positions.push(...newPositionArray);
                normals.push(0, 1, 0, 0, 1, 0);
            }
        }
        this._trailMesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions, true, false);
        this._trailMesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals, true, false);
    }
}
