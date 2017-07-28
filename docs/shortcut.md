# Shortcut

This angular directive is to make the whole handling of adding keyboard shortcuts
very easy. This directive also has a very sophisticated handling of shortcuts
in shortcuts scopes.

## Shortcut Scope

TBD

## Attributes

D* | Name            |  Description
---|-----------------|--------------------------------------------
<  | items           | Array of Items that are current visible 
=  | itemsCount      | Total count of possible items to show
=  | itemsPageTop    | Index of the first visible item on the current page
<  | itemsPageHeight | Height of the current page
=  | itemHeight      | Height an item in px
=  | itemFocused     | The index of the 
<  | showFocused     | Defines if the focused Element is marked with a small boarder.
&  | callbackListviewObjects | Callback if an Element is clicked
=  | overrrideShortCuts | possibility to override default shortcuts

D* for further description see angular directives
