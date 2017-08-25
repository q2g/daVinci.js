
//#region IMPORT
import { Logging } from "../utils/logger";
import { templateReplacer, checkDirectiveIsRegistrated, IRegisterDirective } from "../utils/utils";
import { ShortCutDirectiveFactory } from "./shortcut";
import { SearchBarDirectiveFactory } from "./searchBar";
import * as template from "text!./extensionHeader.html";
import "css!./extensionHeader.css";
//#endregion

//#region Logger
let logger = new Logging.Logger("q2g menuDirective");
//#endregion

class ListElement {

    type: string = "";
    isVisible: boolean = false;
    isEnabled: boolean = false;
    icon: string = "";
    name: string | Function;
    hasSeparator: boolean = false;

}

class ExtensionHeaderController implements ng.IController {

    public $onInit(): void {
        logger.debug("initial Run of MainMenuController");
    }

    //#region VARIABLES
    callbackMainMenuButton: (item: string) => void;
    maxNumberOfElements: number;
    popOverWidth: number = 0;
    reservedButtonWidth: number = 0.5;
    shortcutSearchfield: string;
    showPopoverMenu: boolean = false;
    showSearchField: boolean = false;
    textSearch: string;
    title: string;
    timeout: ng.ITimeoutService;

    private element: JQuery;
    private displayList: Array<ListElement> = [];
    private menuListRefactored: Array<ListElement>;
    private popOverList: Array<ListElement> = [];
    //#endregion
    
    //#region showButtons
    private _showButtons: boolean = false;
    get showButtons(): boolean {
        return this._showButtons;
    }
    set showButtons(value: boolean) {
        if (this.showButtons != value) {
            this._showButtons = value;
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
    };
    set menuList(value: Array<any>) {
        if (this._menuList !== value) {
            try {
                this._menuList = value;
                this.listRefactoring(value);
            } catch (e) {
                logger.error("Error in setter of menuList");
            }
        }
    };
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
            return this.element.width()
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
                assistElement.type = x.type ? x.type : assistElement.type;

                this.menuListRefactored.push(assistElement);
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
                menuList: "<",
                maxNumberOfElements: "<",
                reservedButtonWidth: "<",
                callbackMainMenuButton: "&",
                textSearch: "=",
                showButtons: "=",
                showSearchField: "=",
                title: "<",
                shortcutSearchfield: "<",
            },
            compile: function () {                        
                checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, SearchBarDirectiveFactory(rootNameSpace), "SearchBar");
                checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, ShortCutDirectiveFactory, "Shortcut");
            }
        }
    }
}