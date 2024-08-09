import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class MapLoader {
    public populateScene(canvas: HTMLElement, engine: BABYLON.Engine, scene: BABYLON.Scene, camera: BABYLON.Camera, currentUrl: string, meshAssetContainers: Record<string, BABYLON.AssetContainer>, particleSystemAssetContainers: Record<string, BABYLON.ParticleSystem>, textFileAssetContainers: Record<string, string>): SOA.Unit[] {
        // TODO: only load the meshes initially that belong to the map
        let assetContainerNames = ["redSpaceFighter", "redStation", "strangeObject"];
        let meshes: BABYLON.Mesh[] = [];
        for (let i = 0; i < assetContainerNames.length; i++) {
            let assetContainer = meshAssetContainers[assetContainerNames[i]];
            let cloneMaterialsAndDontShareThem = true;
            let instantiatedEntries = assetContainer.instantiateModelsToScene((name) => "p_" + name, cloneMaterialsAndDontShareThem);
            meshes.push(instantiatedEntries.rootNodes[0] as BABYLON.Mesh);
        }

        let particleSystems: BABYLON.ParticleSystem[] = [];
        for (let particleSystemName in particleSystemAssetContainers) {
            particleSystems.push(particleSystemAssetContainers[particleSystemName]);
        }

        let units: SOA.Unit[] = [];
        for (let i = 0; i < meshes.length; i++) {
            let unit = new SOA.Unit(scene, new BABYLON.Vector3(0, 0, 0), "box" + i, 5.0, currentUrl, meshes[i]);
            let exhaustTransformNode = new BABYLON.TransformNode(unit.mesh.name + "ExhaustTransformNode");
            exhaustTransformNode.parent = unit.mesh;
            exhaustTransformNode.position.x = -0.6;
            exhaustTransformNode.position.y = 0.05;
            exhaustTransformNode.rotation.z = -Math.PI / 2;
            let exhaustParticleSystem = particleSystems[0].clone(unit.mesh.name + "ExhaustParticleSystem", exhaustTransformNode);
            exhaustParticleSystem.emitter = exhaustTransformNode as BABYLON.AbstractMesh;
            exhaustParticleSystem.isLocal = true;
            exhaustParticleSystem.renderingGroupId = SOA.RenderingGroupId.MAIN;
            exhaustParticleSystem.layerMask = SOA.CameraLayerMask.MAIN;
            exhaustParticleSystem.minSize = 0.4;
            exhaustParticleSystem.maxSize = 0.4;
            exhaustParticleSystem.color1 = new BABYLON.Color4(1.0, 0.5, 0.5, 0.8);
            exhaustParticleSystem.color2 = new BABYLON.Color4(1.0, 0.0, 0.0, 1.0);
            exhaustParticleSystem.start();
            unit.getMainMesh().renderingGroupId = SOA.RenderingGroupId.MAIN;
            unit.getMainMesh().layerMask = SOA.CameraLayerMask.MAIN;
            unit.mesh.renderingGroupId = SOA.RenderingGroupId.MAIN;
            unit.mesh.layerMask = SOA.CameraLayerMask.MAIN;
            units.push(unit);
        }

        let originSphere: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
        originSphere.renderingGroupId = SOA.RenderingGroupId.MAIN;
        originSphere.layerMask = SOA.CameraLayerMask.MAIN;
        originSphere.isPickable = true;

        let xSphere: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("xsphere", { diameter: 0.1 }, scene);
        let xSphereMaterial = new BABYLON.StandardMaterial("mat", scene);
        xSphereMaterial.alpha = 1;
        xSphereMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        xSphere.material = xSphereMaterial;
        xSphere.position = new BABYLON.Vector3(1, 0, 0);
        xSphere.isPickable = true;
        xSphere.renderingGroupId = SOA.RenderingGroupId.MAIN;
        xSphere.layerMask = SOA.CameraLayerMask.MAIN;

        let ySphere: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("ysphere", { diameter: 0.1 }, scene);
        let ySphereMaterial = new BABYLON.StandardMaterial("mat", scene);
        ySphereMaterial.alpha = 1;
        ySphereMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        ySphere.material = ySphereMaterial;
        ySphere.position = new BABYLON.Vector3(0, 1, 0);
        ySphere.isPickable = true;
        ySphere.renderingGroupId = SOA.RenderingGroupId.MAIN;
        ySphere.layerMask = SOA.CameraLayerMask.MAIN;

        let zSphere: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("zsphere", { diameter: 0.1 }, scene);
        let zSphereMaterial = new BABYLON.StandardMaterial("mat", scene);
        zSphereMaterial.alpha = 1;
        zSphereMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        zSphere.material = zSphereMaterial;
        zSphere.position = new BABYLON.Vector3(0, 0, 1);
        zSphere.isPickable = true;
        zSphere.renderingGroupId = SOA.RenderingGroupId.MAIN;
        zSphere.layerMask = SOA.CameraLayerMask.MAIN;

        return units;
    }
}
