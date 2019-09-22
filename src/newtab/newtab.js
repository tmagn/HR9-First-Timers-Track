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
    hometab.click();
    
    // saves input into chrome.storage
    submitbttn.addEventListener('click', function() {
        var charity = document.getElementById('choose charity').value;
        var percent = document.getElementById('choose percent').value / 100;
        chrome.storage.sync.set({"charity":charity, "percent":percent});
        console.log(charity)
        console.log(percent)
    }
    )
    }
)