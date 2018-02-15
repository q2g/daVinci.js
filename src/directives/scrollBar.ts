//#region Imports
import { logging } from "../utils/logger";
import { templateReplacer } from "../utils/utils";
import * as template from "text!./scrollBar.html";
import "css!./scrollBar.css";
//#endregion

class DragableBar {

    //#region VARIABLES
    private _logger: logging.Logger;
    private get logger(): logging.Logger {
        if (!this._logger) {
            try {
                this._logger = new logging.Logger("DragableBar");
            } catch (e) {
                console.error("Error in initialising Logger", e);
            }
        }
        return this._logger;
    }

    private element: JQuery;
    private elementDragable: JQuery;
    private position: number = 0;
    private height: number = 0;
    //#endregion

    //#region horizontalMode
    private _horizontalMode: boolean;
    public get horizontalMode() : boolean {
        return this._horizontalMode;
    }
    public set horizontalMode(v : boolean) {
        if (v !== this._horizontalMode) {
            this._horizontalMode = v;
            if (v) {
                this.setHorizontalProperties();
            } else {
                this.setVerticalProperties();
            }
        }
    }
    //#endregion

    /**
     * initial DragableBar
     * @param element requires element in which the Dragable Bar is placed
     */
    constructor(element: JQuery, horizontalMode?: boolean) {

        this.element = element;
        this.elementDragable = this.element.children().children();
        this.elementDragable[0].style.display = "normal";

        this.horizontalMode = false;
        if (typeof(horizontalMode) !== "undefined") {
            this.horizontalMode = horizontalMode;
        }

        this.height = this.horizontalMode?element.children().width():element.children().height();
        this.watchResize(40);
    }

    /**
     * checks the size of the container and resets it
     * @param intervall intervall of controlling the size
     */
    private watchResize(intervall: number): void {
        setInterval(() => {
            if (this.horizontalMode?this.element.children().width():this.element.children().height() !== this.height) {
                try {
                    this.height = this.horizontalMode?this.element.children().width():this.element.children().height();
                } catch (err) {
                    this.logger.error("ERROR in watch resize", err);
                }
            }
        }, intervall);
    }

    /**
     * sets the height of the dragable element of the scroll bar
     * @param height new height of the element
     */
    public setHeight(height: number): string {
        try {
            if (height < 12) {
                if (this.horizontalMode) {
                    this.elementDragable[0].style.width = 12 + "px";
                    this.elementDragable[0].style.height = 11 + "px";
                } else {
                    this.elementDragable[0].style.height = 12 + "px";
                    this.elementDragable[0].style.width = 11 + "px";
                }
            } else {
                if (this.horizontalMode) {
                    this.elementDragable[0].style.width = height + "px";
                    this.elementDragable[0].style.height = 11 + "px";
                } else {
                    this.elementDragable[0].style.height = height + "px";
                    this.elementDragable[0].style.width = 11 + "px";
                }
            }
            if (this.horizontalMode) {
                return this.elementDragable[0].style.width;
            } else {
                return this.elementDragable[0].style.height;
            }
        } catch (e) {
            this.logger.error("Error in class DragableBar by call setHeight");
        }
    }

    /**
     * returns the height of the dragable element
     */
    public getHeight(): number {
        try {
            if (this.horizontalMode) {
                return +this.elementDragable[0].style.width.replace("px", "");
            } else {
                return +this.elementDragable[0].style.height.replace("px", "");
            }
        } catch (err) {
            this.logger.error("ERROR", [err]);
            return 0;
        }
    }

    /**
     * sets the visibility of the Dragable element
     * @param visible new visibility
     */
    public setVisible(visible: boolean): boolean {
        try {
            this.elementDragable[0].style.display = "flex";
            if (!visible) {
                this.elementDragable[0].style.display = "none";
            }
            return visible;
        } catch (err) {
            this.elementDragable[0].style.display = "none";
            this.logger.error("Error in Class DragableBar", err);
        }
    }

    /**
     * resets the top position of the element
     * @param posMove delta of the position the dragable bar moves
     */
    public setPosition(posMove: number): void {
        try {
            if (isNaN(this.position)) {
                this.position = 0;
            } else if (this.position + posMove < 0) {
                if (this.horizontalMode) {
                    this.elementDragable[0].style.left = "0px";
                } else {
                    this.elementDragable[0].style.top = "0px";
                }
                this.position = 0;
            } else if (this.position + posMove > this.height - this.getHeight()) {
                if (this.horizontalMode) {
                    this.elementDragable[0].style.left = this.height - this.getHeight() + "px";
                } else {
                    this.elementDragable[0].style.top = this.height - this.getHeight() + "px";
                }
                this.position = this.height - this.getHeight();
            } else {
                this.position += posMove;
                if (this.horizontalMode) {
                    this.elementDragable[0].style.left = this.position + "px";
                } else {
                    this.elementDragable[0].style.top = this.position + "px";
                }
            }
        } catch (err) {
            this.logger.error("ERROR", [err]);
        }
    }

    /**
     * returns the top/left space as number
     */
    public getTop(): number {
        try {
            if (this.horizontalMode) {
                return parseInt(this.elementDragable[0].style.left.substring(0, this.elementDragable[0].style.left.length - 2), 10);
            } else {
                return parseInt(this.elementDragable[0].style.top.substring(0, this.elementDragable[0].style.top.length - 2), 10);
            }
        } catch (err) {
            this.logger.error("Error in function get Top of class DragableElement", err);
            return 0;
        }
    }

    /**
     * name
     */
    public setHorizontalProperties() {
        try {
            this.elementDragable[0].style.width = "11px";
            this.elementDragable[0].style.left = "0px";
        } catch (error) {
            this.logger.error("Error in setHorizontalProperties", error);
        }
    }

    /**
     * name
     */
    public setVerticalProperties() {
        try {
            this.elementDragable[0].style.height = "12px";
            this.elementDragable[0].style.top = "0px";
        } catch (error) {
            this.logger.error("Error in setVerticalProperties", error);
        }
    }


}

class ScrollBarController implements ng.IController {

    public $onInit(): void {
        this.logger.debug("initial Run of ScrollBarController");
    }

    //#region Variables
    element: JQuery;
    dragElement: JQuery;
    dragableBarElement: DragableBar;
    timeout: angular.ITimeoutService;
    show: boolean;
    //#endregion

    //#region horizontalMode
    private _horizontalMode: boolean;
    get horizontalMode(): boolean {
        if (this._horizontalMode) {
            return this._horizontalMode;
        }
        return false;
    }
    set horizontalMode(value: boolean) {
        if (value !== this._horizontalMode) {
            this._horizontalMode = value;
            if (typeof(this.dragableBarElement) !== "undefined") {
                this.dragableBarElement.horizontalMode = value;
            }
        }
    }
    //#endregion

    //#region itemsPageTop
    private _itemsPageTop: number = 0;
    get itemsPageTop(): number {
        return this._itemsPageTop;
    }
    set itemsPageTop(value: number) {
        if (typeof(value) !== "undefined" && this.itemsPageTop !== value) {
            let oldVal = this.itemsPageTop;
            try {
                if (value < 0) {
                    this.itemsPageTop = 0;
                } else if (value > this.itemsCount - this.itemsPageSize) {
                    this.itemsPageTop = this.itemsCount - this.itemsPageSize;
                } else {
                    this._itemsPageTop = value;
                }
                if (this.element) {
                    let newPostion = ((this.horizontalMode?this.element.width():this.element.height())
                        - this.dragableBarElement.getHeight())
                        / (this.itemsCount - this.itemsPageSize) * (value - oldVal);
                    this.dragableBarElement.setPosition(newPostion);
                }
                if (this.timeout) {
                    this.timeout();
                }
            } catch (e) {
                this.logger.error("error in setter startposition", e);
            }
        }
    }
    //#endregion

    //#region itemsCount
    private _itemsCount: number;
    get itemsCount(): number {
        return this._itemsCount;
    }
    set itemsCount(value: number) {
        if (this.itemsCount !== value) {
            try {
                this._itemsCount = value;
                this.calcDragableBarProperties();
            } catch (e) {
                this.logger.error("error in setter itemsvisible", e);
            }
        }
    }
    //#endregion

    //#region itemsPageSize
    private _itemsPageSize: number;
    get itemsPageSize(): number {
        return this._itemsPageSize;
    }
    set itemsPageSize(values: number) {
        if (this.itemsPageSize !== values) {
            try {
                this._itemsPageSize = values;
                this.calcDragableBarProperties();
            } catch (e) {
                this.logger.error("error in setter itemsvisible", e);
            }
        }
    }
    //#endregion

    //#region logger
    private _logger: logging.Logger;
    private get logger(): logging.Logger {
        if (!this._logger) {
            try {
                this._logger = new logging.Logger("ScrollBarController");
            } catch (e) {
                console.error("Error in initialising Logger", e);
            }
        }
        return this._logger;
    }
    //#endregion

    //#region theme
    private _theme: string;
    get theme(): string {
        if (this._theme) {
            return this._theme;
        }
        return "default";
    }
    set theme(value: string) {
        if (value !== this._theme) {
            this._theme = value;
        }
    }
    //#endregion

    /**
     * init of the Scroll Bar controller
     * @param $element element in which the ScrollbarController is placed
     * @param $timeout angular timeout, to manual trigger dom events
     */
    constructor($element: JQuery, $timeout: angular.ITimeoutService) {
        this.element = $element;
        try {
            this.dragElement = this.element.children().children();
        } catch (e) {
            this.logger.error("children", e);
        }
        this.dragableBarElement = new DragableBar(this.element);
        this.timeout = $timeout;

        this.element.parent().on("wheel", (event: JQueryEventObject) => {
            this.scrollWheelHandle(event);
            this.timeout();
        });

        this.dragElement.on("mousedown", (event: JQueryEventObject) => {
            event.preventDefault();
            let startY = 0;
            let topPositionOfDragElement = 0;

            try {
                startY = this.horizontalMode?event.screenX:event.screenY;
                if (this.horizontalMode) {
                    topPositionOfDragElement = parseInt(
                        this.dragElement[0].style.left.substring(0, this.dragElement[0].style.left.length - 2), 10);
                } else {
                    topPositionOfDragElement = parseInt(
                        this.dragElement[0].style.top.substring(0, this.dragElement[0].style.top.length - 2), 10);
                }
            } catch (err) {
                this.logger.error("ERROR", [err]);
            }

            $(document).on("mousemove", (event: JQueryEventObject) => {

                this.mousehandle(event, "mousemove", startY, this.dragableBarElement.getTop() - topPositionOfDragElement);
            });

            $(document).on("mouseup", (event: JQueryEventObject) => {
                this.mousehandle(event, "mouseup", startY, this.dragableBarElement.getTop() - topPositionOfDragElement);
            });
        });

    }

    /**
     * calculates the properties (visible and height) IMPORTENT! settimeout needs to be changed
     */
    public calcDragableBarProperties(): void {
        setTimeout(() => {
            try {
                this.dragableBarElement.setVisible(this.itemsCount > this.itemsPageSize);
                this.dragableBarElement.setHeight((this.horizontalMode?this.element.width():this.element.height())
                    * this.itemsPageSize
                    / this.itemsCount);
            } catch (err) {
                this.logger.error("ERROR in calcDragableBarProperties", err);
            }
        }, 200);
    }

    /**
     * calculates the position of the dragable element by controling with mouse
     * @param event jQuery event which is triggerd
     * @param upOrMove hint if mouse is moved or mouse up
     * @param startY start position of the mouse Movement
     * @param top the top position of the dragable element
     */
    private mousehandle(event: JQueryEventObject, upOrMove: string, startY: number, top: number): void {

        try {
            this.dragableBarElement.setPosition(((this.horizontalMode?event.screenX:event.screenY) - startY) - top);

            let newPosition: number = (this.dragableBarElement.getTop() /
                ((this.horizontalMode?this.element.width():this.element.height()
                    - this.dragableBarElement.getHeight())
                    / (this.itemsCount - this.itemsPageSize)));

            this.itemsPageTop = Math.round(newPosition);

            if (upOrMove === "mouseup") {
                $(document).unbind("mousemove");
                $(document).unbind("mouseup");
            }
        } catch (err) {
            this.logger.error("ERROR in function moushandle", err);
        }
    }

    /**
     * sets the top of the dragable bar when using scroll wheel
     * @param event JQuery event from the scroll wheel
     */
    private scrollWheelHandle(event: JQueryEventObject): void {
        try {
            this.itemsPageTop += (event.originalEvent as any).deltaY / 100;
        } catch (err) {
            this.dragableBarElement.setPosition(0);
            this.logger.error("ERROR", err);
        }
    }
}

export function ScrollBarDirectiveFactory(rootNameSpace: string): ng.IDirectiveFactory {
    "use strict";
    return () => {
        return {
            restrict: "E",
            replace: true,
            template: templateReplacer(template, rootNameSpace),
            controller: ScrollBarController,
            controllerAs: "vm",
            scope: {},
            bindToController: {
                itemsCount: "<",
                itemsPageTop: "=",
                itemsPageSize: "<",
                horizontalMode: "<?",
                show: "<",
                theme: "<?"
            }
        };
    };
}
