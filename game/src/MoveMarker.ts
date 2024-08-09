import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class MoveMarker {

    private _moveMarker0Mesh: BABYLON.Mesh;
    private _moveMarker1Mesh: BABYLON.Mesh;
    private _moveMarker2Mesh: BABYLON.Mesh;
    private _moveMarkerTransformNode: BABYLON.TransformNode;
    private _shaderMaterial: BABYLON.ShaderMaterial;
    private _glowLayer: BABYLON.GlowLayer;
    private _glowLayerAlpha: number;
    private _timer: BABYLON.Nullable<BABYLON.Observer<BABYLON.Scene>> = null;
    readonly _MOVE_MARKER_INITIAL_OFFSET = -0.05;
    readonly _TIME_TO_LIVE_SECONDS: number = 0.6;
    readonly _MOVE_MARKER_COLOR: BABYLON.Color4 = new BABYLON.Color4(0.0, 1.0, 0.0, 1.0);
    readonly _GLOW_LAYER_ALPHA: number = 0.6;

    public constructor(scene: BABYLON.Scene, currentUrl: string, meshAssetContainers: Record<string, BABYLON.AssetContainer>) {
        let thisPtr = this;
        let moveMarkerAssetName = "moveMarkerCircularArrow";
        let assetContainer = meshAssetContainers[moveMarkerAssetName];
        let cloneMaterialsAndDontShareThem = true;
        let instantiatedEntries0 = assetContainer.instantiateModelsToScene((name) => "moveMarker0" + name, cloneMaterialsAndDontShareThem);
        this._moveMarker0Mesh = instantiatedEntries0.rootNodes[0] as BABYLON.Mesh;
        let instantiatedEntries1 = assetContainer.instantiateModelsToScene((name) => "moveMarker0" + name, cloneMaterialsAndDontShareThem);
        this._moveMarker1Mesh = instantiatedEntries1.rootNodes[0] as BABYLON.Mesh;
        let instantiatedEntries2 = assetContainer.instantiateModelsToScene((name) => "moveMarker0" + name, cloneMaterialsAndDontShareThem);
        this._moveMarker2Mesh = instantiatedEntries2.rootNodes[0] as BABYLON.Mesh;

        this._shaderMaterial = new BABYLON.ShaderMaterial(
            moveMarkerAssetName + "ShaderMaterial",
            scene,
            currentUrl + "assets/shaders/solidColor", // searches for solidColor.vertex.fx and solidColor.fragment.fx
            {
                attributes: ["position"],
                uniforms: ["worldViewProjection", "color"],
            }
        );
        this._shaderMaterial.setFloats("color", [this._MOVE_MARKER_COLOR.r, this._MOVE_MARKER_COLOR.g, this._MOVE_MARKER_COLOR.b, this._MOVE_MARKER_COLOR.a]);
        this._shaderMaterial.forceDepthWrite = true;
        this._shaderMaterial.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
        this._shaderMaterial.alpha = 0.0;
        this._getMainMesh0().alphaIndex = 0;
        this._getMainMesh0().material = this._shaderMaterial;
        this._getMainMesh0().renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._getMainMesh0().layerMask = SOA.CameraLayerMask.MAIN;
        this._getMainMesh1().alphaIndex = 0;
        this._getMainMesh1().material = this._shaderMaterial;
        this._getMainMesh1().renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._getMainMesh1().layerMask = SOA.CameraLayerMask.MAIN;
        this._getMainMesh2().alphaIndex = 0;
        this._getMainMesh2().material = this._shaderMaterial;
        this._getMainMesh2().renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._getMainMesh2().layerMask = SOA.CameraLayerMask.MAIN;
        this._moveMarker0Mesh.alphaIndex = 0;
        this._moveMarker0Mesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._moveMarker0Mesh.layerMask = SOA.CameraLayerMask.MAIN;
        this._moveMarker1Mesh.alphaIndex = 0;
        this._moveMarker1Mesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._moveMarker1Mesh.layerMask = SOA.CameraLayerMask.MAIN;
        this._moveMarker2Mesh.alphaIndex = 0;
        this._moveMarker2Mesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
        this._moveMarker2Mesh.layerMask = SOA.CameraLayerMask.MAIN;

        this._glowLayer = new BABYLON.GlowLayer("moveMarkerGlowLayer", scene);
        this._glowLayer.customEmissiveColorSelector = function (mesh, subMesh, material, result) {
            thisPtr._glowLayerColorSelector(mesh, subMesh, material, result);
        };
        this._glowLayer.addIncludedOnlyMesh(this._getMainMesh0());
        this._glowLayer.addIncludedOnlyMesh(this._getMainMesh1());
        this._glowLayer.addIncludedOnlyMesh(this._getMainMesh2());
        this._glowLayer.renderingGroupId = SOA.RenderingGroupId.MAIN;

        let scalingFactor = 0.3;
        this._moveMarker0Mesh.scaling.x = scalingFactor;
        this._moveMarker0Mesh.scaling.y = scalingFactor;
        this._moveMarker0Mesh.scaling.z = scalingFactor;
        this._moveMarker1Mesh.scaling.x = scalingFactor;
        this._moveMarker1Mesh.scaling.y = scalingFactor;
        this._moveMarker1Mesh.scaling.z = scalingFactor;
        this._moveMarker2Mesh.scaling.x = scalingFactor;
        this._moveMarker2Mesh.scaling.y = scalingFactor;
        this._moveMarker2Mesh.scaling.z = scalingFactor;

        this._moveMarkerTransformNode = new BABYLON.TransformNode("moveMarkerTransformNode");

        let moveMarker0TransformNode = new BABYLON.TransformNode("moveMarker0TransformNode");
        moveMarker0TransformNode.rotation.y = BABYLON.Tools.ToRadians(0.0);
        moveMarker0TransformNode.parent = this._moveMarkerTransformNode;
        this._moveMarker0Mesh.parent = moveMarker0TransformNode;

        let moveMarker1TransformNode = new BABYLON.TransformNode("moveMarker1TransformNode");
        moveMarker1TransformNode.rotation.y = BABYLON.Tools.ToRadians(120.0);
        moveMarker1TransformNode.parent = this._moveMarkerTransformNode;
        this._moveMarker1Mesh.parent = moveMarker1TransformNode;

        let moveMarker2TransformNode = new BABYLON.TransformNode("moveMarker2TransformNode");
        moveMarker2TransformNode.rotation.y = BABYLON.Tools.ToRadians(240.0);
        moveMarker2TransformNode.parent = this._moveMarkerTransformNode;
        this._moveMarker2Mesh.parent = moveMarker2TransformNode;

        this._glowLayerAlpha = this._GLOW_LAYER_ALPHA;

        this.hideMoveMarker();
    }

    public showMoveMarker(scene: BABYLON.Scene, position: BABYLON.Vector3) {
        if (this._timer != null) {
            this._timer.remove();
        }
        this._moveMarkerTransformNode.position.x = position.x;
        this._moveMarkerTransformNode.position.y = position.y;
        this._moveMarkerTransformNode.position.z = position.z;
        this._moveMarker0Mesh.position.x = this._MOVE_MARKER_INITIAL_OFFSET;
        this._moveMarker1Mesh.position.x = this._MOVE_MARKER_INITIAL_OFFSET;
        this._moveMarker2Mesh.position.x = this._MOVE_MARKER_INITIAL_OFFSET;
        this._getMainMesh0().setEnabled(true);
        this._moveMarker0Mesh.setEnabled(true);
        this._getMainMesh1().setEnabled(true);
        this._moveMarker1Mesh.setEnabled(true);
        this._getMainMesh2().setEnabled(true);
        this._moveMarker2Mesh.setEnabled(true);

        this._timer = BABYLON.setAndStartTimer({
            timeout: this._TIME_TO_LIVE_SECONDS * 1000,
            contextObservable: scene.onBeforeRenderObservable,
            onTick: (data) => {
                this._moveMarkerTransformNode.rotation.y = 0.009 * data.deltaTime;
                this._moveMarker0Mesh.position.x += 0.000008 * data.deltaTime;
                this._moveMarker1Mesh.position.x += 0.000008 * data.deltaTime;
                this._moveMarker2Mesh.position.x += 0.000008 * data.deltaTime;

                let a = 1.0 - Math.min(1.0, data.completeRate);
                this._shaderMaterial.setFloats("color", [this._MOVE_MARKER_COLOR.r, this._MOVE_MARKER_COLOR.g, this._MOVE_MARKER_COLOR.b, a]);
                this._glowLayerAlpha = this._GLOW_LAYER_ALPHA * a;
            },
            onEnded: () => {
                this.hideMoveMarker();
            },
            breakCondition: () => {
                return false;
            },
            onAborted: () => {
            },
        });
    }

    public hideMoveMarker() {
        this._getMainMesh0().setEnabled(false);
        this._moveMarker0Mesh.setEnabled(false);
        this._getMainMesh1().setEnabled(false);
        this._moveMarker1Mesh.setEnabled(false);
        this._getMainMesh2().setEnabled(false);
        this._moveMarker2Mesh.setEnabled(false);
    }

    private _getMainMesh0(): BABYLON.Mesh {
        return this._moveMarker0Mesh.getChildren()[0] as BABYLON.Mesh;
    }

    private _getMainMesh1(): BABYLON.Mesh {
        return this._moveMarker1Mesh.getChildren()[0] as BABYLON.Mesh;
    }

    private _getMainMesh2(): BABYLON.Mesh {
        return this._moveMarker2Mesh.getChildren()[0] as BABYLON.Mesh;
    }

    private _glowLayerColorSelector(mesh: any, subMesh: any, material: any, result: any) {
        result.set(this._MOVE_MARKER_COLOR.r, this._MOVE_MARKER_COLOR.g, this._MOVE_MARKER_COLOR.b, this._glowLayerAlpha);
    };
}
