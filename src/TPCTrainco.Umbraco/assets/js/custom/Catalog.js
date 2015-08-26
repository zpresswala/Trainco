'use strict';

function Catalog() {

	// the electrical sort item menu
	this.$categorySelect = $('.elec-sort-category');

	// items to hide/show
	this.$sortItem = $('.electric .seminar-topic');

	this.sortElectricItems();
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