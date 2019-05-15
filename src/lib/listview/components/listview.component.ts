import {
    Component,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    HostBinding,
    OnInit,
    ElementRef,
    AfterViewInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    TemplateRef
} from "@angular/core";
import { ViewportControl, DomHelper } from "ngx-customscrollbar";
import { Subject, ReplaySubject } from "rxjs";
import { takeUntil, switchMap } from "rxjs/operators";
import { WindowResize } from "../../core/window-resize.service";
import { IListItem } from "../api/list-item.interface";
import { ListOrientation } from "../api/list-config.interface";
import { ListSource } from "../model/list-source";
import { MatrixHelper } from "../helper/matrix.helper";
import { VirtualScrollDirective } from "../virtual-scroll/virtual-viewport.directive";

@Component( {
    selector: "davinci-listview",
    templateUrl: "listview.component.html",
    styleUrls: ["listview.component.scss"],
    viewProviders: [ViewportControl],
    exportAs: "DavinciListView",
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class ListViewComponent<T> implements OnDestroy, OnInit, AfterViewInit {

    @Output()
    public selectItem: EventEmitter<IListItem<T>>;

    @ViewChild( VirtualScrollDirective )
    private scrollbarViewport: VirtualScrollDirective;

    public total = 0;

    public rows: IListItem<T>[][] = [];

    public header: any[] = [];

    /** @todo put to model */
    private pageSize: number;

    /** @todo put to model */
    private start = 0;

    /** @todo put to model */
    private domSize: DomHelper.IElementMeasure;

    /** @todo put to model */
    private _cols = 1;

    private sourceConnector: ReplaySubject<ListSource<T>>;

    private source: ListSource<T>;

    /** subject which emits true if component gets destroyed */
    private destroy$: Subject<boolean> = new Subject();

    constructor(
        private windowResize: WindowResize,
        private hostEl: ElementRef,
        private changeDetector: ChangeDetectorRef,
        private viewControl: ViewportControl
    ) {
        this.sourceConnector = new ReplaySubject( 1 );
        this.selectItem = new EventEmitter();
    }

    @Input()
    public set dataSource( source: ListSource<T> ) {
        if ( source ) {
            this.addDataSource( source );
        }
    }

    @Input()
    public set cols( cols: number ) {
        if ( cols && this._cols !== cols ) {
            this._cols = cols;
        }
    }

    public get cols(): number {
        return this._cols;
    }

    @Input()
    @HostBinding( "class" )
    @HostBinding( "class.davinci-listview" )
    public listAlign: ListOrientation = "vertical";

    @Input()
    public splitAlign: ListOrientation = "vertical";

    @Input()
    public itemSize: number;

    @Input()
    public itemTemplate: TemplateRef<T>;

    public ngOnInit() {

        this.windowResize.onChange()
            .pipe( takeUntil( this.destroy$ ) )
            .subscribe( () => {
                this.resize();
            } );
    }

    /**
     *
     */
    public search( value: string ) {
        this.start = 0;
        /** search triggers update */
        this.source.search( value );
    }

    public ngAfterViewInit() {
        const el: HTMLElement = this.hostEl.nativeElement;
        this.domSize = DomHelper.getMeasure( el );

        this.sourceConnector.subscribe( async ( source ) => {
            this.source = source;
            const size = this.listAlign === "vertical" ? this.domSize.innerHeight : this.domSize.innerWidth;
            this.pageSize = Math.ceil( size / this.itemSize );
            this.paint( await this.loadItems() );
        } );
    }

    /** we have scrolled a specific amount and have to load items */
    public async scrolled( range ) {
        this.start = range.top;
        this.paint( await this.loadItems() );
    }

    public ngOnDestroy() {
        this.destroy$.next( true );
        this.destroy$.complete();
    }

    /** if we click on an item select / deselect */
    public itemClick( item: IListItem<T> ) {

        /**
         * we dont want make selections here, since we dont know what should happen on a click
         */
        this.selectItem.emit( item );
        // this.selections.isSelected( item ) ? this.deselectItem( item ) : this.selectItem( item );
    }

    public async resize() {
        /** update size */
        this.updateSize();
        this.scrollbarViewport.updateSize();
        /** forces scrollbars to recalculate not to scroll */
        this.viewControl.update();
    }

    public async reload() {
        this.updateSize();
        this.viewControl.reset();
    }

    private updateSize() {
        this.domSize = DomHelper.getMeasure( this.hostEl.nativeElement );
        const size = this.listAlign === "vertical" ? this.domSize.innerHeight : this.domSize.innerWidth;
        this.pageSize = Math.ceil( size / this.itemSize );

        if ( this.source ) {
            /** @todo refactoring move to own method */
            const viewportSize = this.listAlign === "vertical" ? this.domSize.innerHeight : this.domSize.innerWidth;
            const contentSize = this.pageSize * this.itemSize;

            /** get matrix dimension */
            const possibleSize = Math.min( this.source.total, this.pageSize * this._cols );
            const matrix = MatrixHelper.getMatrixSize( viewportSize, contentSize, possibleSize, this.pageSize, this._cols );
            const missingRows = Math.max( this.source.total - ( matrix.rows * this._cols ), 0 );

            this.scrollbarViewport.itemsTotal = matrix.rows + missingRows;
        }
    }

    /** load items for current page */
    private async loadItems(): Promise<IListItem<T>[]> {
        if ( this.source ) {
            return await this.source.load( this.start, this.pageSize * this._cols );
        }
        return [];
    }

    /** add new datasource to our view */
    private async addDataSource( source: ListSource<T> ) {

        if ( this.source ) {
            await this.source.disconnect();
        }

        this.source = source;
        await this.source.connect();
        this.sourceConnector.next( this.source );

        this.source.update$
            .pipe( switchMap( () => this.loadItems() ) )
            .subscribe( ( result ) => this.paint( result ) );
    }

    /**
     * @todo refactoring, we should not calculate total amount of items and matrix size every time
     * the amount of items will be reduced by search only and not if we scroll
     */
    private paint( data ) {

        if ( !this.source ) {
            return;
        }

        const viewportSize = this.listAlign === "vertical" ? this.domSize.innerHeight : this.domSize.innerWidth;
        const contentSize = this.pageSize * this.itemSize;

        /** get matrix dimension */
        const matrix = MatrixHelper.getMatrixSize( viewportSize, contentSize, data.length, this.pageSize, this._cols );

        /** convert to matrix for template */
        const rows = this.splitAlign === "vertical"
            ? MatrixHelper.createVerticalAlignMatrix<IListItem<T>>( data, matrix.cols, matrix.rows )
            : MatrixHelper.createHorizontalAlignMatrix<IListItem<T>>( data, matrix.cols, matrix.rows );

        /** get max rows which can displayed per page */
        /** get rows which will be added on scroll */
        const missingRows = Math.max( this.source.total - ( matrix.rows * this._cols ), 0 );
        this.total = rows.length + missingRows;
        this.rows = rows;

        this.header = this.source.getHeader();
        this.changeDetector.detectChanges();
        this.viewControl.update();
    }

    public expandCollapseItem?( item: IListItem<T> ) {
        this.source.expandCollapseItem( item );
    }
}
