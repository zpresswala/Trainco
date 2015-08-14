'use strict';

function Register() {

	if($('#supervisor-diff').length) {
		this.$differentInfo = $('#supervisor-diff');
	}

	if($('#mail-checkbox').length) {
		this.$differentInfo = $('#mail-checkbox');
	}

	console.log(this.$differentInfo, 'hi')

	this.$differentInfoFields = $('.hidden-different-check');
	this.$billingInfoText = $('.billing-info-desc');
	this.$billingOptsSelect = $('#billing-opts');
	this.$ccInfo = $('.cc-info');
	this.$nextBtn = $('.next-btn');
	this.$cvv = $('#cvv');

	this.$nextBtn.bind('click', false);

	this.showOtherInfo();
	this.billingOptions();
}

Register.prototype.showOtherInfo = function() {
	var _this = this;
	this.$differentInfo.on('change', function() {
		if($(this).is(':checked')) {
			_this.$differentInfoFields.slideDown('fast');
			_this.$billingInfoText.addClass('hidden');

		} else {
			_this.$differentInfoFields.slideUp('fast');
			_this.$billingInfoText.removeClass('hidden');
		}
	});
};

Register.prototype.billingOptions = function() {
	var _this = this;

	// disable next button
	_this.$nextBtn.unbind('click', false).addClass('disabled');

	this.$billingOptsSelect.on('change', function() {
		var selectedOption = $('#billing-opts').val();
		if(selectedOption === 'credit') {

			// disable next button
			_this.$nextBtn.unbind('click', false).addClass('disabled');
			_this.$ccInfo.slideDown('fast');
			_this.$billingInfoText.addClass('hidden');

			_this.$cvv.on('change', function() {
				if(!_this.$cvv.val()) {

					// disable next button if cvv empty
					_this.$nextBtn.unbind('click', false).addClass('disabled');
				} else {
					// enable next button if cvv has value
					_this.$nextBtn.bind('click', false).removeClass('disabled');
				}
			});

		} else {
			// enable next button if invoice is chosen
			_this.$nextBtn.unbind('click', false);
			_this.$ccInfo.slideUp('fast');
			_this.$billingInfoText.removeClass('hidden');
			_this.$nextBtn.bind('click', false).removeClass('disabled');
		}
	});
};