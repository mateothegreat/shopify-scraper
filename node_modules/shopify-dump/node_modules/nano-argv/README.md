

# nano-argv


A small module to do simple argument parsing.

This package on:
- [GitHub](https://github.com/andrew-templeton/nano-argv)
- [NPM](https://github.com/package/nano-argv)


### Usage

When you do this on the command line...:

```
$ node myscript.js --arg1 value1 --bool1 --arg2 value2 --BOOL2
```

Then you can do this in `myscript.js`...:

```
var args = require('nano-argv');
var CLI_ARGS = args({
	arg2: 'willBeOverridden',
	arg3: 'aDefaultValue',
	bool3: true
});

console.log(CLI_ARGS);

/*
Will log:
{
	arg1: 'value1',
	arg2: 'value2',
	arg3: 'aDefaultValue',
	bool1: true,
	bool2: true,
	bool3: true
}
*/
```

That is...:

 - All `--key`s on the CLI will be lowercased when output in the arguments hash by the module.
 - Any pairing `--key value` will set the value of key `key` to value `value` in the hash returned from the function
 - Any `--key1 --key2 value` sequence, that is, where `--key1` has another `--key2` flag immediately to the right, will make `--key1` a boolean argument flag set to `true`
 - Any `--lastkey` with no value to the right, and no other key (it is the last piece of the command) will also be treated as a boolean argument with the flag set to `true`
 - If you pass an object into the function in the JS, those will be used as the `defaults` for the output object of the function.
 - If you do not pass anything, `defaults` is simply set to `{}` and no keys will have defaults.
 - The `defaults` argument you use in the JS can only handle plain JSON objects, that is, no function values will work, `prototype` keys will not be inherited, and so on and so forth.


## License: MIT

## Author
Andrew Templeton

- [Twitter](https://twitter.com/ayetempleton)
- [GitHub](https://github.com/andrew-templeton)
- [NPM](https://npmjs.com/~andrew-templeton)




