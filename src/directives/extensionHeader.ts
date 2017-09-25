
import { templateReplacer, checkDirectiveIsRegistrated, IRegisterDirective } from "../utils/utils";
import * as template from "text!./extensionHeader.html";
import { ShortCutDirectiveFactory } from "./shortcut";
import { InputBarDirectiveFactory } from "./inputBar";
import { Logging } from "../utils/logger";
import "css!./extensionHeader.css";

let logger = new Logging.Logger("q2g menuDirective");

class ListElement {
    buttonType: string = "";
    isVisible: boolean = false;
    isEnabled: boolean = false;
    icon: string = "";
    name: string | Function;
    hasSeparator: boolean = false;
    isChecked?: boolean;
    type: string;
}

class ExtensionHeaderController implements ng.IController {

    public $onInit(): void {
        logger.debug("initial Run of MainMenuController");
    }

    callbackMainMenuButton: (item: string) => void;

    inputCancel: boolean = false;
    isLocked: boolean = false;
    showUnlockMessage: boolean = false;
    maxNumberOfElements: number;
    popOverWidth: number = 0;
    reservedButtonWidth: number = 0.5;
    shortcutSearchfield: string;
    showPopoverMenu: boolean = false;
    showSearchField: boolean = false;
    textSearch: string;
    timeout: ng.ITimeoutService;
    title: string;
    buttonGroupWidth: number = 0;

    private element: JQuery;
    private displayList: Array<ListElement> = [];
    private menuListRefactored: Array<ListElement>;
    private popOverList: Array<ListElement> = [];

    private _inputAccept: boolean;
    public get inputAccept() : boolean {
        return this._inputAccept;
    }
    public set inputAccept(v : boolean) {
        if(v!==this._inputAccept) {
            this._inputAccept = v;
        }
    }

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

    private _showButtons: boolean = false;
    get showButtons(): boolean {
        return this._showButtons;
    }
    set showButtons(value: boolean) {
        if (this.showButtons !== value) {
            this._showButtons = value;
            if (!value) {
                this.showPopoverMenu = false;
            }
        }
    }

    private _menuList: Array<any>;
    get menuList(): Array<any> {
        return this._menuList;
    }
    set menuList(value: Array<any>) {
        logger.debug("menuList change", value);
        try {
            this._menuList = value;
            this.listRefactoring(value);
        } catch (e) {
            logger.error("Error in setter of menuList");
        }
    }

    static $inject = ["$timeout", "$element", "$scope"];

    /**
     * init of List View Controller
     * @param element element of the List View Controller
     * @param scope scope element to get the watcher in class
     */
    constructor(timeout: ng.ITimeoutService, element: JQuery, scope: ng.IScope) {

        this.element = element;
        this.timeout = timeout;
        this.popOverWidth = element.width();

        scope.$watch(() => {
            return this.element.width();
        }, () => {
            this.calcLists();
        });
    }

    /**
     * refactors the insertet List
     * @param value list to be refactored
     */
    private listRefactoring(value: Array<any>) {
        this.menuListRefactored = [];
        try {
            for (let x of value) {
                let assistElement: ListElement = new ListElement();

                assistElement.hasSeparator = x.hasSeparator ? x.hasSeparator : assistElement.hasSeparator;
                assistElement.icon = x.icon ? x.icon : assistElement.icon;
                assistElement.isEnabled = x.isEnabled ? x.isEnabled : assistElement.isEnabled;
                assistElement.isVisible = x.isVisible ? x.isBisible : assistElement.isVisible;
                assistElement.name = x.name ? x.name : assistElement.name;
                assistElement.buttonType = x.buttonType ? x.buttonType : assistElement.buttonType;
                assistElement.isChecked = x.isChecked ? x.isChecked : assistElement.isChecked;
                assistElement.type = x.type ? x.type : assistElement.type;

                this.menuListRefactored.push(assistElement);
            }

            if (this.element) {
                this.calcLists();
            }
        } catch (e) {
            logger.error("error in listRefactoring", e);
        }
    }

    /**
     * calculates the two lists for displaying
     */
    calcLists() {
        let numberOfVisibleElements: number = (this.element.width() * this.reservedButtonWidth) / 60;
        let counter: number = 0;
        this.displayList = [];
        this.popOverList = [];
        try {
            for (let x of this.menuListRefactored) {
                counter++;
                if (counter < this.maxNumberOfElements && counter < numberOfVisibleElements) {
                    this.displayList.unshift(x);
                } else {
                    this.popOverList.push(x);
                }
            }
            this.buttonGroupWidth = (this.displayList.length + 1) * 60;
            logger.info("width", (this.displayList.length + 1) * 60);
        } catch (e) {
            logger.error("error in calcLists", e);
        }
    }
}

export function ExtensionHeaderDirectiveFactory(rootNameSpace: string): ng.IDirectiveFactory {
    "use strict";
    return ($document: ng.IAugmentedJQuery, $injector: ng.auto.IInjectorService, $registrationProvider: IRegisterDirective) => {
        return {
            restrict: "E",
            replace: true,
            template: templateReplacer(template, rootNameSpace),
            controller: ExtensionHeaderController,
            controllerAs: "vm",
            scope: {},
            bindToController: {
                callbackMainMenuButton: "&",
                inputAccept: "=?",
                inputCancel: "=?",
                maxNumberOfElements: "<",
                menuList: "<",
                reservedButtonWidth: "<",
                shortcutSearchfield: "<",
                showButtons: "=",
                showSearchField: "=",
                textSearch: "=",
                title: "<",
                theme: "<?",
                isLocked: "=?"
            },
            compile: function () {
                checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace,
                    InputBarDirectiveFactory(rootNameSpace), "InputBar");
                checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, ShortCutDirectiveFactory, "Shortcut");
            }
        };
    };
}