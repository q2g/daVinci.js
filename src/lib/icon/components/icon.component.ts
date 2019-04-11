import { Component, Input, ElementRef, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "davinci-icon",
    templateUrl: "icon.component.html",
    styleUrls: ["icon.component.scss"]
})
export class IconComponent {

    @Input()
    icon = "tick";

    @Input()
    buttonType: string;

    @Input()
    isActive = false;

    @Input()
    lable = "";

    @Output()
    click = new EventEmitter<void>();

    onClick(event) {
        event.stopPropagation();
        if (this.isActive) {
            this.click.emit();
        }
    }

    constructor(
    ) {
        this.click = new EventEmitter();
    }

}
