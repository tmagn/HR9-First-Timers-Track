chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({charity: 'WWF'});
    chrome.storage.local.set({percent: 2});
    chrome.storage.local.set({enabled: true});
    chrome.storage.local.set({months: {
        '118-11': 73.31,
        '119-1': 10.84,
        '119-2': 173.14,
        '119-3': 73.93,
        '119-4': 64.83,
        '119-5': 82.12,
        '119-6': 12.12,
        '119-7': 83.49,
        '119-8': 0
    }});
});
