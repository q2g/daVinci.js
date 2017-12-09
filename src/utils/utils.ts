
//#region Import
import { logging } from "./logger";
import { IRegisterDirective, ICalcCubeElement } from "./interfaces";
//#endregion

//#region Logger
let logger: logging.Logger = new logging.Logger("utils");
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
    regDirective: IRegisterDirective,
    rootNameSpace: string,
    factory: ng.IDirectiveFactory,
    directiveName: string) {
    try {
        if (!injector.has("q2g" + rootNameSpace + directiveName + "Directive")) {
            logger.debug("load missing q2g" + rootNameSpace + directiveName);
            regDirective.directive("q2g" + rootNameSpace + directiveName, factory);
        }
    } catch (e) {
        logger.error("Error in checkForExistingDirective", e);
    }
}

/**
 * gets the enigmaRoot for the different Qlik Versions
 * @param scope root angular scoop for the Directive
 * @returns returns the enigma root Object
 */
export function getEnigma(scope: ng.IScope): EngineAPI.IGenericObject {

    let enigmaRoot = undefined;

    try {
        let anyscope = scope as any;
        if (anyscope && anyscope.component && anyscope.component.model) {
            if  (anyscope.component.model.enigmaModel) {
            // pre 3.2 SR3 enigma is in a subvariable of model
                enigmaRoot = anyscope.component.model.enigmaModel as EngineAPI.IGenericObject;
            } else {
                enigmaRoot = anyscope.component.model as EngineAPI.IGenericObject;
            }
        }
    } catch (error) {
        logger.error("Error in getEnigma", error);
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
    protected replace(qMatch: string): string {
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
                    if (element.qFallbackTitle.match(new RegExp(this.replace(qMatch), "i"))) {
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

export class AssistHyperCubeDimensionsInd extends AssistHypercube<EngineAPI.IGenericHyperCubeLayout> {

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

export class AssistHyperCubeDimensions extends AssistHypercube<EngineAPI.IGenericDimensionListLayout> {

    /**
     * no docu
     * @param cube
     */
    protected internalReduceCube(cube: EngineAPI.IGenericDimensionListLayout): Array<ICalcCubeElement> {
        let resElement: Array<ICalcCubeElement> = [];
        for (let element of (cube as any).qDimensionList.qItems) {
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
        for (let element of (cube as any).qFieldList.qItems) {
            resElement.push({
                qState: "O",
                cId: element.qName,
                qGroupFieldDefs: element.qName,
                qFallbackTitle: element.qName
            });
        }
        return resElement;
    }

}

// export class AssistHyperCubeObjects extends AssistHypercube<EngineAPI.IGenericHyperCubeLayout> {
//     protected internalReduceCube(cube: EngineAPI.IGenericHyperCubeLayout): Array<ICalcCubeElement> {
//         let resElement: Array<ICalcCubeElement> = [];
//         logger.info("cube",cube);
//         for (const iterator of (cube as any)) {
//             //
//         }
//         return resElement;
//     }
// }

export interface IStateMachineState<T> {
    placeholder: string;
    icon: string;
    name: T;
    acceptFunction: () => void;
}

export class StateMachineInput<T> {

    states: Array<IStateMachineState<T>> = [];
    relState: IStateMachineState<T>;

    //#region relStateName
    private _relStateName: T = null;
    public get relStateName() : T {
        return this._relStateName;
    }
    public set relStateName(v : T) {
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

    addState(state: IStateMachineState<T>): Promise<boolean> {
        return new Promise(() => {
            this.states.push(state);
        });
    }

    returnStateByName (stateName: T): IStateMachineState<T> {
        return this.states.filter((x) => {
            return (x.name === stateName) ? x : null;
        })[0];
    }

}