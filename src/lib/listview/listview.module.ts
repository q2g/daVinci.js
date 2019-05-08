import { NgModule } from "@angular/core";
import { ListViewComponent } from "./components/listview.component";
import { CommonModule } from "@angular/common";
import { NgxCustomScrollbarModule } from "ngx-customscrollbar";
import { VirtualScrollDirective } from "./virtual-scroll/virtual-viewport.directive";

@NgModule({
    declarations: [
        ListViewComponent,
        VirtualScrollDirective
    ],
    exports: [
        CommonModule,
        ListViewComponent,
    ],
    imports: [
        CommonModule,
        NgxCustomScrollbarModule
    ]
})
export class ListViewModule {}
