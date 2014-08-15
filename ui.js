$(function() {
	// hide the addresses to begin with
	$("#addresses").hide();
	
	// hide the ajax spinner now that we are running
	$("#loader").remove();
	
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
		timer = setTimeout(function () {	
			parseAddresses($(element).val());
		}, 100);
	});
	
	// when we first launch, check what addresses to load
	var q = document.location.href.split("?")[1];
	if (q) {
		alert(q);
	}
});
