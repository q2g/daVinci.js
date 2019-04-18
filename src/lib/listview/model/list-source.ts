import { DataSource, CollectionViewer } from "@angular/cdk/collections";
import { IListItem } from "../public_api";
import { Observable, BehaviorSubject, Subscription } from "rxjs";
import { IListConfig } from "../api/list-config.interface";

export abstract class ListSource<T> extends DataSource<IListItem<T>> {

    /** items per page we want to display */
    protected pageSize: number;

    /** total amount of data we have to shown */
    protected totalSize = 0;

    /** current page we display */
    protected currentPages: number[];

    /**
     * all data we have been loaded and displayed in list
     * values will be overriden if new data page has been
     * loaded
     */
    private cachedData: IListItem<T>[];

    /** datastream which will bound to cdk virtual for */
    private dataStream: BehaviorSubject<IListItem<T>[]>;

    private subscription = new Subscription();

    /** all pages we have allready loaded so we dont need to load it again */
    private fetchedPages: Set<number> = new Set();

    /** abstract method to deselect an item */
    public abstract deselect( item: IListItem<T> );

    /** abstract method to select an item */
    public abstract select( item: IListItem<T> );

    /** load items from concrete source */
    protected abstract loadItems( page: number ): Promise<IListItem<T>[]>;

    public constructor(protected config: IListConfig) {
        super();
    }

    /**
     * called only once before source is bound to cdk virtual for
     * create cached data array to save all loaded values so we not calling them again
     * create datastream which will connected to angular cdk virtual for loop
     */
    public async prepare(): Promise<ListSource<T>> {
        this.cachedData = Array.from<IListItem<T>>( { length: this.totalSize } );
        this.dataStream = new BehaviorSubject<IListItem<T>[]>( this.cachedData );
        return this;
    }

    /**
     * connect to cdkVirtualFor as data source
     */
    public connect( collectionViewer: CollectionViewer ): Observable<IListItem<T>[]> {
        this.subscription.add(
            collectionViewer.viewChange.subscribe( range => {
                const startPage = this.getPageForIndex( range.start );
                const endPage = this.getPageForIndex( range.end );

                this.currentPages = [];
                for ( let i = startPage; i <= endPage; i++ ) {
                    this.loadDataPage( i );
                    this.currentPages.push( i );
                }
            } )
        );
        return this.dataStream;
    }

    public async destroy(): Promise<void> {
    }

    /**
     * disconnect from cdkVirtualFor
     */
    public disconnect( collectionViewer: CollectionViewer ): void {
        this.subscription.unsubscribe();
    }

    /**
     * remove all cached data
     */
    protected cleanCache() {
        this.fetchedPages.clear();
        this.cachedData = [];
    }

    /**
     * reload page
     */
    protected reload() {
        this.cleanCache();
        this.cachedData = Array.from<IListItem<T>>( { length: this.totalSize } );
        this.currentPages.forEach( ( page: number ) => {
            this.loadDataPage( page );
        } );
    }

    /**
     * load data for page
     */
    protected async loadDataPage( page ) {
        if ( this.fetchedPages.has( page ) ) {
            return;
        }
        const items = await this.loadItems( page );

        /** replace data in cache */
        this.cachedData.splice(
            page * this.config.pageSize,
            this.config.pageSize,
            ...items
        );
        this.fetchedPages.add( page );
        this.dataStream.next( this.cachedData );
    }

    /**
     * get starting page index
     */
    private getPageForIndex( index: number ): number {
        return Math.floor( index / this.config.pageSize );
    }
}
