This is a **boilerplate for developing UI components** by **StormId**, used in production in conjunction with our project scaffold.

It includes an opinionated JS component boilerplate, build system, test integration, example, README (see below), and deployment, using nodeJS, npm, gulp, mocha, shouldjs, instanbul, babel, travis ci, and codecov.

Before use make sure to grep for “storm-component-boilerplate” and replace every occurrence as well as updating your tests, readme and example.


---


# Component Name

[![Build Status](https://travis-ci.org/mjbp/storm-component-boilerplate.svg?branch=master)](https://travis-ci.org/mjbp/storm-component-boilerplate)
[![codecov.io](http://codecov.io/github/mjbp/storm-component-boilerplate/coverage.svg?branch=master)](http://codecov.io/github/mjbp/storm-component-boilerplate?branch=master)
[![npm version](https://badge.fury.io/js/storm-component-boilerplate.svg)](https://badge.fury.io/js/storm-component-boilerplate)

One line summary

## Example
[https://mjbp.github.io/storm-component-boilerplate](https://mjbp.github.io/storm-component-boilerplate)


## Usage
HTML
```
<div class="js-boilerplate"></div>
```

JS
```
npm i -S storm-component-boilerplate
```
either using es6 import
```
import Boilerplate from 'storm-component-boilerplate';

Boilerplate.init('.js-boilerplate');
```
asynchronous browser loading (use the .standalone version in the /dist folder) using the global name (Storm + capitalised package name)
```
import Load from 'storm-load';

Load('{{path}}/storm-component-boilerplate.standalone.js')
    .then(() => {
        StormComponentBoilerplate.init('.js-boilerplate');
    });
```

## Options
```
{
    callback: null
}
```

e.g.
```
Boilerplate.init('.js-selector', {
    callback(){
        console.log(this);
    }
});
```

## Tests
```
npm run test
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends upon Object.assign, element.classList, and Promises so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT