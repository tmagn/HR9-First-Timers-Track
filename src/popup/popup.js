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

    chrome.storage.local.get(['percent'], function(result) {
        percent.value = result.percent;

        percent.onkeypress = function(event) {
            if (event.keyCode == 13 || event.which == 13) {
                chrome.storage.local.set({ percent: parseFloat(percent.value) });
            }
        }
    });
}