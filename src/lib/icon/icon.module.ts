import { NgModule } from "@angular/core";
import { IconComponent } from "./components/icon.component";
import { CommonModule } from "@angular/common";
import { CoreModule } from "../core/core.module";

@NgModule({
    declarations: [
        IconComponent
    ],
    imports: [
        CommonModule,
        CoreModule
    ],
    exports: [
        IconComponent
    ]
})
export class IconModule {}
