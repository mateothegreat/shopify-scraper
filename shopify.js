var shopifyDump = require('shopify-dump');
var fs = require("fs");
var request = require('request-json');
var async = require('async');
var argv = require('minimist')(process.argv.slice(2));
var verbose = argv['verbose'] || false;
var jsonSearch = require('json-search');
var converter = require('json-2-csv');

var jsonFormat = require('json-format');

var domain = argv['domain'] || false;
var req = request.createClient('https://' + domain);
var url = '';
var optsMethod = argv['method'] || false;
var optsSaveDir = argv['savedir'] || __dirname;
var optsSearch = argv['search'] || false;
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
    
        fs.writeFileSync(optsSaveDir + '/' + domain + '.products.json', JSON.stringify(masterHash));
        
    }, {
        
        concurrency: 5, // optional: concurrency, defaults to 5
        
        pre: function(type) { //  optional: Pre-download of type (string handle of collection)
        
            // console.log('Downloading Collection: ' + type);
            
        },
        
        post: parseCollection,
        
        flatten: false
        
    });
    
}

function search(terms) {
    
    var javascriptProgrammers = rjsonSearch.find(programmers, 'javascript');
    
    console.log(javascriptProgrammers.length);
    
}

function parseCollection(collection, body) { 
//
// This is called each time a collection is downloaded.
//
    console.log('Parsing Collection: ' + domain + ': ' + collection + ' (Products: ' + body.products.length + ")");

var searchResults = [];

    if(body.products.length > 0) {

        //
        // Loop through each individual product item.
        //
        for(var i = 0; i < body.products.length; i++) {
            
            if(verbose) console.log("\t" + collection + ": " + body.products[i].title);
            
            body.products[i].link = 'https://' + domain + '/products/' +  body.products[i].handle;
             
            if(optsSearch) {
                
                var s = JSON.stringify(body.products[i]);
                
                if(s.search(optsSearch) > 0) {
                    
                    searchResults.push(body.products[i]);

                        console.log("\t" + collection + ": " + body.products[i].title + ' (' + body.products[i].link + ')');
                                        
                }
                
            }
            
        }
        
    // console.log(body);
    
        //
        // Save each product collection to a separate file.
        //
        // fs.writeFileSync(__dirname + domain + '/' + '/products/' + type + '.json', JSON.stringify(body.products));
        
        // var fileName = __dirname + '/' + domain + '/' + '/products/' + collection + '.json';
        var fileName;
        
        var jsonArr = body.products;
        var options = {
                
            delimiter : {
                wrap  : '"', // Double Quote (") character
                field : ',', // Comma field delimiter
                array : ';', // Semicolon array value delimiter
                eol   : '\n' // Newline delimiter
            },
            prependHeader    : true,
            sortHeader       : false,
            trimHeaderValues : true,
            trimFieldValues  :  true,
            keys             : ['id', 'product_type', 'vendor', 'title', 'handle', 'link','published_at', 'created_at','updated_at']
            
        };
        
        if(optsSearch && searchResults.length > 0) {
        
            jsonArr = searchResults;
            fileName = optsSaveDir + '/' + domain + '.' + collection + '.search.' + optsSearch + '.csv';

        } else {
            
            fileName = optsSaveDir + '/' + domain + '.' + collection + '.csv';
            
        }

        var json2csvCallback = function (err, csv) {
            
            if (err) throw err;
            
            fs.writeFile(fileName, csv, function(err){
        
                // if (err) throw err;
            
                if(verbose) console.log('Saved collection to: ' + fileName);
                
            });
            
        };

        converter.json2csv(jsonArr, json2csvCallback, options);

    }
    
}
function err(e) {
    
    console.log(e);
    
}