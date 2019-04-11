import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
} from "@angular/core";
import { Subject } from "rxjs";
import { ISelection } from "../api/selection.interface";
import { SelectionModel } from "@angular/cdk/collections";
import { IListItem } from "../api/list-item.interface";
import { ListSource } from "../model/list-source";

@Component({
    selector: "davinci-listview",
    templateUrl: "listview.component.html",
    styleUrls: ["listview.component.scss"]
})
export class ListViewComponent<T> implements OnInit, OnDestroy {
    @Output()
    public select: EventEmitter<ISelection>;

    public ready = false;

    public source: ListSource<T>;

    public selections: SelectionModel<IListItem<T>>;

    private destroy$: Subject<boolean> = new Subject();

    constructor() {
        this.select = new EventEmitter();
        this.selections = new SelectionModel<IListItem<T>>(true);
    }

    @Input()
    public set dataSource(source: ListSource<T>) {
        this.source = source;
    }

    public ngOnInit() {
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public itemClick(item: IListItem<T>) {
        /** we need to know we have that selection or not */
        this.selections.isSelected(item)
            ? this.deselectItem(item)
            : this.selectItem(item);
    }

    private selectItem(item: IListItem<T>) {
        this.selections.select(item);
        this.source.select(item);
    }

    private deselectItem(item: IListItem<T>) {
        this.selections.deselect(item);
        this.source.deselect(item);
    }
}
