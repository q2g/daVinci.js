import { NgModule } from "@angular/core";
import { ResponsiveMenuComponent } from "./components/responsive-menu.component";
import { IconModule } from "../icon/icon.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        ResponsiveMenuComponent
    ],
    exports: [
        ResponsiveMenuComponent
    ],
    imports: [
        IconModule,
        CommonModule
    ]
})
export class ResponsiveMenuModule {}
