export class GenericListMock implements EngineAPI.IGenericList {
    id: string;
    type: string;
    genericType: string;
    session: enigmaJS.ISession;
    handle: number;

    public app: EngineAPI.IApp = null;

    private eventMap: Map<"changed" | "closed", Array<() => void>> = new Map();

    on( event: "changed" | "closed", func: () => void ): void {
        if (!this.eventMap.has(event)) {
            this.eventMap.set(event, []);
        }

        if (this.eventMap.get(event).indexOf(func) === -1) {
            this.eventMap.get(event).push(func);
        }
    }

    emit( event: "changed" | "closed" ): void {
        this.eventMap.get(event).forEach((fn) => fn());
    }

    abortListObjectSearch(qPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    acceptListObjectSearch(
        qPath: string,
        qToggleMode: boolean,
        qSoftLock?: boolean
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }

    applyPatches(
        qPatches: EngineAPI.INxPatch[],
        qSoftPatch?: boolean
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }

    beginSelections(qPaths: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    clearSelections(qPath: string, qColIndices?: number[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    clearSoftPatches(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    collapseLeft(
        qPath: string,
        qRow: number,
        qCol: number,
        qAll: boolean
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }

    collapseTop(
        qPath: string,
        qRow: number,
        qCol: number,
        qAll: boolean
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }

    copyFrom(qFromId: EngineAPI.IGenericObjectProperties): Promise<void> {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:max-line-length
    createChild(
        qProp: EngineAPI.IGenericObjectProperties,
        qPropForThis?: EngineAPI.IGenericObjectProperties
    ): Promise<EngineAPI.IGenericObject> {
        throw new Error("Method not implemented.");
    }

    destroyAllChildren(
        qPropForThis?: EngineAPI.IGenericObjectProperties
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }

    destroyChild(
        qid: string,
        qPropForThis?: EngineAPI.IGenericObjectProperties
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    drillUp(qPath: string, qDimNo: number, qNbrSteps: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    embedSnapshotObject(qId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    endSelections(qAccept: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }

    expandLeft(
        qPath: string,
        qRow: number,
        qCol: number,
        qAll: boolean
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }

    expandTop(
        qPath: string,
        qRow: number,
        qCol: number,
        qAll: boolean
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:max-line-length
    exportData(
        qFileType: EngineAPI.FileType,
        qPath: string,
        qFileName?: string,
        qExportState?: EngineAPI.ExportStateType
    ): Promise<string> {
        throw new Error("Method not implemented.");
    }

    getLayout(): Promise<EngineAPI.IGenericListLayout> {
        throw new Error("Method not implemented.");
    }
    getProperties(): Promise<EngineAPI.IGenericListProperties> {
        throw new Error("Method not implemented.");
    }

    getChildInfos(): Promise<EngineAPI.INxInfo[]> {
        throw new Error("Method not implemented.");
    }

    getChild(qId: string): Promise<EngineAPI.IGenericObject> {
        throw new Error("Method not implemented.");
    }

    getEffectiveProperties(): Promise<EngineAPI.IGenericObjectProperties> {
        throw new Error("Method not implemented.");
    }

    getFullPropertyTree(): Promise<EngineAPI.IGenericObjectEntry> {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:max-line-length
    getHyperCubeBinnedData(
        qPath: string,
        qPages: EngineAPI.INxPage[],
        qViewport: EngineAPI.INxViewPort,
        qDataRanges: EngineAPI.INxDataAreaPage,
        qMaxNbrCells: number,
        qQueryLevel: number,
        qBinningMethod: number
    ): Promise<EngineAPI.INxDataPage[]> {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:max-line-length
    getHyperCubeContinuousData(
        qPath: string,
        qOptions: EngineAPI.IContinuousDataOptions[]
    ): Promise<{
        qDataPages: EngineAPI.INxDataPage[];
        qAxisData: EngineAPI.INxAxisData[];
    }> {
        throw new Error("Method not implemented.");
    }

    getHyperCubeData(
        qPath: string,
        qPages: EngineAPI.INxPage[]
    ): Promise<EngineAPI.INxDataPage[]> {
        throw new Error("Method not implemented.");
    }

    getHyperCubePivotData(
        qPath: string,
        qPages: EngineAPI.INxPage[]
    ): Promise<EngineAPI.INxPivotPage[]> {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:max-line-length
    getHyperCubeReducedData(
        qPath: string,
        qPages: EngineAPI.INxPage[],
        qZoomFactor: number,
        qReductionMode: EngineAPI.ReductionModeType
    ): Promise<EngineAPI.INxDataPage[]> {
        throw new Error("Method not implemented.");
    }

    getHyperCubeStackData(
        qPath: string,
        qPages: EngineAPI.INxPage[],
        qMaxNbrCells?: number
    ): Promise<EngineAPI.INxStackPage[]> {
        throw new Error("Method not implemented.");
    }

    getHyperCubeTreeData(
        qPath: string,
        qNodeOptions: EngineAPI.INxTreeDataOption[]
    ): Promise<EngineAPI.INxTreeNode> {
        throw new Error("Method not implemented.");
    }

    getInfo(): Promise<EngineAPI.INxInfo> {
        throw new Error("Method not implemented.");
    }

    getLinkedObjects(): Promise<EngineAPI.INxLinkedObjectInfo[]> {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:max-line-length
    getListObjectContinuousData(
        qPath: string,
        qOptions: EngineAPI.IContinuousDataOptions
    ): Promise<{
        qDataPages: EngineAPI.INxDataPage;
        qAxisData: EngineAPI.INxAxisData[];
    }> {
        throw new Error("Method not implemented.");
    }

    getListObjectData(
        qPath: string,
        qPages: EngineAPI.INxPage[]
    ): Promise<EngineAPI.INxDataPage[]> {
        return Promise.resolve([]);
    }

    getSnapshotObject(): Promise<EngineAPI.IGenericBookmark> {
        throw new Error("Method not implemented.");
    }

    lock(qPath: string, qColIndices?: number[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    publish(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:max-line-length
    multiRangeSelectHyperCubeValues(
        qPath: string,
        qRanges: EngineAPI.INxMultiRangeSelectInfo,
        qDeselectOnlyOneSelected: boolean,
        qColumnsToSelect?: number[],
        qOrMode?: boolean
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    // tslint:disable-next-line:max-line-length
    rangeSelectHyperCubeValues(
        qPath: string,
        qRanges: EngineAPI.INxRangeSelectInfo[],
        qDeselectOnlyOneSelected: boolean,
        qColumnsToSelect?: number[],
        qOrMode?: boolean
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    resetMadeSelections(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    searchListObjectFor(qPath: string, qMatch: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:max-line-length
    selectHyperCubeCells(
        qPath: string,
        qRowIndices: number[],
        qColIndices: number[],
        qSoftLock: boolean,
        qDeselectOnlyOneSelected: boolean
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:max-line-length
    selectHyperCubeContinuousRange(
        qPath: string,
        qRanges: EngineAPI.INxContinuousRangeSelectInfo[],
        qSoftLock: boolean
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    selectHyperCubeValues(
        qPath: string,
        qDimNo: number,
        qValues: number[],
        qToggleMode: boolean
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    selectListObjectAll(qPath: string, qSoftLock?: boolean): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    selectListObjectAlternative(
        qPath: string,
        qSoftLock?: boolean
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    selectListObjectContinuousRange(
        qPath: string,
        qRanges: Range[],
        qSoftLock?: boolean
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    selectListObjectExcluded(
        qPath: string,
        qSoftLock?: boolean
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    selectListObjectPossible(
        qPath: string,
        qSoftLock?: boolean
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    selectListObjectValues(
        qPath: string,
        qValues: number[],
        qToggleMode: boolean,
        qSoftLock?: boolean
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:max-line-length
    selectPivotCells(
        qPath: string,
        qSelections: EngineAPI.INxSelectionCell[],
        qDeselectOnlyOneSelected: boolean,
        qSoftLock?: boolean
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    setChildArrayOrder(qIds: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    setFullPropertyTree(
        qPropEntry: EngineAPI.IGenericObjectEntry
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }

    setProperties(qProp: EngineAPI.IGenericObjectProperties): Promise<void> {
        throw new Error("Method not implemented.");
    }

    unlock(qPath: string, qColIndices?: number[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    unPublish(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
