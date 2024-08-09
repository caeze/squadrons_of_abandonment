import * as BABYLON from "./import/babylonImports";
import * as BABYLON_GUI from "./import/babylonGuiImports";
import * as SOA from "./import/soaImports";

export class ConsoleFunctions {
    public constructor() {
        (window as any).displayNumber = this._displayNumber;
    }

    private _displayNumber(arg0: number): boolean {
        alert(arg0);
        return true;
    }
}