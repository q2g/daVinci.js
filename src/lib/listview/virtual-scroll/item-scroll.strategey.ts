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
        this.model.scrollOffset = offset;
        return this.getArea(offset);
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

    /** @todo should be in parent class */
    scrollTo(pixel: number): Scrollbar.IOffset {
        return this.model.scrollOffset;
    }

    /** @todo should be in parent class */
    scrollBy(pixel: number): Scrollbar.IOffset {
        return this.model.scrollOffset;
    }

    /** getArea */
    private getArea(offset) {
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
     * scroll start index for scrolled top
     */
    private calculateTop(offset): number {
        return this.getStartIndex(this.model.viewportHeight, offset, this.model.maxScrollOffset.top);
    }

    /**
     * calculate scrolled left value
     */
    private calculateLeft(offset): number {
        return this.getStartIndex(this.model.viewportWidth, offset, this.model.maxScrollOffset.left);
    }

    private getStartIndex(viewportSize, offset, maxScrollOffset) {
        const currentPage = offset / viewportSize;
        const startIndex  = Math.floor(currentPage * viewportSize / this.model.itemSize);
        const maxStart = Math.floor(maxScrollOffset / this.model.itemSize);
        return startIndex > maxStart ? maxStart : startIndex;
    }
}
