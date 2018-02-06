import { Q2gListAdapter } from "./object";

export class RootExtension {

    model: EngineAPI.IGenericObject;
    qlik: RootAPI.IRoot;

    constructor(model:EngineAPI.IGenericObject, qlik: RootAPI.IRoot) {
        this.model = model;
        this.qlik = qlik;
    }

    /**
     * isEditMode
     * checks if extension is in edit mode or in anylyse mode
     */
    public isEditMode() {
        try {
            if (this.qlik.navigation.getMode() === "analysis") {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.error("Error in function isEditMode", error);
        }
    }
}

export class RootSingleList {

    //#region variables
    editMode: boolean = false;
    element: JQuery;
    elementHeight: number;
    elementWidth: number;
    listObject: any;
    timeout: ng.ITimeoutService;
    //#endregion

    /**
     * init of the controller for the Direction Directive
     * @param timeout
     * @param element
     */
    constructor(timeout: ng.ITimeoutService, element: JQuery, scope: ng.IScope) {
        this.element = element;
        this.timeout = timeout;


        scope.$watch(() => {
            return this.element.width() + this.element.height();
        }, () => {
            this.elementHeight = this.element.height();
            this.elementWidth = this.element.width();
        });
    }

    /**
     * checks if the extension is used in Edit mode
     */
    isEditMode(): boolean {
        if (this.editMode) {
            return true;
        } else {
            return false;
        }
    }

}

export interface IQlikSingleListController {
    model: EngineAPI.IGenericObject;
    selectListObjectCallback(pos: number, event?: JQueryKeyEventObject): void;
    extensionHeaderAccept(): void;
}