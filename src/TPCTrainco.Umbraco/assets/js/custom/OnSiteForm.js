'use strict';

function OnSiteForm() {
	this.showPromoField();
}

OnSiteForm.prototype.showPromoField = function () {
	var $hearSelect = $('.howdidyouhearaboutus').find('select');
	var promoField = $('.contourFieldSet').next('div');
	promoField.addClass('promo-field').find('input').attr('placeholder', 'Enter Promo Code');
	$hearSelect.on('change', function () {
		var selectedOpt = this.options[this.selectedIndex].text;
		if (selectedOpt === 'Direct Mail' || selectedOpt === 'Print Ad' || selectedOpt === 'Email') {
			$(promoField).slideDown().addClass('showing');
		}
		else if (selectedOpt === 'Other') {

		}
		else {
			if ($(promoField).hasClass('showing')) {
				$(promoField).slideUp();
			} else {
				$(promoField).css('display', 'none');
			}
		}
	});
};
