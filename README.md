# Monaca Website

This repository contains assets and other public materials that are published on http://monaca.io Website.

## Directory structure

### /dist

Compiled files will be placed into here
_grunt server command don't watch assets directory, so please run "build" manually after you moved any filed in assets folder._

### /src/templates

Assemble templates.

layouts/default.hbs
: Master template

layouts:index.hbs
: Template for index.html

pages/*.hbs
: Template for each HTML files

partials/footer.hbs
: Global footer

partials/header.hbs
: Global header

## Available Grunt tasks

### Build Website

```
grunt build
```

1. Copy assets in /src/assets into /dist.
2. Compile sass files.
3. Concat JS files in /src/js. Created "all.js" is placed to /dist/js.


### Watch and live-reload

```
grunt server
```

_server command don't watch assets directory, so please run "build" manually after you moved any filed in assets folder._

### Deploy to the server

```
grunt deploy
```

Note: Required to create aws_keys.json manually.

## Copyright

Copyright(c) 2014 Monaca team in Asial Corporation. All rights reserved.

## [Assemble](http://assemble.io/)

Assemble is a component and static site generator that makes it dead simple to build modular sites, documentation and components from reusable templates and data.

* Documentation
* Plugins - Plugins extend the core functionality of Assemble.
* Helpers - Documentation for the helpers in the [handlebars-helpers](http://github.com/assemble/handlebars-helpers) library.
