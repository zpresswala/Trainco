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
				$(this).hide();
			}
		});
	});
};

Catalog.prototype.countryToggle = function() {
	var _this = this;
	$('.country-toggle a').on('click', function(e) {
		e.preventDefault();
		var countryToShow = $(this).attr('data-country-sort');
		var elecItemCategoryActive = $('.current a').data('category');

		// sort items by country. NOTE: sorting electrical items is separate and in the function above.
		_this.$countryItem.each(function() {
			var countryOfItem = $(this).data('country');

			// if selected elec item category matches corresponding item's data attr, fade it in.
			if($(this).data('type') == elecItemCategoryActive && countryOfItem == countryToShow) {
				$(this).fadeIn('fast').css('display', 'inline-block');

				// if the electrical sort is on 'all', show those
			} else if(elecItemCategoryActive == 'all' && countryOfItem == countryToShow) {
				$(this).fadeIn('fast').css('display', 'inline-block');

				// fade in all the other items that aren't in the electrical category but match the country.
			} else if($(this).data('type') == undefined && countryOfItem == countryToShow) {
				$(this).fadeIn('fast').css('display', 'inline-block');
				
			// if no electrical items match, hide them.
			} else {
				console.log('fadeout')
				$(this).hide();
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