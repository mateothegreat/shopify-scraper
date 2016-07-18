var shopifyDump = require('shopify-dump');
var fs = require("fs");
var request = require('request-json');
var async = require('async');
var argv = require('minimist')(process.argv.slice(2));
var verbose = argv['verbose'] || false;

var jsonFormat = require('json-format');

var domain = argv['domain'] || false;
var req = request.createClient('https://' + domain);
var url = '';
var optsCollection = argv['collection'] || false;
var curCollection;

url = '/collections/' + argv['collection'];

if(optsCollection) {

    if(optsCollection.constructor === Array) {

        for(var i = 0; i < optsCollection.length; i++) {

            curCollection = optsCollection[i];
            
            req.get('/collections/' + curCollection + '/products.json?limit=10000', function(err, res, body) {
                        console.log(curCollection);

                parseCollection(curCollection, body);
            
            });
                
        }
        
    } else {
    
        curCollection = optsCollection;
        
        req.get(url + '/products.json?limit=10000', function(err, res, body) {
        
            parseCollection(optsCollection, body);
        
        });
        
    }
    
} else {
    
    shopifyDump(domain, function(err, masterHash) { // callback to execute with hash of products
    
        fs.writeFileSync(__dirname + '/products.json', JSON.stringify(masterHash));
        
    }, {
        
        concurrency: 5, // optional: concurrency, defaults to 5
        
        pre: function(type) { //  optional: Pre-download of type (string handle of collection)
        
            // console.log('Downloading Collection: ' + type);
            
        },
        
        post: parseCollection,
        
        flatten: false
        
    });
    
}


function parseCollection(collection, body) { 
//
// This is called each time a collection is downloaded.
//
    console.log('Parsing Collection: ' + domain + ': ' + collection + ' (Products: ' + body.products.length + ")");

    if(body.products.length > 0) {

        //
        // Loop through each individual product item.
        //
        for(var i = 0; i < body.products.length; i++) {
            
            if(verbose) console.log("\t" + collection + ": " + body.products[i].title);
            
        }
        
        //
        // Save each product collection to a separate file.
        //
        // fs.writeFileSync(__dirname + domain + '/' + '/products/' + type + '.json', JSON.stringify(body.products));
        
        // var fileName = __dirname + '/' + domain + '/' + '/products/' + collection + '.json';
        var fileName = __dirname + '/' + domain + '.' + collection + '.json';
        
        fs.writeFile(fileName, jsonFormat(body.products), function(err){
        
            // if (err) throw err;
        
            if(verbose) console.log('Saved collection to: ' + fileName);
            
        });
            
    }
    
}
function err(e) {
    
    console.log(e);
    
}