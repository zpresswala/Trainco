$(document).ready(function () {
    CreateAccount();
    InterestedTrainingTopics();
    SubmitOrder();
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

function InterestedTrainingTopics() {
    $('.interested-topics').click(function () {
        var valueList = $('.interested-topics:checked').map(function () { return this.value; }).get().join(',');

        $('#Company_TrainingTopics').val(valueList);
    });
}

function SubmitOrder() {
    var $submit_button = $('.submit-button');

    $submit_button.on('click', function () {
        $submit_button.fadeOut(300, function () {
            $('.card-loader').fadeIn();
            $('.processing-msg').fadeIn().text('Order processing may take several seconds. Please wait...');
        });

        setTimeout(function () {
            $('.card-loader').fadeOut(100, function () {
                $('.processing-msg').text('There was an error processing your order. Please try again.');
                $submit_button.fadeIn();
            });
        }, 30000);
    });
}