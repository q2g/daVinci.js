import { NgModule } from "@angular/core";
import { ListViewComponent } from "./components/listview.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { NgxCustomScrollbarModule } from "ngx-customscrollbar";

@NgModule({
    declarations: [
        ListViewComponent
    ],
    exports: [
        CommonModule,
        ListViewComponent,
        ScrollingModule,
        NgxCustomScrollbarModule
    ],
    imports: [
        CommonModule,
        ScrollingModule,
        NgxCustomScrollbarModule
    ]
})
export class ListViewModule {}
