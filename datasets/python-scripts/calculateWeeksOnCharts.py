#calculate till last week 
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

#countryFolders = os.listdir(dataFolder)
#print len(countryFolders)

writeToFolder = os.path.join(datasetsFolder, "week-score")

country = "global"

countryFolderRead = os.path.join(dataFolder, country)

hmap = {}


csvFiles = os.listdir(countryFolderRead)
for csvFile in csvFiles:
	if csvFile[0]==".":
		pass
	else:
		csvFilePath = os.path.join(countryFolderRead, csvFile)
		content = None
		with open(csvFilePath, "r") as f:
			content = f.readlines()

		#print len(content)
		#sys.exit()

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
				#print "I am here"
				#print urlRemainder

			 	if len(splitted)==5:
					#print "I am here"
					if urlRemainder not in hmap:
						obj = {} 
						obj['songName'] = splitted[1].rstrip().replace('"','')
						obj['artistName'] = splitted[2].rstrip().replace('"','')
						obj['track_href'] = splitted[4].rstrip()
						obj['weeksOnChart'] = 0
						#print obj
						hmap[urlRemainder] = obj
						#sys.exit()
						
					else:
						hmap[urlRemainder]['weeksOnChart'] = hmap[urlRemainder]['weeksOnChart']+1
				

		#break

print len(hmap)

pickle.dump(hmap, open("weeksOnChart-Global-Last.pickle", "wb"))

with open("weeksOnChart-Global-Last.json", "w") as fp:
	json.dump(hmap, fp, indent=4)



