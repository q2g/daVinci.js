import { Scrollbar } from "ngx-customscrollbar/ngx-customscrollbars/api/scrollbar.interface";

enum ScrollDirection {
    VERTICAL = 0,
    HORIZONTAL = 1
}

export class ScrollModel {

    private _itemSize: number;

    private _scrollDirection: ScrollDirection;

    private _itemCount: number;

    private _scrolledTop = 0;

    private _scrolledLeft = 0;

    private _containerHeight = 0;

    private _scrollOffset: Scrollbar.IOffset = {
        top: 0,
        left: 0
    };

    private _maxScrollOffset: Scrollbar.IOffset;

    /** width or height of an item */
    public set itemSize(size: number) {
        this._itemSize = size;
    }

    public get itemSize(): number {
        return this._itemSize;
    }

    /** set scroll direction could be vertical or horizontal */
    public set scrollDirection(direction: ScrollDirection) {
        this._scrollDirection = direction;
    }

    public get scrollDirection(): ScrollDirection {
        return this._scrollDirection;
    }

    /** set item total count */
    public set itemCount(count: number) {
        this._itemCount = count;
    }

    public get itemCount() {
        return this._itemCount;
    }

    /** set / get scroll offset from scrollbars */
    public set scrollOffset(offset: Scrollbar.IOffset) {
        this._scrollOffset = offset;
    }

    public get scrollOffset(): Scrollbar.IOffset {
        return this._scrollOffset;
    }

    public set maxScrollOffset(offset: Scrollbar.IOffset) {
        this._maxScrollOffset = offset;
    }

    public get maxScrollOffset(): Scrollbar.IOffset {
        return this._maxScrollOffset;
    }

    /** set scrolled left */
    public set scrolledTop(value: number) {
        this._scrolledTop = value;
    }

    public get scrolledTop(): number {
        return this._scrolledTop;
    }

    /** set scrolled left */
    public set scrolledLeft(value: number) {
        this._scrolledLeft = value;
    }

    public get scrolledLeft(): number {
        return this._scrolledLeft;
    }

    /** set / get viewport max height */
    public set viewportHeight(height: number) {
        this._containerHeight = height;
    }

    public get viewportHeight(): number {
        return this._containerHeight;
    }
}
