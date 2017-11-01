
//#region Imports
import { Logging } from "../utils/logger";
import { IDomContainer } from "../utils/utils";
//#endregion

class ShortcutInputObject implements IShortcutObject {

    name: string;
    shortcut: string;
    preventdefault: boolean;
    action: string;
    rootscope: string;
    triggerHandler: string;

    constructor(name: string) {
        this.name = name;
    }
}

export interface IShortcutObject {
    shortcut: string;
    name: string;
    preventdefault?: boolean;
    action?: string;
    rootscope?: string;
    triggerHandler?: string;
}

interface IShortcutHandlerObject {
    /**
     * A wraper of an dom element, needed to get the element return to the caller
     */
    domcontainer: IDomContainer;

    /**
     * the event calld when the shortcut handler gets triggered
     */
    event: JQueryKeyEventObject;

    /**
     * the object, which hold the information about the shortcut which got fired
     */
    shortcutObject: IShortcutObject;
}

class ShortCutController implements ng.IController {
    static $inject = ["$element"];

    //#region Variables
    private element: JQuery;
    private shortcutAction: (params: IShortcutHandlerObject) => void;
    private shortcutTriggerHandler: string;
    private rootNameSpace: string = "";
    private shortcutObject: Array<IShortcutObject> = [];
    //#endregion

    //#region shortcutOverride
    private _shortcutOverride: Array<IShortcutObject> = [];
    get shortcutOverride(): Array<IShortcutObject> {
        return this._shortcutOverride;
    }
    set shortcutOverride(value: Array<IShortcutObject>) {
        if (value !== this._shortcutOverride) {
            try {
                this._shortcutOverride = value;
                this.shortcutObject = this.implementOverriceShortcuts(this.shortcutObject, value);
            } catch (e) {
                this.logger.error("error in Setter of shortcutOverride", e);
            }
        }
    }
    //#endregion

    //#region shortcut
    private _shortcut: string | Array<IShortcutObject>;
    get shortcut(): string | Array<IShortcutObject> {
        return this._shortcut;
    }
    set shortcut(value: string | Array<IShortcutObject>) {
        if (this._shortcut !== value) {
            try {
                this._shortcut = value;
                if (typeof value === "object" && value[0].shortcut) {
                    let assitsVal: Array<IShortcutObject> = value;
                    this.shortcutObject = [];
                    for(let shortcutElement of value) {
                        this.shortcutObject.push(this.checksShortcutProperties(shortcutElement));
                    }
                } else if (typeof value === "string") {
                    if (!this.shortcutObject || this.shortcutObject.length === 0) {
                        this.shortcutObject = [];
                        this.shortcutObject.push(new ShortcutInputObject("Default"));
                        this.shortcutObject[0].shortcut = value;
                    } else {
                        this.shortcutObject[0].shortcut = value;
                    }
                }
            } catch (e) {
                this.logger.error("Error in SETTER of q2gShortcut", e);
            }
        }
    }
    //#endregion

    //#region logger
    private _logger: Logging.Logger;
    private get logger(): Logging.Logger {
        if (!this._logger) {
            try {
                this._logger = new Logging.Logger("ShortCutController");
            } catch (e) {
                console.error("Error in initialising Logger", e);
            }
        }
        return this._logger;
    }
    //#endregion

    //#region shortcutPreventdefault
    private _shortcutPreventdefault: boolean;
    get shortcutPreventdefault(): boolean {
        if(this._shortcutPreventdefault) {
            return this._shortcutPreventdefault;
        }
        return true;
    }
    set shortcutPreventdefault(value: boolean) {
        if (value !== this.shortcutPreventdefault && this.shortcut) {
            try {
                if (!this.shortcutObject || this.shortcutObject.length === 0) {
                    this.shortcutObject = [];
                    this.shortcutObject.push(new ShortcutInputObject("Default"));
                    this.shortcutObject[0].preventdefault = value;
                } else {
                    this.shortcutObject[0].preventdefault = value;
                }
                this._shortcutPreventdefault = value;
            } catch (e) {
                this.logger.error("ERROR in SETTER of q2gShortcutPreventdefault", e);
            }
        }
    }
    //#endregion

    //#region shortcutRootscope
    private _shortcutRootscope: string;
    get shortcutRootscope(): string {
        if (this._shortcutRootscope) {
            return this._shortcutRootscope;
        }
        return "|local|";
    }
    set shortcutRootscope(value: string) {
        if (value !== this.shortcutRootscope && this.shortcut) {
            try {
                if (!this.shortcutObject || this.shortcutObject.length === 0) {
                    this.shortcutObject = [];
                    this.shortcutObject.push(new ShortcutInputObject("Default"));
                    this.shortcutObject[0].rootscope = value;
                } else {
                    this.shortcutObject[0].rootscope = value;
                }
                this._shortcutRootscope = value;
            } catch (e) {
                this.logger.error("ERROR in SETTER of q2gShortcutRootscope", e);
            }
        }
    }
    //#endregion

    //#region keyDownFunction
    private keyDownFunction: (e: JQueryKeyEventObject) => void;
    //#endregion

    /**
     * init Constructor of Shortcut Controller
     * @param element element of the List View Controller
     */
    constructor(element: JQuery) {
        this.logger.debug("Constructor ShortCutController", "");
        this.element = element;

        if (typeof this.shortcutTriggerHandler === "undefined") {
            this.shortcutTriggerHandler = "";
        }

        if (typeof this.shortcutAction === "undefined") {
            for (var i: number = 0; i < this.shortcutObject.length; i++) {
                this.shortcutObject[i].action = "";
                if (this.shortcutTriggerHandler = "") {
                    this.shortcutTriggerHandler = "focus";
                }
            }
        }

        if (this.shortcutObject && typeof this.shortcut === "string") {
            this.shortcutObject[0].preventdefault = this.shortcutPreventdefault;
            this.shortcutObject[0].rootscope = this.shortcutRootscope;
        }

        this.keyDownFunction = (e: JQueryKeyEventObject) => {
            this.keydownHandler(e);
        };

        if (this.shortcut) {
            $(document).on("keydown", this.keyDownFunction);
        }
    }

    /**
     * checks the Shortcut Object and set default values
     * @param value shortcut object to be checked for default
     */
    private checksShortcutProperties(value: IShortcutObject): IShortcutObject {

        let assistShortcutInputObject = new ShortcutInputObject(value.name);
        assistShortcutInputObject.shortcut = value.shortcut.toString();

        assistShortcutInputObject.rootscope = "|local|";
        if (typeof value.rootscope !== "undefined") {
            assistShortcutInputObject.rootscope = value.rootscope;
        }

        assistShortcutInputObject.preventdefault = true;
        if (typeof value.preventdefault !== "undefined") {
            assistShortcutInputObject.preventdefault = value.preventdefault;
        }

        assistShortcutInputObject.action = "";
        if (typeof value.action !== "undefined") {
            assistShortcutInputObject.action = value.action;
        }

        assistShortcutInputObject.triggerHandler = "";
        if (typeof value.triggerHandler !== "undefined") {
            assistShortcutInputObject.triggerHandler = value.triggerHandler;
        }

        return assistShortcutInputObject;
    }

    /**
     * merges two arrays
     * @param rootArray
     * @param override
     */
    private implementOverriceShortcuts(rootArray: Array<IShortcutObject>, overrideArray: Array<IShortcutObject>): Array<IShortcutObject> {
        let newArray: Array<IShortcutObject> = [];
        for (let rootArrayElement of rootArray) {
            for (let overrideArrayElement of overrideArray) {
                if (overrideArrayElement.name && overrideArrayElement.shortcut && rootArrayElement.name === overrideArrayElement.name) {
                    let assistObj: IShortcutObject = this.checksShortcutProperties(overrideArrayElement);
                    rootArrayElement.name = assistObj.name;
                    rootArrayElement.shortcut = assistObj.shortcut;
                    rootArrayElement.action = overrideArrayElement.action ? assistObj.action : rootArrayElement.action;
                    rootArrayElement.preventdefault
                        = overrideArrayElement.preventdefault ? assistObj.preventdefault : rootArrayElement.preventdefault;
                    rootArrayElement.rootscope = overrideArrayElement.rootscope ? assistObj.rootscope : rootArrayElement.rootscope;
                }
            }
            newArray.push(rootArrayElement);
        }
        return newArray;
    }

    /**
     * löscht die beziehungen der Events vom scope
     */
    $onDestroy(): void {
        this.logger.debug("Function onDestroy", "");

        try {
            $(document).unbind("keydown", this.keyDownFunction);
        } catch (e) {
            this.logger.error("ERROR in function $onDestroy",e);
        }
    }

    /**
     * Handler function to bind on keydown
     * @param event Keybordevent for keydown
     * @param global definition, if handler is fired on local or global
     */
    private keydownHandler(event: JQueryKeyEventObject) {
        for (let shortcut of this.shortcutObject) {
            if (this.checkShortcutsEqual(this.getArrayInsertetShortcut(shortcut.shortcut), this.getArrayKeydownShortcut(event))) {
                if (shortcut.preventdefault) {
                    try {
                        event.preventDefault();
                    } catch (e) {
                        this.logger.error("error in keydownHandler", e);
                    }
                }
                if (shortcut.rootscope === "|global|") {
                    this.runAction(shortcut);

                } else if (this.checkParentForFocus(this.element, shortcut.rootscope)) {
                    this.runAction(shortcut, event);
                }
            }
        }
    }

    /**
     * checks if Action is predefined, otherwise run q2gShortcutAction
     * @param object selected Shortcut Object
     */
    private runAction(shortcutObject: IShortcutObject, event?: JQueryKeyEventObject): void {

        try {
            if (shortcutObject.triggerHandler !== "") {
                this.element.triggerHandler(shortcutObject.triggerHandler);
            }

            if (typeof this.shortcutAction !== "undefined") {

                let params = {
                    shortcutObject: shortcutObject,
                    event: event,
                    domcontainer: {
                        element: this.element
                    }
                };
                this.shortcutAction(params);
            }
        } catch (e) {
            this.logger.error("ERROR in function runAction", e);
        }
    }

    /**
     * check if child element of Root element has focus
     * @param element element of the List View Controller
     * @param rootscope the root scope the function should look for
     */
    private checkParentForFocus(element: JQuery, rootscope: string): boolean {
        this.logger.debug("Function checkParentForFocus", "");

        try {
            let lastElement = null;
            let maxCount: number = 100;
            let foundNode: boolean = false;

            for (let i: number = 0; i < maxCount; i++) {
                let elem: NamedNodeMap = element.parent()[0].attributes;
                if (element.parent().is((document as any) || element === lastElement)) {
                    return false;
                }

                for (var j: number = 0; j < elem.length; j++) {
                    if (!foundNode && rootscope === "|local|" &&
                        elem[j].name === "q2g-" + this.rootNameSpace.toLowerCase() + "-shortcut-scope") {
                        foundNode = true;
                        if ((element.parent() as any).find(":focus").length > 0) {
                            return true;
                        }
                    }
                    if (elem[j].value===rootscope && (element.parent() as any).find(":focus").length > 0) {
                        return true;
                    }
                }
                element = element.parent();
            }
            return false;
        } catch (e) {
            this.logger.error("Error in checkParentForFocus", e);
        }
        return false;
    }

    /**
     * checks the two arrays for a match
     * @param array1 Shortcut array one
     * @param array2 Shortcut array two
     * @returns returns boolean depending on equality
     */
    private checkShortcutsEqual(array1: Array<string>, array2: Array<string>): boolean {
        this.logger.debug("Function checkShortcutsEqual", "");
        try {
            return array1.sort().join("|") === array2.sort().join("|");
        } catch (e) {
            this.logger.error("Error in function checkShortcutsEqual", e);
        }
    }

    /**
     * Creates an Array of Strings from the Shortcut inserted shortcut. The insertet Shortcut gets split on the "+" sign
     * @param shortcut schortcut to be converted into an array
     * @returns returns a Array of strings of the insertet shortcut
     */
    private getArrayInsertetShortcut(shortcut: string): Array<string> {
        this.logger.debug("Function getArrayInsertetShortcut", "");
        try {
            let arr: Array<string> = [];
            arr = shortcut.split("+");
            for (var i: number = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim();
            }
            return arr;
        } catch (e) {
            this.logger.error("ERROR in function getArrayInsertetShortcut", e);
        }
    }

    /**
     * Creates an Array from keybort input from user
     * @param e the jQuery event to be handled
     */
    private getArrayKeydownShortcut(e: JQueryKeyEventObject): Array<string> {
        this.logger.debug("Function getArrayKeydownShortcut", "");
        try {
            let arr: Array<string> = [];

            if (e.key.length >= 1) {
                arr.push(e.keyCode.toString());

                if (e.ctrlKey) {
                    arr.push("strg");
                }

                if (e.altKey) {
                    arr.push("alt");
                }

                if (e.shiftKey) {
                    arr.push("shift");
                }
            }
            return arr;
        } catch (e) {
            this.logger.error("ERROR in function getArrayKeydownShortcut", e);
        }
    }
}

export function ShortCutDirectiveFactory(rootNameSpace: string): ng.IDirectiveFactory {
    "use strict";
    return () => {
        return {
            restrict: "A",
            replace: true,
            controller: ["$element", ShortCutController],
            controllerAs: "vmShortcut",
            scope: {},
            bindToController: {
                shortcut: "<",
                shortcutRootscope: "<?",
                shortcutAction: "&?",
                shortcutPreventdefault: "<?",
                shortcutOverride: "<?",
                shortcutTriggerHandler: "<?"
            },
            link: function (scope: ng.IScope) {
                (scope as any).vmShortcut.rootNameSpace = rootNameSpace;
            }
        };
    };
}