#getWeeklyChartsForUS
import urllib2
import sys 
import os
import datetime as DT


fileFolder = os.path.dirname(os.path.realpath(__file__))
dataFolder = os.path.join(fileFolder, "spotify-charts-data")

#print dataFolder
#sys.exit()

#us, gb=UK, ar = argentina, at=austria, au=australia, be=belgium, bo=bolivia, 
#br=brazil, ca=canada, ch=switz, cl=chile, 

#listOfCountries = ["ch", "cl", "co", "cr", "cz", "de", "dk"] 
listOfCountries = ["ec", "es", "fi", "fr", "gr", "hk", "id", "ie", "is", "it", 
"jp", "mx", "my", "nl", "no", "nz", "pe", "ph", "pt", "se", "sg", "th","tw", "global"]

for country in listOfCountries:
	print country

	countryFolder = os.path.join(dataFolder, country)

	if not os.path.exists(countryFolder):
		os.makedirs(countryFolder)

	weekStart = "2017-10-06"
	weekEnd = "2017-10-13"

	#only modify weekStart, weekEnd can take weekStart values

	while(True):

		weekString = weekStart+"--"+weekEnd
		url = "https://spotifycharts.com/regional/"+country+"/weekly/"+weekString+"/download"
		
		try:
			result = urllib2.urlopen(url).read()


			fileString = country+"_regional_top200_"+weekStart+"_"+weekEnd+".csv"
			filePath = os.path.join(countryFolder, fileString)

			try:
				with open(filePath, "w") as f:
					f.write(result)
			except:
				e = sys.exc_info()[0]
				print e 
			

		except:
			e1 = sys.exc_info()[0]
			print e1 
			print weekString

		if weekEnd == "2016-12-30":
			break


		weekEnd = weekStart
		year, month, date = weekStart.split("-")
		currentDate = DT.date(int(year), int(month), int(date))
		previousWeek = currentDate - DT.timedelta(days=7)
		weekStart = str(previousWeek)
