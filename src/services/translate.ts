import { Logging } from "../utils/logger";

type TranslationResults = string | { [key: string]: string };

interface ILanguageTranslationTable {
    [key: string]: ITranslationTable;
}

interface ITranslationTable {
    [key: string]: string | ITranslationTable;
}

export interface ITranslateProvider {
    translations(key?: string): ITranslationTable;
    translations(key: string, translationTable: ITranslationTable | string): ITranslateProvider;
    //#region not implemented
    // cloakClassName(): string;
    // cloakClassName(name: string): ITranslateProvider;
    // addInterpolation(factory: any): ITranslateProvider;
    // useMessageFormatInterpolation(): ITranslateProvider;
    // useInterpolation(factory: string): ITranslateProvider;
    // useSanitizeValueStrategy(value: string): ITranslateProvider;
    preferredLanguage(): string;
    preferredLanguage(language: string): ITranslateProvider;
    // translationNotFoundIndicator(indicator: string): ITranslateProvider;
    // translationNotFoundIndicatorLeft(): string;
    // translationNotFoundIndicatorLeft(indicator: string): ITranslateProvider;
    // translationNotFoundIndicatorRight(): string;
    // translationNotFoundIndicatorRight(indicator: string): ITranslateProvider;
    // fallbackLanguage(): ITranslateProvider;
    // fallbackLanguage(language: string): ITranslateProvider;
    // fallbackLanguage(languages: string[]): ITranslateProvider;
    // forceAsyncReload(value: boolean): ITranslateProvider;
    // use(): string;
    // use(key: string): ITranslateProvider;
    // storageKey(): string;
    // storageKey(key: string): void; // JeroMiya - the library should probably return ITranslateProvider but it doesn't here
    // uniformLanguageTag(options: string | Object): ITranslateProvider;
    // useUrlLoader(url: string): ITranslateProvider;
    // useStaticFilesLoader(options: IStaticFilesLoaderOptions | { files: IStaticFilesLoaderOptions[] }): ITranslateProvider;
    // useLoader(loaderFactory: string, options?: any): ITranslateProvider;
    // useLocalStorage(): ITranslateProvider;
    // useCookieStorage(): ITranslateProvider;
    // useStorage(storageFactory: any): ITranslateProvider;
    // storagePrefix(): string;
    // storagePrefix(prefix: string): ITranslateProvider;
    // useMissingTranslationHandlerLog(): ITranslateProvider;
    // useMissingTranslationHandler(factory: string): ITranslateProvider;
    // usePostCompiling(value: boolean): ITranslateProvider;
    // directivePriority(): number;
    // directivePriority(priority: number): ITranslateProvider;
    determinePreferredLanguage(fn?: () => void): ITranslateProvider;
    // registerAvailableLanguageKeys(): string[];
    // registerAvailableLanguageKeys(languageKeys: string[], aliases?: ILanguageKeyAlias): ITranslateProvider;
    // useLoaderCache(cache?: any): ITranslateProvider;
    // resolveClientLocale(): string;
    //#endregion
}

export class TranslateProvider implements ITranslateProvider {
    private static translationTable: ITranslationTable = {};
    protected static preferredLanguage: string;

    determinePreferredLanguage(fn?: () => void): ITranslateProvider {
        let userLang = navigator.language || (navigator as any).userLanguage;
        if (userLang === undefined)
            userLang = "";
        this.preferredLanguage(userLang);
        return this;
    }

    preferredLanguage(language?: string): any {
        if (language) {
            TranslateProvider.preferredLanguage = language;
            return this;
        }
        return TranslateProvider.preferredLanguage;
    }

    translations(key: string, translationTable?: ITranslationTable): any {
        if (translationTable !== undefined) {
            TranslateProvider.translationTable[key] = translationTable;
            return this;
        }
        return TranslateProvider.translationTable[key];
    }
}

export interface ITranslateService {
    (translationId: string, interpolateParams?: any, interpolationId?: string): ng.IPromise<string>;
    (translationId: string[], interpolateParams?: any, interpolationId?: string): ng.IPromise<{ [key: string]: string }>;
    // cloakClassName(): string;
    // cloakClassName(name: string): ITranslateProvider;
    // fallbackLanguage(langKey?: string): string;
    // fallbackLanguage(langKey?: string[]): string;
    instant(translationId: string, interpolateParams?: any, interpolationId?: string): string;
    instant(translationId: string[], interpolateParams?: any, interpolationId?: string): { [key: string]: string };
    //#region not implemented
    // isPostCompilingEnabled(): boolean;
    // preferredLanguage(langKey?: string): string;
    // proposedLanguage(): string;
    // refresh(langKey?: string): ng.IPromise<void>;
    // //    storage(): IStorage;
    // storageKey(): string;
    // use(): string;
    // use(key: string): ng.IPromise<string>;
    // useFallbackLanguage(langKey?: string): void;
    // versionInfo(): string;
    // loaderCache(): any;
    // isReady(): boolean;
    // onReady(): ng.IPromise<void>;
    // resolveClientLocale(): string;
    //#endregion
}

export const TranslateService = ((function ($q: ng.IQService, $translateProvider: ITranslateProvider) {
    // init für Translation

    let NameLess = function (translationId: string | string[], interpolateParams?: any, interpolationId?: string): ng.IPromise<TranslationResults> {
        return new $q<TranslationResults>((resolve, reject) => {
            let result = NameLess.instant(translationId as any, interpolateParams, interpolationId);
            resolve(result);
        });
    } as any as ITranslateService;

    NameLess.instant = (translationId: string | string[], interpolateParams?: any, interpolationId?: string): any => {
        try {
            return $translateProvider.translations($translateProvider.preferredLanguage())[translationId as string];;
        }
        catch (err) {
            return translationId;
        }
    }
    return NameLess;
}));