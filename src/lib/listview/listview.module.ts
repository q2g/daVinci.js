import { NgModule } from "@angular/core";
import { ListViewComponent } from "./components/listview.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        ListViewComponent
    ],
    exports: [
        CommonModule,
        ListViewComponent,
        ScrollingModule
    ],
    imports: [
        CommonModule,
        ScrollingModule
    ]
})
export class ListViewModule {}
