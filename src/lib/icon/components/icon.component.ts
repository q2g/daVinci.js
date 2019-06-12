import { Component, Input, Output, EventEmitter, ElementRef } from "@angular/core";

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
    label = "";

    @Output()
    click = new EventEmitter<void>();

    constructor(
        private el: ElementRef<any>
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
