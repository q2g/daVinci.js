
//#region Imports
import { Logging } from "../utils/logger";
//#endregion

class ShortCutScopeController implements ng.IController {

    public $onInit(): void {
        this.logger.debug("initial Run of ScrollBarController");
    }

    static $inject = ["$element"];

    private _logger: Logging.Logger; 
    private get logger(): Logging.Logger {
        if (!this._logger) {
            try {
                this._logger = new Logging.Logger("ShortCutScopeController");
            } catch (e) {
                console.error("Error in initialising Logger", e);
            }
        }
        return this._logger;
    }
}

//#region Shortcut
export const ShortCutScopeDirectiveFactory: ng.IDirectiveFactory = () => {
    return {
        restrict: "A",
        replace: true,
        controller: ["$element", ShortCutScopeController]
    };
};
//#endregion