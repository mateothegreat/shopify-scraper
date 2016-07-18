var chai = require('chai')
	, assert = chai.assert
	, expect = chai.expect
	, should = chai.should()

	, path = require('path')
	, fs = require('fs')

	, rjsonSearch = require('../lib/rjson-search');

var testJSON;

describe('rjson-search', function(){

	before(function(){
	
		var mockJsonPath = path.join(__dirname, 'mocks/json.json')
			, testJSONString = fs.readFileSync(mockJsonPath, {encoding: 'utf8'});

		testJSON = JSON.parse(testJSONString);

	});

	describe('testJson', function(){

		it('should be an object', function(){
			
			expect(testJSON).to.be.a('array');
		
		});

	});

	describe('isRegularExpression', function(){

		it('should be true when regular expression', function(){
			
			expect(rjsonSearch.isRegularExpression(/\w/)).to.equal(true);

			expect(rjsonSearch.isRegularExpression('')).to.equal(false);

			expect(rjsonSearch.isRegularExpression({})).to.equal(false);

			expect(rjsonSearch.isRegularExpression([])).to.equal(false);

			expect(rjsonSearch.isRegularExpression(1)).to.equal(false);
		
		});

	});

	describe('objectContainsQuery', function(){
		it('should find "jesse"', function(){
			
			var jesseObj = testJSON[0];

			var result = rjsonSearch.objectContainsQuery(jesseObj, 'jesse');

			assert.isTrue(result);
		
		});

		it('should find "ICC Lowe Thermal"', function(){
			
			var jesseObj = testJSON[0];

			var result = rjsonSearch.objectContainsQuery(jesseObj, 'ICC Lowe Thermal');

			assert.isTrue(result);
		
		});

		it('should NOT find "Random Query"', function(){
			
			var jesseObj = testJSON[0];

			var result = rjsonSearch.objectContainsQuery(jesseObj, 'Random Query');

			assert.isFalse(result);
		
		});

		it('should find "1"', function(){
			
			var jesseObj = testJSON[0];

			var result = rjsonSearch.objectContainsQuery(jesseObj, '1');

			assert.isTrue(result);
		
		});

		it('should find "sugar"', function(){
			
			var jesseObj = testJSON[0];

			var result = rjsonSearch.objectContainsQuery(jesseObj, 'sugar');

			assert.isTrue(result);
		
		});

		it('should not throw error with null object', function(){
			
			
			expect(function() {
			
				rjsonSearch.objectContainsQuery(testJSON, 'query');
			
			}).to.not.throw(Error);

		});

		it('should ignore case', function () {

			var result = rjsonSearch.objectContainsQuery(testJSON, 'JESSE', true);
			assert(result, true);

		});

	});

	describe('find', function(){
		
		it('should find 1 "jesse"', function(){

			var objectsContainingJesse = rjsonSearch.find(testJSON, 'jesse');

			assert.lengthOf(objectsContainingJesse, 1);

			objectsContainingJesse[0].name.should.equal('jesse');

		});

		it('should find 3 objects with query "javascript"', function(){

			var objectsContainingJavascript = rjsonSearch.find(testJSON, 'javascript');

			assert.lengthOf(objectsContainingJavascript, 3);

		});

		it('should find 3 objects with query "ICC Lowe Thermal"', function(){

			var objectsContainingICCLoweThermal = rjsonSearch.find(testJSON, 'ICC Lowe Thermal');

			assert.lengthOf(objectsContainingICCLoweThermal, 3);

		});

		it('should ignore case', function () {
			var result = rjsonSearch.find(testJSON, 'JESSE', true);
			assert.lengthOf(result, 1);
			assert.equal(result[0].name, 'jesse');
		});
	
	});

});