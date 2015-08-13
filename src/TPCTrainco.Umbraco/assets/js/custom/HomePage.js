'use strict';

function HomePage() {
	this.$overlay = $('.topic-circles .overlay-contain');

	this.showActiveSelection();
}

HomePage.prototype.showActiveSelection = function() {
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