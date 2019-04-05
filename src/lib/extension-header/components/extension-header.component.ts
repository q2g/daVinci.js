import { Component, OnInit, AfterContentInit, OnDestroy, ContentChild, TemplateRef } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "davinci-extension-header",
    templateUrl: "extension-header.component.html",
    styleUrls: ["extension-header.component.scss"]
})
export class ExtensionHeaderComponent implements OnInit, OnDestroy {

    private destroy$: Subject<boolean> = new Subject();

    constructor() {}

    ngOnInit() {
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}
