import { IListItem } from "../api/list-item.interface";
import { ListSource } from "./list-source";
import { IListConfig } from "../api/list-config.interface";

declare type ListItem = IListItem<EngineAPI.INxCell> | IListItem<EngineAPI.INxCell>[];

/** only possible to make it free from listsource is to use a decorator */
export class GenericListSource extends ListSource<EngineAPI.INxCell> {

    /**
     * Creates an instance of GenericListSource.
     */
    public constructor(
        private genericList: EngineAPI.IGenericList,
        config: IListConfig
    ) {
        super(config);
        this.registerEvents();
    }

    /**
     * deselect one or multiple items on hypercube
     */
    public deselect(item: ListItem) {
        this.toggleSelection(item);
    }

    /**
     * select one or multiple items on listobject
     */
    public select(item: ListItem) {
        this.toggleSelection(item);
    }

    /**
     * get layout from current session object to determine full size
     * of our list
     */
    public async prepare(): Promise<ListSource<EngineAPI.INxCell>> {
        const data     = await this.genericList.getLayout();
        this.totalSize = data.qListObject.qSize.qcy;
        return super.prepare();
    }

    /**
     * toggle selection on selected values
     */
    private toggleSelection(item: ListItem) {
        const items: IListItem<EngineAPI.INxCell>[] = Array.isArray(item) ? item : [item];
        const selected = items.map(cell => cell.raw.qElemNumber);

        this.genericList.selectListObjectValues(
            "/qListObjectDef",
            selected,
            true,
            false
        );
    }

    /** what do do here i think we dont need it */
    public update() {
        throw { message: "Method not implemented" };
    }

    /**  */
    protected async loadItems(page: number): Promise<IListItem<EngineAPI.INxCell>[]> {
        const data = await this.genericList.getListObjectData(
            "/qListObjectDef",
            [{
                qHeight: this.config.pageSize,
                qLeft: 0,
                qTop: page * this.config.pageSize,
                qWidth: 1
            }]
        );
        return this.convertDataPage(data);
    }

    /** flatten matrix to resolve a list we could display */
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

    /** register on changed events on session object */
    private registerEvents() {
        this.genericList.on("changed", () => {
            this.update$.next();
        });
    }
}
