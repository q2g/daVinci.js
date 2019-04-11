import { Component, Input, ElementRef, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "davinci-icon",
    templateUrl: "icon.component.html",
    styleUrls: ["icon.component.scss"]
})
export class IconComponent {

    @Input()
    buttonType: string;

    @Input()
    icon = "tick";

    @Input()
    isActive = false;

    @Input()
    lable = "";

    @Output()
    click = new EventEmitter<void>();

    constructor(
    ) {
        this.click = new EventEmitter();
    }

    onClick(event) {
        event.stopPropagation();
        if (this.isActive) {
            this.click.emit();
        }
    }

}
