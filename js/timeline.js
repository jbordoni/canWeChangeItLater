function initiateTimelineSlider(){

	let value1 = 1;
	let value2 = 10; 
    startMonthNoGlobal = 1; 
    endMonthNoGlobal = 10;
    updateCountryData("initiate");
    loadSVGInAudioScatter();
    //update

	//console.log("Setting up timeline");
	$( "#slider-range" ).slider({
      orientation: "vertical",
      range: true,
      min:1, 
      max:10,
      values: [value1, value2], //set initial values
      slide: function( event, ui ) {
        //$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        //console.log(ui.values[0], ui.values[1]);
        showHighlightedValues(ui.values[0], ui.values[1]);
        startMonthNoGlobal = ui.values[0];
        endMonthNoGlobal = ui.values[1];
        updateCountryData("update");
      }
    });

    var monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
    'August', 'September', 'October'];
    monthOptions.reverse();

    let sliderHeight = document.getElementById("slider-range").offsetHeight+20; 
    let sliderPosition = document.getElementById("slider-range").getBoundingClientRect();
    let sliderTop = sliderPosition.top;
    let spacing = sliderHeight/monthOptions.length; 

    let initialPos = sliderTop;
    //console.log(sliderTop);

    for(var i=0; i<monthOptions.length; i++){
    	let monthText = monthOptions[i];
    	let monthSpan = document.createElement("span");
    	monthSpan.innerHTML = monthText;
    	monthSpan.style.position = "absolute";
    	monthSpan.style.top = initialPos+"px"; 
    	monthSpan.id = "monthLabel_"+(monthOptions.length-i);
    	monthSpan.classList.add("monthLabel");
    	if(monthOptions.length-i==value1 || monthOptions.length-i==value2){
    		monthSpan.classList.add("bold");
    	}
    	else{
    		monthSpan.classList.add("normal");
    	}

    	let containerDiv = document.getElementById("sliderLabelsWrapper");
    	containerDiv.append(monthSpan);
    	//containerDiv.append(breakLine);


    	initialPos+=spacing;

    }
}

function showHighlightedValues(value1, value2){

	//$("span.bold")

	$(".monthLabel").each(function(){
		//console.log(this.id);
		if(this.classList.contains("bold")){
			this.classList.remove("bold");
			this.classList.add("normal");
		}
	})

	let spanReqd1 = document.getElementById("monthLabel_"+value1);
	spanReqd1.classList.add("bold");

	let spanReqd2 = document.getElementById("monthLabel_"+value2);
	spanReqd2.classList.add("bold");

}