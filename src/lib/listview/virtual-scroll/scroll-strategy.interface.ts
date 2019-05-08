import { ScrollModel } from "./scrolling.model";
import { Scrollbar } from "ngx-customscrollbar/ngx-customscrollbars/api/scrollbar.interface";

export interface IScrollStrategy {

    /** get area we could display, in the most cases this will be a single array list */
    initialize(model: ScrollModel);

    /** new scroll offset has been given, scroll by specific amount */
    scroll(offset: Scrollbar.IOffset);

    /** scroll up */
    scrollUp(): Scrollbar.IOffset;

    /** scroll down */
    scrollDown(): Scrollbar.IOffset;

    /** @todo should be implemented in abstract class */
    scrollTo(pixel: number): Scrollbar.IOffset;

    /** @todo should be implemented in abstract class */
    scrollBy(pixel: number): Scrollbar.IOffset;
}
