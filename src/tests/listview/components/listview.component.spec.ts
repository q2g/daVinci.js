// unit tests comes here
import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    flush
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ListViewComponent } from "davinci.js/listview/public_api";
import { ScrollingModule, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ListSourceMock } from "@testing/mocks/list-source.mock";
import { createCell } from "@testing/mocks/util";

describe("ListView", () => {
    describe("ListViewComponent", () => {
        let listComponent: ListViewComponent<EngineAPI.INxCell>;
        let fixture: ComponentFixture<ListViewComponent<EngineAPI.INxCell>>;
        let cdkVirtualScroll: CdkVirtualScrollViewport;

        let listSource: ListSourceMock;
        let selectSpy;
        let deselectSpy;

        beforeAll(() => {
            listSource = new ListSourceMock();
            const cells = Array.from(Array(1000), (val, index) => createCell(index, index));
            spyOn(listSource, "loadItems").and.returnValue(
                Promise.resolve(cells)
            );

            selectSpy = spyOn(listSource, "select");
            deselectSpy = spyOn(listSource, "deselect");
        });

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ScrollingModule],
                declarations: [ListViewComponent]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent<
                ListViewComponent<EngineAPI.INxCell>
            >(ListViewComponent);
            listComponent = fixture.componentInstance;

            const cdkScrollDebugEl = fixture.debugElement.query(By.directive(CdkVirtualScrollViewport));
            cdkVirtualScroll = cdkScrollDebugEl.componentInstance;
            cdkScrollDebugEl.nativeNode.style.height = "400px";
        });

        it("should create", () => {
            expect(listComponent).toBeTruthy();
        });

        it("should render items from source", fakeAsync(() => {
            listComponent.dataSource = listSource;
            fixture.autoDetectChanges();
            flush();

            const renderedRange = cdkVirtualScroll.getRenderedRange();
            const listElements = fixture.debugElement.queryAll(
                By.css("div.lui-list__item")
            );

            expect(listElements.length).not.toBe(0);
            expect(listElements.length).toBe(renderedRange.end - renderedRange.start);
        }));

        it("should make single selections", fakeAsync(async () => {
            const items = await listSource.loadItems();
            listComponent.dataSource = listSource;
            fixture.autoDetectChanges();
            flush();

            const listElement = fixture.debugElement.query(
                By.css("div.lui-list__item")
            );
            listElement.triggerEventHandler("click", null);

            expect(selectSpy).toHaveBeenCalled();
            expect(selectSpy).toHaveBeenCalledWith(items[0]);

            fixture.detectChanges();
            expect(listElement.classes.selected).toBeTruthy();
        }));

        it("should deselect an item", fakeAsync(async () => {

            const items = await listSource.loadItems();
            listComponent.dataSource = listSource;
            fixture.autoDetectChanges();
            flush();

            const listElement = fixture.debugElement.query(
                By.css("div.lui-list__item")
            );

            /** click twice to select and then deselect item */
            listElement.triggerEventHandler("click", null);
            listElement.triggerEventHandler("click", null);

            expect(deselectSpy).toHaveBeenCalled();
            expect(deselectSpy).toHaveBeenCalledWith(items[0]);

            fixture.detectChanges();
            expect(listElement.classes.selected).toBeFalsy();
        }));

        it("should select multiple items", () => {});

        it("should reset listview if new data has been loaded", () => {});
    });
});
