// Dependencies
require("dotenv").config();
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require('request');
const fs = require("fs");
const inquirer = require('inquirer');
const keys = require("./keys.js");

// Keys
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
const OMDB_KEY = "trilogy";

// Variables
const argsArray = process.argv.slice(2); // removes the first two arguments (paths)
const OMDB_URL = "http://www.omdbapi.com/?apikey=" + OMDB_KEY + "&plot=short&t="; //OMDB API url

// run the appropriate function depends on the user input
var run = (arg, arg2) => {
    switch (arg) {
        case 'my-tweets':
            showMyTweets();
            break;
        case 'spotify-this-song':
            spotifySong(arg2);
            break;
        case 'movie-this':
            omdbMovie(arg2);
            break;
        case 'do-what-it-says':
            readRandomTxt();
            break;
        default:
            console.log("Unrecognized command");
    }
};
if (argsArray[0])
    run(argsArray[0], argsArray[1]);

// prompt for user interaction when no args are provided
if (!argsArray[0]) {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "Pick an action you would like to perform:",
        choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says']
    }]).then(function (user) {
        if (user.action === 'my-tweets' || user.action === 'do-what-it-says') {
            run(user.action);
        } else {
            inquirer.prompt([{
                type: "input",
                name: "textArg",
                message: "Anything in particular? (press Enter\\Return to skip)"
            }]).then(function (user2) {
                run(user.action, user2.textArg);
            });
        }
    });
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
                print('* *');
                for (let t of tweets) {
                    print("Tweet:", t.text + " (" + t.created_at + ")");
                }
            }
        }
    );
}

// This will show the following information about the song: artist(s), song's name, preview link, album (default: "The Sign" by Ace of Base)
function spotifySong(song) {
    if (!song) {
        song = 'ace of base the sign'; // default song
    }
    spotify.search({
        type: 'track',
        query: song,
        limit: 2
    }, function (error, data) {
        if (error) throw error;
        let result = data.tracks.items;
        print('* *');
        print('Artist(s):', result[0].artists[0].name);
        print('Song\'s Name:', result[0].name);
        print('Preview link:', result[0].preview_url);
        print('Album:', result[0].album.name);
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
            if (thisMovie.Response == 'True') {
                print('* *');
                print('Title:', thisMovie.Title);
                print('Year:', thisMovie.Year);
                print('IMDB Rating:', thisMovie.imdbRating);
                print('RT Rating:', thisMovie.Ratings[1].Value);
                moreThanOne(thisMovie.Country) ? print('Countries:', thisMovie.Country) : print('Country:', thisMovie.Country);
                moreThanOne(thisMovie.Language) ? print('Languages:', thisMovie.Language) : print('Language:', thisMovie.Language);
                print('Plot:', thisMovie.Plot);
                print('Actors:', thisMovie.Actors);
            } else print('Movie not found!');
        }
    });
}

// run the command inside the random.txt file
function readRandomTxt() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        if (error) throw error;
        if (data) run(...data.split(','));
    });
}


/* HELPER METHODS */

// print the item in the desired format to the console/terminal 
function print(title, ...item) { // we use the rest operator to make the second arg "optional" in the context of this function
    console.log("* " + title + " " + item);
    log(title + " " + item);
}

// logs the entry to the log.txt file
function log(entry) {
    fs.appendFile("./log.txt", entry + '\r\n', (error) => {
        if (error) throw error;
    });
}

// checks if the string holds more than one entry (separated by comma)
function moreThanOne(str) {
    return ((str.indexOf(',') === -1) ? false : true);
}
