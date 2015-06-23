'use strict';

function HomePage() {
	this.$overlay = $('.overlay');

	this.showActiveSelection();
}

HomePage.prototype.showActiveSelection = function() {
	// console.log(this.$overlay);
	// $('.seminar-topic').click(function() { 
	//     var $ths = $(this);
	//     if($ths.hasClass('chosen'))
	//         $ths.removeClass('chosen');
	//     else
	//         $ths.addClass('chosen-click');
	// }).mouseleave(function() {
	// 	if(!$(this).hasClass('chosen-click')) {
	// 		$(this).removeClass('chosen');
	// 	}
	// }).mouseenter(function() { 
	//     $(this).addClass('chosen');
	// });
};