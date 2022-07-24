var dict = {};
var otp = {};


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


// most likely this will run when devtools opens
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});



(function createChannel() {
    //Create a port with background page for continous message communication
    var port = chrome.runtime.connect({
        name: "Another Communication" //Given a Name
    });

    // Listen to messages from the background page
    port.onMessage.addListener(function (message) {
        if (message.action === "downloadTracelog") {
            chrome.devtools.network.getHAR(
                (harLog) => {
                    let updatedHarLog = {};
                    
                    var output = {
                        Url: 'HTTPS',
                        TimeTaken: '10',
                        Started: '0',
                        TraceID:'ABC',
                        Link:'XY',
                    };

                    // this makes it readable by Chrome Dev Tools
                    updatedHarLog.log = harLog;
                    
                    if('entries' in updatedHarLog.log) {
                        for(let i=0; i<updatedHarLog.log['entries'].length; i++) {
                            if('request' in updatedHarLog.log['entries'][i]) {
                                if('url' in updatedHarLog.log['entries'][i]['request']) {
                                    if(updatedHarLog.log['entries'][i]['request']['url'].includes("api/erp/expenses")) {
                                        if('headers' in updatedHarLog.log['entries'][i]['request']) {
                                            for(let j=0; j<updatedHarLog.log['entries'][i]['request']['headers'].length; j++) {
                                                if('name' in updatedHarLog.log['entries'][i]['request']['headers'][j]) {
                                                    if(updatedHarLog.log['entries'][i]['request']['headers'][j]['name'] == 'x-b3-traceid') {
                                                        output.Url = updatedHarLog.log['entries'][i]['request']['url'];
                                                        output.TimeTaken = updatedHarLog.log['entries'][i]['time'].toFixed(3)+"ms";
                                                        output.TraceID = updatedHarLog.log['entries'][i]['request']['headers'][j]['value'];
                                                        let Time =  new Date(updatedHarLog.log['entries'][i]['startedDateTime']).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
                                                        output.Started = Time;
                                                        let pre = "https://preprod-fusion.octo.oraclecloud.com/tv/explore?orgId=3&left=%7B%22datasource%22:%22Jaeger-us-phoenix-1%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22instant%22:true,%22range%22:true,%22exemplar%22:true,%22query%22:%22";
                                                        let post = "%22%7D%5D,%22range%22:%7B%22from%22:%22now-1h%22,%22to%22:%22now%22%7D%7D";
                                                        output.Link = pre + output.TraceID + post;

                                                        // let index = updatedHarLog.log['entries'][i]['request']['url'].indexOf('?');
                                                        // let key = updatedHarLog.log['entries'][i]['request']['url'].substring(0, index);
                                                        
                                                        dict[output.Url] = output;
                                                        // dict[output.Url].Url = output.Url;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // let harBLOB = new Blob([JSON.stringify(dict)]);
                    
                    // // harBLOB = harBLOB['log'];
                    // // console.log(harBLOB);
                    // let url = URL.createObjectURL(harBLOB);

                    // chrome.downloads.download({
                    //     url: url
                    // });


                }
            );

            
            
            chrome.devtools.panels.create(
                'Octo',
                'icon.png', 
                'octo.html',
                function(extensionPanel) {
                    var runOnce = false;
                    extensionPanel.onShown.addListener(function(panelWindow) {
                        if (runOnce) return;
                        runOnce = true;
                        var table = document.createElement('table'), tr, td;
                        tr = document.createElement('tr');
                        td = document.createElement('td');
                        tr.appendChild(td);
                        td.innerHTML = "#";

                        td = document.createElement('td');
                        tr.appendChild(td);
                        td.innerHTML = "URL";
                        
                        td = document.createElement('td');
                        tr.appendChild(td);
                        td.innerHTML = "Start Time";
                        
                        td = document.createElement('td');
                        tr.appendChild(td);
                        td.innerHTML = "Duration";
                        
                        td = document.createElement('td');
                        tr.appendChild(td);
                        td.innerHTML = "X-B3-TraceID";

                        td = document.createElement('td');
                        tr.appendChild(td);
                        td.innerHTML = "Octo Link";

                        table.appendChild(tr);

                        var x = 1;

                        for(var key in dict) {
                            tr = document.createElement('tr');
                            
                            td = document.createElement('td');
                            tr.appendChild(td);
                            td.innerHTML = x;

                            td = document.createElement('td');
                            tr.appendChild(td);
                            var Text = key;
                            td.innerHTML = Text.link(key);

                            td = document.createElement('td');
                            tr.appendChild(td);
                            td.innerHTML = dict[key].Started;

                            td = document.createElement('td');
                            tr.appendChild(td);
                            td.innerHTML = dict[key].TimeTaken;

                            td = document.createElement('td');
                            tr.appendChild(td);
                            td.innerHTML = dict[key].TraceID;

                            td = document.createElement('td');
                            tr.appendChild(td);

                            Text = "Link";
                            td.innerHTML = Text.link(dict[key].Link);
                            
                            table.appendChild(tr);

                            x++;
                        }
                        panelWindow.document.body.appendChild(table);
                    });}
            );
            
        }
    });

}());

