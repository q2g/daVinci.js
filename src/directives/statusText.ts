
//#region Imports
import { Logging } from "../utils/logger";
import { templateReplacer } from "../utils/utils";
import * as template from "text!./statusText.html";
//#endregion

class StatusTextController implements ng.IController {
    static $inject = ["$timeout", "$element"];

    timeout: ng.ITimeoutService;
    element: JQuery;
    statustime: number;

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

    //#region statustext
    private _statustext: string;
    get statustext(): string {
        return this._statustext;
    }
    set statustext(value: string) {
        if (value !== this.statustext) {
            try {
                this._statustext = value;
                // better way would be with angular ng-repeat and an array object, but there is a bug in Jaws
                // wich do not read the correct text so following workaround:
                this.element.prepend("<li class='listElement'>" + this.statustext + "</li>");
                this.timeout(() => {
                    this.element.children().remove(":last");
                }, this.statustime);
            } catch (e) {
                this.logger.error("error in SETTER of statustext", e);
            }
        }
    }
    //#endregion

    /**
     * init for the Status Text Controller
     * @param timeout angular timeout, to maual trigger dom events
     * @param element element of the List View Controller
     */
    constructor(timeout: ng.ITimeoutService, element: JQuery) {
        this.timeout = timeout;
        this.element = element;
        if (!this.statustime) {
            this.statustime = 10000;
        }
    }

    /**
     * when destroy the element, remove all added elements from dom
     */
    $onDestroy() {
        try {
            this.element.children().remove();
        } catch (e) {
            this.logger.error("Error while destroying the status bar directiv", e);
        }
    }

}

export function StatusTextDirectiveFactory(rootNameSpace: string): ng.IDirectiveFactory {
    "use strict";
    return () => {
        return {
            restrict: "E",
            replace: true,
            template: templateReplacer(template, rootNameSpace),
            controller: StatusTextController,
            controllerAs: "vm",
            scope: {},
            bindToController: {
                statustext: "<",
                statustime: "<?"
            }
        };
    };
}
