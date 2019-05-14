import { Component, OnDestroy, ElementRef, AfterViewInit, Renderer2, Output } from "@angular/core";
import { Subject } from "rxjs";
import { EventEmitter } from "@angular/core";

@Component({
    selector: "davinci-responsive-menu",
    templateUrl: "responsive-menu.component.html",
    styleUrls: ["responsive-menu.component.scss"]
})
export class ResponsiveMenuComponent implements OnDestroy, AfterViewInit {

    private destroy$: Subject<boolean> = new Subject();
    private element: HTMLElement;
    private children: HTMLCollection;
    private elementWidth: number;

    @Output()
    listElements: EventEmitter<Element[]>;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {
        this.listElements = new EventEmitter ();
     }

    ngAfterViewInit() {

        this.element = this.elementRef.nativeElement;
        this.elementWidth = Math.round(this.element.getBoundingClientRect().width);
        this.children = this.element.children;

        let maxLength = 0;

        const moreWidth = this.children[0].getBoundingClientRect().width;
        const maxNumberOfElements = this.children.length - 1;
        const childsToBeShown: number[] = [];
        const elmsd: Element[] = [];

        for (const {} of this.children) {
            const elw = this.children[childsToBeShown.length].getBoundingClientRect().width;
            if (!this.children[childsToBeShown.length + 1] || maxLength + elw > this.elementWidth) {
                break;
            }
            childsToBeShown.push(elw);
            maxLength += elw;
        }

        if (childsToBeShown.length < maxNumberOfElements) {
            for (let i = childsToBeShown.length - 1; i >= 0; i++) {
                if (maxLength + moreWidth < this.elementWidth) {
                    break;
                }
                maxLength -= childsToBeShown[i];
                childsToBeShown.pop();
            }
        }

        if (childsToBeShown.length >= maxNumberOfElements) {
            this.renderer.removeChild(this.elementRef.nativeElement, this.children[0]);
        }

        let counter = 0;
        for (let i = 0; i < maxNumberOfElements; i++) {
            if (typeof childsToBeShown[i] === "undefined") {

                elmsd.push(this.children[counter]);

                this.renderer.removeChild(this.elementRef.nativeElement, this.children[counter]);
                counter--;
            }
            counter++;
        }

        if (childsToBeShown.length > maxNumberOfElements) {
            this.renderer.removeChild(this.elementRef.nativeElement, this.children[0]);
        }

        this.listElements.emit(elmsd);
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
