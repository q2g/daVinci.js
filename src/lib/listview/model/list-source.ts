import { IListItem } from "../public_api";
import { SourceData } from "./source-data";
import { Subject } from "rxjs";

export abstract class ListSource<T> {

    public update$: Subject<void>;

    /** items per page we want to display */
    protected pageSize: number;

    /** total amount of data we have to shown */
    protected totalSize = 0;

    /** current page we display */
    protected currentPages: number[];

    protected dataModel: SourceData;

    public abstract search(searchVal: string): Promise<boolean>;

    /** load items from concrete source */
    public abstract load(start: number, count: number): Promise<IListItem<T>[]>;

    /**
     * called only once before source is bound to cdk virtual for
     * create cached data array to save all loaded values so we not calling them again
     * create datastream which will connected to angular cdk virtual for loop
     */
    public async connect() {
        this.dataModel = new SourceData();
    }

    /**
     * disconnect from cdkVirtualFor
     */
    public disconnect() {
        this.dataModel = null;
    }

    public constructor() {
        this.update$ = new Subject();
    }

    public get total() {
        return this.dataModel.total;
    }

    public expandCollapseItem(item): void {}

    public scrollTo(item): any {}

    public acceptListObjectSearch(): void {}

    public abortListObjectSearch(): void {}

    public getHeader() {
        return [];
    }
}
