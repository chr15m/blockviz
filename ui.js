$(function() {
	// hide the addresses to begin with
	$("#addresses").hide();
	
	// hide the ajax spinner now that we are running
	$("#loader").hide();
	
	// receive clicks on the ui
	$("#ui").on("click mousedown DOMMouseScroll mousewheel", function(ev) {
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
		var element = this;
		timer = setTimeout(updateFromAddressBox, 500);
	});
	
	// when we first launch, check what addresses to load
	var q = document.location.href.split("?")[1];
	if (q) {
		// alert(q);
		if (q.indexOf(",")) {
		}
	}
});

// parse addresses out of the address box and fetch them
function updateFromAddressBox() {
	function () {
		$("#log").html("");
		var parsed = parseAddresses($(element).val());
		// display rejected addresses
		if (parsed.rejected.length) {
			$("#log").append("Rejected addresses:<br/>");
			for (var r=0; r<parsed.rejected.length; r++) {
				var escaped = parsed.rejected[r].replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
				$("#log").append(escaped + "<br/>");
			}
		}
		// start fetching the addresses from blockchain.info
		fetchAddresses();
	}
}
