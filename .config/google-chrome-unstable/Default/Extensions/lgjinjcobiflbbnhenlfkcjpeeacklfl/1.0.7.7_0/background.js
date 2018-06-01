var tabID;

chrome.runtime.onMessage.addListener( // called by content_script when done
  function(request, sender, sendResponse) {
    //chrome.browserAction.enable(tabID);
});
 
// Called when the user clicks on the browser button.
chrome.browserAction.onClicked.addListener(function(tab) {
    tabID = tab.id;
   // chrome.browserAction.disable(tabID);
    chrome.tabs.executeScript(null, {file:"content_script.js"}); 
    //setTimeout(function(){chrome.browserAction.enable(tabID)}, 5000);
});