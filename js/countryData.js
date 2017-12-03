function updateCountryDataOnFeatureChange(){

	updateCountryData("update");

}


function updateCountryData(typeOfCall){

	let startMonthNo = startMonthNoGlobal; 
	let endMonthNo = endMonthNoGlobal;

	//console.log("Updating data by week");

	d3.json("datasets/combinedData.json", function(error, songsListData){                  
              d3.json("datasets/audioFeaturesHashMap.json", function(error2, audioFeaturesData){
              	//console.log(weeksData==null);
              	//console.log(audioFeaturesData==null);
              	//audioFeaturesScatter.populateDiv(divID, weeksData, audioFeaturesData, xAxisProperty, xAxisPropertyText,  colorProperty, colorPropertyText);
              	//showBubbleMap(rawdata, songsListData, audioFeaturesData);

              	var selectedFeature = document.getElementById('dropDownAudioFeatures').value;
				//console.log(selectedFeature);
				let nodeIdx = document.getElementById('dropDownAudioFeatures').selectedIndex;
				//console.log(nodeIdx);
				let selectedFeatureText = document.getElementById('dropDownAudioFeatures')[nodeIdx].innerHTML;

				countryValues = {}
				countryValuesList = [];
				for(var key in songsListData){
					if(songsListData.hasOwnProperty(key)){
						//console.log(key);
						//return
						let songsList = songsListData[key];
						//console.log(songsList.length);

						countryMap = {};
						countryMapValues = [];
						countryMapValuesSum = 0.0; 

						for(var weekIdx=startMonthNo; weekIdx<=endMonthNo; weekIdx++){
							let weeklyList = songsList[weekIdx]
							for(var songKey in weeklyList){
								if(weeklyList.hasOwnProperty(songKey)){
									if(!(songKey in countryMap)){
										countryMap[songKey] = 1
										if(audioFeaturesData[songKey][selectedFeature]!=undefined||
											audioFeaturesData[songKey][selectedFeature]!=null){

											countryMapValuesSum+= audioFeaturesData[songKey][selectedFeature];
											countryMapValues.push(audioFeaturesData[songKey][selectedFeature]);								
										}
									}
								}
							}
						}

						countryMean = countryMapValuesSum/countryMapValues.length;
						countryValues[key] = countryMean*1000; 
						countryValuesList.push(countryMean*1000)
					}	
				}

				//console.log(countryValues);
				if(typeOfCall=="initiate"){
					loadSVGInBubbleMap(countryValues, countryValuesList);
				}
				else if(typeOfCall=="update"){
					updateBubbleMapData(countryValues, countryValuesList);
				}
            });
        });
	
}