import { GenericListMock } from "../../_mockup/generic-list.mockup";
import { GenericListSource } from "../../q2g-ext-listbox/src/listbox/src/app/generic-list.source";
import { IListItem } from "davinci.js/listview/api/list-item.interface";
import { createListObjectData, createMatrix } from "@testing/mocks/util";

describe("ListView", () => {
    describe("GenericList Source", () => {
        let dataSource: GenericListMock;
        let listSource: GenericListSource;

        beforeEach(() => {
            dataSource = new GenericListMock();
            listSource = new GenericListSource(dataSource);
        });

        it("should call method getListObjectData on ListObjectMock", async () => {
            /** mock getListObjectData on GericList we handle this correctly */
            const spy = spyOn(dataSource, "getListObjectData");
            await listSource.loadItems();
            expect(spy).toHaveBeenCalled();
        });

        /**
         * we should get 10 list items from
         * current data page
         */
        it("should contain 10 items", async () => {
            const matrix = createMatrix(10, 1);
            const data = createListObjectData(matrix);

            /** mock getListObjectData on GericList we handle this correctly */
            spyOn(dataSource, "getListObjectData").and.returnValue(
                Promise.resolve(data)
            );

            const items = await listSource.loadItems();
            expect(items.length).toBe(10);
        });

        /**
         * data should be mapped to be a IListItem so we could display it as list
         */
        it("should contain list items", async () => {
            const matrix = createMatrix(1, 1);
            const data = createListObjectData(matrix);

            /** mock getListObjectData on GericList we handle this correctly */
            spyOn(dataSource, "getListObjectData").and.returnValue(
                Promise.resolve(data)
            );

            const items = await listSource.loadItems();
            expect(items[0].label).toBeDefined();
            expect(items[0].raw).toBeDefined();

            expect(items[0].label).toBe("cell-0");
            expect(items[0].raw).toBe(matrix[0][0]);
        });

        /**
         * test we calll method on generic list
         */
        it("should call select item and call selectListObjectValues on ListObject", async () => {
            const matrix = createMatrix(1, 1);
            const data = createListObjectData(matrix);

            spyOn(dataSource, "getListObjectData").and.returnValue(
                Promise.resolve(data)
            );

            const selectSpy = spyOn(dataSource, "selectListObjectValues");
            const items: IListItem<EngineAPI.INxCell>[] = await listSource.loadItems();

            // select item
            listSource.select(items[0]);

            expect(selectSpy).toHaveBeenCalled();
            expect(selectSpy).toHaveBeenCalledWith(
                "/qListObjectDef",
                [items[0].raw.qElemNumber],
                true,
                false
            );
        });

        /**
         * test select multiple items
         */
        it("should select multiple items at once", async () => {
            const matrix = createMatrix(2, 1);
            const data = createListObjectData(matrix);

            spyOn(dataSource, "getListObjectData").and.returnValue(
                Promise.resolve(data)
            );

            const selectSpy = spyOn(dataSource, "selectListObjectValues");
            const items: IListItem<EngineAPI.INxCell>[] = await listSource.loadItems();

            // select item
            listSource.select(items.slice(0, 2));
            expect(selectSpy).toHaveBeenCalledWith(
                "/qListObjectDef",
                [items[0].raw.qElemNumber, items[1].raw.qElemNumber],
                true,
                false
            );
        });

        it("should call select method on GenericList on deselect an item", async () => {
            const matrix = createMatrix(1, 1);
            const data = createListObjectData(matrix);

            spyOn(dataSource, "getListObjectData").and.returnValue(
                Promise.resolve(data)
            );

            const items = await listSource.loadItems();
            const selectSpy = spyOn(dataSource, "selectListObjectValues");

            listSource.deselect(items[0]);
            expect(selectSpy).toHaveBeenCalledWith(
                "/qListObjectDef",
                [items[0].raw.qElemNumber],
                true,
                false
            );
        });

        it("should submit update$ if a selection has been made", async () => {
            const matrix = createMatrix(1, 1);
            const data = createListObjectData(matrix);

            spyOn(dataSource, "getListObjectData").and.returnValue(
                Promise.resolve(data)
            );

            spyOn(dataSource, "selectListObjectValues").and.callFake(() => {
                dataSource.emit("changed");
            });

            const changedSpy = jasmine.createSpy("changed");
            listSource.update$.subscribe(changedSpy);

            const items = await listSource.loadItems();
            listSource.select([items[0]]);

            expect(changedSpy).toHaveBeenCalled();
        });
    });
});
