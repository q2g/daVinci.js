
//#region Imports
import { Logging } from "../utils/logger";
import { templateReplacer } from "../utils/utils";
import * as template from "text!./scrollBar.html";
import "css!./scrollBar.css";
//#endregion

class DragableBar {
    
    //#region VARIABLES 
    private _logger: Logging.Logger;
    private get logger(): Logging.Logger {
        if (!this._logger) {
            try {
                this._logger = new Logging.Logger("DragableBar");
            } catch (e) {
                console.error("Error in initialising Logger", e);
            }
        }
        return this._logger;
    };

    private element: JQuery;
    private elementDragable: JQuery;
    private position: number = 0;
    private height: number = 0;
    //#endregion

    /**
     * initial DragableBar
     * @param element requires element in which the Dragable Bar is placed
     */
    constructor(element: JQuery) {
        this.element = element;
        this.elementDragable = this.element.children().children();
        this.elementDragable[0].style.height = "12px";
        this.elementDragable[0].style.display = "normal";
        this.elementDragable[0].style.top = "0px";
        this.height = element.children().height();
        this.watchResize(40);
    }

    /**
     * checks the size of the container and resets it
     * @param intervall intervall of controlling the size
     */
    private watchResize(intervall: number): void {
        setInterval(() => {
            if (this.element.children().height() !== this.height) {
                try {
                    this.height = this.element.children().height();
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
                this.elementDragable[0].style.height = 12 + "px";
            } else {
                this.elementDragable[0].style.height = height + "px";
            }
            return this.elementDragable[0].style.height;
        } catch (e) {
            console.error("Error in class DragableBar by call setHeight");
        }
    }

    /**
     * returns the height of the dragable element
     */
    public getHeight(): number {
        try {
            return +this.elementDragable[0].style.height.replace("px", "");
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
    };

    /**
     * resets the top position of the element
     * @param posMove delta of the position the dragable bar moves
     */
    public setPosition(posMove: number): void {
        try {
            if (isNaN(this.position)) {
                this.position = 0;
            } else if (this.position + posMove < 0) {
                this.elementDragable[0].style.top = "0px";
                this.position = 0;
            } else if (this.position + posMove > this.height - this.getHeight()) {
                this.elementDragable[0].style.top = this.height - this.getHeight() + "px";
                this.position = this.height - this.getHeight();
            } else {
                this.position += posMove;
                this.elementDragable[0].style.top = this.position + "px";
            }
        } catch (err) {
            this.logger.error("ERROR", [err]);
        }
    }

    /**
     * returns the top space as number
     */
    public getTop(): number {
        try {
            return parseInt(this.elementDragable[0].style.top.substring(0, this.elementDragable[0].style.top.length - 2), 10);
        } catch (err) {
            this.logger.error("Error in function get Top of class DragableElement", err);
            return 0;
        }
    }

    /**
     * reset height to childreen heigt
     */
    public resetHeight(): void {
        this.height = this.element.children().height();
    }

    //#endregion
}

class ScrollBarController implements ng.IController {
    
    public $onInit(): void {
        this.logger.debug("initial Run of ScrollBarController");
    }

    //#region Variables
    element: JQuery;
    dragElement: JQuery;
    dragableBarElement: DragableBar;
    vertical: any;
    timeout: angular.ITimeoutService;
    show: boolean;
    //#endregion

    //#region itemsPageTop
    private _itemsPageTop: number = 0;
    get itemsPageTop(): number {
        return this._itemsPageTop;
    }
    set itemsPageTop(value: number) {
        if (this.itemsPageTop !== value) {

            let oldVal = this.itemsPageTop;
            try {
                if (value < 0) {
                    this.itemsPageTop = 0;
                } else if (value > this.itemsCount - this.itemsPageHeight) {
                    this.itemsPageTop = this.itemsCount - this.itemsPageHeight;
                } else {
                    this._itemsPageTop = value;
                }
                if (this.element) {
                    let newPostion = (this.element.height() - this.dragableBarElement.getHeight()) /
                        (this.itemsCount - this.itemsPageHeight) * (value - oldVal);
                    this.dragableBarElement.setPosition(newPostion);
                }
                if (this.timeout) {
                    this.timeout();
                }
            } catch (e) {
                console.error("error in setter startposition", e);
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
                console.error("error in setter itemsvisible", e);
            }
        }
    }
    //#endregion

    //#region itemsPageHeight
    private _itemsPageHeight: number;
    get itemsPageHeight(): number {
        return this._itemsPageHeight;
    }
    set itemsPageHeight(values: number) {
        if (this.itemsPageHeight !== values) {
            try {
                this._itemsPageHeight = values;
                this.calcDragableBarProperties();
            } catch (e) {
                console.error("error in setter itemsvisible", e);
            }
        }
    }
    //#endregion

    //#region logger
    private _logger: Logging.Logger;
    private get logger(): Logging.Logger {
        if (!this._logger) {
            try {
                this._logger = new Logging.Logger("ScrollBarController");
            } catch (e) {
                console.error("Error in initialising Logger", e);
            }
        }
        return this._logger;
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
        });
        this.dragElement.on("mousedown", (event: JQueryEventObject) => {
            event.preventDefault();
            let startY = 0;
            let topPositionOfDragElement = 0;

            try {
                startY = event.screenY;
                topPositionOfDragElement = parseInt(
                    this.dragElement[0].style.top.substring(0, this.dragElement[0].style.top.length - 2), 10);
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
                this.dragableBarElement.setVisible(this.itemsCount > this.itemsPageHeight);
                this.dragableBarElement.setHeight(this.element.height() * this.itemsPageHeight / this.itemsCount);
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
            this.dragableBarElement.setPosition((event.screenY - startY) - top);
            let newPosition: number = (this.dragableBarElement.getTop() /
                ((this.element.height() - this.dragableBarElement.getHeight()) / (this.itemsCount - this.itemsPageHeight)));
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
                itemsPageHeight: "<",
                vertical: "<",
                show: "<"
            }
        };
    };
}
