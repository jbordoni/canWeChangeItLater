import spotipy 
import sys
import csv 

from spotipy.oauth2 import SpotifyClientCredentials

SPOTIPY_CLIENT_ID = '996f66ae6e61469aa0d6f43460d1dc3a'
SPOTIPY_CLIENT_SECRET = '2c19bd93f968472e99194011d7a72337'

client_credentials_manager = SpotifyClientCredentials(SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET)

playlistURI = "https://open.spotify.com/user/redmusiccompany/playlist/5YB7GnoRpmzEPjkR3n0Lkm"
username = "redmusiccompany"

spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

results = spotify.user_playlist(username, playlistURI)

#results = spotify.user_playlists(username)

#print len(results)
#print results

"""for item in results:
	print item 
	sys.exit()"""


tracks_object = results['tracks']
#print tracks

global_tracks_object = tracks_object['items']
#print global_tracks_object
#print len(global_tracks_object)
#sys.exit()

"This is random screen clearing \n"

list_of_track_uris = []
list_of_song_names = []

for obj in global_tracks_object:
	#print obj['track']['name']
	#print obj['track']['uri']
	list_of_song_names.append(obj['track']['name'])
	list_of_track_uris.append(obj['track']['uri'])
	#sys.exit()

audio_features_obj = spotify.audio_features(list_of_track_uris)

all_keys = []

for key, value in audio_features_obj[0].items():
	all_keys.append(key)


"""print len(audio_features_obj)

for inner_obj in audio_features_obj:
	print inner_obj
	sys.exit()

sys.exit()"""
"""for item in tracks:
	print type(item)
	print len(item)
	print item['name']
	sys.exit()"""

#print tracks_object

#print len(tracks_object)

"""while tracks_object['next']:
	tracks_object = spotify.next(tracks_object)
	global_tracks_object.extend(tracks_object['track'])

print len(global_tracks_object)"""

all_keys_string = [key for key in all_keys]
#print all_keys_string

all_keys_string = ",".join(all_keys_string)

#print all_keys_string

final_all_keys = "song_name"+","+all_keys_string

#print final_all_keys


with open("audioFeatures_top100_August.csv", "wb") as f:
	f.write(final_all_keys)
	f.write("\n")

	for name, audio_feat_obj in zip(list_of_song_names, audio_features_obj):
		strToWrite = name+","

		values = []
		for key, value in audio_feat_obj.items():
			values.append(str(value))

		#print values
		#sys.exit()
		values_str = ",".join(values)

		final_string = strToWrite+values_str
		#print final_string
		try:
			f.write(final_string)
			f.write("\n")
		except:
			pass
		#sys.exit()





