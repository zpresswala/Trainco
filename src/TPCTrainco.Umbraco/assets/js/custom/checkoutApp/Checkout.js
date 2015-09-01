'use strict';

function Checkout() {
}


Checkout.prototype.CreateFormPostString = function () {
	var $cart = $('.form-container');
	var cartGuid = $cart.data('cart');

	var attendeeList = [];
	$('.form-item-wrapper').each(function () {
		var seminarId = $(this).data('seminar');
		$(this).find('.reg-form').each(function () {
			var attendeeNum = $(this).find('input[name="attendee"]').val();
			var attendeeInc = $(this).find('input[name="attendeeInc"]').val();
			var firstName = $(this).find('input[name="firstname"]').val();
			var lastName = $(this).find('input[name="lastname"]').val();
			var title = $(this).find('input[name="title"]').val();
			var email = $(this).find('input[name="email"]').val();

			var attendeeItem = {
				seminarId: seminarId,
				attendeeNum: attendeeNum,
				attendeeInc: attendeeInc,
				firstName: firstName,
				lastName: lastName,
				title: title,
				email: email
			};

			attendeeList.push(attendeeItem);
		})
	});

	var postData = {
		cartGuid: cartGuid,
		checkoutItems: attendeeList
	}

	return postData;
};
