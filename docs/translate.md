# Translate

Because qlik.js / hub / mashup mode doesn't allow to load external modules we reinvent the wheel and copy
ng-translate in a non angular module way with direct services & filters.

The intention is to be as close a possible on ng-translate so that you can use the docu and to be as 
close on ngx-translate to reuse the code on angular 4+.

## Usage Services

1. register services
2. load the translations
3. use translate.instant(KEY) -> translation

## Usage Filter

work in progress

## Examples

```
qvangular.service<ITranslateProvider>("$translateProvider", TranslateProvider)
    .translations("en", langEN)
    .translations("de", langDE)
.determinePreferredLanguage();

let $translate = qvangular.service<ITranslateService>("$translate", TranslateService);

... settings: {
            uses: "settings",
            items: {
                accessibility: {
                    type: "items",
                    label: $translate.instant("properties.accessibility"),
```
