import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

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

    public constructor() {
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

    public isPressed(keyCode: string): boolean {
        return this._keyPressed[keyCode];
    }

    public registerCallback(keyCode: string, callerId: string, callbackFunctionPressed: (data: any) => void, callbackFunctionReleased: (data: any) => void, data: any) {
        this._callbackFunctionsPressed[keyCode][callerId] = callbackFunctionPressed;
        this._callbackFunctionsReleased[keyCode][callerId] = callbackFunctionReleased;
        this._data[keyCode][callerId] = data;
    }

    public unregisterCallback(keyCode: string, callerId: string) {
        delete this._callbackFunctionsPressed[keyCode][callerId];
        delete this._callbackFunctionsReleased[keyCode][callerId];
        delete this._data[keyCode][callerId];
    }
}