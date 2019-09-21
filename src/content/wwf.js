window.onload = function() {
    let donation = window.location.hash.replace('#amount=', '');

    if (!donation)
        return;

    console.log(donation);

    document.getElementById('level_other').click();
    document.getElementsByName('other_amount')[0].value = donation;
}