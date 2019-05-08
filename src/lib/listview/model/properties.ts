import { IListConfig } from "../api/list-config.interface";

export class Properties {

    private _colCount = 1;

    private _splitDirection: "vertical" | "horizontal";

    private _splitAlign: "vertical" | "horizontal";

    public set cols(count: number) {
        this._colCount = count;
    }

    public get cols(): number {
        return this._colCount;
    }
}
