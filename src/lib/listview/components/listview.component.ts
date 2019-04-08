import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { ISelection } from "../api/selection.interface";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
    selector: "davinci-listview",
    templateUrl: "listview.component.html",
    styleUrls: ["listview.component.scss"]
})
export class ListViewComponent implements OnInit, OnDestroy {

    @Output()
    public select: EventEmitter<ISelection>;

    public items: EngineAPI.INxCell[];

    private destroy$: Subject<boolean> = new Subject();

    private selections: SelectionModel<EngineAPI.INxCell>;

    private source: EngineAPI.IGenericObject;

    constructor() {
        this.select = new EventEmitter();
        this.selections = new SelectionModel<EngineAPI.INxCell>(true);
    }

    @Input()
    public set dataSource(source: EngineAPI.IGenericObject) {
        this.source = source;
    }

    async ngOnInit() {
        this.prepareData(await this.source.getListObjectData("/qListObjectDef", []));
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public itemClick(item: EngineAPI.INxCell) {
        this.selections.toggle(item);
        this.source.selectListObjectValues("/qListObjectDef", [item.qElemNumber], true, false);
    }

    private prepareData(data: EngineAPI.INxDataPage[]) {
        /** flatten data */
        const dataPage = data[0];
        const itemData = dataPage.qMatrix.reduce((flattened, row) => {
            return flattened.concat(...row);
        }, []);
        this.items = itemData;
    }
}
