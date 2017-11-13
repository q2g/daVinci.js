import { logging } from "./utils/logger";

import { IVMScope as _IVMScope } from "./utils/interfaces";

import { AssistHypercube as _AssistHypercube,
         AssistHyperCubeDimensionsInd as _AssistHyperCubeDimensionsInd,
         AssistHyperCubeMeasures as _AssistHyperCubeMeasures,
         AssistHyperCubeDimensions as _AssistHyperCubeDimensions,
         AssistHyperCubeBookmarks as _AssistHyperCubeBookmarks,
         AssistHyperCubeFields as _AssistHyperCubeFields,
         calcNumbreOfVisRows as _calcNumbreOfVisRows,
         checkEqualityOfArrays as _checkEqualityOfArrays,
         checkDirectiveIsRegistrated as _checkDirectiveIsRegistrated,
         getEnigma as _getEnigma,
         ICalcCubeElement as _ICalcCubeElement,
         IDomContainer as _IDomContainer,
         IMenuElement as _IMenuElement,
         IRegisterDirective as _IRegisterDirective,
         IStateMachineState as _IStateMachineState,
         regEscaper as _regEscaper,
         StateMachineInput as _StateMachineInput,
         templateReplacer as _templateReplacer
} from "./utils/utils";

import { ICollection as _ICollection,
         IListener as _IListener,
         ILiteEvent as _ILiteEvent,
         Iq2gIListObject as _Iq2gIListObject,
         LiteEvent as _LiteEvent,
         Q2gIndObject as _Q2gIndObject,
         Q2gListAdapter as _Q2gListAdapter,
         Q2gListObject as _Q2gListObject
} from "./utils/object";

import { RegistrationProvider as _RegistrationProvider,
         IRegistrationProvider as _IRegistrationProvider,
         IRegistrationObject as _IRegistrationObject
} from "./services/registration";

import { ITranslateProvider as _ITranslateProvider,
         ITranslateService as _ITranslateService,
         ITranslationTable as _ITranslationTable,
         TranslateProvider as _TranslateProvider,
         TranslateService as _TranslateService
} from "./services/translate";

import { qStatusFilter as _qStatusFilter } from "./filter/statusFilter";

import { ExtensionHeaderDirectiveFactory as _ExtensionHeaderDirectiveFactory } from "./directives/extensionHeader";

import { IdentifierDirectiveFactory as _IdentifierDirectiveFactory } from "./directives/identifier";

import { InputBarDirectiveFactory as _InputBarDirectiveFactory } from "./directives/inputBar";

import { ListViewDirectiveFactory as _ListViewDirectiveFactory } from "./directives/listview";

import { ScrollBarDirectiveFactory as _ScrollBarDirectiveFactory } from "./directives/scrollBar";

import { ShortCutDirectiveFactory as _ShortCutDirectiveFactory,
         IShortcutObject as _IShortcutObject
} from "./directives/shortcut";

import { StatusTextDirectiveFactory as _StatusTextDirectiveFactory } from "./directives/statusText";

import { IQService } from "angular";


const version: string = "|GitVersionNumber|";

namespace utils {
    export const AssistHypercube = _AssistHypercube;
    export const AssistHyperCubeDimensionsInd = _AssistHyperCubeDimensionsInd;
    export const AssistHyperCubeMeasures = _AssistHyperCubeMeasures;
    export const AssistHyperCubeDimensions = _AssistHyperCubeDimensions;
    export const AssistHyperCubeBookmarks = _AssistHyperCubeBookmarks;
    export const AssistHyperCubeFields = _AssistHyperCubeFields;
    export const StateMachineInput = _StateMachineInput;
    export const Q2gListAdapter = _Q2gListAdapter;
    export const LiteEvent = _LiteEvent;
    export const Q2gIndObject = _Q2gIndObject;
    export const Q2gListObject = _Q2gListObject;

    export const calcNumbreOfVisRows = _calcNumbreOfVisRows;
    export const checkEqualityOfArrays = _checkEqualityOfArrays;
    export const checkDirectiveIsRegistrated = _checkDirectiveIsRegistrated;
    export const getEnigma = _getEnigma;
    export const regEscaper = _regEscaper;
    export const templateReplacer = _templateReplacer;

    export type IVMScope<T> = _IVMScope<T>;
    export type ICalcCubeElement = _ICalcCubeElement;
    export type IDomContainer = _IDomContainer;
    export type IMenuElement = _IMenuElement;
    export type IRegisterDirective = _IRegisterDirective;
    export type IStateMachineState<t> = _IStateMachineState<t>;
    export type ICollection = _ICollection;
    export type IListener = _IListener;
    export type ILiteEvent = _ILiteEvent;
    export type Iq2gIListObject = _Iq2gIListObject;

    export interface IQ2gListAdapter extends _Q2gListAdapter {}
    export interface IQ2gIndObject extends _Q2gListAdapter {}
    export interface IQ2gListObject extends _Q2gListAdapter {}
}

namespace services {
    export const RegistrationProvider = _RegistrationProvider;
    export const TranslateProvider = _TranslateProvider;
    export const TranslateService = _TranslateService;

    export type IRegistrationProvider = _IRegistrationProvider;
    export type IRegistrationObject = _IRegistrationObject;
    export type ITranslateProvider = _ITranslateProvider;
    export type ITranslateService = _ITranslateService;
    export type ITranslationTable = _ITranslationTable;
}

namespace directives {
    export const ExtensionHeaderDirectiveFactory = _ExtensionHeaderDirectiveFactory;
    export const IdentifierDirectiveFactory = _IdentifierDirectiveFactory;
    export const InputBarDirectiveFactory = _InputBarDirectiveFactory;
    export const ListViewDirectiveFactory = _ListViewDirectiveFactory;
    export const ScrollBarDirectiveFactory = _ScrollBarDirectiveFactory;
    export const ShortCutDirectiveFactory = _ShortCutDirectiveFactory;
    export const StatusTextDirectiveFactory = _StatusTextDirectiveFactory;

    export type IShortcutObject = _IShortcutObject;
}

export {
    logging,
    utils,
    services,
    version,
    directives
};


