//#region Imports
import { Logging } from "../utils/logger";
import * as template from "text!./identifier.html";
import * as utils from "../utils/utils";
import "css!./identifier.css";
//#endregion

let logger = new Logging.Logger("q2g Identifier Directive");

class IdentifierController implements ng.IController {

    public $onInit(): void {
        logger.debug("initial Run of AkquinetIdentifierController");
    }

    //#region Variables
    show: boolean;
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
     * init of AkquinetIdentifierController
     */
    constructor() {
        logger.debug("init Constructor", this);
    }
}

export function IdentifierDirectiveFactory(rootNameSpace: string): ng.IDirectiveFactory {
    "use strict";
    return ($document: ng.IAugmentedJQuery, $injector: ng.auto.IInjectorService) => {
        return {
            restrict: "E",
            replace: true,
            template: utils.templateReplacer(template, rootNameSpace),
            controller: IdentifierController,
            controllerAs: "vm",
            scope: {},
            bindToController: {
                show: "<",
                theme: "<?"
            }
        };
    };
}

