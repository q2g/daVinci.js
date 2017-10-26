//#region Imports
import { Logging } from "../utils/logger";
import { qStatusFilter } from "../filter/statusFilter";
import { ShortCutDirectiveFactory, IShortcutObject } from "./shortcut";
import { templateReplacer, checkDirectiveIsRegistrated, IRegisterDirective } from "../utils/utils";
import * as template from "text!./listview.html";
import "css!./listview.css";
//#endregion

let logger = new Logging.Logger("q2g Listview Directive");

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
        logger.debug("initial Run of ListViewController");
    }

    //#region Variables
    callbackListviewObjects: (elem: ICallbackListview) => void;

    element: JQuery;
    hasFocusSearchField: boolean = false;
    ieItemsReadable: boolean = false;
    itemHeight: number;
    itemsCount: number = 0;
    itemsPageHeight: number;
    itemsPageTop: number;
    overrideShortcuts: Array<IShortcutObject>;
    readingText: string = "";
    shortcutRootscope: string;
    showFocused: boolean = false;
    showScrollBar: boolean = false;
    timeout: ng.ITimeoutService;
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


    static $inject = ["$timeout", "$element"];

    /**
     * init of List View Controller
     * @param timeout angular timeout, to maual trigger dom events
     * @param element element of the List View Controller
     */
    constructor(timeout: ng.ITimeoutService, element: JQuery) {
        this.element = element;
        this.timeout = timeout;
        this.ieItemsReadable = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    }

    /**
     * calculates the new selected Positiion. Focus will will be set out of bounds (root div Element)
     * when the the selectet Value is less then 0 and heigher then the max value
     * @param newPos new Position of the selected Element
     */
    private calcSelected(newPos: number): void {
        logger.debug("function calcSelected", "");

        if (newPos !== this._itemFocused) {
            if (newPos < 0 || newPos >= this.itemsCount) {
                return;
            } else if (newPos < this.itemsPageTop || newPos > this.itemsPageTop + this.itemsPageHeight) {
                try {
                    this.element.focus();
                } catch (e) {
                    logger.error("ERROR in calcSelected (else if block)", e);
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
                    logger.error("ERROR in calcSelected (else block)", e);
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
     * @param objectShortcut element which is returned from the shortcut directive
     */
    public shortcutHandler(objectShortcut: any): boolean {
        logger.debug("function shortcutHandler", objectShortcut);
        let assist: number = 0;

        switch (objectShortcut.objectShortcut.name) {
            case "up":
                this.itemFocused++;
                return true;
            case "down":
                this.itemFocused--;
                return true;
            case "pageUp":
                try {
                    this.itemsPageTop += this.itemsPageHeight;
                    if (this.itemFocused >= this.itemsPageTop - this.itemsPageHeight && this.itemFocused <= this.itemsPageTop) {
                        if (this.itemFocused + this.itemsPageHeight >= this.itemsCount) {
                            this.itemFocused = this.itemsCount;
                        } else {
                            this.itemFocused += this.itemsPageHeight;
                        }
                    }
                    this.timeout();
                    return true;
                } catch (e) {
                    logger.error("Error in shortcutHandler pageUp", e);
                }
            case "pageDown":
                try {
                    this.itemsPageTop -= this.itemsPageHeight;
                    if (this.itemFocused >= this.itemsPageTop + this.itemsPageHeight && this.itemFocused
                            <= this.itemsPageTop + this.itemsPageHeight * 2) {
                        if (this.itemFocused - this.itemsPageHeight < 0) {
                            this.itemFocused = 0;
                        } else {
                            this.itemFocused -= this.itemsPageHeight;
                        }
                    }
                    this.timeout();
                    return true;
                } catch (e) {
                    logger.error("Error in shortcutHandler pageDown", e);
                }

            case "enter":
                this.callbackListviewObjects({ pos: this.itemFocused - this.itemsPageTop});
                return true;
            case "enterAll":
                this.callbackListviewObjects({ pos: this.itemFocused - this.itemsPageTop, event: objectShortcut.event });
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
                itemsPageHeight: "<",
                itemHeight: "=",
                itemFocused: "=",
                showFocused: "<",
                callbackListviewObjects: "&",
                overrideShortcuts: "<?",
                theme: "<?"
            },
            compile: function () {
                // checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, ShortCutDirectiveFactory, "Shortcut");
                $registrationProvider.filter("qstatusfilter", qStatusFilter);
            }
        };
    };
}