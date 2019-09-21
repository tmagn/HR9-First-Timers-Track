const percent = 1000;

// parse float from text after removing all non-numeric characters
function parseNumber(string) {
    return parseFloat(string.replace(/[^0-9.]/g, ''));
}

function priceToString(price) {
    let whole = Math.floor(price);
    let fraction = Math.floor(100 * (price - whole)).toString().padStart(2, '0');
    let text = '$' + whole.toLocaleString() + '.' + fraction;
    return {
        whole: whole,
        fraction: fraction,
        text: text
    }
}

function adjustPrice(originalPrice) {
    return originalPrice * (1 + percent / 100);
}

window.onload = function() {
    // prices displayed in searches, on homepage, in suggestions, etc.
    let priceElements = document.getElementsByClassName('a-price');

    for (priceElement of priceElements) {
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
        let priceStrings = priceToString(newPrice);
        priceElement.getElementsByClassName('a-offscreen')[0].innerText = priceStrings.text;
        priceElement.getElementsByClassName('a-price-whole')[0].innerText = priceStrings.whole;
        priceElement.getElementsByClassName('a-price-fraction')[0].innerText = priceStrings.fraction;
    }

    // price displayed on individual product page
    let productPriceElement = this.document.getElementById('priceblock_ourprice');
    let price = parseNumber(productPriceElement.innerText);
    let newPrice = this.adjustPrice(price);
    productPriceElement.innerText = priceToString(newPrice).text;
}