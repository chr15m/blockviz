function parseAddresses(text) {
	var rejected = [];
	// get the list of addresses as an array
	var addresses = _.filter(text.split(/[\r\n]+/), function(e, i) {
		// filter comments
		var a = e.replace(/^[#].*/, "");
		// filter for valid bitcoin addresses
		try {
			Bitcoin.base58check.decode(a);
			return a;
		} catch(e) {
			if (a) {
				rejected.push(a);
			}
			return null;
		}
	});
	return {"addresses": addresses, "rejected": rejected};
}

var known_addresses = {};

// update the list of addresses we know about with new address data
function updateKnownAddresses(new_addresses) {
	for (var a=0; a<new_addresses.length; a++) {
		known_addresses[new_addresses[a].address] = new_addresses[a];
		known_addresses[new_addresses[a].address].use = true;
	}
}

// return a list of addresses we don't know about yet
function filterKnownAddresses(new_addresses) {
	return _.filter(new_addresses, function(e, i) {
		return known_addresses[e] ? null : e;
	});
}

// mark a particular address as in the user's desired visible list
function markKnownAddresses(addresses) {
	for (var a in known_addresses) {
		if (addresses.indexOf(a) != -1) {
			known_addresses[a].use = true;
		} else {
			known_addresses[a].use = false;
		}
	}
}
