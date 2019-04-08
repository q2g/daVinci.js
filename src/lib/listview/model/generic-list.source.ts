import { IListSource } from "../api/list-source.interface";
import { IListItem } from "../api/list-item.interface";
import { Subject } from "rxjs";

export class GenericListSource implements IListSource<EngineAPI.INxCell> {

    public update$: Subject<IListItem<EngineAPI.INxCell>[]> = new Subject();

    /** data source we get data */
    private listObject: EngineAPI.IGenericList;

    public constructor(listObject: EngineAPI.IGenericList) {
        this.listObject = listObject;
        this.registerEvents();
    }

    public async loadItems(): Promise<IListItem<EngineAPI.INxCell>[]> {
        const data = await this.listObject.getListObjectData(
            "/qListObjectDef",
            [
                {
                    qHeight: 10,
                    qLeft: 0,
                    qTop: 0,
                    qWidth: 1
                }
            ]
        );
        return this.convertDataPage(data);
    }

    /**
     * deselect one or multiple items on hypercube
     */
    public deselect(item: EngineAPI.INxCell | EngineAPI.INxCell[]) {
        this.toggleSelection(item);
    }

    /**
     * select one or multiple items on listobject
     */
    public select(item: EngineAPI.INxCell | EngineAPI.INxCell[]) {
        this.toggleSelection(item);
    }

    /**
     * toggle selection on selected values
     */
    private toggleSelection(item: EngineAPI.INxCell | EngineAPI.INxCell[]) {
        const items: EngineAPI.INxCell[] = Array.isArray(item) ? item : [item];
        const selected = items.map((cell) => cell.qElemNumber);
        this.listObject.selectListObjectValues("/qListObjectDef", selected, true, false);
    }

    /**
     */
    public update() {
        throw { message: "Method not implemented" };
    }

    /**
     * flatten matrix to simple array of list items
     */
    private convertDataPage(
        data: EngineAPI.INxDataPage[]
    ): IListItem<EngineAPI.INxCell>[] {
        if (!Array.isArray(data) || !data.length) {
            return [];
        }

        const pageData = data[0].qMatrix;
        const reduced = pageData.reduce<IListItem<EngineAPI.INxCell>[]>((prev, col) => {
            const items = col.map(value => {
                return { label: value.qText, raw: value };
            });
            return prev.concat(...items);
        }, []);

        return reduced;
    }

    private registerEvents() {
        this.listObject.on("changed", () => {
        });
    }
}
