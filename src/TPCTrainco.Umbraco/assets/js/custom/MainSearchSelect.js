'use strict';

function MainSearchSelect() {

	// $.fn.select2.defaults.set("theme", "classic");

	var sampleArray = [{id:0,text:'enhancement'}, {id:1,text:'bug'}
	                       ,{id:2,text:'duplicate'},{id:3,text:'invalid'}
	                       ,{id:4,text:'wontfix'}]


	$('#main-search').select2({

		tags: true,
		tokenSeparators: [',', ' '],
		data:sampleArray,
		// minimumResultsForSearch: -1,
		selectOnBlur: true,
		maximumSelectionLength: 1,
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
	})
	.on('change', function(e) {
		var isNew = $(this).find('[data-select2-tag="true"]');
		console.log(isNew)
		if(isNew.length){
			isNew.replaceWith('<option class="user-added" selected value="'+isNew.val()+'">'+isNew.val()+'</option>');
		}
	});
};