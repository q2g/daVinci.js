import { IScrollStrategy } from "./scroll-strategy.interface";
import { VirtualScrollModel } from "./virtual-scroll.model";
import { Scrollbar } from "ngx-customscrollbar/ngx-customscrollbars/api/scrollbar.interface";

export class ItemScrollStrategy implements IScrollStrategy {

    private model: VirtualScrollModel;

    public initialize( model: VirtualScrollModel ) {
        this.model = model;
    }

    /**
     * page has been scrolled calculate new area
     * we want to show
     */
    public scroll(offset: Scrollbar.IOffset) {
        this.model.scrollOffset = this.calculateScrollbarOffset(offset);
        return this.getArea(this.model.scrollOffset);
    }

    /**
     * scroll up, returns new offset which has been scrolled
     */
    public scrollUp(): Scrollbar.IOffset {
        const top  = this.model.scrollOffset.top;
        const left = this.model.scrollOffset.left;

        return {
            top:  this.model.alignment === "vertical" ? this.calcScrollOffsetTop(top, "up") : top,
            left: this.model.alignment === "vertical" ? left : this.calcScrollOffsetLeft(left, "up")
        };
    }

    /**
     * scroll down, returns new offset which should be scrolled
     */
    public scrollDown(): Scrollbar.IOffset {
        const top  = this.model.scrollOffset.top;
        const left = this.model.scrollOffset.left;

        return {
            top:  this.model.alignment === "vertical" ? this.calcScrollOffsetTop(top, "down") : top,
            left: this.model.alignment === "vertical" ? left : this.calcScrollOffsetLeft(left, "down")
        };
    }

    scrollTo(pixel: number): Scrollbar.IOffset {
        return this.model.scrollOffset;
    }

    scrollBy(pixel: number): Scrollbar.IOffset {
        return this.model.scrollOffset;
    }

    /** getArea */
    private getArea(offset) {
        console.log(offset);
        const topValue = this.model.alignment === "vertical" ? this.calculateTop(offset.top) : this.calculateLeft(offset.left);
        const height   = this.model.alignment === "vertical" ? this.model.viewportHeight     : this.model.viewportWidth;

        const area = {
            top: topValue,
            height: Math.ceil(height / this.model.itemSize),
            left: 0,
            width: 0
        };
        return area;
    }

    /**
     * calculate offset left by item width
     */
    private calcScrollOffsetLeft(left: number, direction: "up" | "down"): number {
        if (direction === "up") {
            left -= this.model.itemSize;
            left = left < 0 ? 0 : left;
        } else {
            left += this.model.itemSize;
            left = left > this.model.maxScrollOffset.left ? this.model.maxScrollOffset.left : left;
        }
        return left;
    }

    /**
     * calculate offset left by item width
     */
    private calcScrollOffsetTop(top: number, direction: "up" | "down"): number {
        if (direction === "up") {
            top -= this.model.itemSize;
            top = top < 0 ? 0 : top;
        } else {
            top += this.model.itemSize;
            top = top > this.model.maxScrollOffset.top ? this.model.maxScrollOffset.top : top;
        }
        return top;
    }

    /**
     * scrolbars first ask the viewport to scroll
     * before they move to new position, calculate new offset for scrollbars
     * to tell them there they will be positioned
     */
    private calculateScrollbarOffset(offset): Scrollbar.IOffset {

        const offsetTop  = this.model.alignment === "vertical" ? this.calculateScrollbarOffsetTop(offset.top) : offset.top;
        const offsetLeft = this.model.alignment === "vertical" ? offset.left : this.calculateScrollbarOffsetLeft(offset.left);

        return {
            left: offsetLeft,
            top: offsetTop
        };
    }

    private calculateScrollbarOffsetTop(offset: number): number {
        if (offset < this.model.maxScrollOffset.top && this.model.viewOffsetTop > 0) {
            return this.model.maxScrollOffset.top - this.model.viewOffsetTop;
        }
        return offset;
    }

    private calculateScrollbarOffsetLeft(offset: number): number {
        if (offset < this.model.maxScrollOffset.left && this.model.viewOffsetLeft > 0) {
            return this.model.maxScrollOffset.left - this.model.viewOffsetLeft;
        }
        return offset;
    }

    /**
     * scroll start index for scrolled top
     */
    private calculateTop(offset): number {

        const maxScrollOffset = this.model.maxScrollOffset.top;
        const maxStart = Math.floor(maxScrollOffset / this.model.itemSize);

        if (offset === maxScrollOffset) {
            this.model.viewOffsetTop = maxScrollOffset - maxStart * this.model.itemSize;
        } else {
            this.model.viewOffsetTop = 0;
        }

        return this.getStartIndex(offset, this.model.maxScrollOffset.top);
    }

    /**
     * calculate scrolled left value
     */
    private calculateLeft(offset): number {

        const maxScrollOffset = this.model.maxScrollOffset.left;
        const maxStart = Math.floor(maxScrollOffset / this.model.itemSize);

        if (offset === maxScrollOffset) {
            this.model.viewOffsetLeft = maxScrollOffset - maxStart * this.model.itemSize;
        } else {
            this.model.viewOffsetLeft = 0;
        }

        return this.getStartIndex(offset, this.model.maxScrollOffset.left);
    }

    private getStartIndex(offset: number, maxScrollOffset) {
        const startIndex  = Math.floor(offset / this.model.itemSize);
        const maxStart = Math.floor(maxScrollOffset / this.model.itemSize);
        return startIndex > maxStart ? maxStart : startIndex;
    }
}
