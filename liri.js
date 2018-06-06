// Requires
require("dotenv").config();
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require('request');
const fs = require("fs");
const keys = require("./keys.js");

// Keys
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

// Variables
const argsArray = process.argv.slice(2); // without the first two elements (paths)


// run the appropriate function depends on the user input
switch (argsArray[0]) {
    case 'my-tweets':
        showMyTweets(); //TODO: build this function
        break;
    case 'spotify-this-song':
        spotifySong(argsArray[1]); //TODO: build this function FIXME: make sure this is the arg the function need
        break;
    case 'movie-this':
        omdbMovie(argsArray[1]); //TODO: build this function FIXME: make sure this is the arg the function need
        break;
    case 'do-what-it-says':
        runRandomTxt(); //TODO: build this function
        break;
    default:
        break;
}

// use the twitter API package to show my last 20 tweets and when they were created
function showMyTweets() {}

// This will show the following information about the song: artist(s), song's name, preview link, album (default: "The Sign" by Ace of Base)
function spotifySong(song) {}

// show the movie info fetched from the OMDB API
function omdbMovie(movie) {}

// run the command inside the random.txt file
function runRandomTxt() {}