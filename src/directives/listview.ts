//#region Imports
import { logging } from "../utils/logger";
import { qStatusFilter } from "../filter/statusFilter";
import { ShortCutDirectiveFactory, IShortcutObject } from "./shortcut";
import { templateReplacer, checkDirectiveIsRegistrated } from "../utils/utils";
import { ScrollBarDirectiveFactory } from "./scrollBar";
import * as template from "text!./listview.html";
import "css!./listview.css";
import { IRegisterDirective } from "../utils/interfaces";
//#endregion

export interface ICallbackListview {
    pos: number;
    event?: JQueryKeyEventObject;
}

export interface IDataModelItem {
    id: string;
    qElementNumber: number;
    fieldDef: string;
    title: string;
    hasFocus: boolean;
    status: string;
}

export interface IDataModel {
    dimensionList: IDataModelItem[];
    valueList: IDataModelItem[];
}

class ListViewController implements ng.IController {

    public $onInit(): void {
        this.logger.debug("initial Run of ListViewController");
    }

    //#region Variables
    callbackListviewObjects: (elem: ICallbackListview) => void;

    element: JQuery;
    hasFocusSearchField: boolean = false;
    ieItemsReadable: boolean = false;
    overrideShortcuts: Array<IShortcutObject>;
    readingText: string = "";
    shortcutRootscope: string;
    showFocused: boolean = false;
    showScrollBar: boolean = false;
    timeout: ng.ITimeoutService;
    //#endregion

    //#region itemPxHeight
    private _itemPxHeight: number;
    public get itemPxHeight() : number {
        if (this._itemPxHeight) {
            return this._itemPxHeight;
        }
        return 31;
    }
    public set itemPxHeight(v : number) {
        if(v !== this._itemPxHeight) {
            this._itemPxHeight = v;
            if (this.horizontalMode) {
                this.itemsPageSize = Math.floor(this.elementWidth/this.itemPxHeight);
            }
            this.itemsPageSize = Math.floor(this.elementHeight/this.itemPxHeight);
        }
    }
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
        }
    }
    //#endregion

    //#region itemsCount
    private _itemsCount: number;
    public get itemsCount() : number {
        if (this._itemsCount) {
            return this._itemsCount;
        }
    }
    public set itemsCount(v : number) {
        if(v !== this._itemsCount) {
            this._itemsCount = v;
        }
    }
    //#endregion

    //#region itemsPageTop
    private _itemsPageTop: number = 0;
    public get itemsPageTop() : number {
        if (this._itemsPageTop) {
            return this._itemsPageTop;
        }
        return 0;
    }
    public set itemsPageTop(v : number) {
        if(v !== this._itemsPageTop) {
            this._itemsPageTop = v;
        }
    }
    //#endregion

    //#region itemPxWidth
    private _itemPxWidth: number;
    public get itemPxWidth() : number {
        if (this._itemPxWidth) {
            return this._itemPxWidth;
        }
    }
    public set itemPxWidth(v : number) {
        if(v !== this._itemPxWidth) {
            this._itemPxWidth = v;
        }
    }
    //#endregion

    //#region elementHeight
    private _elementHeight: number;
    public get elementHeight() : number {
        return this._elementHeight;
    }
    public set elementHeight(v : number) {
        this._elementHeight = v;
        if (!this.horizontalMode) {
            this.itemsPageSize = Math.floor(v/this.itemPxHeight);
        }
    }
    //#endregion

    //#region elementWidth
    private _elementWidth: number;
    public get elementWidth() : number {
        return this._elementWidth;
    }
    public set elementWidth(v : number) {
        this._elementWidth = v;
        if (this.horizontalMode) {
            this.itemsPageSize = Math.floor(v/this.itemPxHeight);
        }
        console.log("test", this.itemsPageSize = Math.floor(v/this.itemPxHeight));
    }
    //#endregion

    //#region itemFocused
    private _itemFocused: number = -1;
    get itemFocused(): number {
        return this._itemFocused;
    }
    set itemFocused(value: number) {
        if (value !== this.itemFocused && this.element) {
            this.calcSelected(value);
        }
    }
    //#endregion

    //#region items
    private _items: IDataModelItem[];
    get items(): IDataModelItem[] {
        return this._items;
    }
    set items(value: IDataModelItem[]) {
        this._items = value;
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

    //#region logger
    private _logger: logging.Logger;
    private get logger(): logging.Logger {
        if (!this._logger) {
            try {
                this._logger = new logging.Logger("ListViewController");
            } catch (e) {
                this.logger.error("ERROR in create logger instance", e);
            }
        }
        return this._logger;
    }
    //#endregion

    //#region itmesPageSize
    private _itemsPageSize: number;
    public get itemsPageSize(): number {
        if (this._itemsPageSize) {
            return this._itemsPageSize;
        }
        return 0;
    }
    public set itemsPageSize(v : number) {
        if (typeof(v) !== "undefined" && this._itemsPageSize !== v) {
            this._itemsPageSize = v;
        }
    }
    //#endregion

    static $inject = ["$timeout", "$element", "$scope"];

    /**
     * init of List View Controller
     * @param timeout angular timeout, to maual trigger dom events
     * @param element element of the List View Controller
     */
    constructor(timeout: ng.ITimeoutService, element: JQuery, scope: ng.IScope) {
        this.element = element;
        this.timeout = timeout;
        this.ieItemsReadable = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

        scope.$watch(() => {
            return this.element.height() * this.element.width();
        }, () => {
            this.elementHeight = this.element.height();
            this.elementWidth = this.element.width();
        });
    }

    /**
     * calculates the new selected Positiion. Focus will will be set out of bounds (root div Element)
     * when the the selectet Value is less then 0 and heigher then the max value
     * @param newPos new Position of the selected Element
     */
    private calcSelected(newPos: number): void {
        this.logger.debug("function calcSelected", "");

        if (newPos !== this._itemFocused) {
            if (newPos < 0 || newPos >= this.itemsCount) {
                return;
            } else if (newPos < this.itemsPageTop || newPos > this.itemsPageTop + this.itemsPageSize) {
                try {
                    this.element.focus();
                } catch (e) {
                    this.logger.error("ERROR in calcSelected (else if block)", e);
                }
            } else {
                try {
                    let childs = this.element.children().children().children();

                    let blurChild = childs[this.calcFocusedPosition(this.itemFocused)];
                    if (blurChild) {
                        blurChild.blur();
                    }

                    let focusChild = childs[this.calcFocusedPosition(newPos)];
                    if (focusChild) {
                        focusChild.focus();
                        this.readingText = focusChild.innerHTML;
                    }
                } catch (e) {
                    this.logger.error("ERROR in calcSelected (else block)", e);
                }
            }
            this._itemFocused = newPos;
            this.timeout();
        }
    }

    /**
     * calculates the relative Position (on the Data Page) for the selected element
     * @param absolutPosition the absolut position of the focused Item
     * @returns calculated number for the focused Position
     */
    private calcFocusedPosition(itemFocused: number): number {
        return itemFocused - this.itemsPageTop;
    }

    /**
     * manage all shortcut events on this directive
     * @param shortcutObject element which is returned from the shortcut directive
     */
    public shortcutHandler(shortcutObject: IShortcutObject, event : JQueryKeyEventObject): boolean {
        this.logger.debug("function shortcutHandler", shortcutObject, event);
        let assist: number = 0;

        switch (shortcutObject.name) {
            case "up":
                this.itemFocused++;
                return true;
            case "down":
                this.itemFocused--;
                return true;
            case "pageUp":
                try {
                    this.itemsPageTop += this.itemsPageSize;
                    if (this.itemFocused >= this.itemsPageTop - this.itemsPageSize && this.itemFocused <= this.itemsPageTop) {
                        if (this.itemFocused + this.itemsPageSize >= this.itemsCount) {
                            this.itemFocused = this.itemsCount;
                        } else {
                            this.itemFocused += this.itemsPageSize;
                        }
                    }
                    this.timeout();
                    return true;
                } catch (e) {
                    this.logger.error("Error in shortcutHandler pageUp", e);
                }
            case "pageDown":
                try {
                    this.itemsPageTop -= this.itemsPageSize;
                    if (this.itemFocused >= this.itemsPageTop + this.itemsPageSize && this.itemFocused
                            <= this.itemsPageTop + this.itemsPageSize * 2) {
                        if (this.itemFocused - this.itemsPageSize < 0) {
                            this.itemFocused = 0;
                        } else {
                            this.itemFocused -= this.itemsPageSize;
                        }
                    }
                    this.timeout();
                    return true;
                } catch (e) {
                    this.logger.error("Error in shortcutHandler pageDown", e);
                }

            case "enter":
                this.callbackListviewObjects({ pos: this.itemFocused - this.itemsPageTop});
                return true;
            case "enterAll":
                this.callbackListviewObjects({ pos: this.itemFocused - this.itemsPageTop, event: event });
                return true;
        }
        return false;
    }

    /**
     * assist function to change the class of a list element when this is in focus
     * @param index Position in the list
     * @returns checks if element on the position Index has the focus
     */
    public hasFocus(index: number): boolean {
        try {
            return (this.itemFocused - this.itemsPageTop === index);
        } catch (err) {
            return false;
        }
    }

    /**
     * selectItem, selects an item from list and calls callback
     * @param index position of selected Item
     * @param event event which got fired when selecting the item
     */
    public selectItem(index: number, event: JQueryEventObject) {

        if (this.callbackListviewObjects) {
            this.callbackListviewObjects({pos: index, event:event});
        }

    }
}

export function ListViewDirectiveFactory(rootNameSpace: string): ng.IDirectiveFactory {
    "use strict";
    return ($document: ng.IAugmentedJQuery, $injector: ng.auto.IInjectorService, $registrationProvider: IRegisterDirective) => {
        return {
            restrict: "E",
            replace: true,
            template: templateReplacer(template, rootNameSpace),
            controller: ListViewController,
            controllerAs: "vm",
            scope: {},
            bindToController: {
                items: "<",
                itemsCount: "=",
                itemsPageTop: "=",
                itemsPageSize: "=",
                itemPxHeight: "=?",
                itemPxWidth: "=?",
                itemFocused: "=?",
                showFocused: "<?",
                horizontalMode: "<?",
                callbackListviewObjects: "&",
                overrideShortcuts: "<?",
                theme: "<?"
            },
            compile: function () {
                checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace,
                    ShortCutDirectiveFactory(rootNameSpace), "Shortcut");
                checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace,
                    ScrollBarDirectiveFactory(rootNameSpace), "ScrollBar");
                $registrationProvider.filter("qstatusfilter", qStatusFilter);
            }
        };
    };
}