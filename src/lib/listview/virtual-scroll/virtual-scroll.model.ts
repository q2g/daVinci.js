import { Scrollbar } from "ngx-customscrollbar/ngx-customscrollbars/api/scrollbar.interface";
import { DomHelper } from "ngx-customscrollbar";

export class VirtualScrollModel {

    private _containerMeasure: DomHelper.IElementMeasure;

    private _itemMeasure: {
        count: number;
        size: number;
    };

    private _scrollOffset: {
        cur: Scrollbar.IOffset,
        max: Scrollbar.IOffset
    };

    private _itemSize: number;

    private _viewOffset = {
        top: 0,
        left: 0
    };

    private _align: "vertical" | "horizontal" = "vertical";

    public constructor() {
        this._itemMeasure = {count: 0, size: 0};
        this._scrollOffset = {
            cur: { top: 0, left: 0 },
            max: { top: 0, left: 0 }
        };
    }

    /** width or height of an item */
    public set itemSize(size: number) {
        this._itemSize = size;
    }

    public get itemSize(): number {
        return this._itemSize;
    }

    /** set / get scroll alignment */
    public set alignment(align: "vertical" | "horizontal") {
        this._align = align;
    }

    public get alignment(): "vertical" | "horizontal" {
        return this._align;
    }

    /** set / get item total count */
    public set itemCount(count: number) {
        this._itemMeasure.count = count;
    }

    public get itemCount(): number {
        return this._itemMeasure.count;
    }

    /** set / get scroll container measure */
    public set containerMeasure(measure: DomHelper.IElementMeasure) {
        this._containerMeasure = measure;
    }

    public get containerMeasure(): DomHelper.IElementMeasure {
        return this._containerMeasure;
    }

    /** set / get scroll offset from scrollbars */
    public set scrollOffset(offset: Scrollbar.IOffset) {
        this._scrollOffset.cur = offset;
    }

    public get scrollOffset(): Scrollbar.IOffset {
        return this._scrollOffset.cur;
    }

    /** get max scroll offset */
    public get maxScrollOffset(): Scrollbar.IOffset {
        const top  = this.alignment === "vertical"   ? (this.itemSize * this.itemCount) - this.viewportHeight : 0;
        const left = this.alignment === "horizontal" ? (this.itemSize * this.itemCount) - this.viewportWidth  : 0;

        return {top, left};
    }

    public get viewportHeight(): number {
        return this.containerMeasure.innerHeight;
    }

    public get viewportWidth(): number {
        return this.containerMeasure.innerWidth;
    }

    public set viewOffsetTop(offset: number) {
        this._viewOffset.top = offset;
    }

    public get viewOffsetTop(): number {
        return this._viewOffset.top;
    }

    public set viewOffsetLeft(offset: number) {
        this._viewOffset.left = offset;
    }

    public get viewOffsetLeft(): number {
        return this._viewOffset.left;
    }

    /** get scroll container measures */
    public get scrollMeasure(): DomHelper.IScrollContainerMeasure {

        const scrollHeight = this.alignment === "vertical"   ? this.itemSize * this.itemCount : this.viewportHeight;
        const scrollWidth  = this.alignment === "horizontal" ? this.itemSize * this.itemCount : this.viewportWidth;

        return {
            ...this.containerMeasure,
            scrollHeight,
            scrollWidth,
            scrollLeft: this.scrollOffset.left,
            scrollTop: this.scrollOffset.top
        };
    }
}
