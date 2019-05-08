// tslint:disable-next-line: max-line-length
import { Component, OnDestroy, Input, Output, EventEmitter, HostBinding, OnInit, ElementRef, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { ViewportControl, DomHelper } from "ngx-customscrollbar";
import { Subject, ReplaySubject } from "rxjs";
import { takeUntil, switchMap } from "rxjs/operators";
import { WindowResize } from "../../core/window-resize.service";
import { ISelection } from "../api/selection.interface";
import { IListItem } from "../api/list-item.interface";
import { ListOrientation } from "../api/list-config.interface";
import { ListSource } from "../model/list-source";
import { MatrixHelper } from "../helper/matrix";

@Component({
    selector: "davinci-listview",
    templateUrl: "listview.component.html",
    styleUrls: ["listview.component.scss"],
    viewProviders: [ViewportControl],
    exportAs: "DavinciListView",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListViewComponent<T> implements OnDestroy, OnInit, AfterViewInit {

    @Output()
    public select: EventEmitter<ISelection>;

    public total = 0;

    public rows: IListItem<T>[][] = [];

    public selections: SelectionModel<IListItem<T>>;

    private sourceConnector: ReplaySubject<ListSource<T>>;

    private source: ListSource<T>;

    /** @todo put to model */
    private pageSize: number;

    /** @todo put to model */
    private start: 0;

    /** @todo put to model */
    private domSize: DomHelper.IElementMeasure;

    /** @todo put to model */
    private _cols = 1;

    /** subject which emits true if component gets destroyed */
    private destroy$: Subject<boolean> = new Subject();

    constructor(
        private windowResize: WindowResize,
        private hostEl: ElementRef,
        private changeDetector: ChangeDetectorRef
    ) {
        this.sourceConnector = new ReplaySubject(1);
        this.select = new EventEmitter();
        this.selections = new SelectionModel<IListItem<T>>(true);
    }

    @Input()
    public set dataSource(source: ListSource<T>) {
        if (source) {
            this.addDataSource(source);
        }
    }

    @Input()
    public set cols(cols: number) {
        this._cols = cols;
    }

    @Input()
    @HostBinding( "class" )
    @HostBinding( "class.davinci-listview" )
    public orientation: ListOrientation = "vertical";

    @Input()
    public itemSize: number;

    public ngOnInit() {
        this.changeDetector.detach();
        this.windowResize.onChange()
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    /**
     *
     */
    public search(value: string) {
        this.start = 0;
        /** search triggers update */
        this.source.search(value);
    }

    public ngAfterViewInit() {
        const el: HTMLElement = this.hostEl.nativeElement;
        this.domSize = DomHelper.getMeasure(el);

        this.sourceConnector.subscribe(async (source) => {
            this.source       = source;
            this.pageSize     = Math.ceil(this.domSize.innerHeight / this.itemSize);
            this.paint(await this.loadItems());
        });
    }

    /** we have scrolled a specific amount and have to load items */
    public async scrolled(range) {
        this.start = range.top;
        this.paint(await this.loadItems());
    }

    public ngOnDestroy() {
        this.destroy$.next( true );
        this.destroy$.complete();
    }

    /** if we click on an item select / deselect */
    public itemClick(item: IListItem<T>) {
        this.selections.isSelected(item) ? this.deselectItem(item) : this.selectItem(item);
    }

    /** load items for current page */
    private loadItems(): Promise<IListItem<T>[]> {
        return this.source.load(this.start, this.pageSize * this._cols);
    }

    /** select an item */
    private selectItem( item: IListItem<T> ) {
        this.selections.select(item);
        this.source.select(item);
    }

    /** deselect an item */
    private deselectItem( item: IListItem<T> ) {
        this.selections.deselect( item );
        this.source.deselect(item);
    }

    /** add new datasource to our view */
    private async addDataSource(source: ListSource<T>) {

        if (this.source) {
            await this.source.disconnect();
        }

        this.source = source;
        await this.source.connect();
        this.sourceConnector.next(this.source);

        this.source.update$
            .pipe(switchMap(() => this.loadItems()))
            .subscribe((result)  => this.paint(result));
    }

    private paint(data) {
        const viewportHeight = this.domSize.innerHeight;
        const contentHeight  = this.pageSize * this.itemSize;

        /** get matrix dimension */
        const matrix = MatrixHelper.getVerticalMatrixSize(viewportHeight, contentHeight, data.length, this.pageSize, this._cols);
        /** convert to matrix */
        const rows = MatrixHelper.createVerticalDataMatrix<IListItem<T>>(data, matrix.cols, matrix.rows);

        /** get max rows which can displayed per page */
        /** get rows which will be added on scroll */
        const missingRows = Math.max(this.source.total - (rows.length * this._cols), 0);
        this.total = rows.length + missingRows;
        this.rows = rows;

        this.changeDetector.detectChanges();
    }
}
