$(document).ready(function () {
    var checkoutCustomer = new CheckoutCustomer();
});


function CheckoutCustomer() {
    var _this = this;
    this.$differentInfo = $('#supervisor-diff');
    this.$differentInfoFields = $('.hidden-different-check');
    this.$billingOptsSelect = $('#PaymentType');
    this.$ccInfo = $('.cc-info');
    this.$invoiceInfo = $('.invoice-info');
    this.$billingDifferent = $('#BillingDifferent');
    this.$promoWrap = $('.promo-wrap');
    this.$hearAbout = $('#HearAbout');
    this.$promoCode = $('#PromoCode');
    this.$hearAboutOther = $('#HearAboutOther');

    this.DisableSelectDropdowns();
    this.showPromoField();
    this.showOtherInfo();
    this.billingOptions();

    if ($("#BillFirstName").val()) {
        this.$differentInfoFields.slideDown('fast');
        this.$billingDifferent.val('true');
    }

    var selectedOption = this.$billingOptsSelect.val();
    if (selectedOption === 'credit') {
        this.$ccInfo.show();
        this.$invoiceInfo.hide();
    }
    else if (selectedOption === 'invoice') {
        this.$ccInfo.hide();
        this.$invoiceInfo.show();
    }

    this.$promoWrap.hide();
    this.$promoCode.hide();
    this.$hearAboutOther.hide();
    var selectedOption2 = this.$hearAbout.val();
    if (selectedOption2 == 'Direct Mail' || selectedOption2 === 'Print Ad' || selectedOption2 === 'Email') {
        this.$promoWrap.show();
        this.$promoCode.slideDown().addClass('showing');
    }
    else if (selectedOption2 == 'Other' || selectedOption2 == 'Referral') {
        this.$promoWrap.show();
        this.$hearAboutOther.slideDown().addClass('showing');
    }


    if ($('#SavedCompanyBilling').val().toLowerCase() == 'true' || $('.input-validation-error').length > 0) {
        $('.hidden-different-check').show();
        $('#supervisor-diff').prop('checked', true);
        $('#BillingDifferent').val('true');
    }

    if ($('.input-validation-error').length > 0) {
        $('.company-profile-wrap').slideDown();
        $('.immutable-account-info').slideUp();
    }

    $('#UpdateCompanyProfile').val('false');

    $('#link-edit-profile').on('click', function (e) {
        $('.company-profile-wrap').slideDown();
        $('.immutable-account-info').slideUp();
        e.preventDefault();
    });


    $('#field-account-update').on('change', function () {
        if ($(this).is(':checked')) {
            $('#UpdateCompanyProfile').val('true');

        } else {
            $('#UpdateCompanyProfile').val('false');
        }
    });

    $('#field-billing-update').on('change', function () {
        if ($(this).is(':checked')) {
            $('#UpdateCompanyBilling').val('true');

        } else {
            $('#UpdateCompanyBilling').val('false');
        }
    });


    $('#button-submit').on('click', function () {
        _this.cardProcessingMessage($(this));
    });
};

CheckoutCustomer.prototype.DisableSelectDropdowns = function () {
    $('select option:first-child').attr('disabled', 'disabled');
};

CheckoutCustomer.prototype.showOtherInfo = function () {
    var _this = this;
    _this.$differentInfo.on('change', function () {
        if ($(this).is(':checked')) {
            _this.$differentInfoFields.slideDown('fast');
            _this.$billingDifferent.val('true');

        } else {
            _this.$differentInfoFields.slideUp('fast');
            _this.$billingDifferent.val('false');
        }
    });
};

CheckoutCustomer.prototype.showPromoField = function () {
    var _this = this;
    _this.$hearAbout.on('change', function () {
        var selectedOption = _this.$hearAbout.val();

        _this.$promoWrap.hide();
        _this.$promoCode.hide();
        _this.$hearAboutOther.hide();

        if (selectedOption === 'Direct Mail' || selectedOption === 'Print Ad' || selectedOption === 'Email' || selectedOption === 'Web search') {
            if (selectedOption == 'Direct Mail') {
                _this.$promoCode.attr('placeholder', 'Promo Code on mailer');
            } else if (selectedOption == 'Print Ad') {
                _this.$promoCode.attr('placeholder', 'Promo Code');
            } else if (selectedOption == 'Email') {
                _this.$promoCode.attr('placeholder', 'Promo Code in email');
            } else if (selectedOption == 'Web search') {
                _this.$promoCode.attr('placeholder', 'Search Term');
            } else {
                _this.$promoCode.attr('placeholder', 'Promo Code or description of mailer');
            }

            _this.$promoWrap.show();
            _this.$promoCode.slideDown().addClass('showing');
        }
        else if (selectedOption == 'Other' || selectedOption == 'Referral') {
            _this.$promoWrap.show();
            _this.$hearAboutOther.slideDown().addClass('showing');
        }
    });
};

CheckoutCustomer.prototype.billingOptions = function () {
    var _this = this;

    _this.$billingOptsSelect.on('change', function () {
        var selectedOption = $('#PaymentType').val();
        if (selectedOption === 'credit') {
            _this.$invoiceInfo.hide();
            _this.$ccInfo.slideDown('fast');
        }
        else if (selectedOption === 'invoice') {
            _this.$ccInfo.hide();
            _this.$invoiceInfo.slideDown('fast');
        }
        else {
            // enable next button if invoice is chosen
            _this.$ccInfo.slideUp('fast');
            _this.$invoiceInfo.slideUp('fast');
        }
    });


    // show/hide cvv text info
    $('.cvv-text').on('click', function () {
        $(this).find('span').toggleClass('showing');
    });
};

// show a loader and message while credit card is processing.
CheckoutCustomer.prototype.cardProcessingMessage = function (submitBtn) {
    submitBtn.fadeOut(300, function () {
        $('.card-loader').fadeIn();
        $('.processing-msg').fadeIn().text('Order processing may take several seconds. Please wait...');
    });

    setTimeout(function () {
        $('.card-loader').fadeOut(100, function () {
            $('.processing-msg').text('There was an error processing your order. Please try again.');
            submitBtn.fadeIn();
        });
    }, 30000);
};