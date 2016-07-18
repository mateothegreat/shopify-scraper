rjson-search
============

A recursive JSON search for words anywhere within the structure.

## Installation

    $ npm install rjson-search

## Example

```javascript
var rjsonSearch = require('rjson-search');

var programmers = [
    {
        "id": 1,
        "name": "jesse",
        "age": 104,
        "programmer": true,
        "experience": "Programs in javascript, objective-c, and ruby",
        "languages": ["javascript"],
        "employmentHistory": [
            {
                "name": "Chromocell"
            },
            {
                "name": "Rutgers"
            },
            {
                "name": "ICC Lowe Thermal"
            },
            {
                "name": "Littlebigberry"
            },
            {
                "name": "Shopbeam"
            },
            {
                "name": "Media Group"
            }
        ],
        "beverage": [
            {
                "name": "coffee",
                "condiments": [
                    {
                        "name": "sugar",
                        "amount": "2tbs"
                    }
                ]
            }
        ]
    },
    {
        "id": 2,
        "name": "matt",
        "age": 105,
        "programmer": true,
        "experience": "Programs in javascript and actionscript",
        "languages": ["javascript"],
        "employmentHistory": [
            {
                "name": "ICC Lowe Thermal"
            },
            {
                "name": "Media Group"
            }
        ]
    },
    {
        "id": 3,
        "name": "stephen",
        "age": 105,
        "programmer": true,
        "experience": "Programs in javascript and objective-c",
        "languages": ["javascript"],
        "employmentHistory": [
            {
                "name": "ICC Lowe Thermal"
            },
            {
                "name": "Canfield"
            }
        ]
    }
];

var jesseObj = programmers[0];

var result = rjsonSearch.objectContainsQuery(jesseObj, 'jesse'); 
assert(result, true);

var javascriptProgrammers = rjsonSearch.find(programmers, 'javascript');
console.log(javascriptProgrammers.length);  // 3
console.log(javascriptProgrammers[0].name); // jesse
console.log(javascriptProgrammers[1].name); // matt
console.log(javascriptProgrammers[2].name); // stephen

var shopbeamEmployees = rjsonSearch.find(programmers, 'Shopbeam');
console.log(javascriptProgrammers.length);  // 1
console.log(shopbeamEmployees[0].name);     // jesse
```