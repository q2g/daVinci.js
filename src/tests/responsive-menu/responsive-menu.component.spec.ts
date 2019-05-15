// unit tests comes here
import { ComponentFixture, async, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ResponsiveMenuComponent } from "davinci.js/responsive-menu/public_api";
import { IconModule } from "davinci.js/icon/public_api";
import { Component, DebugElement, Input, Output } from "@angular/core";
import { By } from "@angular/platform-browser";
import { IconComponent } from "davinci.js/icon/components/icon.component";
import { CommonModule } from "@angular/common";

@Component({
    template: `
            <davinci-responsive-menu (listElements)="output" id="base" class="rootmenu"  style="width:170px; display:block;">
                <davinci-icon class="childElement" *ngFor="let item of countArr" icon="forward"></davinci-icon>
            </davinci-responsive-menu>
    `
})
class WrapperComponent {

    @Input()
    public set count(v: number) {
        this.countArr = new Array(v);
    }

    countArr: any[] = [];

}

describe("Responsive Menu Component", () => {
    let fixture: ComponentFixture<WrapperComponent>;
    let wrapperComponent: WrapperComponent;
    let menuComponent: DebugElement;
    let menuComponentInstance: ResponsiveMenuComponent;
    let returnValues: Element[];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IconModule, CommonModule],
            declarations: [ResponsiveMenuComponent, WrapperComponent]
        }).compileComponents();
    }));

    beforeEach(async(async () => {
        fixture = TestBed.createComponent(WrapperComponent);
        wrapperComponent = fixture.componentInstance;
        menuComponent = fixture.debugElement.query(By.directive(ResponsiveMenuComponent));
        menuComponentInstance = menuComponent.componentInstance;

        menuComponentInstance.listElements.subscribe((res: Element[]) => {
            returnValues = res;
        });

    }));

    it("should create", () => {

        wrapperComponent.count = 1;
        fixture.detectChanges();
        const ln = menuComponent.queryAll(By.directive(IconComponent)).length;

        expect(wrapperComponent).toBeTruthy();
        expect(ln).toBe(1);
        expect(returnValues.length).toBe(0);

    });

    describe("add new Element with not open submenu", async () => {

        it("add 2 nodes, should render 2 items", async () => {

            wrapperComponent.count = 2;
            fixture.detectChanges();
            const ln = menuComponent.queryAll(By.directive(IconComponent)).length;
            const countOfMoreElement = menuComponent.queryAll(By.directive(IconComponent)).filter((e) => {
                if (e.attributes.icon === "more") {
                    return e;
                }
            });

            expect(ln).toBe(2);
            expect(countOfMoreElement.length).toBe(0);
            expect(returnValues.length).toBe(0);
        });

        it("add 3 nodes, should render 3 items", async () => {

            wrapperComponent.count = 3;
            fixture.detectChanges();
            const ln = menuComponent.queryAll(By.directive(IconComponent)).length;
            const countOfMoreElement = menuComponent.queryAll(By.directive(IconComponent)).filter((e) => {
                if (e.attributes.icon === "more") {
                    return e;
                }
            });

            expect(ln).toBe(3);
            expect(countOfMoreElement.length).toBe(0);
            expect(returnValues.length).toBe(0);
        });

        it("add 4 nodes, should render 4 items", async () => {

            wrapperComponent.count = 4;
            fixture.detectChanges();
            const ln = menuComponent.queryAll(By.directive(IconComponent)).length;
            const countOfMoreElement = menuComponent.queryAll(By.directive(IconComponent)).filter((e) => {
                if (e.attributes.icon === "more") {
                    return e;
                }
            });

            expect(ln).toBe(4);
            expect(countOfMoreElement.length).toBe(0);
            expect(returnValues.length).toBe(0);
        });

    });

    describe("add new Element with open submenu", () => {

        it("add 5 nodes, should render 4 items", async () => {

            wrapperComponent.count = 5;
            fixture.detectChanges();
            const ln = menuComponent.queryAll(By.directive(IconComponent)).length;
            const countOfMoreElement = menuComponent.queryAll(By.directive(IconComponent)).filter((e) => {
                if (e.attributes.icon === "more") {
                    return e;
                }
            });

            expect(ln).toBe(4);
            expect(countOfMoreElement.length).toBe(1);
            expect(returnValues.length).toBe(2);
        });

        it("add 6 nodes, should render 4 items", async () => {

            wrapperComponent.count = 6;
            fixture.detectChanges();
            const ln = menuComponent.queryAll(By.directive(IconComponent)).length;
            const countOfMoreElement = menuComponent.queryAll(By.directive(IconComponent)).filter((e) => {
                if (e.attributes.icon === "more") {
                    return e;
                }
            });

            expect(ln).toBe(4);
            expect(countOfMoreElement.length).toBe(1);
            expect(returnValues.length).toBe(3);
        });

        it("add 7 nodes, should render 4 items", async () => {

            wrapperComponent.count = 7;
            fixture.detectChanges();
            const ln = menuComponent.queryAll(By.directive(IconComponent)).length;
            const countOfMoreElement = menuComponent.queryAll(By.directive(IconComponent)).filter((e) => {
                if (e.attributes.icon === "more") {
                    return e;
                }
            });

            expect(ln).toBe(4);
            expect(countOfMoreElement.length).toBe(1);
            expect(returnValues.length).toBe(4);
        });

        it("add 8 nodes, should render 4 items", fakeAsync(async () => {

            wrapperComponent.count = 8;
            fixture.detectChanges();
            const ln = menuComponent.queryAll(By.directive(IconComponent)).length;
            const countOfMoreElement = menuComponent.queryAll(By.directive(IconComponent)).filter((e) => {
                if (e.attributes.icon === "more") {
                    return e;
                }
            });

            expect(ln).toBe(4);
            expect(countOfMoreElement.length).toBe(1);
            expect(returnValues.length).toBe(5);
        }));
    });

});
