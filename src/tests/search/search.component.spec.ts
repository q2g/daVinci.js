// unit tests comes here
import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { SearchComponent } from "davinci.js/search/public_api";

describe("SearchComponent", () => {
    let buttonEl: DebugElement;
    let iconEl: DebugElement;
    let searchEl: DebugElement;
    let searchComponent: SearchComponent;
    let fixture: ComponentFixture<SearchComponent>;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule],
            declarations: [SearchComponent]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchComponent);
        searchComponent = fixture.componentInstance;

        buttonEl = fixture.debugElement.query(By.css("button[type='button']"));
        iconEl = fixture.debugElement.query(By.css("i.lui-icon.lui-icon--search"));
        searchEl = fixture.debugElement.query(By.css("input[type='text']"));

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(searchComponent).toBeTruthy();
    });

    describe("Search Button / Icon", () => {

        it("should contain search icon", () => {
            expect(iconEl).toBeDefined();
            expect(iconEl).not.toBeNull();
        });
    });

    describe("Search form control", () => {

        it("should contain search field", () => {
            expect(searchEl).toBeDefined();
            expect(searchEl).not.toBeNull();
        });

        it("should be disabled", () => {
            expect(searchEl.nativeElement.disabled).toBe(true);
        });

        it("should contain placeholder ", () => {
            expect(searchEl.nativeElement.placeholder).toBe("Search");
        });

        it("should set placeholder to search here ", () => {
            searchComponent.placeholder = "search here";
            fixture.detectChanges();
            expect(searchEl.nativeElement.placeholder).toBe("search here");
        });

        it("should emit search if value has been changed", () => {
            // enable search field
            let inputValue: string;
            searchComponent.searchValue.subscribe((val) => inputValue = val);

            searchComponent.enable();
            searchEl.nativeElement.value = "hello world";
            searchEl.nativeElement.dispatchEvent(new Event("input"));

            expect(inputValue).toBe("hello world");
        });

        it("should emit no value if component is disabled", () => {
            // enable search field
            let inputValue: string;
            searchComponent.searchValue.subscribe((val) => inputValue = val);

            searchComponent.disable();
            searchEl.nativeElement.value = "hello world";
            searchEl.nativeElement.dispatchEvent(new Event("input"));

            expect(inputValue).toBeUndefined();
        });

        it("should not emit a value if nothing has been changed", () => {
            const subSpy = jasmine.createSpy("subscription", () => {});
            // apply spy which should not called twice
            searchComponent.searchValue.subscribe(subSpy);
            searchComponent.enable();
            searchEl.nativeElement.value = "hello world";
            searchEl.nativeElement.dispatchEvent(new Event("input"));
            searchEl.nativeElement.dispatchEvent(new Event("input"));
            expect(subSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("search form button", () => {
        it("should contain search button", () => {
            expect(buttonEl).toBeDefined();
            expect(buttonEl).not.toBeNull();
        });

        it("should enabled button", () => {
            buttonEl.triggerEventHandler("click", null);
            expect(searchEl.nativeElement.disabled).toBeFalsy();
        });

        it("should have focus on search field", () => {
            buttonEl.triggerEventHandler("click", null);
            expect(document.activeElement).toBe(searchEl.nativeElement);
        });

        it("should disable search field if we click on button again", () => {
            buttonEl.triggerEventHandler("click", null);
            buttonEl.triggerEventHandler("click", null);
            expect(searchEl.nativeElement.disabled).toBeTruthy();
        });
    });

    describe("global search controls", () => {
        it("should disable search field", () => {
            searchComponent.disable();
            expect(searchEl.nativeElement.disabled).toBeTruthy();
        });

        it("should enable search field", () => {
            searchComponent.enable();
            expect(searchEl.nativeElement.disabled).toBeFalsy();
        });
    });
});
