chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage")
      sendResponse({data1: localStorage[request.key1],
      				data2: localStorage[request.key2],
      				data3: localStorage[request.key3],
      				data4: localStorage[request.key4],
      				data5: localStorage[request.key5],
      				data6: localStorage[request.key6],
      				data7: localStorage[request.key7],
      				data8: localStorage[request.key8],
      				data9: localStorage[request.key9]
      				});
    else
      sendResponse({}); // snub them.
});

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
    chrome.tabs.create({url:"options.html"});
});
