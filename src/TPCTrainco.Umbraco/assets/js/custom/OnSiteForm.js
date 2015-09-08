// 'use strict';

// function OnSiteForm() {
// 	// this.showPromoField();
// }

// OnSiteForm.prototype.placeholders = function() {
// 	var $labels = $('.fieldLabel').attr('for');
// 	var $id = $('.text').id;

// 	$('.contourField').each(function(index, val) {
// 		if(!val.hasClass('dropdownList')) {
			
// 		}
// 		var labelText = $(val).find('.fieldLabel').text();
// 		var labelName = $(val).find('.fieldLabel').attr('for');
// 		var inputField = $(val).find('.text').attr('id');
// 		console.log(labelText, labelName, inputField);
// 		if(labelName[index] == inputField[index]) {
// 			$('#' + inputField).attr('placeholder', labelText);	
// 		}
// 	});
// };

// OnSiteForm.prototype.showPromoField = function () {
// 	var $hearSelect = $('.howdidyouhearaboutus').find('select');
// 	var promoField = $('.contourFieldSet').next('div');
// 	promoField.addClass('promo-field').find('input').attr('placeholder', 'Enter Promo Code');
// 	$hearSelect.on('change', function () {
// 		var selectedOpt = this.options[this.selectedIndex].text;
// 		if (selectedOpt === 'Direct Mail' || selectedOpt === 'Print Ad' || selectedOpt === 'Email') {
// 			$(promoField).slideDown().addClass('showing');
// 		}
// 		else if (selectedOpt === 'Other') {

// 		}
// 		else {
// 			if ($(promoField).hasClass('showing')) {
// 				$(promoField).slideUp();
// 			} else {
// 				$(promoField).css('display', 'none');
// 			}
// 		}
// 	});
// };
