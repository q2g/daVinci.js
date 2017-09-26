# Shortcut

This angular directive is to make the whole handling of adding keyboard shortcuts
very easy. This directive also has a very sophisticated handling of shortcuts
in shortcuts scopes.


## Attributes

D*  | Name             |  Description
----|------------------|--------------------------------------------
 <  | shortcut         | the shortcut(s)
 <  | shortcutOverride | same like shortcuts but easy possibility to merge / override only some shortcuts / parts
 \<\? | shortcutRootscope| optional; Rootscope for the shortcut
 \&\? | shortcutAction   | optional; action that is called for shortcut
 \<\? | shortcutPreventdefault | optional; cancels the default action that belongs to the element
 \<\? | shortcutTriggerHandler | optional; event which is triggered when shortcut is called

D* for further description see angular directives

### Shortcut element(s)

Type | Name |   Description
-----|------|---------------------------------
string | shortcut | tbd
string | name | tbd
boolean? | preventdefault | optional tbd
string? | action | tbd
string? | rootscope | tbd

### possible Actions

focus
click
...text

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
        shortcut="[{shortcut: 'ctrl + alt + 13'}]"
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
        shortcut-action="vm.shortcutHandler(objectShortcut)">
    Enter
</button>
```

```typescript
shortcutHandler(objcet: IShortcutHandlerObject): void {
        switch(objcet.objectShortcut.name) {
            case "enter":
                console.log("Shortcut ENTER called");
            case "esc":
                console.log("Shortcut ESC called");
        }
    }
```


### scoped Shortcuts

## Example

