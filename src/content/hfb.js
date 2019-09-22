window.onload = function() {
    let donation = window.location.hash.replace('#amount=', '');

    if (!donation)
        return;

    console.log(donation);

    document.getElementById('otherAmountField').value = donation;
}