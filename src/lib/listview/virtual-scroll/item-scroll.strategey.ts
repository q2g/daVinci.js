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
        let newTop = this.model.scrollOffset.top;
        newTop -= this.model.itemSize;
        newTop = newTop < 0 ? 0 : newTop;

        return {
            top: newTop,
            left: this.model.scrollOffset.left
        };
    }

    /**
     * scroll down, returns new offset which should be scrolled
     */
    public scrollDown(): Scrollbar.IOffset {
        let newTop = this.model.scrollOffset.top;
        newTop += this.model.itemSize;
        newTop = newTop > this.model.maxScrollOffset.top ? this.model.maxScrollOffset.top : newTop;
        return {
            top: newTop,
            left: this.model.scrollOffset.left
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
