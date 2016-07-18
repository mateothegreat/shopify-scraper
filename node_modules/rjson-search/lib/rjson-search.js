module.exports = {

	isRegularExpression: function(arg){

		return Object.prototype.toString.call(arg) === '[object RegExp]';

	},

	find: function(json, query, ignoreCase){
		
		var results = [];

		for (var i = 0 ; i < json.length ; i++) {

			var obj = json[i];

			if (this.objectContainsQuery(obj, query, ignoreCase))

				results.push(obj);

		}

		return results;
	},

	objectContainsQuery: function(obj, query, ignoreCase){
		
		function isValueType (obj) {
			return ( typeof obj === 'string' || 
				       typeof obj === 'number' || 
				       typeof obj === 'boolean');
		}

		function queryToRegExp (query) {
			return new RegExp('^' + query + '$', ignoreCase ? 'i' : '');
		}

		if (isValueType(obj)) {
			
			var stringValue = obj.toString();
			var queryRegExp = queryToRegExp(query);
			
			return queryRegExp.test(stringValue)

		} else if (typeof obj === 'object' && obj !== null) {
			var keys = Object.keys(obj);

			for (var i = 0 ; i < keys.length ; i++) {

				if (this.objectContainsQuery(obj[keys[i]], query, ignoreCase)) 
					return true;

			}
		}
		
		return false;

	}

};