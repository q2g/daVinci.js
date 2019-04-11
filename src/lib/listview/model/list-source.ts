import { DataSource, CollectionViewer } from "@angular/cdk/collections";
import { IListItem } from "../public_api";
import { Subject, Observable, BehaviorSubject, Subscription } from "rxjs";

export abstract class ListSource<T> extends DataSource<IListItem<T>> {

    public update$: Subject<IListItem<T>[]> = new Subject();

    private cachedData = Array.from<IListItem<T>>({length: 61});

    private dataStream = new BehaviorSubject<(IListItem<T>)[]>(this.cachedData);

    private pageSize = 20;

    private subscription = new Subscription();

    private fetchedPages: Set<number> = new Set();

    /** connect to cdk virtual scroll viewport */
    public connect(collectionViewer: CollectionViewer): Observable<IListItem<T>[]> {
        this.subscription.add(
            collectionViewer.viewChange
            .subscribe(range => {
                const startPage = this.getPageForIndex(range.start);
                const endPage   = this.getPageForIndex(range.end);

                for (let i = startPage; i <= endPage; i++) {
                    this.loadDataPage(i);
                }
            })
        );
        return this.dataStream;
    }

    public disconnect(collectionViewer: CollectionViewer): void {
        this.subscription.unsubscribe();
    }

    private getPageForIndex(index: number): number {
        return Math.floor(index / this.pageSize);
    }

    private async loadDataPage(page) {
        if (this.fetchedPages.has(page)) {
            return;
        }
        const items = await this.loadItems(page);
        /** replace data in cache */
        this.cachedData.splice( page * this.pageSize, this.pageSize, ...items);
        this.fetchedPages.add(page);
        this.dataStream.next(this.cachedData);
    }

    abstract loadItems(page: number): Promise<IListItem<T>[]>;

    abstract select(item: IListItem<T>);

    abstract deselect(item: IListItem<T>);
}
