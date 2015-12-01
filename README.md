# Monaca Website

This repository contains assets and other public materials that are published on http://monaca.io Website.

## Settting Up

```
$ git clone https://github.com/monaca/website.git
$ cd website
$ npm install
$ npm install -g grunt-cli
```

## Directory structure

### /dist

Compiled files will be placed into here.

_grunt server command don't watch assets directory, so please run "build" manually after you moved any filed in assets folder._

### /src/templates

Assemble templates.

- `layouts/default.hbs`
   : Master template

- `layouts:index.hbs`
   : Template for index.html

- `pages/*.hbs`
   : Template for each HTML files

- `partials/footer.hbs`
   : Global footer

- `partials/header.hbs`
   : Global header

### /docs

- `docs/styleguide`
   : Style guide

## Available Grunt tasks

### Build Website

```
grunt build
```

1. Copy assets in `/src/assets` into `/dist`.
2. Compile sass files.
3. Concatenate JS files in `/src/js`. Generated `all.js` will be placed in `/dist/js`.


### Watch and live-reload

To launch both English and Japanese Website in the local environment: 

```
grunt server
```

or type like this for each languages:

```
grunt server:ja
grunt server:en
```

_server command don't watch assets directory. Please run `build` manually after you moved any filed in assets folder._

## About [Assemble](http://assemble.io/)

Assemble is a component and static site generator that makes it dead simple to build modular sites, documentation and components from reusable templates and data.

* [Documentation](http://assemble.io/docs/)
* [Plugins](http://assemble.io/plugins/) - Plugins extend the core functionality of Assemble.

### Handlebars Template System

Templates are compiled by [Handlebars](http://handlebarsjs.com/).

- Handlebar Built-in Helpers: [Built-In Helpers](http://handlebarsjs.com/builtin_helpers.html)
- Additional Helpers: [handlebars-helpers](http://github.com/assemble/handlebars-helpers)

## i18n

### Separate Templates

Place "hoge.en.hbs" or "hoge.ja.hbs" and "hoge.html" will be created.
While \*.{en|ja}.hbs have higher priority than \*.hbs, if you place both hoge.hbs and hoge.en.hbs, hoge.en.hbs will be used.

### Use Same Template

We can use shortcode in hbs files:
 
```html
<html>
    <body>
        <p>{{i18n "hoge"}}</p>
    </body>
</html>
```

```html
{{#is language "ja"}}
    <p>簡単な分岐はできます</p>
{{else}}
    <p>like this</p>
{{/is}}
```

```html
{{i18n "key"}} <- HTML will be escaped
{{{i18n "key"}}} <- Call with triple brackets will prevent escaping
```

Translation files
: /src/data/i18n/*.json

### Get current language

```html
<img src="/img/ninja_{{language}}.jpg" />
will be
<img src="/img/ninja_en.jpg" />
or
<img src="/img/ninja_ja.jpg" />
```

## CSS selector to be applied to only Japanese/English pages

```css
html[lang=en] body.localkit {
    h1 {
        color: gold;
    }
}

html[lang=ja] body.localkit {
    h1 {
        color: dimgray;
        margin-bottom: 20px;
    }
}
```

## Using jQuery

As jQuery is loaded in the bottom of pages, we can't use $(function(){}) before it. Use addEventListener instead:

```javascript
window.addEventListener("load", function() {
    $(".slick").slick();
});
```

## Deployment

Deployment to the staging server is automatically made by pushing to `master` branch. Similarly, deployment to to the production server is automatically done by pushing to `production` branch.

Staging server URL: http://s.ja.monaca.io/ and http://s.monaca.io/.

## Bower Components

* Twitter Bootstrap
* jQuery
* CodeMirror

These components are copied to appropriate directories by "grunt copy".

## Copyright

Copyright(c) 2014 Monaca team in Asial Corporation. All rights reserved.
