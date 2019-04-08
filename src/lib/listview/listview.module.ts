import { NgModule } from "@angular/core";
import { ListViewComponent } from "./components/listview.component";

@NgModule({
    declarations: [
        ListViewComponent
    ],
    exports: [
        ListViewComponent
    ]
})
export class ListModule {}
