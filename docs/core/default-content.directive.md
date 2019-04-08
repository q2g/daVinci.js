# Davinci Default Directive

Simple Directive which sets a Default template when content does not exist

## Usage

import **CoreModule** to your module:

```ts
import { CoreModule } from "davinci.js";

@NgModule({
    ...
    imports: [
        ...,
        CoreModule,
        ...
    ]
    ...
})
export class MyModule { }
```

In template add

```html
<ng-template #title>
    <span>desault content</span>
</ng-template>


<div [davinciDefaultTemplate]="title">
    <div *ngIf=show>
        <span>some content</span>
    </div>
</div>
```