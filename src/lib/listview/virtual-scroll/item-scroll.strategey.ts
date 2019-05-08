import { IScrollStrategy } from "./scroll-strategy.interface";
import { ScrollModel } from "./scrolling.model";
import { Scrollbar } from "ngx-customscrollbar/ngx-customscrollbars/api/scrollbar.interface";

export class ItemScrollStrategy implements IScrollStrategy {

    private model: ScrollModel;

    public initialize( model: ScrollModel ) {
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
        const scrolledTop  = this.calculateTop(offset.top);
        const scrolledLeft = this.calculateLeft(offset.left);
        const area = {
            top: scrolledTop,
            height: Math.ceil(this.model.viewportHeight / this.model.itemSize),
            left: scrolledLeft,
            width: 0
        };
        return area;
    }

    /**
     * scroll start index for scrolled top
     */
    private calculateTop(offset): number {
        const currentPage = offset / this.model.viewportHeight;
        const startIndex  = Math.floor(currentPage * this.model.viewportHeight / this.model.itemSize);
        const maxStart = Math.floor(this.model.maxScrollOffset.top / this.model.itemSize);
        return startIndex > maxStart ? maxStart : startIndex;
    }

    /**
     * calculate scrolled left value
     */
    private calculateLeft(offset): number {
        return 0;
    }
}
