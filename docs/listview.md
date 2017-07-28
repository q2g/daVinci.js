# ListView

This angular directive is from the design very close to the qlik selection element,
but extends this with all accessibility features.
Because of the paging the interface is a little bit more complex, but you will find
a wrapper class in the utils that make binding from engima.JS objects very easyily
to that directive.

## Shortcuts / Keyboard

In the default the element allows the following usage with keyboard.

Shortcut        |  Description
----------------|--------------------------------------------
up              | focus element above, if outside visible range move page
down            | focus element below, if outside visible range move page
page-up         | move visible page to page above
page-down       | move visible page to page below
space           | equivalent to left mouseclick on element
space + ctrl    | equivalent to left mouseclick + ctrl on element


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
