//#region IMPORT
import { templateReplacer, checkDirectiveIsRegistrated, IRegisterDirective } from "../utils/utils";
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
    placeholder: string;
    textSearch: string = "";
    //#endregion

    static $inject = ["$element", "$scope"];

    /**
     * init of List View Controller
     */
    constructor(element: JQuery, scope: ng.IScope) {

        scope.$watch(function () { return element.is(":visible"); }, function () {
            try {
                if (element.is(":visible")) {
                    element.children().eq(1).focus();
                }
            } catch (e) {
                logger.error("error in constructor", e);
            }
        });
    }

}

export function SearchBarDirectiveFactory(rootNameSpace: string): ng.IDirectiveFactory {
    "use strict";
    return ($document: ng.IAugmentedJQuery, $injector: ng.auto.IInjectorService, $registrationProvider: IRegisterDirective) => {
        return {
            restrict: "E",
            replace: true,
            template: templateReplacer(template, rootNameSpace),
            controller: SearchBarController,
            controllerAs: "vm",
            scope: {},
            bindToController: {
                textSearch: "=",
                placeholder: "<"
            },
            compile: function () {
                checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, ShortCutDirectiveFactory, "Shortcut");
            }
        };
    };
}


