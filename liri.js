require("dotenv").config();

var keys = require("./keys.js");

var omdb = require("omdb");
var Twitter = require("twitter");
var spotifyAPI = require("node-spotify-api");
var fs = require("file-system");
var request = require("request");

var nodeArg = process.argv;

var command = process.argv[2];

function choose() {
    switch (command) {
        case "my-tweets":
            myTweets();
            break;
        case "spotify-this-song":
            spotifyThisSong(process.argv[3]);
            break;
        case "movie-this":
            movieThis(process.argv[3]);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("Please provide an additional input after liri.js");
    }

}

// OMDB Movie
function movieThis() {

    var movieName = "";

    for (var i = 3; i < nodeArg.length; i++) {
        if (i > 3 && i < nodeArg.length) {
            movieName = movieName + "+" + nodeArg[i];
        } else {
            movieName += nodeArg[i];
        }
    }

    // if (nodeArg.length === 3) {
    //     movieName = "Mr. Nobody";
    // }

    console.log(movieName);
    if (process.argv[3] == null) {
        movieName = 'Mr. Nobody';
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            fs.appendFile("log.txt", "\n" + "Title: " + JSON.parse(body).Title + "\n", function() {});

            console.log("Release Year: " + JSON.parse(body).Year);
            fs.appendFile("log.txt", "Release Year: " + JSON.parse(body).Year + "\n", function() {});

            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            fs.appendFile("log.txt", "IMDB Rating: " + JSON.parse(body).imdbRating + "\n", function() {});

            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            fs.appendFile("log.txt", "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\n", function() {});
            
            console.log("Country of Production: " + JSON.parse(body).Country);
            fs.appendFile("log.txt", "Country of Production: " + JSON.parse(body).Country + "\n", function() {});

            console.log("Language of Movie: " + JSON.parse(body).Language);
            fs.appendFile("log.txt", "Language of Movie: " + JSON.parse(body).Language + "\n", function() {});
            
            console.log("Plot of Movie: " + JSON.parse(body).Plot);
            fs.appendFile("log.txt", "Plot of Movie: " + JSON.parse(body).Plot + "\n", function() {});

            console.log("Actors in Movie: " + JSON.parse(body).Actors);
            fs.appendFile("log.txt", "Actors in Movie: " + JSON.parse(body).Actors + "\n" + "\n", function() {});
        }
    });
}

// Twitter
function myTweets() {
    var client = new Twitter(keys.twitter);
    var params = {
        screen_name: "Mondo_Mango",
        count: 20
    };
    client.get("statuses/user_timeline", params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                output = ("@" + params.screen_name + " tweeted: " + tweets[i].text + " at time: " + tweets[i].created_at);
                console.log(output);
                fs.appendFile("log.txt", "\n" + output + "\n", function() {});
            }
        } else {
            console.log("Twitter Error!");
        }
    });
}

// Spotify
function spotifyThisSong(song) {

    var spotifySearch = new spotifyAPI(keys.spotify);

    if (song == null) {
        song = 'The Sign Ace of Base';
    }

    spotifySearch.search({
        'type': 'track',
        'query': song
    }, function (error, data) {
        if (error) {
            console.log(error + "\n");
        } else {
            console.log('Artist: ' + data.tracks.items[0].album.artists[0].name);
            fs.appendFile("log.txt", "\n" + 'Artist: ' + data.tracks.items[0].album.artists[0].name + "\n", function() {});

            console.log('Song Name: ' + data.tracks.items[0].name);
            fs.appendFile("log.txt", 'Song Name: ' + data.tracks.items[0].name + "\n", function() {});

            console.log('Preview URL: ' + data.tracks.items[0].preview_url);
            fs.appendFile("log.txt", 'Preview URL: ' + data.tracks.items[0].preview_url + "\n", function() {});

            console.log('Album Name: ' + data.tracks.items[0].album.name);
            fs.appendFile("log.txt", 'Album Name: ' + data.tracks.items[0].album.name + "\n", function() {});
        }
    });
}

// Do What it Says
function doWhatItSays() {
    fs.readFile('random.txt', "utf8", function(error, data){
      var txt = data.split(",");

      spotifyThisSong(txt[1]);
    });
  }

choose();