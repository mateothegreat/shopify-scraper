# A Document Path Library for Node

[![Build Status](https://travis-ci.org/mrodrig/doc-path.svg?branch=master)](https://travis-ci.org/mrodrig/doc-path)
![David - Dependency Checker Icon](https://david-dm.org/mrodrig/doc-path.png "doc-path Dependency Status")
[![Monthly Downloads](http://img.shields.io/npm/dm/doc-path.svg)](https://www.npmjs.org/package/doc-path)
[![NPM version](https://img.shields.io/npm/v/doc-path.svg)](https://www.npmjs.org/package/doc-path)
[![bitHound Score](https://www.bithound.io/github/mrodrig/doc-path/badges/score.svg)](https://www.bithound.io/github/mrodrig/doc-path)

This module will take paths in documents which can include nested paths specified by '.'s and can evaluate the path
to a value, or can set the value at that path depending on the function called.

## Installation

```bash
$ npm install doc-path
```

## Usage

```javascript
var path = require('doc-path');
```

### API

#### path.evaluatePath(document, key)

* `document` - `Object` - A JSON document that will be iterated over.
* `key` - `String` - A path to the existing key whose value will be returned.

If the key does not exist, `null` is returned.

##### path.evaluatePath Example:

```javascript
var path = require('doc-path');

var document = {
    Make: 'Nissan',
    Model: 'Murano',
    Year: '2013',
    Specifications: {
        Mileage: '7106',
        Trim: 'S AWD'
    }
};

console.log(path.evaluatePath(document, 'Make'));
// => 'Nissan'

console.log(path.evaluatePath(document, 'Specifications.Mileage'));
// => '7106'
```

#### path.setPath(document, key, value)

* `document` - `Object` - A JSON document that will be iterated over.
* `key` - `String` - A path to the existing key whose value will be set.
* `value` - `*` - The value that will be set at the given key.

If the key does not exist, then the object will be built up to have that path.
If no document is provided, an error will be thrown.

#### path.setPath Example:

 ```javascript
 var path = require('doc-path');

 var document = {
     Make: 'Nissan'
 };

 console.log(path.setPath(document, 'Color.Interior', 'Tan'));
 // => { Make: 'Nissan', Color: { Interior: 'Tan' } }

 console.log(path.setPath(document, 'StockNumber', '34567'));
 // => { Make: 'Nissan', Color: { Interior: 'Tan' }, StockNumber: '34567' }
 ```

## Tests

```bash
$ npm test
```

_Note_: This requires `mocha`, `should`, `async`, and `underscore`.

To see test coverage, please run:
```bash
$ npm run coverage
```

Current Coverage is:
```
Statements   : 100% ( 22/22 )
Branches     : 90% ( 9/10 )
Functions    : 100% ( 2/2 )
Lines        : 100% ( 19/19 )
```

## Features

- Supports nested paths
- Same common path specification as other programs such as MongoDB