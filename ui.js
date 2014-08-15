$(function() {
	// when we first launch, check what addresses to load
	var q = document.location.href.split("?")[1];
	if (q) {
		// if there is a comma separated list of addresses passed in
		if (q.indexOf(",") != -1 || q[0] == "1") {
			$("#addresses").text(q.replace(/\,/g, "\n"));
			updateFromAddressBox();
		// if there is a URL passed in
		/*} else if (q.indexOf("http")) {
			$.get(q, function(data) {
				console.log(data);
			}, "text");*/
		// if there is a textfile name passed in
		} else {
			$.get("addresses/" + q + ".txt", function(data) {
				$("#addresses").text(data);
				updateFromAddressBox();
			}, "text");
		}
	}
	
	// hide the ajax spinner now that we are running
	$("#loader").hide();
	
	// receive clicks on the ui
	$("#ui").on("click mousedown DOMMouseScroll mousewheel keydown", function(ev) {
		ev.stopPropagation();
	});
	
	// toggle the addresses view
	$("#address-toggle").on("click", function(ev) {
		$("#addresses").toggle();
	});
	
	// debounce updates
	var timer = null;
	
	// when addresses are changed, trigger the update
	$('#addresses').on('change paste keyup', function () {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(updateFromAddressBox, 500);
	});
});

// parse addresses out of the address box and fetch them
function updateFromAddressBox() {
	$("#log").html("");
	$("#loading").show();
	$("#loading").text("Parsing addresses.");
	var parsed = parseAddresses($("#addresses").val());
	// display rejected addresses
	if (parsed.rejected.length) {
		$("#log").append("Rejected addresses:<br/>");
		for (var r=0; r<parsed.rejected.length; r++) {
			var escaped = parsed.rejected[r].replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			$("#log").append("<span class='alert'>" + escaped + "</span><br/>");
		}
	}
	// fetch good addresses
	if (parsed.addresses.length) {
		$("#loading").text("Fetching " + parsed.addresses.length + " addresses.");
		markKnownAddresses(parsed.addresses);
		fetchAddresses(parsed.addresses);
	} else {
		$("#log").append("<span class='alert'>No good addresses found.</span><br/>");
		$("#loading").hide();
	}
}

// fetch all of the requested addresses from blockchain.info
function fetchAddresses(addresses) {
	var addresses = filterKnownAddresses(addresses);
	var address_count = addresses.length;
	// fetch the addresses in blocks of 20
	var jump = 20;
	var address_blocks = Math.ceil(addresses.length / jump);
	for (var b=0; b<address_blocks; b++) {
		$.getJSON("https://blockchain.info/multiaddr?cors=true&active=" + addresses.slice(b * jump, (b+1) * jump).join("|"), function(data) {
			// console.log(data);
			updateKnownAddresses(data.addresses);
			updateTransactionLinks(data.txs);
			address_count -= data.addresses.length;
			$("#loading").text("Fetching " + address_count + " addresses.");
			checkAddressCount(address_count);
		});
	}
	checkAddressCount(address_count);
}

// if addresses-to-be-fetched count has reached zero, hide log
function checkAddressCount(address_count) {
	if (address_count == 0) {
		$("#loading").hide();
		$("#log").append(_(known_addresses).keys().length + " addresses.<br/>");
		$("#log").append(_(known_transactions).keys().length + " transactions.<br/>");
	}
}
