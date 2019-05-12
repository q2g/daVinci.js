
import { Directive, Host, ElementRef, OnDestroy, AfterViewInit, Input, EventEmitter, Output, HostListener } from "@angular/core";
import { ViewportControl, Viewport, DomHelper } from "ngx-customscrollbar";
import { Scrollbar } from "ngx-customscrollbar/ngx-customscrollbars/api/scrollbar.interface";
import { VirtualScrollModel } from "./virtual-scroll.model";
import { ItemScrollStrategy } from "./item-scroll.strategey";
import { IScrollStrategy } from "./scroll-strategy.interface";

/**
 * directive for html elements
 * this will wrap the html element into HtmlViewport
 * react on dom changes and updates scrollbar
 */
@Directive({
    selector: "[davinciVirtualScroll]",
    exportAs: "virtualScrollViewport"
})
export class VirtualScrollDirective extends Viewport implements AfterViewInit, OnDestroy {

    @Output()
    public scroll: EventEmitter<any>;

    private _scrollStrategy: IScrollStrategy;

    private model: VirtualScrollModel;

    constructor(
        @Host() private viewportControl: ViewportControl,
        private el: ElementRef
    ) {
        super();
        this.model  = new VirtualScrollModel();
        this.scroll = new EventEmitter();
    }

    @Input()
    public set itemSize(size: number) {
        if (!this.model.itemSize || this.model.itemSize !== size) {
            this.model.itemSize = size;
            this.updateSize();
        }
    }

    @Input()
    public set itemsTotal(count: number) {
        if (!this.model.itemCount || this.model.itemCount !== count) {
            this.model.itemCount = count;
            this.updateSize();
        }
    }

    @Input()
    public set scrollStrategy(strategy: IScrollStrategy) {
        this._scrollStrategy = strategy;
        this._scrollStrategy.initialize(this.model);
    }

    @Input()
    public set direction(align: "horizontal" | "vertical") {
        this.model.alignment = align;
    }

    public updateSize() {
        /** we have to set max scroll offset */
        const domMeasure = DomHelper.getMeasure(this.el.nativeElement);
        this.model.containerMeasure = domMeasure;

        if (this.viewportControl.viewPort) {
            this.viewportControl.update();
        }
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
        return this.model.scrollMeasure;
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

        if (!this._scrollStrategy) {
            this.scrollStrategy = new ItemScrollStrategy();
        }
        this.updateSize();
        this.viewportControl.viewPort = this;
    }
}
