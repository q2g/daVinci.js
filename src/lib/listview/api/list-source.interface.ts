import { IListItem } from "./list-item.interface";
import { Subject } from "rxjs";

export interface IListSource<T> {

    update$: Subject<IListItem<T>[]>;

    loadItems(): Promise<IListItem<T>[]>;

    select(item: IListItem<T>);

    deselect(item: IListItem<T>);
}
