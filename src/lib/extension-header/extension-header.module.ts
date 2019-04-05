import { NgModule } from "@angular/core";
import { ExtensionHeaderComponent } from "./components/extension-header.component";
import { CommonModule } from "@angular/common";
import { CoreModule } from "../core/core.module";

@NgModule({
    declarations: [
        ExtensionHeaderComponent
    ],
    imports: [
        CommonModule,
        CoreModule
    ],
    exports: [
        ExtensionHeaderComponent
    ]
})
export class ExtensionHeaderModule {}
