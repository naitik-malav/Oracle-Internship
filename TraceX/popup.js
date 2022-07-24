function $(id) { return document.getElementById(id); }
function show(id) { $(id).style.display = 'block'; }

(function () {
	// var captureButton = document.getElementById('Capture');
	// check if devtools is open
	chrome.extension.sendMessage({ action: "getDevToolsStatus" }, function (response) {
		if (!response.data) {
			alert("DevTools needs to be open to get Trace logs")
		} else {

			// sends message to devtools(through background.js)
			let message = { action: "downloadTracelog" };
			chrome.extension.sendMessage(message, function (a) {
				// alert(JSON.stringify(a));
			});
		}
	});

	
})();