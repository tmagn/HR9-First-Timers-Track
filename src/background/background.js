chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({charity: 'WWF'});
    chrome.storage.local.set({percent: 2});
    chrome.storage.local.set({enabled: true});
});
