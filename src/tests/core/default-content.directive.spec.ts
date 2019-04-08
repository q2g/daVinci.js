import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { DefaultContentDirective } from "davinci.js/core/default-content.directive";
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

@Component({
    template: `
        <ng-template #title>
            <span class="default">something</span>
        </ng-template>


        <div [davinciDefaultTemplate]="title">
            <div *ngIf=show>
                <span class="content">some content</span>
            </div>
        </div>
    `
})
class WrapperComponent {
    show = false;
}

describe("Default-Content.Directive", () => {

    let fixture: ComponentFixture<WrapperComponent>;
    let wrapperComponent: WrapperComponent;
    let defaultContent: DebugElement[];
    let setContent: DebugElement[];

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [DefaultContentDirective, WrapperComponent]
        }).compileComponents();

    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(WrapperComponent);
        wrapperComponent = fixture.componentInstance;
        defaultContent = fixture.debugElement.queryAll(By.css(".default"));
        setContent = fixture.debugElement.queryAll(By.css(".content"));

        fixture.detectChanges();

    });

    it("should create", () => {

        expect(wrapperComponent).toBeTruthy();

    });

    describe("check output when show is set to false", () => {

        it("should show default html", async () => {
            await fixture.whenStable();
            expect(defaultContent).toBeDefined();
        });

        it("should not show content html", async () => {
            await fixture.whenStable();
            expect(setContent.length).toBe(0);
        });

    });

    describe("check output when show is set to true", async () => {

        it("should not show default html", async () => {
            await fixture.whenStable();
            wrapperComponent.show = true;
            expect(defaultContent.length).toBe(0);
        });

        it("should not show content html", async () => {
            await fixture.whenStable();
            wrapperComponent.show = true;
            expect(setContent).toBeDefined();
        });

    });

});
