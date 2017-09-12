import spotipy 

from spotipy.oauth2 import SpotifyClientCredentials

SPOTIPY_CLIENT_ID = '996f66ae6e61469aa0d6f43460d1dc3a'
SPOTIPY_CLIENT_SECRET = '2c19bd93f968472e99194011d7a72337'

client_credentials_manager = SpotifyClientCredentials(SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET)

artistUri = 'spotify:artist:2WX2uTcsvV5OnS0inACecP' #uri for Birdy
spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

#getting all albums by artist

results = spotify.artist_albums(artistUri, album_type='album')

albums = results['items']

while results['next']:
	results = spotify.next(results)
	albums.extend(results['items'])

for album in albums:
	print album['name']
	#print album['genres']
	#print album['popularity']
	#print album['tracks']
	print album['type']



