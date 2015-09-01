
$('#reg-submit').on('click', function (e) {
	e.preventDefault();

	var checkout = new Checkout();

	var formData = checkout.CreateFormPostString();
	console.log(JSON.stringify(formData));

	CheckoutPost(formData);
});

function CheckoutPost(checkoutData) {
	console.log()

	$('#reg-submit').hide();
	$('.checkout-loader').show();

	$('input').next('span').remove();
	$('input').css('border-color', '#d7d7d7');

	$.ajax({
		url: ApiDomain + '/api/checkout/submit',
		data: JSON.stringify(checkoutData),
		type: "POST",
		contentType: "application/json"
	}).done(function (successObj) {
		console.log(successObj);

		var success = successObj.success;
		var message = successObj.message;

		$('#reg-submit').show();
		$('.checkout-loader').hide();

		if (success) {
			window.location.href = '/register/info/';
		}
		else {
			// There was a problem with the form.
			$('.checkout-err-msg').html(message);
			$('.checkout-err-msg').show();

			if (successObj.invalidItems.length > 0) {
				var formElArray = successObj.invalidItems;

				for (var i = 0, l = formElArray.length; i < l; i++) {
					var formEl = formElArray[i];

					$('#' + formEl.elementId).after('<span>' + formEl.message + '</span>');
					$('#' + formEl.elementId).css('border-color', 'red');
				}
			}

		}
	}).fail(function (error) {
		$('#reg-submit').show();
		$('.checkout-loader').hide();
		$('#reg-submit').prepend('<p class="checkout-err-msg">An error occurred. Please try again later.</p>');
	});
};