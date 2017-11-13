//#region Imports
import { logging } from "../utils/logger";
import * as template from "text!./identifier.html";
import * as utils from "../utils/utils";
import "css!./identifier.css";
//#endregion

class IdentifierController implements ng.IController {

    public $onInit(): void {
        this.logger.debug("initial Run of IdentifierController");
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

    //#region logger
    private _logger: logging.Logger;
    private get logger(): logging.Logger {
        if (!this._logger) {
            try {
                this._logger = new logging.Logger("IdentifierController");
            } catch (e) {
                this.logger.error("ERROR in create logger instance", e);
            }
        }
        return this._logger;
    }
    //#endregion
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

