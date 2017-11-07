// import * as packageJsonImport from "../package.json";
// import * as adasd from "text!./directives/identifier.html";

// // export const idhtml = adasd;
// // export const version = packageJsonImport.version;
// // export * from "./directives/listview";
// // export * from "./directives/extensionHeader";
// export * from "./directives/identifier";
// // export * from "./directives/inputBar";
// // export * from "./directives/shortcut";
// // export * from "./directives/statusText";
// // export * from "./directives/scrollBar";

// // export * from "./filter/statusFilter";

// // export * from "./services/registration";
// // // export * from "./services/translate";

// // export * from "./utils/interfaces";
// export * from "./utils/logger";
// // export * from "./utils/object";
// // export * from "./utils/utils";


// import {Logging} from "./utils/logger";

// namespace daVinci {
// }
// export default daVinci;


// export * from "./utils/logger";
// export * from "./directives/identifier";



import { Logging as _Logging} from "./utils/logger";
import { getEnigma as _getEnigma, templateReplacer as _templateReplacer,
    checkDirectiveIsRegistrated as _checkDirectiveIsRegistrated } from "./utils/utils";
import { IdentifierDirectiveFactory as _IdentifierDirectiveFactory } from "./directives/identifier";
import { IVMScope as _IVMScope } from "./utils/interfaces";
import { RegistrationProvider as _RegistrationProvider, IRegistrationProvider as _IRegistrationProvider } from "./services/registration";

// declare module test {
//     export _Logging;
// }



export namespace daVinci {

    export namespace utils {
        export const Logging = _Logging;
        export const templateReplacer = _templateReplacer;
        export const checkDirectiveIsRegistrated = _checkDirectiveIsRegistrated;
    }

    export namespace services {
        export const RegistrationProvider = _RegistrationProvider;
        export type IRegistrationProvider = _IRegistrationProvider;
    }

    export const IdentifierDirectiveFactory = _IdentifierDirectiveFactory;
    export type IVMScope<T> = _IVMScope<T>;
    export const version: string = "|GitVersionNumber|";
    export const getEnigma = _getEnigma;
}
