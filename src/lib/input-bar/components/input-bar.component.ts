import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "davinci-input-bar",
    templateUrl: "input-bar.component.html",
    styleUrls: ["input-bar.component.scss"]
})
export class InputBarComponent implements OnInit, OnDestroy {

    private destroy$: Subject<boolean> = new Subject();

    constructor() {}

    ngOnInit() { }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
