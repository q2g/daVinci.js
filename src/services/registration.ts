//#region Import
import { Logging } from "../utils/logger";
//#endregion

interface IRegistrationObject {
    directive(name: string, directiveFactory: ng.Injectable<ng.IDirectiveFactory>): void;
    filter(name: string, filterFactoryFunction: ng.Injectable<Function>): void;
    service<T>(name: string, serviceConstructor: ng.Injectable<Function>): T;
}

export interface IRegistrationProvider {
    implementObject(object: IRegistrationObject): void;
}

export class RegistrationProvider implements IRegistrationObject {

    directive: (name: string, directiveFactory: ng.Injectable<ng.IDirectiveFactory>) => void;
    filter: (name: string, filterFactoryFunction: ng.Injectable<Function>) => void;
    service: <T>(name: string, serviceConstructor: ng.Injectable<Function>) => T;

    //#region logger
    private _logger: Logging.Logger;
    private get logger(): Logging.Logger {
        if (!this._logger) {
            try {
                this._logger = new Logging.Logger("RegistrationProvider");
            } catch (e) {
                this.logger.error("ERROR in create logger instance", e);
            }
        }
        return this._logger;
    }
    //#endregion

    implementObject(object: IRegistrationObject) {

        this.directive = object.directive ? object.directive : null;
        this.filter = object.filter ? object.filter : null;
        this.service = object.service ? object.service : null;

        if (!this.directive && this.filter && this.service) {
            this.logger.error("object with missing properties inserted", object);
        }
    }
}