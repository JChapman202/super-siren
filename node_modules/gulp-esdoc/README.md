# gulp-esdoc
Gulp plugin for [ESDoc](https://esdoc.org/)

[![NPM](https://nodei.co/npm/gulp-esdoc.png)](https://npmjs.org/package/gulp-esdoc)

[![Circle CI](https://circleci.com/gh/nanopx/gulp-esdoc.svg?style=shield&circle-token=bed625bfea8a6be44a43f8455b2db0b51b5984a1)](https://circleci.com/gh/nanopx/gulp-esdoc)

## Installation

```
npm install gulp-esdoc --save-dev
```

## Usage

```JavaScript
var esdoc = require("gulp-esdoc");

// document "./src" folder and output at "./docs" folder
gulp.src("./src")
  .pipe(esdoc({ destination: "./docs" });
```

## API

### esdoc(options)

`options.destination` is **required**.
See [here](https://esdoc.org/config.html) for more options.

# Tests

Run:

```
npm test
```

## License
MIT
