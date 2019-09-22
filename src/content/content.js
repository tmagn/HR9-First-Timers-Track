// parse float from text after removing all non-numeric characters
function parseNumber(string) {
    // don't parse fields like ($0.17 / count)
    if (string.charAt(0).match(/[0-9$]/) == null) {
        return NaN;
    }
    return parseFloat(string.replace(/[^0-9.]/g, ''));
}

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

function tooltipText(price, newPrice) {
    return '' + priceToString(price) + ' + '
        + '<strong><span style="color:lightgreen">' + priceToString(newPrice - price)
        + '</span></strong> = ' + priceToString(newPrice);
}

function adjustPrice(percent, originalPrice) {
    return originalPrice * (1 + percent / 100);
}

function setText(element, text) {
    if (!element.hasAttribute('original')) {
        element.setAttribute('original', element.innerText);
    }
    
    element.innerText = text;
}

function getOriginalText(element) {
    if (element.hasAttribute('original')) {
        return element.getAttribute('original');
    } else {
        return element.innerText;
    }
}

let totalDonation;

function setTooltip(element, content) {
    if (element.tooltip !== undefined) {
        element.tooltip.setContent(content);
    } else {
        let tooltip = tippy(element, {
            content: content,
            arrow: true
        });
        element.tooltip = tooltip;
    }
}

let donateButton;

function updatePrices(percent) {
    // prices displayed in searches, on homepage, in suggestions, etc.
    for (priceElement of document.getElementsByClassName('a-price')) {
        // skip text price elements (original price shown crossed out when discounted)
        if (priceElement.classList.contains('a-text-price'))
            continue;

        let price = parseNumber(getOriginalText(priceElement.getElementsByClassName('a-offscreen')[0]));

        if (isNaN(NaN)) {
            let whole = parseNumber(getOriginalText(priceElement.getElementsByClassName('a-price-whole')[0]));
            let fraction = parseNumber(getOriginalText(priceElement.getElementsByClassName('a-price-fraction')[0]));
            price = whole + fraction / 100;
        }
        
        let newPrice = adjustPrice(percent, price);
        let priceStrings = priceToStrings(newPrice);
        setText(priceElement.getElementsByClassName('a-offscreen')[0], priceStrings.text);
        setText(priceElement.getElementsByClassName('a-price-whole')[0], priceStrings.whole);
        setText(priceElement.getElementsByClassName('a-price-fraction')[0], priceStrings.fraction);

        setTooltip(priceElement, tooltipText(price, newPrice));
    }

    // cart prices
    for (priceElement of document.getElementsByClassName('a-color-price')) {
        let price = parseNumber(getOriginalText(priceElement));

        if (isNaN(price))
            continue;

        let newPrice = adjustPrice(percent, price);
        setText(priceElement, priceToString(newPrice));

        setTooltip(priceElement, tooltipText(price, newPrice));

        if (priceElement.classList.contains('grand-total-price')) {
            totalDonation = priceToString(newPrice - price);
            if (donateButton !== undefined) {
                donateButton.innerText = 'donate (' + totalDonation + ')';
            }
        }
    }

    /*
    // price displayed on individual product page
    let productPriceElement = this.document.getElementById('priceblock_ourprice');

    if (!productPriceElement)
        return;

    let price = parseNumber(productPriceElement.innerText);
    console.log(price);
    let newPrice = this.adjustPrice(price);
    productPriceElement.innerText = priceToString(newPrice);
    console.log(newPrice);

    tippy('#priceblock_ourprice', {
        content: tooltipText(price, newPrice),
        arrow: true
    });*/
}

function donate(amount) {
    chrome.storage.local.get(['charity', 'months'], function(result) {
        let charity = result.charity;
        if (charity === undefined) {
            charity = 'WWF';
        }

        switch (charity) {
            case 'WWF':
                window.open('https://support.worldwildlife.org/site/SPageNavigator/donate_to_charity#amount=' + parseNumber(amount));
                break;
            case 'HFB':
                window.open('https://secure3.convio.net/hfb/site/Donation2?df_id=8530&mfc_pref=T&8530.donation=form1#amount=' + parseNumber(amount));
                break;
        }

        let date = new Date();
        let key = date.getYear() + '-' + date.getMonth();

        if (!(key in result.months)) {
            result.months[key] = 0;
        }
        result.months[key] += parseNumber(amount);

        chrome.storage.local.set({months: result.months});
    });
}

function doCheckout() {
    let checkoutButton = document.querySelector('#subtotals > div > div > div > .place-order-button');

    if (checkoutButton === null)
        return;

    let checkoutButtonDiv = document.querySelector('#subtotals > div > div > div:first-child');
    let buttonsDiv = document.querySelector('#subtotals > div > div:first-child');
    donateButton = document.createElement('button');

    donateButton.innerText = 'donate (' + totalDonation + ')';
    donateButton.style = 'padding: 0.5em';
    donateButton.classList.add('a-row');
    donateButton.onclick = function() {
        donate(totalDonation);
        checkoutButton.style.opacity = 1;
        checkoutButton.style.pointerEvents = 'all';
    };
    buttonsDiv.insertBefore(donateButton, checkoutButtonDiv);

    if (!checkoutButton)
        return;

    checkoutButton.style.opacity = 0.5;
    checkoutButton.style.pointerEvents = 'none';
}

window.onload = function() {
    chrome.storage.local.get(['enabled', 'percent'], function(result) {
        if (result.enabled) {
            doCheckout();
            if (result.percent === undefined) {
                updatePrices(1000);
            } else {
                updatePrices(result.percent);
            }
        }
    });
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if ('enabled' in changes) {
        window.location.reload('false');
    }
    if ('percent' in changes) {
        updatePrices(changes.percent.newValue);
    }
  });
