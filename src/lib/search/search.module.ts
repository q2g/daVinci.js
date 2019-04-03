import { NgModule } from "@angular/core";
import { SearchComponent } from "./components/search.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        SearchComponent,
    ],
    exports: [
        SearchComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule
    ]
})
export class SearchModule {}
