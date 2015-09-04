"use strict";function TPCApp(){var _this=this;this.$win=$(window),this.$aHref=$("a[href^=#]"),this.$page=$("html, body"),$(".carousel").carousel(),$(".catalog-top").length&&(this.catalog=new Catalog),this.homePage=new HomePage,$("#main-search").length&&(app.mainSearchSelect=new MainSearchSelect),$("#date-range-slider").length&&(this.datePicker=new DatePicker),$("#count").length&&(this.countUp=new CountUp(this.$win)),$(".share-btn-wrap").length&&$('[data-toggle="popover"]').popover({animation:!0,trigger:"click",html:!0}),$(".contact").length&&(this.register=new Register),$(".register-top").length&&(this.Checkout=new Checkout,$("#reg-submit").on("click",function(e){e.preventDefault();var formData=CreateFormPostString();CheckoutPost(formData)})),$(".register-two").length&&(this.CheckoutCustomer=new CheckoutCustomer),this.bindScroll();var isRetina=!1,mediaQuery="(-webkit-min-device-pixel-ratio: 1.5),\r\n	        (min--moz-device-pixel-ratio: 1.5),\r\n	        (-o-min-device-pixel-ratio: 3/2),\r\n	        (min-resolution: 1.5dppx)";if(window.devicePixelRatio>1&&(isRetina=!0),window.matchMedia&&window.matchMedia(mediaQuery).matches&&(isRetina=!0),this.animateCart(isRetina),this.retinaLogos(isRetina),this.$aHref.not(".add-to-cart").on("click",function(){_this.clickScrollTo()}),window.location.hash||$(".detail-page-app").length){void 0==app.mainSearchSelect&&(app.mainSearchSelect=new MainSearchSelect);var searchParams;searchParams=window.location.hash?app.mainSearchSelect.getHashSearchParams():app.mainSearchSelect.getSearchParams(),performSearch(searchParams)}$(".success").length&&app.cartNotifyView.clearCart(),$("#search-results").length&&$("body").css("background-color","#F9F9F9 !important"),$(".form-standard").length&&this.addClassToFormBtn(),"?homeref=1"==window.location.search&&_this.scrollToResults()}function Catalog(){this.$categorySelect=$(".elec-sort-category"),this.$sortItem=$(".electric .seminar-topic"),this.sortElectricItems()}function Checkout(){}function CreateFormPostString(){var $cart=$(".form-container"),cartGuid=$cart.data("cart"),attendeeList=[];$(".form-item-wrapper").each(function(){var seminarId=$(this).data("seminar");$(this).find(".reg-form").each(function(){var attendeeNum=$(this).find('input[name="attendee"]').val(),attendeeInc=$(this).find('input[name="attendeeInc"]').val(),firstName=$(this).find('input[name="firstname"]').val(),lastName=$(this).find('input[name="lastname"]').val(),title=$(this).find('input[name="title"]').val(),email=$(this).find('input[name="email"]').val(),attendeeItem={seminarId:seminarId,attendeeNum:attendeeNum,attendeeInc:attendeeInc,firstName:firstName,lastName:lastName,title:title,email:email};attendeeList.push(attendeeItem)})});var postData={cartGuid:cartGuid,checkoutItems:attendeeList};return postData}function CheckoutPost(checkoutData){$("#reg-submit").css("opacity",0),$(".checkout-loader").show(),$("input").next("span").remove(),$("input").css("border-color","#d7d7d7"),$.ajax({url:ApiDomain+"/api/checkout/submit",data:JSON.stringify(checkoutData),type:"POST",contentType:"application/json"}).done(function(successObj){var success=successObj.success,message=successObj.message;if($("#reg-submit").css("opacity",1),$(".checkout-loader").hide(),success)window.location.href="/register/info/";else if($(".checkout-err-msg").html(message),$(".checkout-err-msg").show(),successObj.invalidItems.length>0)for(var formElArray=successObj.invalidItems,i=0,l=formElArray.length;l>i;i++){var formEl=formElArray[i];$("#"+formEl.elementId).after("<span>"+formEl.message+"</span>"),$("#"+formEl.elementId).css("border-color","red")}}).fail(function(error){$("#reg-submit").css("opacity",1),$(".checkout-loader").hide(),$("#reg-submit").prepend('<p class="checkout-err-msg">An error occurred. Please try again later.</p>')})}function CheckoutCustomer(){this.$differentInfo=$("#supervisor-diff"),this.$differentInfoFields=$(".hidden-different-check"),this.$billingInfoText=$(".billing-info-desc"),this.$billingOptsSelect=$("#PaymentType"),this.$ccInfo=$(".cc-info"),this.$invoiceInfo=$(".invoice-info"),this.$billingDifferent=$("#BillingDifferent"),this.$promoWrap=$(".promo-wrap"),this.$hearAbout=$("#HearAbout"),this.$promoCode=$("#PromoCode"),this.$hearAboutOther=$("#HearAboutOther"),this.DisableSelectDropdowns(),this.showPromoField(),this.showOtherInfo(),this.billingOptions(),$("#BillFirstName").val()&&(this.$differentInfoFields.slideDown("fast"),this.$billingInfoText.addClass("hidden"),this.$billingDifferent.val("true"));var selectedOption=this.$billingOptsSelect.val();"credit"===selectedOption?(this.$ccInfo.show(),this.$invoiceInfo.hide(),this.$billingInfoText.addClass("hidden")):"invoice"===selectedOption&&(this.$ccInfo.hide(),this.$invoiceInfo.show(),this.$billingInfoText.addClass("hidden")),this.$promoWrap.hide(),this.$promoCode.hide(),this.$hearAboutOther.hide();var selectedOption2=this.$hearAbout.val();"Direct Mail"==selectedOption2||"Print Ad"===selectedOption2||"Email"===selectedOption2?(this.$promoWrap.show(),this.$promoCode.slideDown().addClass("showing")):("Other"==selectedOption2||"Referral"==selectedOption2)&&(this.$promoWrap.show(),this.$hearAboutOther.slideDown().addClass("showing"))}function CountUp($win){this.$win=$win,this.$numbers=$(".number-callout").find("h3"),this.endValuesArr=[],this.triggered=!1,this.$counterStartMarker=$("#js-counter-start"),this.getMaxVal(),this.resetVals(),console.log("hello, counting")}function DatePicker(){var _this=this,minDate=new Date;this.minMonth=minDate.getMonth();var minYear=minDate.getFullYear();minDate.setMonth(parseInt(this.minMonth)),minDate.setDate(parseInt("1")),minDate.setFullYear(parseInt(minYear));var monthOffset=15,maxDate=new Date;this.maxMonth=maxDate.getMonth();var maxYear=maxDate.getFullYear()+1;maxDate.setMonth(parseInt(this.maxMonth+monthOffset)),maxDate.setDate(parseInt("1")),maxDate.setFullYear(parseInt(maxYear));var maxRangeSelect=new Date,maxRangeMonth=maxRangeSelect.getMonth(),maxRangeYear=maxRangeSelect.getFullYear();maxRangeSelect.setMonth(parseInt(maxRangeMonth+3)),maxRangeSelect.setDate(parseInt("1")),maxRangeSelect.setFullYear(parseInt(maxRangeYear));var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];if($(window).width()<=700)var months=["J","F","M","A","M","J","J","A","S","O","N","D"];$("#date-range-slider").dateRangeSlider({bounds:{min:new Date(minDate),max:new Date(maxDate)},defaultValues:{min:new Date(minDate),max:new Date(maxRangeSelect)},valueLabels:"hide",step:{months:1},scales:[{first:function(value){return value},end:function(value){return value},next:function(value){var next=new Date(value);return new Date(next.setMonth(value.getMonth()+1))},label:function(value){var firstMonth=months[value.getMonth()];return"Jan"===firstMonth&&$(window).width()>=701?firstMonth+" "+value.getFullYear():months[value.getMonth()]},format:function(tickContainer,tickStart,tickEnd){tickContainer.addClass("month-label");var tickMonth=tickStart.getMonth(),jan=months[tickMonth];"Jan"===jan&&tickContainer.addClass("first")}}]}),$(window).width()>=700&&this.addYearLabel(),this.valuesChanged(this.minMonth,this.minMonth+4),setTimeout(function(){_this.fixWidth(),$(window).width()>=700&&_this.sizeHandle()},10)}function HomePage(){this.$overlay=$(".topic-circles .overlay-contain"),this.showActiveSelection()}function MainSearchSelect(){$("#main-search").select2({tags:!0,selectOnBlur:!0,maximumSelectionLength:1,dropdownAutoWidth:!0,placeholder:function(){$(this).data("placeholder")}}),window.location.hash||this.autofillLocation()}function OnSiteForm(){this.showPromoField()}function Register(){$("#supervisor-diff").length&&(this.$differentInfo=$("#supervisor-diff")),$("#mail-checkbox").length&&(this.$differentInfo=$("#mail-checkbox")),this.$differentInfoFields=$(".hidden-different-check"),this.$billingInfoText=$(".billing-info-desc"),this.$billingOptsSelect=$("#billing-opts"),this.$ccInfo=$(".cc-info"),this.$nextBtn=$(".next-btn"),this.$cvv=$("#cvv"),this.$nextBtn.bind("click",!1),this.showOtherInfo(),this.billingOptions()}window.app=window.app||{},TPCApp.prototype.bindScroll=function(){var _this=this;this.$win.on("scroll",function(){_this.handleWindowScroll()})},TPCApp.prototype.handleWindowScroll=function(){this.currentScrollTop=this.$win.scrollTop(),$("#count").length&&this.countUp.handleWindowScroll(this.currentScrollTop)},TPCApp.prototype.animateCart=function(retinaScreen){var _this=this;this.$carttab=$(".cart-tab"),this.$cartvis=$(".cart-visible"),this.$cartTopImg=$(".cart-top").find("img"),retinaScreen&&this.$carttab.find("img").attr("src","/images/icon-cart-retina.png").css({width:"32px",top:"-15px"}),this.$carttab.on("click",function(){$(".cart").slideToggle(300,function(){$(this).toggleClass("down"),retinaScreen?(_this.$cartvis.toggleClass("down").find("img").attr("src","/images/icon-cart-close-arrow-2x.png"),_this.$cartTopImg.attr("src","/images/icon-cart-retina.png").css({width:"32px"}),$(this).hasClass("down")||_this.$carttab.find("img").attr("src","/images/icon-cart-retina.png")):(_this.$cartvis.toggleClass("down").find("img").attr("src","/images/icon-cart-close-arrow.png"),$(this).hasClass("down")||(_this.$cartTopImg.attr("src","/images/icon-cart-tab.png"),_this.$carttab.find("img").attr("src","/images/icon-cart-tab.png")))})})},TPCApp.prototype.clickScrollTo=function(){var _this=this,offsetAmount=140,jump=function(e){if(console.log(e),e){e.preventDefault();var target=$($.attr(this,"href"))}else var target=location.hash;console.log(target,"suttfff"),_this.$page.animate({scrollTop:$(target).offset().top-offsetAmount},300,function(){location.hash=target})};location.hash&&setTimeout(function(){_this.$page.scrollTop(0),jump()},0),this.$aHref.on("click",jump)},TPCApp.prototype.retinaLogos=function(retinaScreen){retinaScreen?$("#logo").attr("src","/images/logo-trainco-2x.png").css("width","220px"):$("#logo").attr("src","/images/logo-trainco-1x.png")},TPCApp.prototype.addClassToFormBtn=function(){$(".form-standard").find(".btn").addClass("btn-reg").addClass("btn-blue-solid")},TPCApp.prototype.scrollToResults=function(){var _this=this;setTimeout(function(){_this.$page.animate({scrollTop:$("#search-btn").offset().top-80},300)},500)},Catalog.prototype.sortElectricItems=function(){var _this=this;this.$categorySelect.on("click",function(e){e.preventDefault(),_this.$categorySelect.parent().removeClass("current");var $target=$(e.target),filterVal=$(this).data("category");"all"==filterVal?(_this.$sortItem.fadeIn("fast").css("display","inline-block"),$target.parent().addClass("current")):_this.$sortItem.each(function(){$(this).data("type")!==filterVal?$(this).fadeOut("fast"):($(this).fadeIn("fast").css("display","inline-block"),$target.parent().addClass("current"))})})},CheckoutCustomer.prototype.DisableSelectDropdowns=function(){$("select option:first-child").attr("disabled","disabled")},CheckoutCustomer.prototype.showOtherInfo=function(){var _this=this;_this.$differentInfo.on("change",function(){$(this).is(":checked")?(_this.$differentInfoFields.slideDown("fast"),_this.$billingInfoText.addClass("hidden"),_this.$billingDifferent.val("true")):(_this.$differentInfoFields.slideUp("fast"),_this.$billingInfoText.removeClass("hidden"),_this.$billingDifferent.val("false"))})},CheckoutCustomer.prototype.showPromoField=function(){var _this=this;_this.$hearAbout.on("change",function(){var selectedOption=_this.$hearAbout.val();_this.$promoWrap.hide(),_this.$promoCode.hide(),_this.$hearAboutOther.hide(),"Direct Mail"==selectedOption||"Print Ad"===selectedOption||"Email"===selectedOption?(_this.$promoWrap.show(),_this.$promoCode.slideDown().addClass("showing")):("Other"==selectedOption||"Referral"==selectedOption)&&(_this.$promoWrap.show(),_this.$hearAboutOther.slideDown().addClass("showing"))})},CheckoutCustomer.prototype.billingOptions=function(){var _this=this;_this.$billingOptsSelect.on("change",function(){var selectedOption=$("#PaymentType").val();"credit"===selectedOption?(_this.$ccInfo.slideDown("fast"),_this.$billingInfoText.addClass("hidden")):(_this.$ccInfo.slideUp("fast"),_this.$billingInfoText.removeClass("hidden"))}),$(".cvv-text").on("click",function(){$(this).find("span").toggleClass("showing")})},CountUp.prototype.getMaxVal=function(){var _this=this;$(".number-callout").find("h3").each(function(index){var number=parseInt($(this).data("value").toString().replace(/\D/g,""));_this.endValuesArr.push(number)})},CountUp.prototype.resetVals=function(){this.$numbers[0].innerHTML="-",this.$numbers[1].innerHTML="-",this.$numbers[2].innerHTML="-"},CountUp.prototype.startCounter=function(){function increase(){var max=_this.endValuesArr[indx];startNum++,_this.$numbers[indx].innerHTML=0===indx?startNum+"K+":2===indx?startNum+"+":startNum+"K+",startNum===max&&(indx++,numOfCalls++,startNum=0,clearInterval(inter),maxInt>=indx&&(inter=setInterval(increase,6))),3==numOfCalls&&window.clearInterval(inter)}var inter,_this=this,maxInt=this.endValuesArr.length,indx=0,startNum=0,numOfCalls=0;inter=setInterval(increase,6)},CountUp.prototype.handleWindowScroll=function(currentScrollTop){var _this=this;this.currentScrollTop=currentScrollTop,this.$counterStartMarker.offset().top.toFixed(0)<=this.currentScrollTop&&(_this.triggered=!0),_this.triggered&&(this.startCounter(),this.$win.off("scroll"))},DatePicker.prototype.addYearLabel=function(){$(".first").css({"line-height":1.27,marginTop:"-7px",position:"relative",top:"8px",height:"42px"}).find(".ui-ruler-tick-label").css({display:"inline-block",width:"84%"})},DatePicker.prototype.sizeHandle=function(){var monthWidth=$($(".ui-ruler-tick-inner")[0]).outerWidth();$(".ui-rangeSlider-handle").css("width",monthWidth+"px")},DatePicker.prototype.valuesChanged=function(startMonth,endMonth){var rHandle=$(".ui-rangeSlider-rightHandle"),lHandle=$(".ui-rangeSlider-leftHandle"),months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEPT","OCT","NOV","DEC"];rHandle.text(months[this.minMonth+2]),lHandle.text(months[this.maxMonth]),$("#date-range-slider").on("valuesChanged",function(e,data){var minMonth=new Date(data.values.min),maxMonth=new Date(data.values.max);maxMonth.setDate(maxMonth.getDate()-1),minMonth.setDate(minMonth.getDate()),console.log(minMonth,maxMonth);var maxMonthAbbr=months[maxMonth.getMonth()],minMonthAbbr=months[minMonth.getMonth()];rHandle.text(maxMonthAbbr),lHandle.text(minMonthAbbr)})},DatePicker.prototype.fixWidth=function(){var containerWidth=$(".ui-rangeSlider-container").width();$(".ui-rangeSlider-innerBar").css("width",containerWidth+"px")},HomePage.prototype.showActiveSelection=function(){Modernizr.touch?this.$overlay.on("touchstart",function(){var $this=$(this);$this.hasClass("chosen")?$this.removeClass("chosen"):$this.addClass("chosen")}):this.$overlay.on("click",function(){var $this=$(this);$this.hasClass("chosen")?$this.removeClass("chosen"):$this.addClass("chosen")})},window.app=window.app||{},MainSearchSelect.prototype.getSearchParams=function(){var topicsArray=[],classId=0,searchLocationVal=$("#main-search").select2("val");if($('.secondary-search[data-classid!=""][data-classid]')&&(classId=$(".secondary-search").data("classid")),null==searchLocationVal)return $(".empty-location-msg").fadeIn(150).delay(200).fadeTo(150,.5).delay(150).fadeTo(150,1).delay(200).fadeTo(150,.5).delay(150).fadeTo(150,1).delay(200).fadeTo(150,.5).delay(150).fadeTo(150,1),$(".class-loader").fadeOut(150),!1;var location=$("#main-search").select2("val").toString();$(".empty-location-msg").fadeOut(150),$(".chosen").each(function(){var selectedTopic=$(this).data("topic");"all"===selectedTopic?topicsArray.push("electrical","management","hvac","mechanical"):topicsArray.push(selectedTopic)}),0==topicsArray.length&&topicsArray.push("electrical","management","hvac","mechanical");var dateValues=$("#date-range-slider").dateRangeSlider("values"),minDate=new Date(dateValues.min),minMonth=minDate.getMonth()+1,minYear=minDate.getFullYear(),maxDate=new Date(dateValues.max),maxMonth=maxDate.getMonth()+1,maxYear=maxDate.getFullYear();return this.updateHashBang(location,topicsArray,minMonth+"/"+minYear,maxMonth+"/"+maxYear),app.resStringified=this.generateJsonSearchString(location,topicsArray,classId,minMonth,minYear,maxMonth,maxYear),app.resStringified},MainSearchSelect.prototype.getHashSearchParams=function(){var hashArray=this.processHashBang();if(hashArray.hasOwnProperty("loc")||hashArray.hasOwnProperty("topics")){$(".detail-page-app").show();var topicsArray=[],classId=0,location="";topicsArray=hashArray.topics.split(","),location=unescape(hashArray.loc),this.autofillLocation(location);var minDate=hashArray.dMin.split("/"),minMonth=minDate[0],minYear=minDate[1],maxDate=hashArray.dMax.split("/"),maxMonth=maxDate[0],maxYear=maxDate[1],minDateObj=new Date(parseInt(minYear),parseInt(minMonth)-1),maxDateObj=new Date(parseInt(maxYear),parseInt(maxMonth)-1);if($(document).ready(function(){$("#date-range-slider").dateRangeSlider("values",minDateObj,maxDateObj)}),void 0!=topicsArray&&4==topicsArray.length)$('.overlay-contain[data-topic="all"]').addClass("chosen");else for(var i in topicsArray)$('.overlay-contain[data-topic="'+topicsArray[i]+'"]').addClass("chosen");return $('.secondary-search[data-classid!=""][data-classid]')&&(classId=parseInt($(".secondary-search").data("classid"))),app.resStringified=this.generateJsonSearchString(location,topicsArray,classId,minMonth,minYear,maxMonth,maxYear),app.resStringified}return $(".detail-page-app").hide(),!1},MainSearchSelect.prototype.generateJsonSearchString=function(location,topicsArray,classId,minMonth,minYear,maxMonth,maxYear){var returnJson,searchResults,minMonthYear={minMonthVal:minMonth,minYearVal:minYear},maxMonthYear={maxMonthVal:maxMonth,maxYearVal:maxYear},selectedDates={min:minMonthYear,max:maxMonthYear};return searchResults=classId>0?{location:location,classId:classId,dates:selectedDates}:{location:location,classTopics:topicsArray,dates:selectedDates},returnJson=JSON.stringify(searchResults)},MainSearchSelect.prototype.autofillLocation=function(urlLocation){if(urlLocation)$("#main-search").prepend('<option value="'+urlLocation+'" selected>'+urlLocation+"</option>").trigger("change");else{var visitorLocation=$("#main-search").data("location");if("undefined"==visitorLocation||""==visitorLocation)return!1;$("#main-search").prepend('<option value="'+visitorLocation+'" selected>'+visitorLocation+"</option>").trigger("change")}},MainSearchSelect.prototype.processHashBang=function(){for(var url=window.location.href,vars={},hashes=url.slice(url.indexOf("#")+1).split("&"),i=0;i<hashes.length;i++){var hash=hashes[i].split("=");vars[hash[0]]=hash.length>1?hash[1]:null}return vars},MainSearchSelect.prototype.updateHashBang=function(location,topics,dateMin,dateMax){var hashStr="loc="+(escape(location)||"")+"&topics="+(topics.toString()||"")+"&dMin="+(dateMin||"")+"&dMax="+(dateMax||"");window.location.hash=hashStr},MainSearchSelect.prototype.detailPageSearch=function(){var classLocation=$("#main-search").data("location"),classIdSearched=$(".secondary-search").data("classid");return{location:classLocation,classId:classIdSearched}},OnSiteForm.prototype.showPromoField=function(){var hearSelect=document.getElementById("hear"),promoField=document.querySelectorAll(".promo-wrap");hearSelect.addEventListener("change",function(){var selectedOpt=this.options[this.selectedIndex].text;"Direct Mail"===selectedOpt||"Print Ad"===selectedOpt||"Email"===selectedOpt?$(promoField).slideDown().addClass("showing"):"Other"===selectedOpt||($(promoField).hasClass("showing")?$(promoField).slideUp():$(promoField).css("display","none"))})},Register.prototype.showOtherInfo=function(){var _this=this;this.$differentInfo.on("change",function(){$(this).is(":checked")?(_this.$differentInfoFields.slideDown("fast"),_this.$billingInfoText.addClass("hidden")):(_this.$differentInfoFields.slideUp("fast"),_this.$billingInfoText.removeClass("hidden"))})},Register.prototype.billingOptions=function(){var _this=this;_this.$nextBtn.unbind("click",!1).addClass("disabled"),this.$billingOptsSelect.on("change",function(){var selectedOption=$("#billing-opts").val();"credit"===selectedOption?(_this.$nextBtn.unbind("click",!1).addClass("disabled"),_this.$ccInfo.slideDown("fast"),_this.$billingInfoText.addClass("hidden"),_this.$cvv.on("change",function(){_this.$cvv.val()?_this.$nextBtn.bind("click",!1).removeClass("disabled"):_this.$nextBtn.unbind("click",!1).addClass("disabled")})):(_this.$nextBtn.unbind("click",!1),_this.$ccInfo.slideUp("fast"),_this.$billingInfoText.removeClass("hidden"),_this.$nextBtn.bind("click",!1).removeClass("disabled"))}),$(".cvv-text").on("click",function(){$(this).find("span").toggleClass("showing")})};