
import { Directive, Host, ElementRef, OnDestroy, AfterViewInit, Input, EventEmitter, Output, HostListener } from "@angular/core";
import { ViewportControl, Viewport, DomHelper } from "ngx-customscrollbar";
import { Scrollbar } from "ngx-customscrollbar/ngx-customscrollbars/api/scrollbar.interface";
import { ScrollModel } from "./scrolling.model";
import { ItemScrollStrategy } from "./item-scroll.strategey";
import { IScrollStrategy } from "./scroll-strategy.interface";

/**
 * directive for html elements
 * this will wrap the html element into HtmlViewport
 * react on dom changes and updates scrollbar
 */
@Directive({
    selector: "[davinciVirtualScroll]"
})
export class VirtualScrollDirective extends Viewport implements AfterViewInit, OnDestroy {

    @Output()
    public scroll: EventEmitter<any>;

    private _scrollOffset;

    private _scrollStrategy: IScrollStrategy;

    private model: ScrollModel;

    private loaded = false;

    constructor(
        @Host() private viewportControl: ViewportControl,
        private el: ElementRef
    ) {
        super();

        this.model  = new ScrollModel();
        this.scroll = new EventEmitter();

        this._scrollOffset = {
            left: 0,
            top: 0,
        };
    }

    @Input()
    public set itemSize(size: number) {
        if (!this.model.itemSize || this.model.itemSize !== size) {
            this.model.itemSize = size;
            this.updateSize();
            if (this.loaded) {
                this.viewportControl.update();
            }
        }
    }

    @Input()
    public set itemsTotal(count: number) {
        if (!this.model.itemCount || this.model.itemCount !== count) {
            this.model.itemCount = count;

            this.updateSize();
            if (this.loaded) {
                this.viewportControl.update();
            }
        }
    }

    @Input()
    public set scrollStrategy(strategy: IScrollStrategy) {
        this._scrollStrategy = strategy;
        this._scrollStrategy.initialize(this.model);
    }

    private updateSize() {
        const domMeasure = DomHelper.getMeasure(this.el.nativeElement);
        this.model.viewportHeight = domMeasure.innerHeight;
        this.model.maxScrollOffset = {
            top: (this.model.itemSize * this.model.itemCount) - this.model.viewportHeight,
            left: 0
        };
    }

    /**
     * handle mousewheel scroll event
     */
    @HostListener("mousewheel", ["$event"])
    mouseWheelScroll(event: any) {
        const wheelDelta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        this.scrollTo(wheelDelta === 1 ? this._scrollStrategy.scrollUp() : this._scrollStrategy.scrollDown());
    }

    public get scrolledOffset() {
        return this.model.scrollOffset;
    }

    /**
     * calculate offset of scroll container
     */
    public measureSize(): DomHelper.IScrollContainerMeasure {
        const domMeasure = DomHelper.getMeasure(this.el.nativeElement);
        const measure: DomHelper.IScrollContainerMeasure = {
            ...domMeasure,
            scrollHeight: this.model.itemSize * this.model.itemCount,
            scrollLeft: 0,
            scrollTop: this._scrollOffset.top,
            scrollWidth: domMeasure.innerWidth
        };
        return measure;
    }

    /** scrolled to */
    public scrollTo(offset: Scrollbar.IOffset) {
        const test = this._scrollStrategy.scroll(offset);
        this.scroll.emit(test);
        this.scrolled$.next();
    }

    /**
     * if component gets destroyed tell our control we gets destroyed
     * and remove from dom mutations
     */
    public ngOnDestroy() {
        this.viewportControl = null;
    }

    /**
     * start watching the dom after view has been initialized
     * this ensures initial data has allready been set.
     *
     * We only want to know if we add or remove some items
     */
    public ngAfterViewInit(): void {
        this.loaded = true;
        if (!this._scrollStrategy) {
            this.scrollStrategy = new ItemScrollStrategy();
        }
        this.updateSize();
        this.viewportControl.viewPort = this;
    }
}
