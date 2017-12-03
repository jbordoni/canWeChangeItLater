#calculate till last week 
import urllib2
import sys 
import os
import datetime as DT
import spotipy
import pickle
import json
import pprint
pp = pprint.PrettyPrinter(indent=4)

fileFolder = os.path.dirname(os.path.realpath(__file__))
#datasetsFolder = os.path.dirname(fileFolder)
datasetsFolder = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
#print datasetsFolder
dataFolder = os.path.join(datasetsFolder, "spotify-charts-data")

writeToFolder = os.path.join(datasetsFolder, "combined-data")

countryList = os.listdir(dataFolder)

hmap = {}

for country in countryList:
	#hmap = {}
	weekList = []
	if country[0]==".":
		continue
	countryFolderRead = os.path.join(dataFolder, country)

	csvFiles = os.listdir(countryFolderRead)

	prev = ""
	newList = []
	for idx, csvFile in enumerate(csvFiles[1:]):
		endDate = csvFile.split("_")[4]
		endDateMonth = endDate.split("-")[1]
		#print idx
		if int(endDateMonth)!=prev:
			newList.append(idx)
			
		prev = int(endDateMonth)


	print len(newList)
	print newList
	sys.exit()


	for csvFile in csvFiles:
		startDate = csvFile.split("_")[3]
		startDateYear = startDate.split("-")[0]
		#print startDateYear
		#sys.exit()
		if startDateYear=="2016":
			continue
		if csvFile[0]==".":
			continue
		else:
			perWeekMap = {}
			csvFilePath = os.path.join(countryFolderRead, csvFile)
			content = None
			with open(csvFilePath, "r") as f:
				content = f.readlines()

			#print len(content)
			#sys.exit()
			#print content[:10]
			#sys.exit()
			#print content[100]
			#sys.exit()

			for line in content[1:101]: #ignore header
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
				 		obj = {}
				 		obj['position'] = splitted[0].rstrip()
				 		obj['songName'] = splitted[1].rstrip().replace('"','')
						obj['artistName'] = splitted[2].rstrip().replace('"','')
						obj['streams'] = splitted[3].rstrip()
						obj['track_href'] = splitted[4].rstrip()
						perWeekMap[urlRemainder] = obj
						#pp.pprint(obj)
						#sys.exit()
						#print "I am here"
						"""if urlRemainder not in hmap:
							obj = {} 
							obj['songName'] = splitted[1].rstrip().replace('"','')
							obj['artistName'] = splitted[2].rstrip().replace('"','')
							obj['track_href'] = splitted[4].rstrip()
							obj['weeksOnChart'] = 1
							#print obj
							hmap[urlRemainder] = obj
							#sys.exit()
							
						else:
							hmap[urlRemainder]['weeksOnChart'] = hmap[urlRemainder]['weeksOnChart']+1"""
					

			print len(perWeekMap)
			print perWeekMap
			sys.exit()
			#break

	print len(hmap)

	#pickle.dump(hmap, open("weeksOnChart-"+country+"-Last.pickle", "wb"))

	#with open("weeksOnChart-"+country+"-Last.json", "w") as fp:
	#	json.dump(hmap, fp, indent=4)
