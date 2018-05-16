# Extension Header

This angular directive is from the design very close to the qlik header of an extension
with search / accept / cancel icon, ...
For intention we differ in some parts from the qlik design.

## Shortcuts / Keyboard

In the default the element allows the following usage with keyboard.

Shortcut        |  Description
----------------|--------------------------------------------
TBD             | 

## Attributes

D* | Name            |  Description
---|-----------------|--------------------------------------------
 < | maxNumberOfElements    | mandatory; max Number of Menu items that are shown in the header even if is enough space for more
 < | reservedButtonWidth    | mandatory; how many space should be reserved for the buttons (between 0 and 1)
 < | title           | mandatory; the inner title
 < | theme           | optional; theme of the header
 & | inputAccept    | optional; function to be called when accept header input
 & | inputCancel    | optional; function to be called when cancel header input
 = | inputField     | optional; search text from the inner searchbar
 = | inputBarLogo   | optional; lui logo of the search logo
 = | inputBarPlaceholder    | optional; placeholer for the input bar
 = | inputBarVisible    | optional; shows the input bar
 = | inputBarFocus  | optional; set input bar focus
 = | menuVisible | optional; sets visibility of header menue
 & | menuCallback | optional; callback for the Menu
 < | menuList | optional; list of the menu elements
 < | shortcutSearchfield | optional; the shortcut for the searchfield
 < | isLocked | optional; locks the header for more input

D* for further description see angular directives

## Usage

```html
<q2g-extension-header 
    max-number-of-elements="4"
    reserved-button-width="0.5"
    title="vm.titleDimension"
    theme="vm.theme"

    input-accept="vm.inputAcceptDimensions"
    input-cancel="vm.inputCancelDimensions"
    input-field="vm.textSearchDimension"
    input-bar-visible="vm.showSearchFieldDimension"

    menu-visible="vm.showButtonsDimension"
    menu-callback="vm.menuListActionCallback(item)"
    menu-list="vm.menuListDimension"
    
    shortcut-searchfield="'strg + alt + 83'">
</q2g-extension-header>
```