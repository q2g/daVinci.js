
//#region Imports
import { Logging } from "../utils/logger";
//#endregion

class ShortcutInputObject implements IShortcutObject {

    name: string;
    shortcut: string;
    preventdefault: boolean;
    action: string;
    rootscope: string;

    constructor(name: string) {
        this.name = name;
    }
}

interface IShortcutObject {
    shortcut: string;
    name: string;
    preventdefault: boolean;
    action: string;
    rootscope: string;
}

class ShortCutController implements ng.IController {
    static $inject = ["$element"];

    //#region Variables
    private rootNameSpace: string = "";
    private shortcutObject: Array<IShortcutObject> = [];
    public shortcutAction: (object: any) => void;
    element: JQuery;
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
                    for (var i: number = 0; i < value.length; i++) {

                        let assistShortcutInputObject = new ShortcutInputObject(value[i].name);
                        assistShortcutInputObject.shortcut = value[i].shortcut.toString();

                        assistShortcutInputObject.rootscope = "|local|";
                        if (typeof assitsVal[i].rootscope !== "undefined") {
                            assistShortcutInputObject.rootscope = assitsVal[i].rootscope;
                        }

                        assistShortcutInputObject.preventdefault = true;
                        if (typeof assitsVal[i].preventdefault !== "undefined") {
                            assistShortcutInputObject.preventdefault = assitsVal[i].preventdefault;
                        }

                        assistShortcutInputObject.action = "";
                        if (typeof assitsVal[i].action !== "undefined") {
                            assistShortcutInputObject.action = assitsVal[i].action;
                        }

                        this.shortcutObject.push(assistShortcutInputObject);
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
        return this._shortcutPreventdefault;
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
        return this._shortcutRootscope;
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

        //#region Setting string call of q2gShortcut
        if (typeof this.shortcutPreventdefault === "undefined") {
            this.shortcutPreventdefault = true;
        }

        if (typeof this.shortcutRootscope === "undefined") {
            this.shortcutRootscope = "|local|";
        }

        if (typeof this.shortcutAction === "undefined") {
            for (var i: number = 0; i < this.shortcutObject.length; i++) {
                this.shortcutObject[i].action = "focus";
            }
         }

        if (this.shortcutObject && typeof this.shortcut === "string") {
            this.shortcutObject[0].preventdefault = this.shortcutPreventdefault;
            this.shortcutObject[0].rootscope = this.shortcutRootscope;
        }
        //#endregion

        this.keyDownFunction = (e: JQueryKeyEventObject) => {
            this.keydownHandler(e);
        };

        if (this.shortcut) {
            $(document).on("keydown", this.keyDownFunction);
        }
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
        this.logger.debug("Function keyDownHandler", this.shortcutObject);

        this.shortcutObject.forEach((shortcut) => {
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
        })
    }

    /**
     * checks if Action is predefined, otherwise run q2gShortcutAction
     * @param object selected Shortcut Object
     */
    private runAction(objectShortcut: IShortcutObject, event?: JQueryKeyEventObject): boolean {
        this.logger.debug("Function runAction", "");

        try {

            if (objectShortcut.action === "focus") {
                
                this.element.focus();
                return;
            }

            if (objectShortcut.action === "onClick") {
                this.element.triggerHandler("click")
                return;
            }

            this.shortcutAction({
                objectShortcut: {
                    objectShortcut: objectShortcut,
                    element: this.element,
                    event: event,
                },
            });
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
                if (element.parent().is(document) || element === lastElement) {
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
                shortcutPreventdefault: "<?"
            },
            link: function (scope: ng.IScope) {
                (scope as any).vmShortcut.rootNameSpace = rootNameSpace;
            }
        };
    };
}