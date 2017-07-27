//#region Import
import { Logging } from "../utils/logger";
//#endregion

//#region Logger
let logger = new Logging.Logger("Main");
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
    

    implementObject(object: IRegistrationObject) {

        this.directive = object.directive ? object.directive : null;
        this.filter = object.filter ? object.filter : null;
        this.service = object.service ? object.service : null;

        if (!this.directive && this.filter && this.service) {
            logger.error("object with missing properties inserted", object);
        }
    }
}