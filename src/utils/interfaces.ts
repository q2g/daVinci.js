export interface IVMScope<T> extends ng.IScope {
    vm: T;
}

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
    filter(name: string, filterFactoryFunction: ng.Injectable<Function>): void;
    filter(object: { [name: string]: ng.Injectable<Function> }): void;
}

export interface ICalcCubeElement {
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

export interface IDomContainer {
    element: JQuery;
}