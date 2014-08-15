function parseAddresses(text) {
	// get the list of addresses as an array
	var addresses = _.filter(text.split(/[\r\n]+/), function(e, i) {
		var a = e.replace(/^[#].*/, "");
		return a ? a : null;
	});
	console.log(addresses);
}
