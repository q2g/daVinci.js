
//#region IMPORT
import { templateReplacer, checkDirectiveIsRegistrated, IRegisterDirective } from "../utils/utils";
import * as template from "text!./extensionHeader.html";
import { ShortCutDirectiveFactory } from "./shortcut";
import { InputBarDirectiveFactory } from "./inputBar";
import { Logging } from "../utils/logger";
import "css!./extensionHeader.css";
//#endregion

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
        this.logger.debug("initial Run of MainMenuController");
    }

    //#region VARIABLES
    inputAccept: () => void;
    inputCancel: () => void;
    menuCallback: (item: string) => void;

    buttonGroupWidth: number = 0;
    inputBarFocus: boolean = false;
    inputBarVisible: boolean = false;
    inputField: string;
    isLocked: boolean = false;
    maxNumberOfElements: number;
    popOverWidth: number = 0;
    reservedButtonWidth: number = 0.5;
    shortcutSearchfield: string;
    showUnlockMessage: boolean = false;
    showPopoverMenu: boolean = false;
    timeout: ng.ITimeoutService;
    title: string;

    private element: JQuery;
    private displayList: Array<ListElement> = [];
    private menuListRefactored: Array<ListElement>;
    private popOverList: Array<ListElement> = [];
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

    //#region inputBarLogo
    private _inputBarLogo: string;
    get inputBarLogo(): string {
        if (this._inputBarLogo) {
            return this._inputBarLogo;
        }
        return "lui-icon--search";
    }
    set inputBarLogo(value: string) {
        if (value !== this._inputBarLogo) {
            this._inputBarLogo = value;
        }
    }
    //#endregion

    //#region inputBarPlaceholder
    private _inputBarPlaceholder: string;
    public get inputBarPlaceholder() : string {
        if(this._inputBarPlaceholder) {
            return this._inputBarPlaceholder;
        }
        return "search " + this.title;
    }
    public set inputBarPlaceholder(v : string) {
        if(v !== this._inputBarPlaceholder) {
            this._inputBarPlaceholder = v;
        }
    }
    //#endregion

    //#region menuVisible
    private _menuVisible: boolean = false;
    get menuVisible(): boolean {
        return this._menuVisible;
    }
    set menuVisible(value: boolean) {
        if (this.menuVisible !== value) {
            this._menuVisible = value;
            if (!value) {
                this.showPopoverMenu = false;
            }
        }
    }
    //#endregion

    //#region menuList
    private _menuList: Array<any>;
    get menuList(): Array<any> {
        return this._menuList;
    }
    set menuList(value: Array<any>) {
        try {
            this._menuList = value;
            this.listRefactoring(value);
        } catch (e) {
            this.logger.error("Error in setter of menuList");
        }
    }
    //#endregion

    //#region logger
    private _logger: Logging.Logger;
    private get logger(): Logging.Logger {
        if (!this._logger) {
            try {
                this._logger = new Logging.Logger("ExtensionHeaderController");
            } catch (e) {
                this.logger.error("ERROR in create logger instance", e);
            }
        }
        return this._logger;
    }
    //#endregion

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
            this.logger.error("error in listRefactoring", e);
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
                if (counter < this.maxNumberOfElements && counter < numberOfVisibleElements-1) {
                    this.displayList.unshift(x);
                } else {
                    this.popOverList.push(x);
                }
            }

            if (this.popOverList.length === 1) {
                this.displayList.unshift(this.popOverList[0]);
                this.popOverList.pop();
            }

            this.buttonGroupWidth = (this.displayList.length + 1) * 60;
        } catch (e) {
            this.logger.error("error in calcLists", e);
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
                maxNumberOfElements: "<",
                reservedButtonWidth: "<",
                title: "<",
                theme: "<?",

                inputAccept: "&?",
                inputCancel: "&?",
                inputField: "=?",
                inputBarLogo: "=?",
                inputBarPlaceholder: "=?",
                inputBarVisible: "=?",
                inputBarFocus: "=?",

                menuVisible: "=?",
                menuCallback: "&?",
                menuList: "<?",

                shortcutSearchfield: "<?",
                isLocked: "=?"
            },
            compile: function () {
                checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace,
                    InputBarDirectiveFactory(rootNameSpace), "InputBar");
                // checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, ShortCutDirectiveFactory, "Shortcut");
            }
        };
    };
}