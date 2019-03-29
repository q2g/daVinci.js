import { NgModule } from "@angular/core";
import { InputBarComponent } from "./components/input-bar.component";
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        InputBarComponent
    ],
    exports: [
        InputBarComponent
    ],
    imports: [
        FormsModule
    ]
})
export class InputBarModule {}
