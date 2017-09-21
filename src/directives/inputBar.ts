
import { templateReplacer, checkDirectiveIsRegistrated, IRegisterDirective } from "../utils/utils";
import { ShortCutDirectiveFactory, IShortcutObject, IShortcutHandlerObject } from "./shortcut";
import * as template from "text!./inputBar.html";
import { Logging } from "../utils/logger";

let logger = new Logging.Logger("q2g inputBarDirective");

class InputBarController implements ng.IController {

    public $onInit(): void {
        logger.debug("initial Run of inputBarController");
    }

    inputAccept: boolean = false;
    inputCancel: boolean = false;
    placeholder: string;
    timeout: ng.ITimeoutService;
    textSearch: string = "";

    private _theme: string;
    get theme(): string {
        if (this._theme) {
            return this._theme;
        }
        return "default";
    }
    set theme(value: string) {
        if (value !== this._theme) {
            this._theme = value;
        }
    }

    private _icon: string;
    get icon(): string {
        return this._icon;
    }
    set icon(value: string) {
        if (!value) {
            value = "lui-search__search-icon";
        }
        if (value !== this._icon) {

            this._icon = value;
        }
    }

    static $inject = ["$element", "$scope", "$timeout"];

    /**
     * init of List View Controller
     */
    constructor(element: JQuery, scope: ng.IScope, timeout: ng.ITimeoutService) {

        this.timeout = timeout;

        scope.$watch(function () { return element.is(":visible"); }, function () {
            try {
                if (element.is(":visible")) {
                    element.children().eq(1).focus();
                }
            } catch (e) {
                logger.error("error in constructor", e);
            }
        });
    }

    /**
     * manage all shortcut events, called on the input tag
     * @param objcet element which is returned from the shortcut directive
     */
    shortcutHandlerSearchBar(objcet: IShortcutHandlerObject): void {
        switch(objcet.objectShortcut.name) {
            case "accept":
                this.inputAccept = true;
            case "cancel":
                this.inputCancel = true;
        }
        this.timeout();
    }
}

export function InputBarDirectiveFactory(rootNameSpace: string): ng.IDirectiveFactory {
    "use strict";
    return ($document: ng.IAugmentedJQuery, $injector: ng.auto.IInjectorService, $registrationProvider: IRegisterDirective) => {
        return {
            restrict: "E",
            replace: true,
            template: templateReplacer(template, rootNameSpace),
            controller: InputBarController,
            controllerAs: "vm",
            scope: {},
            bindToController: {
                inputAccept: "=?",
                inputCancel: "=?",
                icon: "<?",
                placeholder: "<",
                textSearch: "=",
                theme: "<?"
            },
            compile: function () {
                checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, ShortCutDirectiveFactory, "Shortcut");
            }
        };
    };
}


