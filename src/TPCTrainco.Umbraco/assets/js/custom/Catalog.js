'use strict';

function Catalog() {

	// the electrical sort item menu
	this.$categorySelect = $('.elec-sort-category');

	// items to hide/show
	this.$sortItem = $('.electric .seminar-topic');

	// us/canada items to hide/show
	this.$countryItem = $('.seminar-topic');

	this.sortElectricItems();
	this.countryToggle();
}

Catalog.prototype.sortElectricItems = function() {
	var _this = this;
	this.$categorySelect.on('click', function(e) {
		e.preventDefault();

		// button data attr
		var activeCountry = $('.country-toggle a').data('active-country');
		_this.$categorySelect.parent().removeClass('current');
		var $target = $(e.target);
		var filterVal = $(this).data('category');
		

			_this.$sortItem.each(function() {
			
			// if all, and appropriate country, fade in
			if(filterVal == 'all' && $(this).data('country') == activeCountry) {
				$(this).fadeIn('fast').css('display', 'inline-block');
				$target.parent().addClass('current');

				// if a certain sort link, and country matches, fade in
			} else if($(this).data('type') == filterVal && $(this).data('country') == activeCountry) {
				$(this).fadeIn('fast').css('display', 'inline-block');
				$target.parent().addClass('current');

				// else fade out everything remaining
			} else {
				$(this).fadeOut('fast');
			}
		});
	});
};

Catalog.prototype.countryToggle = function() {
	var _this = this;
	$('.country-toggle a').on('click', function(e) {
		e.preventDefault();
		var countryToShow = $(this).attr('data-country-sort');

		
		// sort items by country
		_this.$countryItem.each(function() {
			if($(this).data('country') !== countryToShow) {
				$(this).fadeOut('fast');
			} else {
				$(this).fadeIn('fast').css('display', 'inline-block');
			}
		});

		// change toggle appearance and text
		if(countryToShow == ('ca')) {
			$(this).fadeOut(50, function() {

				// change to usa w/flag and data attr
				$(this).fadeIn(50).html('<img src="/images/icon-us-flag.png" class="flag-icon" /> Click to view U.S. seminars');
				$(this).attr('data-country-sort', 'us').data('active-country', 'ca');
			});
		} else {
			$(this).fadeOut(50, function() {

				// change to canada
				$(this).fadeIn(50).html('<img src="/images/icon-canada-flag.png" class="flag-icon" /> Click to view Canadian seminars');
				$(this).attr('data-country-sort', 'ca').data('active-country', 'us');	
			});
		}
	});
};