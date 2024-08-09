import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class SquadronsOfAbandonement {
    public constructor() {
        let currentUrl = window.location.href;

        let loadingScreenDiv = document.getElementById("loadingScreenDiv");
        if (loadingScreenDiv != null) {
            loadingScreenDiv.style.display = "none";
        }

        let canvas = document.createElement("canvas");
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        canvas.id = "soaGameCanvas";
        document.body.appendChild(canvas);
        document.body.style.cssText = "margin: 0; padding: 0; height: 100%; overflow: hidden;";

        BABYLON.ParticleHelper.BaseAssetsUrl = currentUrl + "assets/particle_definitions";
        BABYLON.ParticleSystemSet.BaseAssetsUrl = currentUrl + "assets/particle_definitions";
        BABYLON.DefaultLoadingScreen.DefaultLogoUrl = currentUrl + "assets/img/squadronsOfAbandonementLogo.png";

        let engine = new BABYLON.Engine(canvas, true);
        engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
        let scene = new BABYLON.Scene(engine);

        let assetsLoader = new SOA.AssetsLoader();

        let onProgressFunction = function (remainingCount: number, totalCount: number, lastFinishedTask: any) {
            let percent = Math.floor((totalCount - remainingCount) / totalCount * 100.0);
            engine.loadingUIText = "LOADING MODELS " + percent + "%";
            engine.loadingUIBackgroundColor = "#000000";
        };
        let thisPtr = this;
        let onFinishFunction = function (meshAssetContainers: Record<string, BABYLON.AssetContainer>, particleSystemAssetContainers: Record<string, BABYLON.ParticleSystem>, textFileAssetContainers: Record<string, string>) {
            /*for (let i = 0; i < assetContainer.meshes.length; i++) {
                let mesh = assetContainer.meshes[i];
                let meshNameWithoutSuffix = mesh.name.substring(0, mesh.name.lastIndexOf("_"));
                if (!(meshNameWithoutSuffix in meshesInAssetContainer)) {
                    meshesInAssetContainer[meshNameWithoutSuffix] = [];
                }
                meshesInAssetContainer[meshNameWithoutSuffix].push(mesh);
            }*/
            thisPtr._showScene(canvas, engine, scene, currentUrl, meshAssetContainers, particleSystemAssetContainers, textFileAssetContainers);
        };

        // TODO: load all meshes from the meshes directory and dont specify them here
        let meshesToLoad = ["redSpaceFighter.glb", "redStation.glb", "strangeObject.glb", "moveMarker.glb", "moveMarkerCircularArrow.glb", "wrench.glb", "jupiter.glb"];
        assetsLoader.loadAssets(scene, currentUrl, meshesToLoad, ["rocket_exhaust.json"], ["maps/passage_of_maerula.json"], onProgressFunction, onFinishFunction);
    }

    private _showScene(canvas: HTMLElement, engine: BABYLON.Engine, scene: BABYLON.Scene, currentUrl: string, meshAssetContainers: Record<string, BABYLON.AssetContainer>, particleSystemAssetContainers: Record<string, BABYLON.ParticleSystem>, textFileAssetContainers: Record<string, string>) {
        let mapSidelength = 1000.0;

        let skybox = new SOA.Skybox(scene, currentUrl);
        let ambientLight = new SOA.AmbientLight(scene);
        let gui = new SOA.Gui(currentUrl, window.innerWidth, window.innerHeight);

        let mainCamera = new SOA.MainCamera(canvas, scene);
        scene.registerBeforeRender(() => {
            mainCamera.runBeforeRender();
        });
        let minimap = new SOA.Minimap(scene, mainCamera.camera, engine, currentUrl, mapSidelength);
        scene.activeCameras = [];
        scene.activeCameras.push(mainCamera.camera);
        scene.activeCameras.push(minimap.minimapCamera);
        scene.cameraToUseForPointers = mainCamera.camera;

        let pipeline = new SOA.RenderingPipeline(scene, mainCamera.camera);

        let selectedEntities: SOA.Entity[] = [];
        let ground = new SOA.Ground(scene, currentUrl, 128, 128, mapSidelength);
        let meshToExclude = ground.getGroundMesh();
        scene.registerBeforeRender(() => {
            ground.updateRevealerPositions(revealers);
            ground.updateSelectedPositions(selectedEntities);
        });

        let sun = new SOA.Sun(scene, mainCamera.camera, engine, currentUrl, meshToExclude);
        let jupiter = new SOA.Planet(meshAssetContainers["jupiter"]);

        let mapLoader = new SOA.MapLoader();
        let revealers = mapLoader.populateScene(canvas, engine, scene, mainCamera.camera, currentUrl, meshAssetContainers, particleSystemAssetContainers, textFileAssetContainers);
        let entities = revealers;

        let repairIcons: SOA.RepairIcon[] = [];
        for (let i = 0; i < entities.length; i++) {
            let repairIcon = new SOA.RepairIcon(scene, currentUrl, entities[i].getMainMesh(), meshAssetContainers);
            repairIcon.showRepairIcon();
            repairIcons.push(repairIcon);
        }

        let moveMarker = new SOA.MoveMarker(scene, currentUrl, meshAssetContainers);

        scene.registerBeforeRender(() => {
            entities[0].mesh.position.x -= 0.005;
            entities[0].mesh.rotation.x += 0.005;
            //entities[0].mesh.rotation.y += 0.005;
            entities[1].mesh.position.x += 0.005;
            //entities[1].mesh.rotation.x += 0.005;
            //entities[1].mesh.rotation.y += 0.005;
            entities[0].mesh.rotationQuaternion = null;
            //entities[1].mesh.rotationQuaternion = null;
            for (let i = 0; i < repairIcons.length; i++) {
                repairIcons[i].tick();
            }
        });

        let getAllEntitiesFunction = () => {
            return entities;
        }
        let selectedEntitiesCallbackFunction = (newlySelectedEntities: SOA.Entity[]) => {
            selectedEntities.length = 0;
            selectedEntities.push(...newlySelectedEntities);
        }
        let selectionManager = new SOA.SelectionManager(engine, scene, mainCamera.camera, getAllEntitiesFunction, selectedEntitiesCallbackFunction, gui.advancedTexture);

        let keyboardInputManager = new SOA.KeyboardInputManager();
        keyboardInputManager.registerCallback("KeyF", "launchFullscreenCaller", this._nop, this._launchFullscreen, null);
        keyboardInputManager.registerCallback("KeyI", "toggleDebugLayerCaller", this._nop, this._toggleDebugLayer, scene);

        let consoleFunctions = new SOA.ConsoleFunctions();

        /*let unitToSlice = new Unit(scene, new Vector3(0.0, 0.0, 0.0), "unitToSlice", 5.0, currentUrl, MeshBuilder.CreateBox("boxForSlicing", {size: 0.5}, scene));
        let sliceMesh = new SliceMesh();
        let [meshParts, explodeMeshMovementDirections, explodeMeshMovementRotations] = sliceMesh.slice(scene, unitToSlice.mesh, 6);
        let explosionMovementStrengthFactor = 0.05;
        scene.registerBeforeRender(() => {
            for (let i = 0; i < meshParts.length; i++) {
                meshParts[i].position.x += explodeMeshMovementDirections[i].x * explosionMovementStrengthFactor;
                meshParts[i].position.y += explodeMeshMovementDirections[i].y * explosionMovementStrengthFactor;
                meshParts[i].position.z += explodeMeshMovementDirections[i].z * explosionMovementStrengthFactor;
                meshParts[i].rotation.x += explodeMeshMovementRotations[i].x * explosionMovementStrengthFactor;
                meshParts[i].rotation.y += explodeMeshMovementRotations[i].y * explosionMovementStrengthFactor;
                meshParts[i].rotation.z += explodeMeshMovementRotations[i].z * explosionMovementStrengthFactor;
            }
        });*/

        let explosionEffect = new SOA.ExplosionEffect(mainCamera.camera, scene, currentUrl);
        explosionEffect.createExplosionWithShockwave("shockwaveEffect0", new BABYLON.Vector3(0.0, 0.0, 0.0), engine, mainCamera, SquadronsOfAbandonement.project);

        let spaceshipTrail = new SOA.SpaceshipTrail("spaceshipTrail0", scene, mainCamera.camera, new BABYLON.Vector3(0.0, 0.0, 0.0), currentUrl, new BABYLON.Color4(0.5, 0.0, 0.0, 0.5), 0.1);
        let k = 0;
        let p = [
            Math.random() * 180 + 20,
            Math.random() * 180 + 20,
            Math.random() * 180 + 20,
            Math.random() * 180 + 20,
            Math.random() * 180 + 20,
            Math.random() * 180 + 20,
        ]
        scene.onBeforeRenderObservable.add(
            () => {
                let newPosition = new BABYLON.Vector3();
                newPosition.x = 5 * (Math.sin(k / p[0]) + Math.cos(k / p[3]));
                newPosition.y = 5 * (Math.sin(k / p[1]) + Math.cos(k / p[4]));
                newPosition.z = 5 * (Math.sin(k / p[2]) + Math.cos(k / p[5]));
                spaceshipTrail.update(newPosition);
                k++;
            }
        )

        scene.onPointerObservable.add((eventData: any) => {
            let mousePositionX = scene.pointerX;
            let mousePositionY = scene.pointerY;
            let mousePosition = new BABYLON.Vector2(mousePositionX, mousePositionY);
            let eventDataType = eventData.type;
            let mouseButtonId = eventData.event.button;
            selectionManager.onMouseMove(mousePosition, eventDataType, mouseButtonId);
            if (eventDataType === BABYLON.PointerEventTypes.POINTERDOWN && mouseButtonId == 0) {
                let pickResultList = scene.multiPick(mousePositionX, mousePositionY, undefined, mainCamera.camera);
                if (pickResultList) {
                    for (let i = 0; i < pickResultList.length; i++) {
                        let m = pickResultList[i].pickedMesh;
                        if (m != null) {
                            console.log(m.name);
                        }
                    }
                    for (let i = 0; i < pickResultList.length; i++) {
                        let pickResult = pickResultList[i];
                        if (pickResult.hit && pickResult.pickedMesh != null && pickResult.pickedPoint != null && pickResult.pickedMesh.name == "ground") {
                            moveMarker.showMoveMarker(scene, pickResult.pickedPoint);
                        }
                    }
                }
            }
        });

        window.addEventListener("resize", function () {
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            minimap.resize(window.innerWidth, window.innerHeight);
            gui.updateGuiPositions(window.innerWidth, window.innerHeight);
            engine.resize();
        });

        let divFps = document.getElementById("fps");

        let i = 0;
        engine.runRenderLoop(() => {
            // here all updating stuff must be updated
            i += 0.001;
            //gui.setAbilityProgress(i);
            if (divFps) {
                divFps.innerHTML = engine.getFps().toFixed() + " fps";
            }

            let displacement = 0.025 * mainCamera.camera.radius;
            let cameraPosition = mainCamera.camera.position;
            let cameraTarget = mainCamera.camera.getTarget();
            let displacementX = 0.0;
            let displacementZ = 0.0;
            if (keyboardInputManager.isPressed("KeyW")) {
                displacementZ += displacement;
            }
            if (keyboardInputManager.isPressed("KeyA")) {
                displacementX -= displacement;
            }
            if (keyboardInputManager.isPressed("KeyS")) {
                displacementZ -= displacement;
            }
            if (keyboardInputManager.isPressed("KeyD")) {
                displacementX += displacement;
            }
            let cameraAngleDegrees = BABYLON.Tools.ToDegrees(mainCamera.camera.alpha) % 360.0 + 90.0;
            while (cameraAngleDegrees < 0.0) {
                cameraAngleDegrees += 360.0;
            }
            let cameraQuaternion = BABYLON.Quaternion.FromEulerAngles(0.0, 0.0, BABYLON.Tools.ToRadians(cameraAngleDegrees));
            let matrix = new BABYLON.Matrix();
            cameraQuaternion.toRotationMatrix(matrix);
            let displacementVec2 = BABYLON.Vector2.Transform(new BABYLON.Vector2(displacementX, displacementZ), matrix);
            displacementX = displacementVec2.x;
            displacementZ = displacementVec2.y;

            mainCamera.camera.position = new BABYLON.Vector3(cameraPosition.x + displacementX, cameraPosition.y, cameraPosition.z + displacementZ);
            mainCamera.camera.setTarget(new BABYLON.Vector3(cameraTarget.x + displacementX, cameraTarget.y, cameraTarget.z + displacementZ));

            if (i > 0.1 && i < 0.2) {
                repairIcons[1].hideRepairIcon();
            }
            if (i > 0.2) {
                repairIcons[1].showRepairIcon();
            }

            scene.render();
        });
    }

    private _destroyScene() {
        // TODO: implement this:
        //scene.onBeforeRenderObservable.removeCallback(this.update);
    }

    private _launchFullscreen(data: any) {
        document.documentElement.requestFullscreen();
    }

    private _toggleDebugLayer(data: any) {
        if (data.debugLayer.isVisible()) {
            data.debugLayer.hide();
        } else {
            data.debugLayer.show();
        }
    }

    private _nop(data: any) {
    }

    public static project(worldPosition: BABYLON.Vector3, engine: BABYLON.Engine, camera: BABYLON.Camera): [BABYLON.Vector2, number] {
        // Coordinate system is from screen_top_left = [0, 0]
        // to screen_bottom_right = [screen_width, screen_height]
        let vector3 = BABYLON.Vector3.Project(
            worldPosition,
            BABYLON.Matrix.Identity(),
            camera.getTransformationMatrix(),
            camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()),
        );
        let screenPos = new BABYLON.Vector2(vector3.x, vector3.y);
        let depth = vector3.z;
        return [screenPos, depth];
    }

    public static unproject(screenPosition: BABYLON.Vector2, depth: number, engine: BABYLON.Engine, camera: BABYLON.Camera): BABYLON.Vector3 {
        return BABYLON.Vector3.Unproject(
            new BABYLON.Vector3(screenPosition.x, screenPosition.y, depth),
            engine.getRenderWidth(),
            engine.getRenderHeight(),
            BABYLON.Matrix.Identity(),
            camera.getViewMatrix(),
            camera.getProjectionMatrix()
        );
    }

    public static getFirstHitEntity(pickingInfoList: BABYLON.Nullable<BABYLON.PickingInfo[]>, orderOfReturnValues: SOA.EntityId[]): SOA.Entity[] {
        let retMap: SOA.Entity[] = [];
        let retList: SOA.Entity[] = [];
        return retList;
    }
}
