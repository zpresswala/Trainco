$(document).ready(function () {
    CreateAccount();
});

function CreateAccount() {
    var $speedCheckout = $('#speedCheckout');
    var $speedCheckoutForm = $('.speedCheckout-form');
    var $CreateAccount = $('#CreateAccount');

    $speedCheckout.on('change', function () {
        if ($(this).is(':checked')) {
            $speedCheckoutForm.slideDown('fast');
            $CreateAccount.val('true');

        } else {
            $speedCheckoutForm.slideUp('fast');
            $CreateAccount.val('false');
        }
    });
}