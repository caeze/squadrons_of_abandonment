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
Layer,
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
Viewport,
VolumetricLightScatteringPostProcess,
WebGPUEngine,
} from "@babylonjs/core";
// ----------- global imports end -----------

/**
 * A class managing keyboard input.
 *
 * It holds the state of all keyboard keys. Moreover, events are fired on key state changes.
 */
export class KeyboardInputManager {

    readonly KEY_CODES = [
        "ControlLeft",
        "ControlRight",
        "ShiftLeft",
        "ShiftRight",
        "AltLeft",
        "CapsLock",
        "Tab",
        "Space",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "KeyA",
        "KeyB",
        "KeyC",
        "KeyD",
        "KeyE",
        "KeyF",
        "KeyG",
        "KeyH",
        "KeyI",
        "KeyJ",
        "KeyK",
        "KeyL",
        "KeyM",
        "KeyN",
        "KeyO",
        "KeyP",
        "KeyQ",
        "KeyR",
        "KeyS",
        "KeyT",
        "KeyU",
        "KeyV",
        "KeyW",
        "KeyX",
        "KeyY",
        "KeyZ",
        "IntlBackslash",
        "Comma",
        "Period",
        "Slash",
        "Enter",
        "Backspace",
        "Digit1",
        "Digit2",
        "Digit3",
        "Digit4",
        "Digit5",
        "Digit6",
        "Digit7",
        "Digit8",
        "Digit9",
        "Digit0",
        "Numpad1",
        "Numpad2",
        "Numpad3",
        "Numpad4",
        "Numpad5",
        "Numpad6",
        "Numpad7",
        "Numpad8",
        "Numpad9",
        "Numpad0",
        "NumpadDecimal",
        "NumpadEnter",
        "NumpadAdd",
        "NumpadSubtract",
        "NumpadMultiply",
        "NumpadDivide",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
    ];
    private _keyPressed: Record<string, boolean> = {};
    private _callbackFunctionsPressed: Record<string, Record<string, (data: any) => void>> = {};
    private _callbackFunctionsReleased: Record<string, Record<string, (data: any) => void>> = {};
    private _data: Record<string, Record<string, any>> = {};

    public constructor(scene: Scene) {
        for (let code of this.KEY_CODES) {
            this._keyPressed[code] = false;
        }
        for (let code of this.KEY_CODES) {
            this._callbackFunctionsPressed[code] = {};
        }
        for (let code of this.KEY_CODES) {
            this._callbackFunctionsReleased[code] = {};
        }
        for (let code of this.KEY_CODES) {
            this._data[code] = {};
        }
        
        window.addEventListener("keydown", (ev) => {
            if (this.KEY_CODES.includes(ev.code)) {
                if (!this._keyPressed[ev.code]) {
                    this._keyPressed[ev.code] = true;
                    for (let callerId in this._callbackFunctionsPressed[ev.code]) {
                        let functionToCall = this._callbackFunctionsPressed[ev.code][callerId];
                        let data = this._data[ev.code][callerId];
                        functionToCall(data);
                    }
                }
            }
        });
        window.addEventListener("keyup", (ev) => {
            if (this.KEY_CODES.includes(ev.code)) {
                if (this._keyPressed[ev.code]) {
                    this._keyPressed[ev.code] = false;
                    for (let callerId in this._callbackFunctionsReleased[ev.code]) {
                        let functionToCall = this._callbackFunctionsReleased[ev.code][callerId];
                        let data = this._data[ev.code][callerId];
                        functionToCall(data);
                    }
                }
            }
        });
    }
    
    /**
     * Get if a key is currently pressed.
     * @param keyCode
     */
    public isPressed(keyCode: string): boolean {
        return this._keyPressed[keyCode];
    }
    
    /**
     * Register a callback.
     * @param keyCode The keyboard code of the wanted key button
     * @param callerId A unique ID of the one registering this callback
     * @param callbackFunctionPressed The function to be called when the key is pressed
     * @param callbackFunctionReleased The function to be called when the key is released
     * @param data Some data that can be passed to the functions
     */
    public registerCallback(keyCode: string, callerId: string, callbackFunctionPressed: (data: any) => void, callbackFunctionReleased: (data: any) => void, data: any) {
        this._callbackFunctionsPressed[keyCode][callerId] = callbackFunctionPressed;
        this._callbackFunctionsReleased[keyCode][callerId] = callbackFunctionReleased;
        this._data[keyCode][callerId] = data;
    }
    
    /**
     * Unregister a callback.
     * @param keyCode The keyboard code of the wanted key button
     * @param callerId A unique ID of the one registering this callback
     */
    public unregisterCallback(keyCode: string, callerId: string) {
        delete this._callbackFunctionsPressed[keyCode][callerId];
        delete this._callbackFunctionsReleased[keyCode][callerId];
        delete this._data[keyCode][callerId];
    }
}