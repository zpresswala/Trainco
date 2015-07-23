'use strict';

function MainSearchSelect() {

	var sampleArray = [
						{	
							id: 0,
							text:'enhancement'
						}, 

						{	
							id:1,
							text:'bug'
						},
						{
							id:2,
							text:'duplicate'
						},
						{
							id:3,
							text:'invalid'
						},
	                    {
	                    	id:4,
	                    	text:'wontfix'
	                    }
	                ];


	$('#main-search').select2({
		data:sampleArray,
		tags: true,	
		selectOnBlur: true,
		maximumSelectionLength: 1,
		dropdownAutoWidth: true,

		placeholder: function() {
			$(this).data('placeholder');
		},


		
		// createSearchChoice:function(term, data) {
		// 	alert('hi')
		// 	console.log(term, data);
		// 	// if ($(data).filter(function() { 
		// 	// 	return this.text.localeCompare(term)===0; }).length===0) {
		// 	// 	return {
		// 	// 		id:term, text:term
		// 	// 	};
		// 	// } 

		// 	if ($(data).filter(function() {
		// 	      return this.text.localeCompare(term)===0;
		// 	    }).length===0) {
		// 	      return {id:term, text:term};
		// 	    }
		// },
		
		// createSearchChoicePosition: function(list, item) {
		// 	alert('stuff')
		// 	list.splice(1, 0, item);
		// }
	});
	// .on('change', function(e) {
		// var isNew = $(this).find('[data-select2-tag="true"]');
		// if(isNew.length){
		// 	isNew.replaceWith('<option class="selected value="'+isNew.val()+'">'+isNew.val()+'</option>');
		// }
	// });
};