var SpotifyWebApi = require('spotify-web-api-node');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var express = require('express');
app.use(express.static(__dirname + '/'));

var scopes = ['playlist-modify-private'],
    redirectUri = 'http://localhost:3000/callback.html',
    clientId = '',
    clientSecret = '';
   // state = 'some-state-of-my-choice';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri : redirectUri,
  clientId : clientId,
  clientSecret : clientSecret
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
console.log(authorizeURL);


var userNameis;
var userIdis="";
var playlistName="";
var accessTokenSetAgain;
var codeGrant;
// Socket.io server to listen
io.sockets.on('connection', function (socket){
io.sockets.emit('url',{value:authorizeURL});
});

io.on('connection', function (socket){
    
//once code is extracted from client-side get tokens
    socket.on('code', function(data){
      io.sockets.emit('codeOutput', { value: data});
      var code = data.x;
       // get tokens
      spotifyApi.authorizationCodeGrant(code)
        .then(function(data) {
          codeGrant = data.x;
        console.log('The token expires in ' + data['expires_in']);
        console.log('The access token is ' + data['access_token']);
        console.log('The refresh token is ' + data['refresh_token']);

        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data['access_token']);
      
        // get current users info
        spotifyApi.getMe()
            .then(function(data) {
              console.log('Some information about the authenticated user', data);
              userIdis = data.uri.split(':',3);
              userNameis=data.display_name;
            }, function(err) {
              io.sockets.emit('error', {text:'error'});
              console.log('Something went wrong with getting user info!', err);
            });
        }, function(err) {
          io.sockets.emit('error', {text:'error'});
            console.log('Something went wrong with getting Auth tokens !', err);
          });
    });
    
    //get playlist name and track array 
    socket.on('playlsitName', function(data){
         var playlsitName= data.x;
         var spotifyTrackString= data.y;

         //create playlist and add tracks
         createPlaylist(playlsitName,spotifyTrackString);
             
    });
    
});

function createPlaylist(a,b){
var playlistId
  spotifyApi.createPlaylist(userIdis[2],a, { 'public' : false })
                  .then(function(data) {
                    playlistId=data.uri.split(':',5);
                    spotifyApi.addTracksToPlaylist(userIdis[2], playlistId[4], b)
                      .then(function(data) {
                        io.sockets.emit('succesful', { text: "Tracks have been added to playlist",playId:playlistId,userId:userIdis});
                        console.log('Tracks added to '+a+'!');
                      
                      }, function(err) {
                        io.sockets.emit('error', {text:'error'});
                        console.log('Something went wrong adding tracks!', err);
                      });
                    
                  }, function(err) {
                    io.sockets.emit('error', { text:'error'});
                    console.log('Something went wrong!', err);
                  });
}

server.listen(3000);
