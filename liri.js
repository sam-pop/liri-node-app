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
const OMDB_URL = "http://www.omdbapi.com/?apikey=" + OMDB_KEY + "&plot=short&t=";


// run the appropriate function depends on the user input
switch (argsArray[0]) {
    case 'my-tweets':
        showMyTweets();
        break;
    case 'spotify-this-song':
        spotifySong(argsArray[1]); //TODO: finish building this function
        break;
    case 'movie-this':
        omdbMovie(argsArray[1]);
        break;
    case 'do-what-it-says':
        runRandomTxt(); //TODO: build this function
        break;
}


// use the twitter API package to show my last 20 tweets and when they were created
function showMyTweets() {
    client.get(
        // '/statuses/user_timeline.json', {
        //         screen_name: 'POTUS',
        '/statuses/home_timeline.json', {
            count: 20
        },
        function (error, tweets) {
            if (error) throw error;
            if (tweets) {
                for (let i of tweets) {
                    console.log("Tweet: " + i.text + " (" + i.created_at + ")");
                }
            }
        }
    );
}

// This will show the following information about the song: artist(s), song's name, preview link, album (default: "The Sign" by Ace of Base)
//TODO: fix to display all the info
function spotifySong(song) {
    spotify.search({
        type: 'track',
        query: 'All the Small Things',
        limit: 2
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data.tracks.items);
    });
}

// show the movie info fetched from the OMDB API
function omdbMovie(movie) {
    if (!movie) {
        movie = 'Mr. Nobody'; //default movie
    }
    let url = OMDB_URL + movie;
    request(url, (error, response, body) => {
        if (error) throw error;
        if (!error && response.statusCode === 200) {
            let thisMovie = JSON.parse(body);
            print('Title', thisMovie.Title);
            print('Year', thisMovie.Year);
            print('IMDB Rating', thisMovie.imdbRating);
            print('RT Rating', thisMovie.Ratings[1].Value);
            moreThanOne(thisMovie.Country) ? print('Countries', thisMovie.Country) : print('Country', thisMovie.Country);
            moreThanOne(thisMovie.Language) ? print('Languages', thisMovie.Language) : print('Language', thisMovie.Language);
            print('Plot', thisMovie.Plot);
            print('Actors', thisMovie.Actors);
        }
    });
}

// run the command inside the random.txt file
function runRandomTxt() {}

// print the item to the console/terminal 
function print(title, item) {
    console.log("* " + title + ": " + item);
}

// checks if the string holds more than one entry (separated by comma)
function moreThanOne(str) {
    if (str.indexOf(',') == -1)
        return false;
    return true;
}