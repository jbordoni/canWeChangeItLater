function updateCountryDataOnFeatureChange(){

	updateCountryData("update");

}

function loadCountryData(){

	//songsListData

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

		//console.log(Object.keys(songsListData).length)
	    // do stuff with response.
	  }
	});

	//console.log(Object.keys(songsListData).length);

	/*d3.json("datasets/cumulativeCountryFeatureValuesPlain.json", function(error, data){

		for(var key in data){
			songsListData[key] = data[key];
		}
	}); */

}


function updateCountryData(typeOfCall){

	console.log("updating");
	console.log(Object.keys(songsListData).length);
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
		console.log(countryValues);

		if(typeOfCall=="initiate"){
					loadSVGInBubbleMap(countryValues, countryValuesList);
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