# Davinci Search

Simple Search field which can be enabled / disabled

<aside class="notice">
@angular/forms module is required, install with npm i --save @angular/forms
</aside>

## Usage

import **SearchModule** to your module:

```ts
import { SearchModule } from "davinci.js";

@NgModule({
    ...
    imports: [
        ...,
        SearchModule,
        ...
    ]
    ...
})
export class MyModule { }
```

In template add

```html
<davinci-search></davinci-search>
```

## @Input

- **placeholder** , sets the placeholder text in search component

```html
<davinci-search [placeholder]="what do you search ..."></davinci-search>
```

## @Output

- **search** emits current value after the value has been changed

```html
<davinci-search (input)="onSearch($event)"></davinci-search>
```
