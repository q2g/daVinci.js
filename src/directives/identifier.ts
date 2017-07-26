//#region Imports
import { Logging } from "../utils/logger";
import * as template from "text!./identifier.html";
import * as utils from "../utils/utils";
import "css!./identifier.css";
//#endregion

class AkquinetIdentifierController implements ng.IController {

    public $onInit(): void {
        this.logger.debug("initial Run of AkquinetIdentifierController");
    }

    //#region Variables
    show: boolean; 
    //#endregion

    //#region logger
    private _logger: Logging.Logger;
    private get logger(): Logging.Logger {
        if (!this._logger) {
            try {
                this._logger = new Logging.Logger("StatusTextController");
            } catch (e) {
                this.logger.error("ERROR in create logger instance", e);
            }
        }
        return this._logger;
    }
    //#endregion
    
    /**
     * init of AkquinetIdentifierController
     */
    constructor() {
        this.logger.debug("init Constructor", this);
    }    
}

export function AkquinetIdentifierDirectiveFactory(rootNameSpace: string): ng.IDirectiveFactory {
    "use strict";
    return ($document: ng.IAugmentedJQuery, $injector: ng.auto.IInjectorService) => {
        return {
            restrict: "E",
            replace: true,
            template: utils.templateReplacer(template, rootNameSpace),
            controller: AkquinetIdentifierController,
            controllerAs: "vm",
            scope: {},
            bindToController: {
                show: "<"
            }
        };
    };
};

