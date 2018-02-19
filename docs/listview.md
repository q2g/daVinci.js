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

D* | Name                       |  Description
---|----------------------------|--------------------------------------------
<  | items                      | mandatory; Array of Items that are current visible; this parameter is mendatory
=  | itemsCount                 | mandatory; Total count of possible items to show; this parameter is mendatory
=  | itemsPageTop               | mandatory; Index of the first visible item on the current page; this parameter is mendatory
=  | itemsPageSize              | mandatory; Height of the current page; this parameter is mendatory
&  | callbackListviewObjects    | mandatory; Callback if an Element is clicked; this parameter is mendatory
=? | itemPxHeight               | optional; Height of an item in px; this parameter is optional
=? | itemPxWidth                | optional; Width of an item in px; this parameter is optional
=? | itemFocused                | optional; The index of the; this parameter is optional
<? | showFocused                | optional; Defines if the focused Element is marked with a small boarder.; this parameter is optional
=? | overrrideShortCuts         | optional; possibility to override default shortcuts; this parameter is optional
<? | theme                      | optional; choose the theme; this parameter is optional
<? | horizontalMode             | optional; switch to horizontal mode
<? | splitMode                  | optional; activate split mode

D* for further description see angular directives


## Usage

```html
<q2g-listview items="vm.fieldList.collection"
              items-count="vm.fieldList.itemsCounter"
              items-page-top="vm.fieldList.itemsPagingTop"
              items-page-height="vm.fieldList.itemsPagingHeight"
              item-height="31"
              item-focused="vm.focusedPosition"
              show-focused="vm.showFocused"
              callback-listview-objects="vm.selectObjectCallback(pos)"
              theme="vm.theme">
</q2g-listview>
```