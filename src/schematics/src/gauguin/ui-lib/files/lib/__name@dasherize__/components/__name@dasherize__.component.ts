import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "<%= selector %>",
    templateUrl: "<%= dasherize(name) %>.component.html",
    styleUrls: ["<%= dasherize(name) %>.component.scss"]
})
export class <%= classify(name) %>Component implements OnInit, OnDestroy {

    private destroy$: Subject<boolean> = new Subject();

    constructor() {}

    ngOnInit() { }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
