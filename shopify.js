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
var optsByVariant = argv['byvariant'] || false;
var optsSave = argv['save'] || false;
var optsSaveDir = argv['savedir'] || __dirname;
var optsSearch = argv['search'] || false;
var optsCollection = argv['collection'] || false;
var optsSaveAll = optsSearch;

var curCollection;

url = '/collections/' + argv['collection'];

if(optsCollection) {

    if(optsCollection.constructor === Array) {

        for(var i = 0; i < optsCollection.length; i++) {

            curCollection = optsCollection[i];
            
            req.get('/collections/' + curCollection + '/products.json?limit=10000', function(err, res, body) {

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
    
        // fs.writeFileSync(optsSaveDir + '/' + domain + '.products.json', JSON.stringify(masterHash));
        
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
    if(optsSave) console.log('Parsing Collection: ' + domain + ': ' + collection + ' (Products: ' + body.products.length + ")");

    var searchResults = [];

    if(body.products.length > 0) {

        //
        // Loop through each individual product item.
        //
        for(var i = 0; i < body.products.length; i++) {
            
            body.products[i].link = 'https://' + domain + '/products/' +  body.products[i].handle;
             
            if(optsSearch) {
                
                var s = JSON.stringify(body.products[i]);
                
                if(s.search(optsSearch) > 0) {
                    
                    searchResults.push(body.products[i]);

                    // console.log("\t" + collection + ": " + body.products[i].title + ' (' + body.products[i].link + ')');
                                        
                }
                
            }
            
        }
        
        // fs.writeFileSync(__dirname + domain + '/' + '/products/' + type + '.json', JSON.stringify(body.products));
        
        var fileName;
        var isSaveable = false;
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
            trimFieldValues  : true,
            
            keys             : []
            
        };
        
        if(optsSearch) {
        
            if(searchResults.length > 0) {
                
                jsonArr = searchResults;
                fileName = optsSaveDir + '/' + domain + '.' + collection + '.search.' + optsSearch + '.csv';
                
                if(optsSave) {
                    
                    isSaveable = true;
                    
                }
                
            } else {
                
                console.log("No results found for '" + optsSearch + "'.");
                
                isSaveable = false;

            }

        } else if(!optsSearch) {
            
            fileName = optsSaveDir + '/' + domain + '.' + collection + '.csv';
            
            if(optsSave) {
                
                isSaveable = true;
                
            }
            
        }
        
        if(optsByVariant) {
            
            var build = [];
            if(jsonArr.length > 0 && (optsSearch && searchResults.length > 0)) {
                
                for(var i = 0; i < jsonArr.length; i++) {
                
                    for(var j = 0; j < jsonArr[i].variants.length; j++) {
                        
                        var newRow = {
                            
                            id: jsonArr[i].id,
                            domain: jsonArr[i].domain,
                            collection: jsonArr[i].collection,
                            product_type:  jsonArr[i].product_type,
                            vendor:  jsonArr[i].vendor,
                            title:  jsonArr[i].title,
                            handle:  jsonArr[i].handle,
                            
                            variant_id: jsonArr[i].variants[j].id,
                            variant_title: jsonArr[i].variants[j].title,
                            variant_available: jsonArr[i].variants[j].available,
                            variant_price: jsonArr[i].variants[j].price,
                            
                            link:  jsonArr[i].link,
                            published_at:  jsonArr[i].published_at,
                            created_at:  jsonArr[i].created_at,
                            updated_at:  jsonArr[i].updated_at
                            
                        }
                        
                        if(newRow.variant_available) {
                        
                            console.log('[' + domain + ' "' + collection + '"] ' + newRow.title + ' = ' + newRow.variant_title + ": $" + newRow.variant_price + ' (Available? ' + newRow.variant_available + ') ' + newRow.link);
                            
                        }

                        build.push(newRow);
                        // console.log(newRow);
                        
                    }
                    
                    
                }
                
            
            }
            
            jsonArr = build;
            
            options.keys = ['id', 'product_type', 'vendor', 'title', 'variant_id', 'variant_title', 'variant_available', 'variant_price', 'handle', 'link','published_at', 'created_at','updated_at'];
            
        } else {
            
            options.keys = ['id', 'product_type', 'vendor', 'title', 'handle', 'link','published_at', 'created_at','updated_at'];
        
        }
        

// console.log(jsonArr);
        
        

        var json2csvCallback = function (err, csv) {
            
            if (err) throw err;
            
            fs.writeFile(fileName, csv, function(err){
        
                // if (err) throw err;
                if(verbose) console.log('Saved collection to: ' + fileName);
                
            });
            
        };

        if(isSaveable) {
            
            if(jsonArr.length > 0) {
            
                converter.json2csv(jsonArr, json2csvCallback, options);
            
            }
            
        }

    }
    
}

function err(e) {
    
    console.log(e);
    
}