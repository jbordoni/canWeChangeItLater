function updateCountryDataOnFeatureChange(){

	updateCountryData("update");

}

function loadCountryData(){

	//songsListData
	//load up data synchronously 

	$.ajax({
	  url: 'datasets/cumulativeCountryFeatureValuesPlain.json',
	  async: false,
	  dataType: 'json',
	  success: function (response) {
	  	//console.log(response.length);
	  	for(var key in response){
	  		if(response.hasOwnProperty(key)){
				songsListData[key] = response[key];
			}
		}
	  }
	});

	$.ajax({
	  url: 'datasets/combinedData.json',
	  async: false,
	  dataType: 'json',
	  success: function (response) {
	  	//console.log(response.length);
	  	for(var key in response){
	  		if(response.hasOwnProperty(key)){
				weeklyCharts[key] = response[key];
			}
		}
	  }
	});


	$.ajax({
	  url: 'datasets/audioFeaturesHashMap.json',
	  async: false,
	  dataType: 'json',
	  success: function (response) {
	  	//console.log(response.length);
	  	for(var key in response){
	  		if(response.hasOwnProperty(key)){
				audioFeaturesMapGlobal[key] = response[key];
			}
		}
	  }
	});
	console.log("Data loaded");
}

function filterSongsByCountry(){
	if(globalCountryCode==""){
		return;
	}
	console.log("Filtering by country");
	let countryCode = globalCountryCode; 
	let startMonthNo = startMonthNoGlobal; 
	let endMonthNo = endMonthNoGlobal;

	let startMonthNoChart = globalWeekMap[startMonthNo];
	let endMonthNoChart = globalWeekMap[endMonthNo];

	let weeklyChartsList = weeklyCharts[countryCode];

	let hmap = {}; 

	for(var i=startMonthNoChart; i<=endMonthNoChart; i++){
		let weekChart = weeklyChartsList[i];
		//console.log(weekChart.length)
		//return;

		for(var song in weekChart){
			if(weekChart.hasOwnProperty(song)){
				if(!(song in hmap)){
					if(song in audioFeaturesMapGlobal)
					{
						let obj = $.extend(true, {}, audioFeaturesMapGlobal[song])
						obj['weeksOnCharts'] = 1;
						obj['songName'] = weekChart[song]['songName'];
						obj['artistName'] = weekChart[song]['artistName'];
						hmap[song] = obj;
					}

				}
				else{
					hmap[song]['weeksOnCharts'] = hmap[song]['weeksOnCharts']+1
				}
			}
		}
	}

	console.log(Object.keys(hmap).length);
	//console.log(hmap);
	updateAudioScatter(hmap);

	//let selectedFeatureX = document.getElementById("xdropdownScatter").value;
	//let selectedFeatureXText = document.getElementById("xdropdownScatter").innerHTML; 



}

function updateCountryData(typeOfCall){

	//console.log("updating");
	//return;

	let startMonthNo = startMonthNoGlobal; 
	let endMonthNo = endMonthNoGlobal;

	let startMonthNoChart = globalWeekMap[startMonthNo];
	let endMonthNoChart = globalWeekMap[endMonthNo];

	let selectedFeature = document.getElementById('dropDownAudioFeatures').value;
		let meanList = []
		let newmap = []

		for(var country in songsListData){

			let obj = songsListData[country][startMonthNo][endMonthNo][selectedFeature];
			let mean = obj['valueMean']; 
			newmap[country] = mean; 
			meanList.push(mean);
		}
		let countryValues = newmap; 
		let countryValuesList = meanList;
		//console.log(countryValues);

		if(typeOfCall=="initiate"){
			loadSVGInBubbleMap(countryValues, countryValuesList);
			//loadSVGInAudioScatter();
		}
		else if(typeOfCall=="update"){
			updateBubbleMapData(countryValues, countryValuesList);
		}

	/*d3.json("datasets/cumulativeCountryFeatureValuesPlain.json", function(error, songsListData){
		console.log("read data");
		//let obj = songsListData
		let selectedFeature = document.getElementById('dropDownAudioFeatures').value;
		let meanList = []
		let newmap = []

		for(var country in songsListData){

			let obj = songsListData[country][startMonthNo][endMonthNo][selectedFeature];
			let mean = obj['valueMean']; 
			newmap[country] = mean; 
			meanList.push(mean);
		}
		let countryValues = newmap; 
		let countryValuesList = meanList;
		console.log("done");

		if(typeOfCall=="initiate"){
					loadSVGInBubbleMap(countryValues, countryValuesList);
		}
		else if(typeOfCall=="update"){
			updateBubbleMapData(countryValues, countryValuesList);
		}
	})*/

	// console.log("Updating data by week");

	// d3.json("datasets/combinedData.json", function(error, songsListData){                  
 //              d3.json("datasets/audioFeaturesHashMap.json", function(error2, audioFeaturesData){
 //              	//console.log(weeksData==null);
 //              	//console.log(audioFeaturesData==null);
 //              	//audioFeaturesScatter.populateDiv(divID, weeksData, audioFeaturesData, xAxisProperty, xAxisPropertyText,  colorProperty, colorPropertyText);
 //              	//showBubbleMap(rawdata, songsListData, audioFeaturesData);

 //              	var selectedFeature = document.getElementById('dropDownAudioFeatures').value;
	// 			//console.log(selectedFeature);
	// 			let nodeIdx = document.getElementById('dropDownAudioFeatures').selectedIndex;
	// 			//console.log(nodeIdx);
	// 			let selectedFeatureText = document.getElementById('dropDownAudioFeatures')[nodeIdx].innerHTML;

	// 			countryValues = {}
	// 			countryValuesList = [];
	// 			for(var key in songsListData){
	// 				if(songsListData.hasOwnProperty(key)){
	// 					//console.log(key);
	// 					//return
	// 					let songsList = songsListData[key];
	// 					//console.log(songsList.length);

	// 					countryMap = {};
	// 					countryMapValues = [];
	// 					countryMapValuesSum = 0.0; 

	// 					for(var weekIdx=startMonthNoChart; weekIdx<=endMonthNoChart; weekIdx++){
	// 						let weeklyList = songsList[weekIdx]
	// 						for(var songKey in weeklyList){
	// 							if(weeklyList.hasOwnProperty(songKey)){
	// 								if(!(songKey in countryMap)){
	// 									countryMap[songKey] = 1
	// 									if(songKey in audioFeaturesData)
	// 									{
	// 										if(audioFeaturesData[songKey][selectedFeature]!=undefined||
	// 											audioFeaturesData[songKey][selectedFeature]!=null){

	// 											countryMapValuesSum+= audioFeaturesData[songKey][selectedFeature];
	// 											countryMapValues.push(audioFeaturesData[songKey][selectedFeature]);								
	// 										}
	// 									}
										
	// 								}
	// 							}
	// 						}
	// 					}

	// 					countryMean = countryMapValuesSum/countryMapValues.length;
	// 					countryValues[key] = countryMean*1000; 
	// 					countryValuesList.push(countryMean*1000)
	// 				}	
	// 			}

	// 			//console.log(countryValues);
	// 			if(typeOfCall=="initiate"){
	// 				loadSVGInBubbleMap(countryValues, countryValuesList);
	// 			}
	// 			else if(typeOfCall=="update"){
	// 				updateBubbleMapData(countryValues, countryValuesList);
	// 			}
 //            });
 //        });
	
}