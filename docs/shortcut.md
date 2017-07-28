# Shortcut

This angular directive is to make the whole handling of adding keyboard shortcuts
very easy. This directive also has a very sophisticated handling of shortcuts
in shortcuts scopes.

## Shortcut Scope

TBD

## Attributes

D*  | Name             |  Description
----|------------------|--------------------------------------------
 <  | shortcut         | the shortcut(s)
 <  | shortcutOverride | same like shortcuts but easy possibility to merge / override only some shortcuts / parts
 \<\? | shortcutRootscope| optional Rootscope for the shortcut
 \&\? | shortcutAction   | action that is called for shortcut
 \<\? | shortcutPreventdefault | TBD

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
onClick
...text

## Example

