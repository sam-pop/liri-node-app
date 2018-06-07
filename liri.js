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
            spotifySong(arg2); //TODO: finish building this function
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
                message: "Anything in particular? (press Enter to skip)"
            }]).then(function (user2) {
                run(user.action, user2.textArg);
            });
        }
    });
    // inquirer.prompt([{
    //         type: "list",
    //         name: "action",
    //         message: "Pick an action you would like to perform:",
    //         choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says']
    //     },
    //     {
    //         type: "input",
    //         name: "textArg",
    //         message: "Anything in particular? (press Enter to skip)"
    //     },
    // ]).then(function (user) {
    //     run(user.action, user.textArg);
    // });
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
                    print("Tweet:", i.text + " (" + i.created_at + ")");
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
        query: song,
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
            if (thisMovie.Response == 'True') {
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
}

// checks if the string holds more than one entry (separated by comma)
function moreThanOne(str) {
    if (str.indexOf(',') == -1)
        return false;
    return true;
}