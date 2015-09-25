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
		_this.$categorySelect.parent().removeClass('current');
		var $target = $(e.target);
		var filterVal = $(this).data('category');
		if(filterVal == 'all') {
			_this.$sortItem.fadeIn('fast').css('display', 'inline-block');
			$target.parent().addClass('current');
		} else {
			_this.$sortItem.each(function() {
				if($(this).data('type') !== filterVal) {
					$(this).fadeOut('fast');
				} else {
					$(this).fadeIn('fast').css('display', 'inline-block');
					$target.parent().addClass('current');
				}
			});
		}
	});
};

Catalog.prototype.countryToggle = function() {
	var _this = this;
	$('.country-toggle a').on('click', function(e) {
		e.preventDefault();
		var countryToShow = $(this).data('country-sort');
		
		// sort items by country
		_this.$countryItem.each(function() {
			if($(this).data('country') !== countryToShow) {
				$(this).fadeOut('fast');
			} else {
				$(this).fadeIn('fast').css('display', 'inline-block');
			}
		});

		// change toggle appearance and text
		if(!$(this).hasClass('usa')) {
			$(this).fadeOut(50, function() {

				// change to usa w/flag and data attr
				$(this).fadeIn(50).addClass('usa').html('<img src="/assets/images/icon-us-flag.png" class="flag-icon" /> Click to view U.S. seminars');
				$(this).data('country-sort', 'us');
			});
		} else {
			$(this).fadeOut(50, function() {

				// change to canada
				$(this).removeClass('usa').fadeIn(50).html('<img src="/assets/images/icon-canada-flag.png" class="flag-icon" /> Click to view Canadian seminars');
				$(this).data('country-sort', 'ca');	
			});
		}
	});
};