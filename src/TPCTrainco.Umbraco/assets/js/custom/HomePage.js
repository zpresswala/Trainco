'use strict';

function HomePage() {
	this.$overlay = $('.topic-circles .overlay-contain');

	this.showActiveSelection();
}

HomePage.prototype.showActiveSelection = function() {
	if(Modernizr.touch) {
		this.$overlay.on('touchstart', function() {
		    var $this = $(this);
		    if($this.hasClass('chosen')) {
		    	$this.removeClass('chosen').addClass('touch');
		    }
		 	else {
		 		$this.addClass('chosen').removeClass('touch');
		 	}
		});
	} else {
		this.$overlay.on('click', function() { 
		    var $this = $(this);
		    if($this.hasClass('chosen')) {
		    	$this.removeClass('chosen');
		    }
		 	else {
		 		$this.addClass('chosen');
		 	}
		});
	}
};