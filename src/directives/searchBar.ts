//#region IMPORT
import { templateReplacer, checkDirectiveIsRegistrated } from "../utils/utils";
import { Logging } from "../utils/logger";
import { ShortCutDirectiveFactory } from "./shortcut";
import * as template from "text!./searchBar.html";
//#endregion

//#region Logger
let logger = new Logging.Logger("q2g searchBarDirective");
//#endregion

class SearchBarController implements ng.IController {

    public $onInit(): void {
        logger.debug("initial Run of SearchBarController");
    }

    //#region Variables
    placeholder: string = "";
    shortcutSetFocus: string;
    textSearch: string = "";
    //#endregion

    //#region OverrideStandardsShortcut
    private _overrideStandarsShortcuts: any;
    get overrideStandarsShortcuts(): any {
        return this._overrideStandarsShortcuts;
    }
    set overrideStandarsShortcuts(value: any) {
        if (!value) {
            this._overrideStandarsShortcuts = this.setDefaultShortcuts();
        } else {
            this._overrideStandarsShortcuts = value;
        }
    }
    //#endregion
    
    static $inject = ["$element", "$scope"];

    /** 
     * init of List View Controller
     */
    constructor(element: JQuery, scope: ng.IScope) {
        this.overrideStandarsShortcuts = this.setDefaultShortcuts();

        scope.$watch(function () { return element.is(':visible') }, function () {
            try {
                if (element.is(':visible')) {
                    element.children().eq(1).focus();
                }
            } catch (e) {
                logger.error("error in constructor", e);
            }          
        });
    }

    /**
     * sets the default values for the shortcuts, when no override gots entered
     */
    private setDefaultShortcuts() {
        return {
            esc: {
                name: "esc",
                shortcut: "27",
                action: "onClick"
            }
        }
    }
}

export function SearchBarDirectiveFactory(rootNameSpace: string): ng.IDirectiveFactory {
    "use strict";
    return ($document: ng.IAugmentedJQuery, $injector: ng.auto.IInjectorService, $registrationProvider) => {
        return {
            restrict: "E",
            replace: true,
            template: templateReplacer(template, rootNameSpace),
            controller: SearchBarController,
            controllerAs: "vm",
            scope: {},
            bindToController: {
                textSearch: "=",
                placeholder: "<",
                shortcutSetFocus: "<",
                overrideStandarsShortcuts: "=?"
            },
            compile: function () {
                checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, ShortCutDirectiveFactory, "Shortcut");
            }
        }
    }
}


