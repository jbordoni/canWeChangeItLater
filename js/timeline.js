function initiateTimelineSlider(){

	//console.log("Setting up timeline");
	$( "#slider-range" ).slider({
      orientation: "vertical",
      range: true,
      min:1, 
      max:12,
      values: [1, 12], //set initial values
      slide: function( event, ui ) {
        //$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        console.log(ui.values[0], ui.values[1]);
      }
    });

    var monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
    'August', 'September', 'October', 'November', 'December'];

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

    	let containerDiv = document.getElementById("sliderLabelsWrapper");
    	containerDiv.append(monthSpan);
    	//containerDiv.append(breakLine);


    	initialPos+=spacing;

    }

}