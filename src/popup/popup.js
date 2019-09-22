window.onload = function() {
    let toggle = document.getElementById('toggle');

    chrome.storage.local.get(['enabled'], function(result) {
        toggle.checked = result.enabled;

        toggle.onclick = function() {
            let enabled = toggle.checked;
            console.log('enabled = ' + enabled);
            chrome.storage.local.set({enabled: enabled});
        };
    });

    let percent = document.getElementById('percent');

    chrome.storage.local.get(['percent', 'charity'], function(result) {
        percent.value = result.percent;

        percent.onkeypress = function(event) {
            if (event.keyCode == 13 || event.which == 13) {
                chrome.storage.local.set({ percent: parseFloat(percent.value) });
            }
        }

        let charity;
        if (result.charity === undefined) {
            charity = 'WWF';
        } else {
            charity = result.charity;
        }

        document.getElementById('charity').innerText = 'Donating to ' + charity;
    });

    document.getElementById("settings").onclick = function() {
        chrome.storage.local.set({tab: 'settings'}, () =>
            chrome.tabs.create({})
        );
    };
}