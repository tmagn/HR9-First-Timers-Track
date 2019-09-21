const percent = 1000;

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

function adjustPrice(originalPrice) {
    return originalPrice * (1 + percent / 100);
}

let totalDonation;

function updatePrices() {
    // prices displayed in searches, on homepage, in suggestions, etc.
    for (priceElement of document.getElementsByClassName('a-price')) {
        // skip text price elements (original price shown crossed out when discounted)
        if (priceElement.classList.contains('a-text-price'))
            continue;

        let price = parseNumber(priceElement.getElementsByClassName('a-offscreen')[0].innerText);

        if (isNaN(NaN)) {
            let whole = parseNumber(priceElement.getElementsByClassName('a-price-whole')[0].innerText);
            let fraction = parseNumber(priceElement.getElementsByClassName('a-price-fraction')[0].innerText);
            price = whole + fraction / 100;
        }
        
        let newPrice = adjustPrice(price);
        let priceStrings = priceToStrings(newPrice);
        priceElement.getElementsByClassName('a-offscreen')[0].innerText = priceStrings.text;
        priceElement.getElementsByClassName('a-price-whole')[0].innerText = priceStrings.whole;
        priceElement.getElementsByClassName('a-price-fraction')[0].innerText = priceStrings.fraction;

        tippy(priceElement, {
            content: tooltipText(price, newPrice),
            arrow: true
        });
    }

    // cart prices
    for (priceElement of document.getElementsByClassName('a-color-price')) {
        let price = parseNumber(priceElement.innerText);

        if (isNaN(price))
            continue;

        let newPrice = adjustPrice(price);
        priceElement.innerText = priceToStrings(newPrice).text;

        tippy(priceElement, {
            content: tooltipText(price, newPrice),
            arrow: true
        });

        if (priceElement.classList.contains('grand-total-price')) {
            totalDonation = priceToString(newPrice - price);
        }
    }

    // price displayed on individual product page
    let productPriceElement = this.document.getElementById('priceblock_ourprice');

    if (!productPriceElement)
        return;

    let price = parseNumber(productPriceElement.innerText);
    let newPrice = this.adjustPrice(price);
    productPriceElement.innerText = priceToString(newPrice);

    tippy('#priceblock_ourprice', {
        content: tooltipText(price, newPrice),
        arrow: true
    });
}

function doCheckout() {
    let checkoutButton = document.querySelector('#subtotals > div > div > div > .place-order-button');
    let checkoutButtonDiv = document.querySelector('#subtotals > div > div > div:first-child');
    let buttonsDiv = document.querySelector('#subtotals > div > div:first-child');
    let donateButton = document.createElement('button');

    donateButton.innerText = 'donate (' + totalDonation + ')';
    donateButton.style = 'padding: 0.5em';
    donateButton.classList.add('a-row');
    donateButton.onclick = function() {
        window.open('https://support.worldwildlife.org/site/SPageNavigator/donate_to_charity#amount=' + parseNumber(totalDonation))
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
    updatePrices();
    doCheckout();
}