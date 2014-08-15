// parse addresses out of a newline-separated string of addresses
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

// register a callback that will get called when new data/links are available
var dataCallback = null;
function registerDataCallback(callback) {
	dataCallback = callback;
}

// parse the relevant data about a node for visualisation
function parseRelevanNodeData() {
	
}

// trigger an update because we have new data
function triggerAddressesUpdate() {
	// build a list of nodes
	var node_list = {};
	var edge_list = {};
	// for (var a in known_addresses) {
		
	// }
}

/*** manage all known addresses and transactions ***/

var known_addresses = {};
var known_transactions = {};

// return a list of addresses we don't know about yet
function filterKnownAddresses(new_addresses) {
	return _.filter(new_addresses, function(e, i) {
		return known_addresses[e] ? null : e;
	});
}

// update the list of addresses we know about with new address data
function updateKnownAddresses(new_addresses) {
	for (var a=0; a<new_addresses.length; a++) {
		var address = new_addresses[a];
		address.use = true;
		known_addresses[new_addresses[a].address] = address;
	}
	triggerAddressesUpdate();
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
	triggerAddressesUpdate();
}

// update known addresses with transactions
function updateTransactionLinks(transactions) {
	for (var t=0; t<transactions.length; t++) {
		var transaction = transactions[t];
		known_transactions[transaction.hash] = transaction;
	}
	triggerAddressesUpdate();
}
