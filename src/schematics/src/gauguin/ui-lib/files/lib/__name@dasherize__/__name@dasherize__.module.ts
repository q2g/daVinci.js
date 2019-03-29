import { NgModule } from "@angular/core";
import { <%= classify(name) %>Component } from "./components/<%= dasherize(name) %>.component";

@NgModule({
    declarations: [
        <%= classify(name) %>Component
    ],
    exports: [
        <%= classify(name) %>Component
    ]
})
export class <%= classify(name) %>Module {}
