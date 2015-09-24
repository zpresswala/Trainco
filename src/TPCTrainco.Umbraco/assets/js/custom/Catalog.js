'use strict';

function Catalog() {

	// the electrical sort item menu
	this.$categorySelect = $('.elec-sort-category');

	// items to hide/show
	this.$sortItem = $('.electric .seminar-topic');

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
	$('.country-toggle a').on('click', function() {
		if(!$(this).hasClass('usa')) {
			$(this).fadeOut(50, function() {
				$(this).fadeIn(50).addClass('usa').html('<img src="/assets/images/icon-us-flag.png" class="flag-icon" /> Click to view U.S. seminars');				
			});
		} else {
			$(this).fadeOut(50, function() {
				$(this).removeClass('usa').fadeIn(50).html('<img src="/assets/images/icon-canada-flag.png" class="flag-icon" /> Click to view Canadian seminars');				
			});
		}
	});
};