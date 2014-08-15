function parseAddresses(text) {
	// get the list of addresses as an array
	var addresses = _.filter(text.split(/[\r\n]+/), function(e, i) {
		// filter comments
		var a = e.replace(/^[#].*/, "");
		// filter for valid bitcoin addresses
		try {
			Bitcoin.base58check.decode(a);
			return a;
		} catch(e) {
			return null;
		}
	});
	console.log(addresses);
}
