# Davinci Icon

Simple Icon which can be enabled/disabled, activated/deactivated, give some actions and style them with lui styling.

## Usage

import **IconModule** to your module:

```ts
import { IconModule } from "davinci.js";

@NgModule({
    ...
    imports: [
        ...,
        IconModule,
        ...
    ]
    ...
})
export class MyModule { }
```

In template add

```html
<davinci-icon></davinci-icon>
```

## @Input

- **icon** , sets the icon of the component. every end-tag of the leonardo UI icons can be used.

```html
<davinci-icon icon="clock"></davinci-icon>
```

- **buttonType** , sets the button type of the component. every end-tag of the leonardo UI buttons can be used.

```html
<davinci-icon buttonType="success"></davinci-icon>
```

- **isActive** , sets activates or deactivates the button.

```html
<davinci-icon isActive=true></davinci-icon>
```

- **isActive** , insert lable for tooltip and menu

```html
<davinci-icon lable="my button"></davinci-icon>
```



## @Output

- **click** insert a function to be called on click

```html
<davinci-search (click)="myFunktion()"></davinci-search>
```
