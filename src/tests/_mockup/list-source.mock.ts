import { IListSource } from "davinci.js/listview/api/list-source.interface";
import { IListItem } from "davinci.js/listview/api/list-item.interface";
import { Subject } from "rxjs";

export class ListSourceMock implements IListSource<EngineAPI.INxCell> {

    update$: Subject<IListItem<EngineAPI.INxCell>[]>;

    loadItems(): Promise<IListItem<EngineAPI.INxCell>[]> {
        throw new Error( "Method not implemented." );
    }

    select(item: IListItem<EngineAPI.INxCell>) {
        throw new Error( "Method not implemented." );
    }

    deselect(item: IListItem<EngineAPI.INxCell>) {
        throw new Error("Method not implemented.");
    }
}
