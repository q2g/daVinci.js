// unit tests comes here
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
  flush
} from "@angular/core/testing";
import { ListViewComponent } from "davinci.js/listview/public_api";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { By } from "@angular/platform-browser";
import { GenericListMock } from "../mockup/generic-object.mockup";

describe("ListView", () => {
  describe("ListComponent", () => {
    let listComponent: ListViewComponent;
    let fixture: ComponentFixture<ListViewComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ScrollingModule],
        declarations: [ListViewComponent]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ListViewComponent);
      listComponent = fixture.componentInstance;
    });

    describe("default", () => {
      it("should create", () => {
        expect(listComponent).toBeTruthy();
      });

      it("should render 2 items from hypercube", fakeAsync(() => {
        const genericObjectMock = new GenericListMock();
        spyOn(genericObjectMock, "getListObjectData").and.returnValue(
          Promise.resolve(createListObjectData(createMatrix(4, 1)))
        );

        listComponent.dataSource = genericObjectMock;
        fixture.autoDetectChanges();
        flush();

        const listElements = fixture.debugElement.queryAll(
          By.css("div.lui-list__item")
        );

        expect(listElements.length).toBe(4);
      }));
    });

    describe("selections", () => {
      let selection;
      let genericObjectMock;

      beforeEach(fakeAsync(() => {
        genericObjectMock = new GenericListMock();
        spyOn<EngineAPI.IGenericObject>(
          genericObjectMock,
          "getListObjectData"
        ).and.returnValue(
          Promise.resolve(createListObjectData(createMatrix(4, 1)))
        );

        selection = spyOn(genericObjectMock, "selectListObjectValues");

        listComponent.dataSource = genericObjectMock;
        fixture.autoDetectChanges();
        flush();
      }));

      it("should make single selections", () => {
        const listElement = fixture.debugElement.query(
          By.css("div.lui-list__item")
        );
        listElement.triggerEventHandler("click", null);
        expect(selection).toHaveBeenCalled();
      });

      it("should selected first item", async () => {
        const data = (await genericObjectMock.getListObjectData()) as EngineAPI.INxDataPage[];
        const listElement = fixture.debugElement.query(
          By.css("div.lui-list__item")
        );
        listElement.triggerEventHandler("click", null);
        expect(selection).toHaveBeenCalledWith(
          "/qListObjectDef",
          [data[0].qMatrix[0][0].qElemNumber],
          true,
          false
        );
      });

      it("should has class selected", async () => {
        const data = (await genericObjectMock.getListObjectData()) as EngineAPI.INxDataPage[];
        const listElement = fixture.debugElement.query(
          By.css("div.lui-list__item")
        );
        listElement.triggerEventHandler("click", null);
        fixture.autoDetectChanges();
        expect(listElement.classes.selected).toBeTruthy();
      });

      it("should not have class selected", async () => {
        const data = (await genericObjectMock.getListObjectData()) as EngineAPI.INxDataPage[];
        const listElement = fixture.debugElement.query(
          By.css("div.lui-list__item")
        );
        listElement.triggerEventHandler("click", null);
        fixture.autoDetectChanges();
        listElement.triggerEventHandler("click", null); // click twice since it should toggle
        fixture.autoDetectChanges();
        expect(listElement.classes.selected).toBeFalsy();
      });

      it("should select multiple items", async () => {
        const data = (await genericObjectMock.getListObjectData()) as EngineAPI.INxDataPage[];
        const listElement = fixture.debugElement.query(
          By.css("div.lui-list__item")
        );
        listElement.triggerEventHandler("click", null);
        expect(selection).toHaveBeenCalledWith(
          "/qListObjectDef",
          [data[0].qMatrix[0][0].qElemNumber],
          true,
          false
        );
      });
    });
  });
});

/** generate list object data */
function createListObjectData(
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
function createMatrix(
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
