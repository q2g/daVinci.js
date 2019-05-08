export class MatrixHelper {

    /**
     * convert data to MxN matrix
     *
     * it is important to understand this will be very flexible if not enough items exists to fill matrix
     * completly and 1 col will be completly empty so we dont need to create it
     *
     * @example 6x3 matrix with 10 items which results in a 6x2 matrix
     * const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // 10 items
     *
     * // this should create data for a matrix which can show up 18 items, 6 rows, 3 cols max 18 items
     * // but we only have enough data for 10 items this means 6 rows, 2 cols max 12 items which can applied to 2 cols
     * const maxRows = 6;
     * const cols = 3;
     *
     * const matrix = createVerticalDataMatrix(data, cols, maxRows);
     *
     * // prints 6 rows with max 2 cols, 2 items will be undefined since we only got 10 items in our data array
     * // [
     * //  [1, 7]
     * //  [2, 8]
     * //  [3, 9]
     * //  [4, 0]
     * //  [5, undefined]
     * //  [6, undefined]
     * // ]
     * console.log(matrix);
     *
     * @example 4x3 matrix with 10 items
     * const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // 10 items
     *
     * // create matrix which can contain max of 12 items, we could put all items in 4x3 matrix
     * // but a 4x2 matrix would be not enough since this can only contain 8 items
     * const maxRows = 4;
     * const cols = 3;
     *
     * const matrix = createVerticalDataMatrix(data, cols, maxRows);
     *
     * // prints 4 rows with max 3 cols, 2 items will be undefined since we only got 10 items in our data array
     * // [
     * //  [1, 5, 9]
     * //  [2, 6, 0]
     * //  [3, 7, undefined]
     * //  [4, 8, undefined]
     * // ]
     * console.log(matrix);
     */
    public static createVerticalDataMatrix<T>(data: T[], colCount: number, rowCount: number): T[][] {

        // max rows we can paint
        const rowsMax   = Math.min(data.length, rowCount);

        // max cols we can paint
        const colsPossible = Math.ceil(data.length / rowCount);
        // const colsMax      = colsPossible > colCount ? colCount : colsPossible;
        const colsMax = Math.min(colsPossible, colCount);

        /** create new matrix */
        const matrix = Array.from({length: rowsMax}, (val, row) => {
            const cols = [];
            /** internal loop to fill up a row with items */
            for (let i = 0; i < colsMax; i++) {
                const idx = rowCount * i + row;
                cols.push(data[idx]);
            }
            return cols;
        });
        return matrix;
    }

    public static getVerticalMatrixSize(maxHeight: number, contentHeight: number, items: number, rows: number, cols = 1) {

        const size = { cols, rows };

        /** if we dont have an overflow or only one column return matrix size as we need it */
        if (cols === 1 || maxHeight > contentHeight) {
            return size;
        }

        /** if we can show all items in a simple row */
        if (items < rows * cols - cols) {
            return {
                cols,
                rows: rows - 1
            };
        }

        return size;
    }

    /** convert list data which has been loaded to horiztal matrix */
    public static createHorizontalDataMatrix<T>(data: T[], colCount: number): T[][] {
        return [[]];
    }
}
