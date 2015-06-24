'use strict';

function HomePage() {
	this.$overlay = $('.overlay-contain');

	this.showActiveSelection();
}

HomePage.prototype.showActiveSelection = function() {
	// console.log(this.$overlay);
	this.$overlay.on('click', function() { 
	    var $this = $(this);
	    if($this.hasClass('chosen')) {
	    	$this.removeClass('chosen');
	    }
	 	else {
	 		$this.addClass('chosen');
	 	}
	});
};