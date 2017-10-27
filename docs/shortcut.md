# Shortcut

This angular directive is to make the whole handling of adding keyboard shortcuts
very easy. This directive also has a very sophisticated handling of shortcuts
in shortcuts scopes.


## Attributes

D*  | Name             |  Description
----|------------------|--------------------------------------------
 <  | shortcut         | mandatory; the shortcut(s)
 <  | shortcutOverride | mandatory; same like shortcuts but easy possibility to merge / override only some shortcuts / parts
 \<\? | shortcutRootscope| optional; Rootscope for the shortcut; use "\|global\|" to registrate on document 
 \&\? | shortcutAction   | optional; action that is called for shortcut
 \<\? | shortcutPreventdefault | optional; cancels the default action that belongs to the element
 \<\? | shortcutTriggerHandler | optional; event which is triggered when shortcut is called

D* for further description see angular directives

### Shortcut element(s)

Type | Name |   Description
-----|------|---------------------------------
string | shortcut | mandatory; the shortcut
string | name | mandatory; name of the shortcut, to be identified in the in the handler function outside of the directive
boolean? | preventdefault | optional; cancels the default action that belongs to the element
string? | action | optional; action that is called for shortcut
string? | rootscope | optional; Rootscope for the shortcut; use "\|global\|" to registrate on document
string? | triggerHandler | optional; event which is triggered when shortcut is called

### possible Actions

focus; click; ...text

## Usage

### single Shortcut on Element
A singele shortcut on one element can be written in two ways, first way is, to only use the separate properties of the directive, second way is to insert the required informations to the shortcut Attribute in an object.

#### Use the separate properties of the directive:
```html
<button type="button"
        q2g-shortcut
        shortcut="'ctrl + alt + 13'"
        shortcut-action="vm.callButton()">
    Enter
</button>
```

#### Use the object syntax
```html
<button type="button"
        q2g-shortcut
        shortcut="[{name: 'enter'; shortcut: 'ctrl + alt + 13'}]"
        shortcut-action="vm.callButton()">
    Enter
</button>
```

### multiple Shortcuts on element
to implement more than one shortcut on an element you can insert an Array in the shortcut property. Each Element of the Array should have a name attribute. the function in the shortcut-action property can get an inputparameter which contains the called shortcut name.

```html
<button type="button"
        q2g-shortcut
        shortcut="[
            {name: 'enter'; shortcut: 'ctrl + alt + 13'},
            {name: 'esc'; shortcut: 'ctrl + alt + 27'}
        ]"
        shortcut-action="vm.shortcutHandler(shortcutObject)">
    Enter
</button>
```

```typescript
shortcutHandler(objcet: IShortcutHandlerObject): void {
    switch(objcet.shortcutObject.name) {
        case "enter":
            console.log("Shortcut ENTER called");
        case "esc":
            console.log("Shortcut ESC called");
    }
}
```

### using "triggerHandler" attribute
With the "triggerHandler" attribute you can trigger standard events on elements. In the example you can see, how to trigger the click event on an element

```html
<button type="button"
        ng-click="vm.showMessage()"
        q2g-shortcut
        shortcut="[{name: 'enter'; shortcut: 'ctrl + alt + 13', triggerHandler:'click'}]">
    Enter
</button>
```

```typescript
showMessage(): void {
    console.log("Shortcut ENTER called");
}
```

### scoped Shortcuts
It is possible to use scoped shortcuts. This means that you can define, if the shortcut is triggered global (it is not important, where the focus is on the document), or local (the focus needs to be below a defined element). To define a scoped Shortcut you have to insert the attribute "q2g-shortcut-scope" to a element which is heiger in the doom.

The following example shows how to define a local shortcut. When the focus is on the input field in the div with the class "section-1", both shortcuts can be triggered. When the focus is on the input field in the div with the class "section-2" only the shortcut with the name "enter2" will bi triggered.

```html
<body>
    <div class="section-1"
         q2g-shortcut-scope>
        <input type="text"></input>
        <button type="button"
                ng-click="vm.showMessageLocal()"
                q2g-shortcut
                shortcut="[{name: 'enter1'; shortcut: 'ctrl + alt + 13', triggerHandler:'click'}]">
            Enter
        </button>
    </div>
    
    <div class="section-2">
        <input type="text"></input>
        <button type="button"
                ng-click="vm.showMessageGlobal()"
                q2g-shortcut
                shortcut="[{name: 'enter2'; shortcut: 'ctrl + alt + 83', triggerHandler:'click', rootscope: '|global|'}]">
            Enter
        </button>
    </div>
</body>
```

```typescript
showMessageLocal(): void {
    console.log("Shortcut ENTER called for LOCAL shortcut");
}

showMessageGlobal(): void {
    console.log("Shortcut ENTER called for GLOBAL shortcut");
}
```

The next example shows how to namespace shortcuts. This means that it`s possible to nest scopes.

```html
<body>
    <div q2g-shortcut-scope>
        <input type="text"></input>

        <div q2g-shortcut-scope="section1">
            <input type="text"></input>

            <div q2g-shortcut-scope="section2">
                <input type="text"></input>

                <button type="button"
                        ng-click="vm.showMessageGlobal()"
                        q2g-shortcut
                        shortcut="[
                            {name: 'enter1'; shortcut: 'ctrl + alt + 83'},
                            {name: 'enter2'; shortcut: 'ctrl + alt + 84', rootscope: 'section1'},
                            {name: 'enter3'; shortcut: 'ctrl + alt + 85', rootscope: 'section2'}
                        ]"
                        shortcut-action="vm.shortcutHandler(shortcutObject)">
                    Enter
                </button>
            </div>
        </div>
    </div>
</body>
```

```typescript
shortcutHandler(objcet: IShortcutHandlerObject): void {
    switch(objcet.shortcutObject.name) {
        case "enter1":
            console.log("Shortcut for local called");
        case "enter2":
            console.log("Shortcut for section1 called");
        case "enter3":
            console.log("Shortcut for section2 called");
    }
}
```
