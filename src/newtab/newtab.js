let chart;

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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      alert(request);
    });

// as soon as page is loaded (ie. DOMContentLoaded), look for events to happen with the tabs
document.addEventListener('DOMContentLoaded', function(){
    var hometab = document.getElementById("hometab");
    var settingstab = document.getElementById("settingstab");
    var submitbttn = document.getElementById("Submit")

    // looks for click on home tab
    hometab.addEventListener('click', function(){
        // get content from all tabs and hide them
        var tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // make all tab links inactive
        var tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // show current tab and change ot active
        home.style.display = "block";
        home.className += " active";
        }
    )

    // looks for click on settings tab
    settingstab.addEventListener('click', function() {
        // get content from all tabs and hide them
        var tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // make all tab links inactive
        var tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // show current tab and change ot active
        settings.style.display = "block";
        settings.className += " active";
        }
    )
    // begin the webpage on home

    chrome.storage.local.get(['tab'], function(result) {
        if (result.tab === 'settings') {
            settingstab.click();
            chrome.storage.local.set({tab: ''});
        } else {
            hometab.click();
        }
    })
    
    chrome.storage.local.get(['percent', 'charity', 'months'], function(result) {
        document.getElementById('choose_percent').value = result.percent;
        document.getElementById('choose_charity').value = result.charity;

        let date = new Date();
        let key = date.getYear() + '-' + date.getMonth();
        let month = 0;

        if (key in result.months) {
            month = result.months[key];
        }
        month = priceToString(month);

        document.getElementById('month').innerText = 'Donations This Month: ' + month;

        let total = 0;
        for (value of Object.values(result.months)) {
            total += parseFloat(value);
        }
        document.getElementById('total').innerText = 'Grand Total: ' + priceToString(total);
    });

    // saves input into chrome.storage
    submitbttn.addEventListener('click', function() {
        let charity = document.getElementById('choose_charity').value;
        chrome.storage.local.set({charity: charity});
        let percent = document.getElementById('choose_percent').value;
        chrome.storage.local.set({percent: percent});
    });
});

window.onload = () => {
    chrome.storage.local.get('months', function(result) {

        let dataPoints = [];
        for (value of Object.values(result.months)) {
            dataPoints.push({y: value});
        }

    window.setTimeout(() => {
     chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        axisY:{
            includeZero: false
        },
        data: [{        
            type: "line",       
            dataPoints: dataPoints
        }]
    });
    chart.render();
    }, 100);
});
};