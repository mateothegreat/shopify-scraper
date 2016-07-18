
var fs = require('fs');
var path = require('path');

var args = require('nano-argv')({
	host: 'localhost',
	concurrency: 5,
	flatten: false
});

var pull = require('./');
var host = args.host;
var outputFile = args.output
		? path.resolve(args.output)
		: (process.cwd() + '/products.json');

pull(args.host, function(err, masterHash) {
	console.log('All categories scraped!');
	fs.writeFileSync(outputFile, JSON.stringify(masterHash, null, 2));
	console.log('Wrote to disk.');
}, {
	concurrency: args.concurrency || 5,
	pre: function(type) {
		console.log('Downloading: ' + type);
	},
	post: function(type) {
		console.log('Finished: ' + type);
	},
	flatten: args.flatten
});
