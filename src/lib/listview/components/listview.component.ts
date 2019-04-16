import { Component, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { ISelection } from "../api/selection.interface";
import { SelectionModel } from "@angular/cdk/collections";
import { IListItem } from "../api/list-item.interface";
import { ListSource } from "../model/list-source";
import { ViewportControl } from "ngx-customscrollbar";

@Component({
    selector: "davinci-listview",
    templateUrl: "listview.component.html",
    styleUrls: ["listview.component.scss"],
    viewProviders: [ViewportControl]
})
export class ListViewComponent<T> implements OnDestroy {
    @Output()
    public select: EventEmitter<ISelection>;

    public ready = false;

    public source: ListSource<T>;

    public selections: SelectionModel<IListItem<T>>;

    private destroy$: Subject<boolean> = new Subject();

    constructor() {
        this.select     = new EventEmitter();
        this.selections = new SelectionModel<IListItem<T>>(true);
    }

    @Input()
    public set dataSource(source: ListSource<T>) {
        if (source) {
            this.addDataSource(source);
        }
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /** if we click on an item select / deselect */
    public itemClick(item: IListItem<T>) {
        this.selections.isSelected(item)
            ? this.deselectItem(item)
            : this.selectItem(item);
    }

    /** select an item */
    private selectItem(item: IListItem<T>) {
        this.selections.select(item);
        this.source.select(item);
    }

    /** deselect an item */
    private deselectItem(item: IListItem<T>) {
        this.selections.deselect(item);
        this.source.deselect(item);
    }

    /** add new datasource to our view */
    private async addDataSource(source: ListSource<T>) {
        if (this.source) {
            await this.source.destroy();
        }
        this.source = await source.prepare();
    }
}
