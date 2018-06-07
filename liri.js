// Dependencies
require("dotenv").config();
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require('request');
const fs = require("fs");
const keys = require("./keys.js");

// Keys
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
const OMDB_KEY = "trilogy";

// Variables
const argsArray = process.argv.slice(2); // without the first two elements (paths)
const OMDB_URL = "http://www.omdbapi.com/?apikey=" + OMDB_KEY + "&plot=short&t="; //FIXME: add the query URL


// run the appropriate function depends on the user input
switch (argsArray[0]) {
    case 'my-tweets':
        showMyTweets(); //TODO: build this function
        break;
    case 'spotify-this-song':
        spotifySong(argsArray[1]); //TODO: build this function FIXME: make sure this is the arg the function need
        break;
    case 'movie-this':
        omdbMovie(argsArray[1]);
        break;
    case 'do-what-it-says':
        runRandomTxt(); //TODO: build this function
        break;
    default:
        break;
}

// use the twitter API package to show my last 20 tweets and when they were created
function showMyTweets() {
    client.get(
        '/statuses/home_timeline.json', {
            count: 20
        },
        function (error, tweets) {
            if (error) throw error;
            if (tweets) {
                for (let i of tweets) {
                    console.log("Tweet: " + i.text);
                }
            }
        }
    );

}

// This will show the following information about the song: artist(s), song's name, preview link, album (default: "The Sign" by Ace of Base)
function spotifySong(song) {}

// show the movie info fetched from the OMDB API
function omdbMovie(movie) {
    if (!movie) {
        movie = 'Mr. Nobody';
    }
    let url = OMDB_URL + movie;
    console.log(url);
    request(url, (error, response, body) => {
        if (error) throw error;
        if (!error && response.statusCode === 200) {
            let thisMovie = JSON.parse(body);
            console.log("* " + thisMovie.Title);
            console.log("* " + thisMovie.Year);
            console.log("* " + thisMovie.imdbRating);
            console.log("* " + thisMovie.Ratings[1].Value);
            console.log("* " + thisMovie.Country);
            console.log("* " + thisMovie.Language);
            console.log("* " + thisMovie.Plot);
            console.log("* " + thisMovie.Actors);
        }
    });
}

// run the command inside the random.txt file
function runRandomTxt() {}