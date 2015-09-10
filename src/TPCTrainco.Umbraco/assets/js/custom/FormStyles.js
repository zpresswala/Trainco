'use strict';

function FormStyles() {
	var _this = this;
	$('.pleasesendmeinformationthroughthemail').find('input[type=checkbox]').on('change', function() {
		if($(this).is(':checked')) {
			var showHide = true;
		} else {
			var showHide = false;
		}

		_this.showHideForms(showHide);
	});
}

FormStyles.prototype.showHideForms = function(showHide) {
	$('.mailingaddress, .mailingaddressline2, .city, .stateprovince, .postalcode, .country').find('input[type=text], label, select').toggle(showHide);
};