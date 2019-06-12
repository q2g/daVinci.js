// unit tests comes here
import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { ExtensionHeaderComponent } from "davinci.js/extension-header/public_api";
import { CoreModule } from "davinci.js/core/core.module";

fdescribe("ExtensionHeaderComponent", () => {

    let fixture: ComponentFixture<ExtensionHeaderComponent>;
    let extensionHeaderComponent: ExtensionHeaderComponent;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            imports: [CoreModule],
            declarations: [ExtensionHeaderComponent]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExtensionHeaderComponent);
        extensionHeaderComponent = fixture.componentInstance;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(extensionHeaderComponent).toBeTruthy();
    });

});
