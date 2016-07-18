

module.exports = Flatten;


function Flatten(master) {
	var handles = Object.keys(master);
	var products = {};
	handles.forEach(function(handle) {
		master[handle].products.forEach(function(product) {
			var id = product.id;
			products[id] = products[id] || JSON.parse(JSON.stringify(product));
			products[id].collections = products[id].collections || [];
			products[id].collections.push(handle);
		});
	});
	return Object.keys(products).map(function(id) {
		return products[id];
	});
}
