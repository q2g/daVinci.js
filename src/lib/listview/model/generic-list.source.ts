import { IListItem } from "../api/list-item.interface";
import { ListSource } from "./list-source";
// import { createCell } from "@testing/mocks/util";

declare type bn = IListItem<EngineAPI.INxCell> | IListItem<EngineAPI.INxCell>[];

/** only possible to make it free from listsource is to use a decorator */
export class GenericListSource extends ListSource<EngineAPI.INxCell> {

    /** data source we get data */
    private genericList: EngineAPI.IGenericList;

    public constructor(genericList: EngineAPI.IGenericList) {
        super();
        this.genericList = genericList;
        this.registerEvents();
    }

    public async loadItems(page: number): Promise<IListItem<EngineAPI.INxCell>[]> {
        const data = await this.genericList.getListObjectData(
            "/qListObjectDef",
            [this.calculatePage(page)]
        );
        return this.convertDataPage(data);
    }

    /**
     * deselect one or multiple items on hypercube
     */
    public deselect(item: bn) {
        this.toggleSelection(item);
    }

    /**
     * select one or multiple items on listobject
     */
    public select(
        item: IListItem<EngineAPI.INxCell> | IListItem<EngineAPI.INxCell>[]
    ) {
        this.toggleSelection(item);
    }

    /**
     * toggle selection on selected values
     */
    private toggleSelection(
        item: IListItem<EngineAPI.INxCell> | IListItem<EngineAPI.INxCell>[]
    ) {
        const items: IListItem<EngineAPI.INxCell>[] = Array.isArray(item) ? item : [item];
        const selected = items.map(cell => cell.raw.qElemNumber);

        this.genericList.selectListObjectValues(
            "/qListObjectDef",
            selected,
            true,
            false
        );
    }

    /**
     */
    public update() {
        throw { message: "Method not implemented" };
    }

    /**
     * flatten matrix to simple array of list items
     */
    private convertDataPage(data: EngineAPI.INxDataPage[]): IListItem<EngineAPI.INxCell>[] {
        if (!Array.isArray(data) || !data.length) {
            return [];
        }
        const pageData = data[0].qMatrix;
        const reduced = pageData.reduce<IListItem<EngineAPI.INxCell>[]>(
            (prev, col) => {
                const items = col.map(value => {
                    return { label: value.qText, raw: value };
                });
                return prev.concat(...items);
            },
            []
        );
        return reduced;
    }

    private registerEvents() {
        this.genericList.on("changed", () => {
            this.update$.next();
        });
    }

    private calculatePage(page: number): EngineAPI.INxPage {
        return {
            qHeight: 20,
            qLeft: 0,
            qTop: page * 20,
            qWidth: 1
        };
    }
}
