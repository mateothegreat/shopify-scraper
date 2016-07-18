
// see http://stackoverflow.com/questions/10679580/javascript-search-inside-a-json-object/29308856#29308856
// see http://jsperf.com/regex-on-large-strings
// see http://jsperf.com/json-search

// description
/*
First, stringify the JSON object. Then, you need to store the starts and lengths of the matched substrings. For example:
	"matched".search("ch") // yields 3

For a JSON string, this works exactly the same (unless you are searching explicitly for commas and curly brackets in which case I'd recommend some prior transform of your JSON object before performing regex (i.e. think :, {, }).

Next, you need to reconstruct the JSON object. The algorithm I authored does this by detecting JSON syntax by recursively going backwards from the match index. For instance, the pseudo code might look as follows:

	find the next key preceding the match index, call this theKey
	then find the number of all occurrences of this key preceding theKey, call this theNumber
	using the number of occurrences of all keys with same name as theKey up to position of theKey, traverse the object until keys named theKey has been discovered theNumber times
	return this object called parentChain

With this information, it is possible to use regex to filter a JSON object to return the key, the value, and the parent object chain.

You can see the library and code I authored at http://json.spiritway.co/
*/
JSON.search=function(o,str){
	if ( str.length < 2 || str == "." || str == ".+" )
		return [{"key":"","val":"","chain":o,"inKey":false}];
	performIndexSearch	= function(ostr,str) {
		if ( typeof str == "string" ) {
			str	= str.toLowerCase();
			idx	= ostr.toLowerCase().search(str)
		}
		else
			idx	= ostr.search(str);
		if ( idx == -1 )
			return [];
		ocpy	= ostr;
		_starts	= [idx];
		while ( idx != -1 ) {
			ocpy = ocpy.substr(idx+1);
			idx = ocpy.search(str);
			if ( idx == -1 )
				break;
			_starts.push(_starts[_starts.length-1]+idx+1);
		}

		return _starts;
	}

	oobj	= o;
	keys	= Object.keys(o);
	numKeys	= Object.keys(o).length;
	numDivisions	= 4;
	keysPerDivision	= numKeys/numDivisions;
	strings	= [];
	for ( var i = 0; i < numDivisions; i++ ){
		obj	= {};
		for ( var j = i*keysPerDivision; j < numKeys; j++ )
			obj[keys[j]]	= o[keys[j]]
		strings.push(JSON.stringify(obj));
	}
	o = JSON.stringify(o);
	segmentSize	 = o.length;
	numSegments	= (o.length/segmentSize);
	starts	= [];
	for ( var i = 0; i < numSegments; i++ ){ 
		starts	= starts.concat(performIndexSearch(o.substr(starts+i*segmentSize,segmentSize),str));
	}
	
	keys = [];
	backtrack	= function(str,start,ignore){
		if ( ignore == undefined )
			ignore = false;
		strsub	= str.substr(0,start);
		rquote		= str.substr(start).search(/([0-9]|\{|\[|")\:?/);
		quote	= strsub.split("").reverse().join("").search(/"[^\\]?/);
		if ( !ignore && str.substr(start).substr(rquote+1,1) == ":" ) {
			return [str.substr(start-quote,quote+rquote),str.substr(0,start+rquote+1).match(new RegExp('\"'+str.substr(start-quote,quote+rquote)+'\"',"g")).length-1];
		}
		strsub	= strsub.split("").reverse().join("")
		end		= strsub.search(/([0-9]|\{|\[|")\:"/);
		if ( end == -1 )
			return -1;
		strsubsub	= strsub.substr(end+3);
		newstart	= strsubsub.search(/"[^\\]?/);
		key		= strsub.substr(end+3,newstart);
		key		= key.split("").reverse().join("");
		num		= str.substr(0,start-end).match(new RegExp('\"'+key+'\"',"g"));
		if ( num == null )
			num = 0;
		else
			num	= num.length-1;
		return [key,num,start-end-newstart,start-end];
	}
	keysearch	= function(root,key,idx,matches){
		return (function(results,count,matches,idx){
			if ( matches == undefined )
				matches	= [0,false];
			results = {};
			count = 0;
			val	  = "";
			for ( var i in root ){
				if ( i == key && matches[0] == idx ) {
					obj	= {};
					obj[key]	= root[i];
					return [obj,[1,true],obj[key]];
				}
				if ( i == key )
					matches[0]++;
				if (typeof root[i] != "object" || root[i] == null )
					continue;
				count++;
				result = (function(){return keysearch(root[i],key,idx,matches);})();
				matches[0]  = result[1][0];
				matches[1]	= result[1][1];
				found	= matches[1];
				if ( found && result.length > 2 )
					val	= result[2];
				result	= result[0];
				if ( found ) {
					results[i]	= result;
					break;
				}
			}
			if ( count == 0 )
				return [[],matches,val];
			else
				return [results,matches,val];
		})({},0,matches,idx);
	} 
	//https://jsfiddle.net/dfpL4ayL/3/
	function smartJSONextend(obj1, obj2) {
	    //clone
	    var mergedObj = JSON.parse(JSON.stringify(obj1));

	    (function recurse(currMergedObj, currObj2){
	        var key;

	        for (key in currObj2) {
	            if (currObj2.hasOwnProperty( key )){

	                //keep path alive in mergedObj
	                if (!currMergedObj[key]){
	                    currMergedObj[key] = undefined;
	                }

	                if ( typeof currObj2[key] === "string" || typeof currObj2[key] === "number" || typeof currObj2[key] === "boolean" ){
	                //overwrite if obj2 is leaf and not nested
	                    currMergedObj[key] = currObj2[key];
	                } else if (typeof currObj2[key] === "object"){
	                //obj2 is nested

	                    //and currMergedObj[key] is undefined, sync types
	                    if (!currMergedObj[key]) {
	                        //obj2[key] ifArray
	                        if(currObj2.hasOwnProperty(key) && Array.isArray(currObj2[key]) && currObj2[key].hasOwnProperty("length") && currObj2[key].length !== undefined){
	                            currMergedObj[key] = [];
	                        } else {
	                            currMergedObj[key] = {};
	                        }
	                    }
	                    recurse(currMergedObj[key], currObj2[key]);
	                }
	            }
	        }
	    }(mergedObj, obj2));

	    return mergedObj;
	}
	for ( var i in starts ) {
		key	= backtrack(o,starts[i]);
		parents	= keysearch(oobj,key[0],key[1]);
		if ( key[0].search(str) != -1 )
			inKey	= true;
		else
			inKey	= false;
		obj	= {"key":key[0],"val":parents[2],"chain":parents[0],"inKey": inKey};
		keys.push(obj);
	}

	merged	= {};
	for ( var i in keys )
		merged	= smartJSONextend(merged,keys[i]['chain']);
	return keys;
}