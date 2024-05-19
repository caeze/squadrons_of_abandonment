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

export class SpaceshipTrail extends Mesh {
	private _generator: Mesh;
	private _mainCamera: Camera;
	private _radius: number;
	private _length: number;
    private _points: Vector3[] = [];

	public constructor(name: string, generator: Mesh, scene: Scene, mainCamera: Camera, radius: number = 1, length: number = 60) {
		super(name, scene);
		this.layerMask = 1;
		this._generator = generator;
		this._mainCamera = mainCamera;
		this._radius = radius;
		this._length = length;
		this._createMesh();
		scene.onBeforeRenderObservable.add(this._update);
	}

	public destroy(): void {
		this.getScene().onBeforeRenderObservable.removeCallback(this._update);
		this.dispose();
	}

	public foldToGenerator(): void {
        let verticesData = this.getVerticesData(VertexBuffer.PositionKind);
        if (verticesData == null) {
            verticesData = [];
        }
		let positions: Array<number> | Float32Array = verticesData;
		let generatorWorldPosition = this._generator.absolutePosition;
		for (let i = 0; i < positions.length; i += 3) {
			positions[i] = generatorWorldPosition.x;
			positions[i + 1] = generatorWorldPosition.y;
			positions[i + 2] = generatorWorldPosition.z;
		}
	}

	private _createMesh(): void {
		let data: VertexData = new VertexData();
		let positions: Array<number> = [];
		let indices: Array<number> = [];

        let index = 0;
        let initialPosition = this._generator.absolutePosition.asArray();
		for (let i = 0; i < this._length - 1; i++) {
            positions.push(...initialPosition);
            positions.push(...initialPosition);
            indices.push(index, index + 1, index + 3);
            indices.push(index, index + 3, index + 2);
            index += 2;
        }
        positions.push(...initialPosition);
        positions.push(...initialPosition);

		data.positions = positions;
		data.indices = indices;
        data.normals = [];
        VertexData.ComputeNormals(data.positions, data.indices, data.normals);
		data.applyToMesh(this, true);
	}

	private _update = () => {
        let initialPosition = this._generator.position.asArray();
        this._points.push(this._generator.position.clone());
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
                let norm = Vector3.Cross(dir, camDir).normalize();
                positions.push(...(this._points[i].add(norm.scale(- this._radius * i / this._length)).asArray()));
                positions.push(...(this._points[i].add(norm.scale(this._radius * i / this._length)).asArray()));
                normals.push(...norm.asArray(), ...norm.asArray());
            }
            else {
                positions.push(...initialPosition);
                positions.push(...initialPosition);
                normals.push(0, 1, 0, 0, 1, 0);
            }
        }

        this.updateVerticesData(VertexBuffer.PositionKind, positions, true, false);
	    this.updateVerticesData(VertexBuffer.NormalKind, normals, true, false);
	}
}