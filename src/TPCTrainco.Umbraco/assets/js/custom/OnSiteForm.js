'use strict';

function OnSiteForm() {
	this.showPromoField();
}

OnSiteForm.prototype.showPromoField = function() {
	var hearSelect = document.getElementById('hear');
	var promoField = document.querySelectorAll('.promo-wrap');
	hearSelect.addEventListener('change', function() {
		var selectedOpt = this.options[this.selectedIndex].text;
		if(selectedOpt === 'Direct Mail' || selectedOpt === 'Print Ad' || selectedOpt === 'Email') {
			$(promoField).slideDown().addClass('showing');
		} else {
			if($(promoField).hasClass('showing')) {
				$(promoField).slideUp();	
			} else {
				$(promoField).css('display', 'none');
			}
		}
	});
};