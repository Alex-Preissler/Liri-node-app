require('dotenv').config();

var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');

//console.log(keys);

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//console.log(Spotify);
//console.log(client);

var inputArray = process.argv;

var operation = process.argv[2];
    operation = operation.toLowerCase();

var searchArray = inputArray;
    searchArray.splice(0,3);

var search;

if(searchArray != null){
    search = searchConstructor(searchArray);
};


function searchConstructor(searchConstructorArray){
    
    console.log(searchConstructorArray);

    var localSearch = searchConstructorArray[0];

    for(var i=1; i<searchConstructorArray.length; i++){

        localSearch += '+' + searchConstructorArray[i];

    }
    
    console.log(localSearch); 

    return localSearch;
}


function main(operation, search){

            switch(operation){

                case('my-tweets'):

                    client.get('statuses/home_timeline', function(error, tweets, response){

                        if(error){
                            return console.log(error);
                        }

                        tweets.forEach(function (currentValue, index, arr){

                            console.log(currentValue.created_at);
                            console.log(currentValue.text);
                            console.log("*****************");

                        });

                    });
                    break;



                case('spotify-this-song'):

                    spotify.search({type: 'track', query: search}, function(error, data){

                        if(error){
                            return console.log(error);
                        }

                        var albumArray = data.tracks.items;

                        
                        albumArray.forEach(function(currentValue, index, arr){

                            //console.log(JSON.stringify(arr[index], null, 2));
                            var preview = arr[index].preview_url;

                            if(preview == null){
                                preview = "Preview not available.";
                            }

                            console.log(arr[index].artists[0].name);
                            console.log(arr[index].name);
                            console.log(preview);
                            console.log(arr[index].album.name);
                        
                            console.log("-----------------------------------------------------------------------------");

                        });

                    });
                    break;


                case('movie-this'):
                    
                    request('http://www.omdbapi.com/?i=tt3896198&apikey=640a01e7&t=' + search, function(error, response, body){

                        if(error){
                            return console.log(error);
                        }
                    
                        var movie = JSON.parse(body);
                        
                        console.log(movie.Title);
                        console.log(movie.Year);
                        console.log(movie.Ratings[0]. Value);
                        console.log(movie.Ratings[1].Value);
                        console.log(movie.Country);
                        console.log(movie.Plot);
                        console.log(movie.Actors);
                    
                    });
                    break;
                    


                case('do-what-it-says'):

                    fs.readFile('random.txt', 'utf8', function(error, data){

                        if(error){
                            return console.log(error);
                        }

                        console.log(data);

                        var string = data.split(',"');
                        console.log(string);
                        var fileOperation = string[0]
                        fileOperation = operation.toLocaleLowerCase();

                        var arraySearch = string[1].split('"');
                            arraySearch = arraySearch.split(' ');

                            console.log(arraySearch);

                        var thisSearch = searchConstructor(arraySearch);
                        console.log(thisSearch);


                    });




            }
        }

main(operation, search);