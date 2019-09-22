function priceToStrings(price) {
    let whole = Math.floor(price);
    let fraction = Math.floor(100 * (price - whole)).toString().padStart(2, '0');
    let text = '$' + whole.toLocaleString() + '.' + fraction;

    return {
        whole: whole,
        fraction: fraction,
        text: text
    }
}

function priceToString(price) {
    return priceToStrings(price).text;
}

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

    chrome.storage.local.get(['percent', 'charity', 'months'], function(result) {
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

        let date = new Date();
        let key = date.getYear() + '-' + date.getMonth();
        let month = 0;

        if (key in result.months) {
            month = result.months[key];
        }
        month = priceToString(month);

        document.getElementById('month').innerText = '' + month + ' donated this month';

        let total = 0;
        for (value of Object.values(result.months)) {
            total += parseFloat(value);
        }
        document.getElementById('total').innerText = '' + priceToString(total) + ' donated since you joined!';
    });

    document.getElementById("settings").onclick = function() {
        chrome.storage.local.set({tab: 'settings'}, () =>
            chrome.tabs.create({})
        );
    };
}