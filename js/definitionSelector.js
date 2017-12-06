var definitions = [];



definitions["Valence"] = " describes whether something is likely to make someone feel happy (positive valence) or sad (negative valence).";
definitions["Energy"] = " is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.";
definitions["Liveness"] = " detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.";
definitions["Tempo"] = " is the overall estimated tempo of a track in beats per minute (BPM).";
definitions["Speechiness"] = " detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value.";
definitions["Acousticness"] = " is the confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.";
definitions["Danceability"] = " describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.";
definitions["Loudness"] = " is the overall loudness of a track in decibels (dB)."

$("#dropDownAudioFeatures").change(function(){
	//console.log("GOT HERE");
	var thisvalue = $(this).find("option:selected").text();
	var definition = definitions[thisvalue];
	//bubble_map_definition
	$("#currently_selected_bubble").html(thisvalue);
	$("#bubble_map_definition").html("<strong>"+ thisvalue + "</strong>" + definition);
});

$("#xdropdownScatter").change(function(){
	//console.log("GOT HERE");
	var thisvalue = $(this).find("option:selected").text();
	var definition = definitions[thisvalue];
	//bubble_map_definition
	$("#scatterplot_x_definition").html("<strong>"+ thisvalue + "</strong>" + definition);
});

$("#colordropdownScatter").change(function(){
	//console.log("GOT HERE");
	var thisvalue = $(this).find("option:selected").text();
	if (thisvalue == "None"){
		$("#scatterplot_color_definition").html("");
	}
	else {
		var definition = definitions[thisvalue];
		//bubble_map_definition
		$("#scatterplot_color_definition").html("<strong>"+ thisvalue + "</strong>" + definition);
	}
});