
//#region Import
import { Logging } from "./logger";
//#endregion

//#region interfaces
interface IPropertiesDefault {
    ref: string | boolean;
    defaultValue: string;
}

interface IDefinitionObject {
    definition: any;
    getDefinition: any;
}

export interface IRegisterDirective {
    directive(name: string, directiveFactory: ng.Injectable<ng.IDirectiveFactory>): void;
    directive(object: { [directiveName: string]: ng.Injectable<ng.IDirectiveFactory> }): void;
    filter(name: string, filterFactoryFunction: ng.Injectable<Function>): ng.IModule;
    filter(object: { [name: string]: ng.Injectable<Function> }): ng.IModule;
}


interface ICalcCubeElement {
    qState: string;
    cId: string;
    qGroupFieldDefs: Array<string>;
    qFallbackTitle: string;
}

export interface IMenuElement {
    buttonType: string;
    isVisible: boolean;
    isEnabled: boolean;
    isChecked?: boolean;
    icon: string;
    type: "menu" | "submenu" | "checkbox";
    name: string;
    hasSeparator: boolean;
}
//#endregion

//#region Logger
let logger = new Logging.Logger("utils");
//#endregion

//#region AssistFunctions

/**
 * replace and creates namespace for the directives in the templates, to ensure multiple use of directives
 * @param template basic template for the directive
 * @param rootNameSpace naming of the extension, to ensure multiple use of directives
 */
export function templateReplacer(template: string, rootNameSpace: string) {
    let newTemplate: string = template.replace(/([< /]q2g\-)|(\nq2g\-)/g, (a, b, c) => {
        if (c) {
            return c + rootNameSpace + "-";
        }
        return b + rootNameSpace + "-";
    });
    return newTemplate;
}

/**
 * check and replace additional characters
 * @param string
 */
export function regEscaper(string: string) {
    return string.replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * checks if Directiv is already registrated
 * @param injector
 * @param qvangular
 * @param rootNameSpace
 * @param factory
 * @param directiveName
 */
export function checkDirectiveIsRegistrated(
    injector: ng.auto.IInjectorService,
    regDirective: IRegisterDirective | IQVAngular,
    rootNameSpace: string,
    factory: ng.IDirectiveFactory,
    directiveName: string) {
    try {
        if (!injector.has("q2g" + rootNameSpace + directiveName)) {
            logger.debug("load missing q2g" + rootNameSpace + directiveName);
            regDirective.directive("q2g" + rootNameSpace + directiveName, factory);
        }
    } catch (e) {
        logger.error("Error in checkForExistingDirective", e);
    }
}

/**
 * calculates the number of Visible Rows
 */
export function calcNumbreOfVisRows(elementHeight: number): number {
    try {
        return Math.floor((elementHeight - 42) / 32.5);
    } catch (err) {
        logger.error("ERROR in calc Number of vis roes", err);
    }
}

/**
 * gets the enigmaRoot for the different Qlik Versions
 * @param scope root angular scoop for the Directive
 * @returns returns the enigma root Object
 */
export function getEnigma(scope: IVMScope<any>): EngineAPI.IGenericObject {

    let enigmaRoot = (scope.component.model as any) as EngineAPI.IGenericObject;

    if ((scope.component.model as any).enigmaModel) {
        // pre 3.2 SR3 enigma is in a subvariable of model
        enigmaRoot = (scope.component.model as any).enigmaModel as EngineAPI.IGenericObject;
    }

    return enigmaRoot;
}

/**
 * checks if two arrays are equal
 * @param array1
 * @param array2
 */
export function checkEqualityOfArrays(array1: Array <any>, array2: Array<any>, checkOnlyId: boolean): boolean {
    logger.debug("Function checkEqualityOfArrays", "");

    try {
        if (array1 && array2 && array1.length !== array2.length) {
            return false;
        }

        if (array1 && array2) {
            for (var i: number = 0; i < array1.length; i++) {
                if (!checkOnlyId && array1[i].id !== array2[i].id) {
                    return false;
                }

                if (checkOnlyId && JSON.stringify(array1[i]).indexOf(JSON.stringify(array2[i])) === -1) {
                    return false;
                }
            }
        }
        return true;
    } catch (e) {
        logger.error("Error in function checkEqualityOfArrays", e);
        return true;
    }
}

/**
 * sorting of enelements
 * @param a
 * @param b
 */
function sort(a: any, b: any) {
    if (a.id > b.id) {
        return 1;
    }
    if (a.id < b.id) {
        return -1;
    }
    // a muss gleich b sein
    return 0;
}

//#endregion

export abstract class AssistHypercube<T extends EngineAPI.IGenericBaseLayout> {

    rootCube: T;
    preCalcCube: Array<ICalcCubeElement>;
    calcCube: Array<ICalcCubeElement>;

    //#region searchString
    private _searchString: string = "";
    get searchString(): string {
        return this._searchString;
    }
    set searchString(value: string) {
        if (value !== this.searchString) {
            this._searchString = value;
        }
    }
    //#endregion

    constructor(rootCube: T) {
        this.rootCube = rootCube;
        this.preCalcCube = this.reduceCube(rootCube);
        this.calcCube = this.preCalcCube;
    }

    /**
     * returns an array of the elements on the inserted data page
     * @param string string of the type (only required when using qlik data)
     * @param qPages the page which should be returend
     * @returns asdf
     */
    getListObjectData(type: string, qPages: Array<EngineAPI.INxPage>): Promise<Array<ICalcCubeElement>> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.calcCube.slice(qPages[0].qTop, qPages[0].qTop + qPages[0].qHeight));
            } catch (error) {
                logger.error("Error in getListObjectData", error);
                reject(error);
            }
        });
    }

    /**
     * replaces some character
     * @param qMatch string to be checked
     */
    protected replacer(qMatch: string): string {
        return qMatch
        .replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&")
        .replace(/\*/g, ".*");
    }

    /**
     * search the list object for the inserted string
     * @param qMatch search string to be looked for
     * @returns a Promise if the search was succesfull
     */
    public searchListObjectFor(qMatch: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.calcCube = this.preCalcCube.filter((element) => {
                    if (element.qFallbackTitle.match(new RegExp(this.replacer(qMatch), "i"))) {
                        return element;
                    }
                });
                resolve(true);
            } catch (error) {
                logger.error("ERROR", error);
                reject(error);
            }
        });
    }

    //#region reduceCube
    /**
     * no docu
     * @param elements
     */
    protected abstract internalReduceCube(cube: T): Array<ICalcCubeElement>;

    /**
     * reduces the root element for the only relevant elements
     * @param elements Array of the root Elements
     * @returns shortened Array of the root elements
     */
    public reduceCube(cube: T): Array<ICalcCubeElement> {
         return this.internalReduceCube(cube);
    }
    //#endregion

}

export class AssistHyperCubeDimensions extends AssistHypercube<EngineAPI.IGenericHyperCubeLayout> {

    /**
     * no docu
     * @param elements
     */
    protected internalReduceCube(cube: EngineAPI.IGenericHyperCubeLayout): Array<ICalcCubeElement> {
        let resElement: Array<ICalcCubeElement> = [];
        for (let element of cube.qHyperCube.qDimensionInfo) {
            resElement.push({
                qState: "O",
                cId: "1",
                qGroupFieldDefs: element.qGroupFieldDefs,
                qFallbackTitle: element.qFallbackTitle
            });
        }
        return resElement;
    }

}

export class AssistHyperCubeBookmarks extends AssistHypercube<EngineAPI.IGenericBookmarkListLayout> {

    /**
     * no docu
     * @param cube
     */
    protected internalReduceCube(cube: EngineAPI.IGenericBookmarkListLayout): Array<ICalcCubeElement> {
        let resElement: Array<ICalcCubeElement> = [];
        for (let element of cube.qBookmarkList.qItems) {
            resElement.push({
                qState: "O",
                cId: element.qInfo.qId,
                qGroupFieldDefs: [element.qMeta.title],
                qFallbackTitle: element.qMeta.title
            });
        }
        return resElement;
    }
}

export class AssistHyperCubeMeasures extends AssistHypercube<EngineAPI.IGenericMeasureListLayout> {

    /**
     * no docu
     * @param cube
     */
    protected internalReduceCube(cube: EngineAPI.IGenericMeasureListLayout): Array<ICalcCubeElement> {
        let resElement: Array<ICalcCubeElement> = [];
        for (let element of cube.qMeassureListObject.qItems) {
            resElement.push({
                qState: "O",
                cId: element.qInfo.qId,
                qGroupFieldDefs: [element.qMeta.title],
                qFallbackTitle: element.qMeta.title
            });
        }
        return resElement;
    }

}

export class AssistHyperCubeFields extends AssistHypercube<EngineAPI.IGenericHyperCubeLayout> {

    /**
     * no docu
     * @param cube
     */
    protected internalReduceCube(cube: EngineAPI.IGenericHyperCubeLayout): Array<ICalcCubeElement> {
        let resElement: Array<ICalcCubeElement> = [];
        for (let element of cube.qHyperCube.qDimensionInfo) {
            resElement.push({
                qState: "O",
                cId: "1",
                qGroupFieldDefs: element.qGroupFieldDefs,
                qFallbackTitle: element.qFallbackTitle
            });
        }
        return resElement;
    }

}

export interface IStateMachineState {
    placeholder: string;
    icon: string;
    name: string;
    acceptFunction: () => void;
}

export class StateMachineInput {

    states: Array<IStateMachineState> = [];
    relState: IStateMachineState;

    //#region relStateName
    private _relStateName: string = "";
    public get relStateName() : string {
        return this._relStateName;
    }
    public set relStateName(v : string) {
        if (v !== this._relStateName) {
            this._relStateName = v;
            try {
                this.relState = this.returnStateByName(v);
            } catch (error) {
                logger.error("ERROR in setter of relStateName", error);
            }
        }
    }
    //#endregion

    addState(state: IStateMachineState): Promise<boolean> {
        return new Promise(() => {
            this.states.push(state);
        });
    }

    returnStateByName (stateName: string): IStateMachineState {
        return this.states.filter((x) => {
            return (x.name === stateName) ? x : null;
        })[0];
    }

}