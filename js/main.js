var apikey = 'JSSXGZIEPOLRS21K7';
var musicService = [];
var link = [];
var artistTitle=[];
var trackId = [];
var songObjects=[];
var youtubetracks=[];
var mysong = [];
var dups={};
var val;
var songId;
var artist;
var track;
var percent=.09;
var audioSummary;
var artistId="";
var genre = [];
var styles="";
var artistTrack;
var returnedSongsArray = [];
var sortable = [];
var artistStylesArray=[];
var songDescription ="";
var artistImage = [];
var spotifyTracksArray = [];
var storedSpotifyTracksArray = [];
$('#track').prop('disabled',true);
$('#mybutton5').prop('disabled',true);
$('#artist').on( 'keyup', function( e ) {
     if( e.which == 9 || e.which==13 &&$('#artist').val()) {
         $('#track').prop('disabled',false).css("background","white");
         
     }
     
 } );
$('#track').on( 'keyup', function( e ) {
     if($('#track').val().length>0) {
         $('#mybutton5').prop('disabled',false);
         
     }
     else{
     	$('#mybutton5').prop('disabled',true);
     }
     
 } );

function getTrackId(){
	$(document).ajaxStart(function(){
    $("#cover").css("display","block");
  	});
	artist=$('#artist').val();
	track=$('#track').val();
	dups={};
	var url = 'http://developer.echonest.com/api/v4/song/search?api_key=JSSXGZIEPOLRS21K7&format=json&results=100&sort=song_hotttnesss-desc';
	$.getJSON(url,{
		'title':track,
		'artist':artist,
	}, 
	function(data){
		$.each(data.response.songs, function(i,item){
			
			songId = item.id;
			artistId = item.artist_id;
		});
		getPlaylist(songId);
		

	});
	
}

var page=0;
var bool = false;

function getTrackIdLink(a,t){
	bool=true;
	page = page+1;
	artist=a;
	track=t;
	dups={};
	$('.list-group').empty();
	while(songObjects.length > 0) {
    songObjects.pop();
	}

	var url = 'http://developer.echonest.com/api/v4/song/search?api_key=JSSXGZIEPOLRS21K7&format=json&results=100&sort=song_hotttnesss-desc';
	$.getJSON(url,{
		'title':track,
		'artist':artist,
	}, 
	function(data){
		$.each(data.response.songs, function(i,item){
			songId = item.id;
			artistId = item.artist_id;
		});
		artistStyles(artistId);

	});
	
}


// get a playlist of songs based on  #artist and #track input
function getPlaylist(a){
	dups={};
		
	//get request
	var url = 'http://developer.echonest.com/api/v4/playlist/static?api_key=JSSXGZIEPOLRS21K7&format=json&sort=song_hotttnesss-desc&bucket=id:spotify&bucket=tracks';
	$.getJSON(url,{
		'song_id':a,
		'type':'song-radio',
		'min_tempo':tempoMin,
		'max_tempo':tempoMax,
		'max_duration':durationMax,
		'min_duration':durationMin,
		'results':resultsMax,
		'song_max_hotttnesss':hotSongMax,
		'song_min_hotttnesss':hotSongMin,
		'artist_max_hotttnesss':hotArtistMax,
		'artist_min_hotttnesss':hotArtistMin,
		'artist_max_familiarity':artistfamiliarMax,
		'artist_min_familiarity':artistfamiliarMin
	}, 
	function(data){
		$.each(data.response.songs, function(i,item){
			isGoodSong(item)
			songObjects.push(item);
			
		});

	}).done(function(){
		if(bool){
			spotifyTracksPlaylist()
		}else
		spotifyTracks()});

}


$('#mybutton5').click(function(){
	getTrackId();
	
	});

$('#mybutton7').click(function(){
	fillPlaylist();
	
	});


var spotifyTrackString="";

var stuff =[];
var linkId='';
var cssTrackId='';
var pageId ='';


function spotifyTracksPlaylist(){
	var count =1;
	//$('#originalPlaylist').css("display","none");
			pageId='page'+page;
 		    cssTrackId='track'+page;
 		    linkId='link'+page;
 		// $('.row').append("<div class=\"panel panel-default\" id=\""+pageId+"\"><div class=\"panel-body\"><ul class=\"list-group\" id = \""+cssTrackId+"\"></ul><div class = \"navi\" id = \""+linkId+"\"></div></div></div>");
 		
 		$.each(songObjects, function(i,item){
			
			if(item.tracks.length===0){
			//	$('#tracks').append('<p>'+ item.title+": 		"+item.artist_name+"	"+item.song_hotttnesss+'soz, no link found</p>');
			}
			else{

				
			$.each(item.tracks, function(i2,item2){
				//to create infinite playlist
				//<button class = \"btn\"onclick=\"getTrackIdLink('"+item.artist_name+"'"+","+"'"+item.title+"'"+ ")\"><span class=\"glyphicon glyphicon-list\"></span></button>
			$('.list-group').append("<div> <a href='https://open.spotify.com/track/"+item2.foreign_id.substring(14,item2.foreign_id.length)+"' class='list-group-item'>"+count+".		"+item.artist_name+"<p>"+ item.title+"</p></a><div>");
			 // $('.list-group').append("<li class = \"list-group-item\"><span class=\"glyphicon glyphicon-film\" onclick=\"getTrackIdLink('"+item.artist_name+"'"+","+"'"+item.title+"'"+ ")\"></span> <a  class='list-group-item'>"+count+".		"+item.artist_name+"<p>"+ item.title+"</p></a></li>");
				
			//	spotifyTrackString +=('"'+item2.foreign_id+'",');	
				
			//	stuff[count-1] = "<a href='https://open.spotify.com/track/"+item2.foreign_id.substring(14,item2.foreign_id.length)+"' class='list-group-item'>"+count+".		"+item.artist_name+"<p>"+ item.title+"</p></a>";
				return false;

			});
			count = count +1;
			}
	});
$(".panel").css("visibility","visible");
pagination();
 	// $('#'+linkId).jPages({
  //       containerID : cssTrackId,
  //       perPage: 5,
  //       keyBrowse:true,
        
  //     });
}

//display spotify tracks from songObjects array
function spotifyTracks(){
	var artistNumber=countArtists(dups);
	var count =1;
 	
	$.each(songObjects, function(i,item){
			
			if(item.tracks.length===0){
				return			
			}
			else{
			$.each(item.tracks, function(i2,item2){
				//<button class = \"btn\"onclick=\"getTrackIdLink('"+item.artist_name+"'"+","+"'"+item.title+"'"+ ")\"><span class=\"glyphicon glyphicon-list\"></span></button>
			$('#tracks').append("<div><a href='https://open.spotify.com/track/"+item2.foreign_id.substring(14,item2.foreign_id.length)+"' class='list-group-item' target=\"_blank\">"+count+".		"+item.artist_name+"<p data-toggle=\"tooltip\" data-placement=\"left\" title=\""+item.title+"\">"+ item.title+"</p></a><div>");
				spotifyTrackString +=('"'+item2.foreign_id+'",');	
				spotifyTracksArray.push(item2.foreign_id);
				stuff[count-1] = "<a href='https://open.spotify.com/track/"+item2.foreign_id.substring(14,item2.foreign_id.length)+"' class='list-group-item' target=\"_blank\">"+count+".		"+item.artist_name+"<p>"+ item.title+"</p></a>";
				return false;
			});
			count = count +1;
			}
		});
	  spotifyTrackString = spotifyTrackString.substring(0, spotifyTrackString.length - 1);
	  pagination();
	//  displayArtists();
}

function pagination(){
	
    $("#tracks-links").jPages({
        containerID : "tracks",
        perPage: 10,
        keyBrowse:true,
        
      });
    $('#mybutton5').css('display','none');
    $('#demo,#dropdown').css('display','none');
	$('.input-group').css('display','none');
	$('#playlist-info').css('display','inherit');
	$('#login').css('display','block');
	$(".panel").css('display','inherit');
	$("#tracks-links").jPages({
        containerID : "tracks",
        perPage: 10,
        keyBrowse:true,
        
      });
      localStorage.tracksArray = spotifyTracksArray; 
      localStorage.artistName  = $('#artist').val();
      localStorage.trackName   =  $('#track').val();
    $(document).ajaxComplete(function(){
    	$("#cover").css("display","none");
  	});
}

function displayArtists(){
	
	for(var prop in dups) {
		
	      	var url = 'http://developer.echonest.com/api/v4/artist/profile?api_key=JSSXGZIEPOLRS21K7&format=json&bucket=images&bucket=biographies';
			$.getJSON(url,{
			'id':prop,
			
			
			}, 
			function(data){
				for(var prop in data) {
				
				setInterval( function(){ $("#artists-thumb").append("<div class=\"thumbnail col-md-4\"><img src=\""+data.response.artist.images[0].url+"\" alt=\"...\"><div class=\"caption\"><h3>"
					+data.response.artist.name+"</h3><p>"
					+data.response.artist.biographies[0].text+"</p><p><a href=\""+data.response.artist.biographies[0].url+"\" class=\"btn btn-primary\" role=\"button\">Read More</a> <a href=\"#\" class=\"btn btn-default\" role=\"button\">Button</a></p></div></div>");
				
		},1000);}
			}).done( function(){
					localStorage.artistName = $('#artist').val();
                localStorage.trackName = $('#track').val();
                $('#artist').val(localStorage.artistName);  
                $('#track').val(localStorage.trackName);}
					 );
        
    }
}
//check for duplictaes of songs returned from song request
function isGoodSong(song) {
    var hash = getDupHash(song);
    if (! (hash in dups)) {
        dups[hash] = song;
        return true;
    } else {
        return false;
    }
}

function getDupHash(song) {
    return song.artist_id;
}

function countArtists(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}


//query the artist name on input #artist
var artist = new Bloodhound({
    datumTokenizer: function(data) { return Bloodhound.tokenizers.whitespace(data.name); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    limit: 3,
                    remote: {
						url:'http://developer.echonest.com/api/v4/artist/search?api_key=JSSXGZIEPOLRS21K7&name=%QUERY',
							filter: function(artist) {
                            return $.map(artist.response.artists, function(data) {  return { name: data.name }; });
                        	}
    				}

});

artist.initialize();
$('#artist').typeahead(null, {
                    name: 'artists',
                    displayKey: 'name',
                    source: artist.ttAdapter()
});
//query the track assosiated with the artist on input #track
var track = new Bloodhound({
    datumTokenizer: function(data) { return Bloodhound.tokenizers.whitespace(data.title); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    limit: 10,
                    remote: {
						url:'http://developer.echonest.com/api/v4/song/search?api_key=JSSXGZIEPOLRS21K7&results=100&title=%QUERY',
							filter: function(title) {
                            return $.map(title.response.songs, function(data) { 
                            				
                            		return { name: data.title }; 
                            	
                            	});
                        	},
                        	 replace: function (url, query) {
            					//updat eurl to include previous input value and include query again
            					if ($('#artist').val()) {
                					url = 'http://developer.echonest.com/api/v4/song/search?api_key=JSSXGZIEPOLRS21K7&results=100&artist='+$('#artist').val()+'&title='+query;
            					}
            				return url;
        					}
                        
    				}
});

track.initialize();
$('#track').typeahead(null, {
                    name: 'title',
                    displayKey: 'name',
                    source: track.ttAdapter()
});


$('#login').click(function(){
	$('.container').css('display','none');
	$('.panel').css('display','none');
	
});
