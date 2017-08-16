
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
    /**
    * Register a new directive with the compiler.
    *
    * @param name Name of the directive in camel-case (i.e. ngBind which will match as ng-bind)
    * @param directiveFactory An injectable directive factory function.
    */
    directive(name: string, directiveFactory: ng.Injectable<ng.IDirectiveFactory>): void;
    directive(object: { [directiveName: string]: ng.Injectable<ng.IDirectiveFactory> }): void;
    filter(name: string, filterFactoryFunction: ng.Injectable<Function>): ng.IModule;
    filter(object: { [name: string]: ng.Injectable<Function> }): ng.IModule;
}
//#endregion

//#region Logger 
let logger = new Logging.Logger("utils");
//#endregion

// check if can be deleted
export class SimplifierDefinitionObject {

    constructor(rootDef: IDefinitionObject) {
        let rootList = Object.getOwnPropertyNames(rootDef.definition);
        this.getObjectsRec(rootList, rootDef.definition, "definition");
    }

    //#region variables
    public properties: Array<IPropertiesDefault> = [];
    //#endregion variables

    /**
     * recorsive function to generate relevant Object Properties(ref and defaultValue)
     * @param objectArr Array of stringified Property names 
     * @param object object of which the property names where stringified
     * @param propName search string for the ref definition of properties
     */
    private getObjectsRec(objectArr: Array<string>, object: any, propName: string): any {
        try {
            for (var i: number = 0; i < objectArr.length; i++) {
                if (typeof object[objectArr[i]] === "object") {
                    let assistList = Object.getOwnPropertyNames(object[objectArr[i]]);
                    this.getObjectsRec(assistList, object[objectArr[i]], objectArr[i]);

                } else if (objectArr[i] === "ref" && object.defaultValue) {
                    let assistObject: IPropertiesDefault = {
                        defaultValue: object.defaultValue,
                        ref: object.ref
                    };
                    this.properties.push(assistObject);
                }
            }
        } catch (e) {
            console.error("error in function getObjectsRec", e)
        }
    }

    /**
     * returns the value of the property in dependency of the insertet link
     * @param property the relevant enigma Properties of the object
     * @param link the ref string of the object
     * @param forceDefault use default value or not
     */
    public getPropertyValue(property: EngineAPI.IGenericObjectProperties, link: string, forceDefault: boolean): any {
        try {
            let arrLink: Array<string> = [];
            arrLink = link.split(".");
            let assistObjectProperties: any = property;

            for (var i: number = 0; i < this.properties.length; i++) {

                if (this.properties[i].ref === link && forceDefault) {
                    return this.properties[i].defaultValue;

                } else if (this.properties[i].ref === link) {
                    for (var j: number = 0; j < arrLink.length; j++) {
                        assistObjectProperties = assistObjectProperties[arrLink[j]];
                    }

                    return assistObjectProperties as any;
                }
            }
        } catch (e) {
            console.error("error in function getPropertyValue", e);
        }
    }
}

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
    })    
    return newTemplate;
}

/**
 * check and replace additional characters
 * @param string
 */
export function regEscaper(string) {
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
            logger.trace("load missing q2g" + rootNameSpace + directiveName);
            regDirective.directive("q2g" + rootNameSpace + directiveName, factory);
        }
    } catch (e) {
        console.error("Error in checkForExistingDirective", e)
    }
}


export class AssistHypercube {

    rootCube: any;
    calcCube: Array<any> = [];

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

    constructor(rootCube: any) {
        this.rootCube = rootCube;
        this.searchListObjectFor("");        
    }
    
    getListObjectData(string: string, qPages: EngineAPI.INxPage): Promise<any> {

        return new Promise((resolve, reject) => {
            try {
                resolve(this.calcCube.slice(qPages[0].qTop, qPages[0].qTop + qPages[0].qHeight));
            } catch (e) {
                console.error("Error in getListObjectData", e);
                reject(e);
            }
        });



    }

    
    searchListObjectFor(qMatch: string): Promise<boolean> {

        return new Promise((resolve, reject) => {
            try {
                let assistElement: string = qMatch
                    .replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&")
                    .replace(/\*/g, ".*");

                if (this.rootCube.qBookmarkList) {
                    this.calcCube = this.rootCube.qBookmarkList.qItems.filter((element: any) => {
                        if (element.qMeta.title.match(new RegExp(assistElement, "i"))) {
                            return element;
                        }
                    });
                } else if (this.rootCube.qHyperCube) {
                    this.calcCube = this.rootCube.qHyperCube.qDimensionInfo.filter((element: any) => {
                        if (element.qGroupFieldDefs[0].match(new RegExp(assistElement, "i"))) {
                            return element;
                        }
                    });
                }

                resolve(true);
            } catch (e) {
                console.error("Error in seachListObjectData", e);
                reject(e);
            }
        });

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
export function checkEqualityOfArrays(array1: Array < string >, array2: Array<string>): boolean {
    logger.debug("Function checkEqualityOfArrays", "");

    try {
        if (array1 && array2 && array1.length !== array2.length) {
            return false;
        }

        if (array1 && array2) {
            for (var i: number = 0; i < array1.length; i++) {

                if (JSON.stringify(array1[i]).indexOf(JSON.stringify(array2[i])) === -1) {
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

function sort(a, b) {
    if (a.id > b.id) {
        return 1;
    }
    if (a.id < b.id) {
        return -1;
    }
    // a muss gleich b sein
    return 0;
}