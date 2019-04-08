export class HyperCubeMock implements EngineAPI.IHyperCube {
    // empty matrix for hypercube
    private dataMatrix: EngineAPI.INxCellRows[] = [[]];

    get qStateName(): string {
        return "";
    }

    get qSize(): EngineAPI.ISize {
        return {
            qcx: this.dataMatrix[0].length,
            qcy: this.dataMatrix.length
        };
    }

    get qDimensionInfo(): EngineAPI.INxDimensionInfo[] {
        return [];
    }

    get qMeasureInfo(): EngineAPI.INxMeasureInfo[] {
        return [];
    }

    get qEffectiveInterColumnSortOrder(): number[] {
        return [1];
    }

    get qGrandTotalRow(): EngineAPI.INxCell[] {
        return [];
    }

    get qDataPages(): EngineAPI.INxDataPage[] {
        const size = this.qSize;
        return [
            {
                qMatrix: this.dataMatrix,
                qArea: {
                    qHeight: size.qcy,
                    qLeft: 0,
                    qTop: 0,
                    qWidth: size.qcx
                },
                qTails: [],
                qIsReduced: false
            }
        ];
    }

    get qPivotDataPages(): EngineAPI.INxPivotPage[] {
        return [];
    }

    get qStackedDataPages(): EngineAPI.INxStackPage[] {
        return [];
    }

    get qMode(): EngineAPI.NxHypercubeMode {
        return null;
    }

    get qNoOfLeftDims(): number {
        return 0;
    }

    get qHasOtherValues(): boolean {
        return false;
    }

    public initData(rowCount: number, colCount: number) {
        this.dataMatrix = this.createHyperCubeMatrix(rowCount, colCount);
    }

    private createHyperCubeMatrix(
        rowCount: number,
        colCount: number = 0
    ): EngineAPI.INxCellRows[] {
        /** generate rows */
        const rows = Array.from(
            new Array(rowCount),
            (rVal, rIdx): EngineAPI.INxCellRows => {
                /** generate cols */
                const col = Array.from(
                    new Array(colCount),
                    (cVal, cIdx): EngineAPI.INxCell => {
                        return {
                            qAttrDims: {
                                qValues: []
                            },
                            qAttrExps: {
                                qValues: []
                            },
                            qElemNumber: parseInt(
                                `${rIdx}${this.pad(
                                    cIdx,
                                    colCount.toString().length
                                )}`,
                                10
                            ),
                            qIsNull: false,
                            qState: "L",
                            qText: `row: ${rIdx}, col: ${cIdx}`
                        };
                    }
                );
                return col;
            }
        );

        return rows;
    }

    /** add leading zeros */
    private pad(num, size) {
        let s = String(num);
        while (s.length < size) {
            s = `0${s}`;
        }
        return s;
    }
}
