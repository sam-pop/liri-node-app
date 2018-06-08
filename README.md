# LIRI Bot

LIRI is a Language Interpretation and Recognition Interface. 
LIRI is a command line node app that takes in parameters and gives you back data.

The app will show the formatted results in the command line and log them to `log.txt` file.

## How to use
`node liri.js` (for a user selection menu)

**OR USE**  `node liri.js '<command>' '<parameter>'`

### Available Commands
`node liri.js my-tweets` This will show your last 20 tweets and when they were created.

`node liri.js spotify-this-song '<song name here>'` This will show you the requested song information from Spotify.

`node liri.js movie-this '<movie name here>'` This will show you the requested movie information from OMDB.

`node liri.js do-what-it-says` This will read and execute the command and parameters from the `random.txt` file.
