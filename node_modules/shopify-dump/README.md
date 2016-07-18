

### Usage

`$ node pull --host kickpleat.com --output /tmp/kickpleat.json [--flatten]`

or, programmatically,

```
var shopifyDump = require('shopify-dump');
shopifyDump('kickpleat.com', function(err, masterHash) { // callback to execute with hash of products
	console.log('All categories scraped!');
	fs.writeFileSync(__dirname + '/products.json', JSON.stringify(masterHash));
	console.log('Wrote to disk.');
}, {
	concurrency: 5, // optional: concurrency, defaults to 5
	pre: function(type) { //  optional: Pre-download of type (string handle of collection)
		console.log('Downloading: ' + type);
	},
	post: function(type) { //  optional: Post-download of type (string handle of collection)
		console.log('Finished: ' + type);
	},
	flatten: true
});
```
