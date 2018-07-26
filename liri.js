//Logging of twitter operation and result is active, others operations will be added.

require('dotenv').config();

var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');
var timestamp = require('time-stamp');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var inputArray = process.argv;
var operation = process.argv[2];
    operation = operation.toLowerCase();
var searchArray = inputArray;
    searchArray.splice(0, 3);
var exeTime = timestamp('MM/DD/YYYY HH:mm:ss');
console.log(exeTime);

function searchConstructor(searchConstructorArray) {

    var localSearch = searchConstructorArray[0];

    for (var i = 1; i < searchConstructorArray.length; i++) {

        localSearch += '+' + searchConstructorArray[i];

    }

    return localSearch;
}

function tweets() {

    var dataArray = [];
    var dataArrayIndex = 0;
    function dataObject(timestamp, body){
        this.timestamp = timestamp,
        this.body = body
    };

    client.get('statuses/home_timeline', function (error, tweets, response) {

        if (error) {
            return console.log(error);
        }

        tweets.forEach(function (currentValue, index, arr) {

            var tweet = new dataObject((index+1) + ": " + currentValue.created_at, currentValue.text);
            dataArray[dataArrayIndex] = tweet;
            dataArrayIndex++;

            console.log((index + 1) + ": " + currentValue.created_at);
            console.log(currentValue.text);
            console.log("\n******************************************************************************************************************************************************************************\n");
            
        });

        toFile(operation, dataArray);

    });

  

}

function spotifyThis(searchArray) {

    var dataArray = [];
    var dataArrayIndex = 0;
    function dataObject(artist, song, preview, album){
        this.artist = artist,
        this.song = song,
        this.preview = preview,
        this.album = album
    }

    var search = searchConstructor(searchArray);

    spotify.search({ type: 'track', query: search }, function (error, data) {

        if (error) {
            return console.log(error);
        }

        var albumArray = data.tracks.items;


        albumArray.forEach(function (currentValue, index, arr) {

            var preview = arr[index].preview_url;

            if (preview == null) {
                preview = "Preview not available.";
            }
            
           // var song = new dataObject(arr[index].artists[0].name, arr[index].name, preview, arr[index].album.name);
            //dataArray[dataArrayIndex] = song;
            //dataArrayIndex++;

            console.log("Artist: " + arr[index].artists[0].name);
            console.log("Song: " + arr[index].name);
            console.log("Preview: " + preview);
            console.log("Album: " + arr[index].album.name);
            console.log(" ");
            console.log("******************************************************************************************************************************************************************************");
            console.log(" ");
        });

       // toFile(operation, song);

    });
}

function movieThis(searchArray) {

    var search = searchConstructor(searchArray);

    request('http://www.omdbapi.com/?i=tt3896198&apikey=640a01e7&t=' + search, function (error, response, body) {

        if (error) {
            return console.log(error);
        }

        var movie = JSON.parse(body);

        console.log("Title: " + movie.Title);
        console.log("Year: " + movie.Year);
        console.log("Ratings:");
        console.log("IMDB: " + movie.Ratings[0].Value);
        console.log("Rotten Tomatoes: " + movie.Ratings[1].Value);
        console.log("Country: " + movie.Country);
        console.log("Plot: " + movie.Plot);
        console.log("Actors: " + movie.Actors);
        console.log(" ");
        console.log("******************************************************************************************************************************************************************************");
        console.log(" ");

    });
}

function doWhatItSays() {

    fs.readFile('random.txt', 'utf8', function (error, data) {

        if (error) {
            return console.log(error);
        }

        var string = data.split(',');
        
        var fileOperation = string[0]
            operation = fileOperation.toLocaleLowerCase();

        var arraySearch = string[1];
            arraySearch = arraySearch.replace(/"/g, "");
            arraySearch = arraySearch.split(' ');

        main(operation, arraySearch);

    });
}

function toFile(operation, fileInfo){

    //console.log(operation);

    //console.log(fileInfo[0]);

    var operationInfo = "\n" + exeTime + "\nOperation: " + operation + "\n\n";
    var prettyPrint =  "\n\n******************************************************************************************************************************************************************************\n\n"
    var body = "";

    fs.appendFile('log.txt', operationInfo, function(error){
        if(error){
            return console.log("Error: " + error);
        }
    });
   // console.log(operationInfo);
    //console.log(resultInfo);

    for(var i=0; i<fileInfo.length; i++){
       
        var resultInfo = fileInfo[i].timestamp + "\n" + fileInfo[i].body;
        body += resultInfo + prettyPrint;
    }    
      
    
    
    
    fs.appendFile('log.txt', body, function(error){
           
            if(error){
               return  console.log("Error: " + error);
            }
        });

    


}

function main(operation, searchArray) {

    switch (operation) {

        case ('my-tweets'):

            tweets();
            break;

        case ('spotify-this-song'):

            spotifyThis(searchArray);
            break;

        case ('movie-this'):

            movieThis(searchArray);
            break;

        case ('do-what-it-says'):

            doWhatItSays();
            break;
    };
}

main(operation, searchArray);