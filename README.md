# daVinci.js

davinci.js is a framework to build visual elments for the qlik sense plattform.

The most important design principal is that you can use the visual element easy
as qlik extension in the qlik sense enterprise, but also to use it in own
angular websites with just Enigma.JS and without the whole qlik.js stack.

The rest design principals:
* accessibility, screenreader ready and keybord usage / shortcuts
* ready for versioning, possibility to run different versions of the plugin or elements
  in one page
* stay close to the qlik ux

The plan is in the end to get even angular 1.x and angular 4+ elements out
of one codebase.

# Getting started

## Prerequisites

Before continuing, make sure that you have these tools installed:

    Node.js >= 4.0
    Git bash
    Visual Studio 2017 with TS

And know of at least some these web technologies:

    TypeScript
    Angular
    Promises

# Docu

[List of (Visual)-Elements](docs/elements.md)

[Architecture](docs/architecture.md)

# Usage

first start with https://github.com/q2g/q2g-ext-selector or any other published extension.

make a git subtree clone into your own extensions (see Docu)

... later we will add a npm packages
