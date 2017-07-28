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
 < | menuList        | the elements for the menu
 < | maxNumberOfElements    | max Number of Menu items that are shown in the header even if is enough space for more
 < | reservedButtonWidth    | tbd 
 & | callbackMainMenuButton | callback for the Menu
 = | textSearch      | search text from the inner searchbar
 = | showButtons     | if the Menubuttons are visible
 = | showSearchField | if the searchfield is visible
 < | title           | the inner title
 < | shortcutSearchfield | the shortcut for the searchfield

D* for further description see angular directives
