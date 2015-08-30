'use strict';

function Checkout() {
	this.$regSubmit = $('#reg-submit');

	this.FormSubmitListener();
}

HomePage.prototype.FormSubmitListener = function () {
	this.$regSubmit.on('click', function () {
		var tempFormData = CreateFormPostString();
	});
};

HomePage.prototype.CreateFormPostString = function () {
	var seminarList = [];
	$('.form-item-wrapper').each(function () {
		var seminarId = $(this).data('seminar');
		var firstName = $(this).find('input[name="firstname"]').val();
		var lastName = $(this).find('input[name="lastname"]').val();
		var title = $(this).find('input[name="title"]').val();
		var email = $(this).find('input[name="email"]').val();

		var postData = {
			seminarId: seminarId,
			firstName: firstName,
			lastName: lastName,
			title: title,
			email: email
		};

		seminarList.push(postData);
	});

	return JSON.stringify(seminarList);
};

HomePage.prototype.PostFormData = function () {
	var _this = this;

	var postData = this.CreateFormPostString();

	$.ajax({
		url: ApiDomain + '/api/checkout/submit',
		data: postData,
		type: "POST",
		contentType: "application/json"
	}).done(function (successObj) {
		var success = successObj.success;
		var message = successObj.message;

		_this.$('.checkout-loader').hide();

		if (success) {
			window.location.href = '/register/info/';
		}
		else {
			// There was a problem with the form. Please check where the error has occured.
			_this.$('#reg-submit').prepend('<p class="checkout-err-msg">' + message + '</p>');
		}

		var redirectGuid = successObj.cartGuid;
		
		window.location.href = '/register/?cart=' + redirectGuid;
	}).fail(function (error) {
		_this.$('.checkout-loader').hide();
		_this.$('#reg-submit').prepend('<p class="checkout-err-msg">An error occurred. Please try again later.</p>');
	});
};