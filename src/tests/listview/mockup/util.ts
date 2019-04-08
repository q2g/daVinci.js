/** generate list object data */
export function createListObjectData(
  matrix: EngineAPI.INxCellRows[]
): EngineAPI.INxDataPage[] {
  /** generate rows */
  return [
    {
      qMatrix: matrix,
      qArea: {
        qHeight: 10,
        qLeft: 0,
        qTop: 0,
        qWidth: 1
      },
      qIsReduced: false,
      qTails: []
    }
  ];
}

/** generate matrix */
export function createMatrix(
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
              `${rIdx}${pad(cIdx, colCount.toString().length)}`,
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
function pad(num, size) {
  let s = String(num);
  while (s.length < size) {
    s = `0${s}`;
  }
  return s;
}
