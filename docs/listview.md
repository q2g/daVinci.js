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
<  | items                      | Array of Items that are current visible; this parameter is mendatory
=  | itemsCount                 | Total count of possible items to show; this parameter is mendatory
=  | itemsPageTop               | Index of the first visible item on the current page; this parameter is mendatory
=  | itemsPageHeight            | Height of the current page; this parameter is mendatory
=? | itemHeight                 | Height of an item in px; this parameter is optional
=? | itemWidth                  | Width of an item in px; this parameter is optional
=  | itemFocused                | The index of the; this parameter is mendatory
<? | showFocused                | Defines if the focused Element is marked with a small boarder.; this parameter is optional
&  | callbackListviewObjects    | Callback if an Element is clicked; this parameter is mendatory
=? | overrrideShortCuts         | possibility to override default shortcuts; this parameter is optional
<? | theme                      | choose the theme; this parameter is optional

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