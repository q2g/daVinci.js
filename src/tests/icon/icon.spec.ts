// unit tests comes here
import { IconComponent } from "davinci.js/icon/public_api";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe("IconComponent", () => {
    let fixture: ComponentFixture<IconComponent>;
    let iconComponent: IconComponent;
    let iconEl: DebugElement;
    let buttonEl: DebugElement;


    beforeEach(async(() => {

        TestBed.configureTestingModule({
            imports: [],
            declarations: [IconComponent]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IconComponent);
        iconComponent = fixture.componentInstance;

        iconEl = fixture.debugElement.query(By.css("i"));
        buttonEl = fixture.debugElement.query(By.css("button"));

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(iconComponent).toBeTruthy();
    });

    describe("default settings", () => {
        it("should be tick icon", () => {
            expect(iconEl).toBeDefined();
            expect(iconEl.classes["lui-icon--tick"]).toBeTruthy();
        });

        it("should be no info button", () => {
            expect(buttonEl).toBeDefined();
            expect(buttonEl.classes["lui-fade-button"]).toBeTruthy();
        });

        it("should be not disable", () => {
            expect(buttonEl).toBeDefined();
            expect(buttonEl.classes["lui-disabled"]).toBeTruthy();
        });

        it("attribute title should be empty", () => {
            expect(buttonEl).toBeDefined();
            expect(buttonEl.attributes.title).toBe("");
        });
    });

    describe("change Component properties", () => {

        it("should contain clock icon", () => {
            iconComponent.icon = "clock";
            fixture.detectChanges();
            expect(iconEl).toBeDefined();
            expect(iconEl.classes["lui-icon--clock"]).toBeTruthy();
        });

        it("should contain info styling", () => {
            iconComponent.buttonType = "info";
            fixture.detectChanges();
            expect(buttonEl).toBeDefined();
            expect(buttonEl.classes["lui-button--info"]).toBeTruthy();
            expect(buttonEl.classes["lui-button"]).toBeTruthy();
        });

        it("should switch activity of button", () => {
            iconComponent.isActive = true;
            fixture.detectChanges();
            expect(buttonEl).toBeDefined();
            expect(buttonEl.classes["lui-disabled"]).toBeFalsy();
        });

        it("attribute title should contain 'My Title'", () => {
            iconComponent.lable = "My Title";
            fixture.detectChanges();
            expect(buttonEl.attributes.title).toBe("My Title");
        });
    });

    describe("interaction handling", () => {

        it("should call click event", () => {
            const a = jasmine.createSpy("testSpy");

            iconComponent.isActive = true;
            iconComponent.click.subscribe(a);

            buttonEl.triggerEventHandler("click", new Event("click"));
            fixture.detectChanges();

            expect(a).toHaveBeenCalled();
        });

        it("should NOT call click event", () => {
            const a = jasmine.createSpy("testSpy");

            iconComponent.isActive = false;
            iconComponent.click.subscribe(a);

            buttonEl.triggerEventHandler("click", new Event("click"));
            fixture.detectChanges();

            expect(a).not.toHaveBeenCalled();
        });
    });

});
