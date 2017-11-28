#calculate for last chart 

import urllib2
import sys 
import os
import datetime as DT
import spotipy
import pickle
import json

fileFolder = os.path.dirname(os.path.realpath(__file__))
#datasetsFolder = os.path.dirname(fileFolder)
datasetsFolder = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
#print datasetsFolder
dataFolder = os.path.join(datasetsFolder, "spotify-charts-data")

countryFolders = os.listdir(dataFolder)

hmap = {}

for country in countryFolders:
	if country[0]==".":
		continue

	countryFolderRead = os.path.join(dataFolder, country)

	csvFiles = os.listdir(countryFolderRead)
	csvFile = csvFiles[len(csvFiles)-1] #get last file 

	csvFilePath = os.path.join(countryFolderRead, csvFile)

	with open(csvFilePath, "r") as f:
		content = f.readlines()

	newList = []
	for line in content[1:]: #ignore header
		#print line
		
		splitted = line.split(",")
		#print splitted
		#print len(splitted)

		#print pos, name, artist, streams, url
		url = splitted[len(splitted)-1]

		urlRemainderSplit = url.split("/")
		urlRemainder = urlRemainderSplit[len(urlRemainderSplit)-1]
		urlRemainder = urlRemainder.rstrip()
		#print "Remainder is", urlRemainder
		#print "Checking ", urlRemainder.isalnum()
		
		#sys.exit()

		if "<" in urlRemainder or ">" in urlRemainder or " " in urlRemainder:
			pass
		else:
			newList.append(urlRemainder)

	#print len(newList)
	hmap[country] = newList

print len(hmap)

pickle.dump(hmap, open("songListPerCountry-Last.pickle", "wb"))
with open("songListPerCountry-Last.json", "w") as fp:
	json.dump(hmap, fp, indent=4)


