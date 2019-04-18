import { Component, OnDestroy, Input, Output, EventEmitter, HostBinding, ViewChild, OnInit } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ViewportControl } from "ngx-customscrollbar";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { WindowResize } from "../../core/window-resize.service";
import { ISelection } from "../api/selection.interface";
import { IListItem } from "../api/list-item.interface";
import { ListOrientation } from "../api/list-config.interface";
import { ListSource } from "../model/list-source";

@Component( {
    selector: "davinci-listview",
    templateUrl: "listview.component.html",
    styleUrls: ["listview.component.scss"],
    viewProviders: [ViewportControl]
} )
export class ListViewComponent<T> implements OnDestroy, OnInit {

    @Output()
    public select: EventEmitter<ISelection>;

    @Input()
    @HostBinding( "class" )
    @HostBinding( "class.davinci-listview" )
    public orientation: ListOrientation = "vertical";

    @ViewChild( CdkVirtualScrollViewport )
    private cdkScrollViewport: CdkVirtualScrollViewport;

    public source: ListSource<T>;

    public selections: SelectionModel<IListItem<T>>;

    /** subject which emits true if component gets destroyed */
    private destroy$: Subject<boolean> = new Subject();

    constructor(
        private viewportCtrl: ViewportControl,
        private windowResize: WindowResize
    ) {
        this.select = new EventEmitter();
        this.selections = new SelectionModel<IListItem<T>>( true );
    }

    @Input()
    public set dataSource( source: ListSource<T> ) {
        if ( source ) {
            this.addDataSource( source );
        }
    }

    public ngOnInit() {
        this.windowResize.onChange()
            .pipe( takeUntil( this.destroy$ ) )
            .subscribe(
                () => this.updateSize()
            );
    }

    /** update size of listview */
    public updateSize() {
        this.viewportCtrl.update();
        this.cdkScrollViewport.checkViewportSize();
    }

    public ngOnDestroy() {
        this.destroy$.next( true );
        this.destroy$.complete();
    }

    /** if we click on an item select / deselect */
    public itemClick( item: IListItem<T> ) {
        this.selections.isSelected( item )
            ? this.deselectItem( item )
            : this.selectItem( item );
    }

    /** select an item */
    private selectItem( item: IListItem<T> ) {
        this.selections.select( item );
        this.source.select( item );
    }

    /** deselect an item */
    private deselectItem( item: IListItem<T> ) {
        this.selections.deselect( item );
        this.source.deselect( item );
    }

    /** add new datasource to our view */
    private async addDataSource( source: ListSource<T> ) {
        if ( this.source ) {
            await this.source.destroy();
        }
        this.source = await source.prepare();
    }
}
