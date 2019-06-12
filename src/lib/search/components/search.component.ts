import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from "@angular/core";
import { FormControl, FormBuilder } from "@angular/forms";
import { takeUntil, distinctUntilChanged, filter } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
    selector: "davinci-search",
    templateUrl: "search.component.html",
    styleUrls: ["search.component.scss"]
})
export class SearchComponent implements OnInit, OnDestroy {

    /**
     * the form control for the search field
     */
    public searchField: FormControl;

    @Input()
    public placeholder = "Search";

    @Output()
    public changed: EventEmitter<string>;

    private destroy$: Subject<boolean> = new Subject();

    @ViewChild("search", {read: ElementRef, static: true})
    private searchEl: ElementRef<HTMLInputElement>;

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.changed = new EventEmitter();
    }

    /**
     * component gets destroyed
     */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * initializes component
     */
    ngOnInit() {
        this.searchField = this.createSearchField();

        /** handle value change on search field */
        this.searchField.valueChanges.pipe(
            takeUntil(this.destroy$),
            filter(() => this.searchField.enabled),
            distinctUntilChanged()
        )
        .subscribe((value: string) => this.changed.emit(value));
    }

    /**
     * enable search field and auto focus input
     */
    public toggleSearch(event: MouseEvent) {
        if (this.searchField.enabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    /**
     * disable search component
     */
    public disable() {
        this.searchEl.nativeElement.blur();
        this.searchField.disable({onlySelf: true, emitEvent: false});
    }

    /**
     * enable search component
     */
    public enable() {
        this.searchField.enable({ onlySelf: true, emitEvent: false});
        this.searchEl.nativeElement.focus();
    }

    /**
     * create search field
     */
    private createSearchField(): FormControl {
        const control = this.formBuilder.control("");
        control.disable();
        return control;
    }
}
