$.ajaxSetup({
	timeout: 1000
});

//Uses the unique foursquare id to call the address,
//image, and url.
var getImage = function(restaurant) {
	var businessid = restaurant.foursquare;
	var foursquareurl = "https://api.foursquare.com/v2/venues/" + businessid +
      '?' + $.param({
      	'client_id': "J1VQF20MDSUGLGCIAQNQLDKSZZHEG5I3FN434R4C2XMDFTF0",
      	'client_secret': "MZYCQZRTBI1GJO2GGE50CHOQJHJXE0F3P1INZYWVQ1AECC55",
      	'v': '20161009'
	});
    $.getJSON(foursquareurl, function( data ) {
		var image = data.response.venue.bestPhoto.prefix + "width" +
		data.response.venue.bestPhoto.width + data.response.venue.bestPhoto.suffix;
		var address = data.response.venue.location.address;
		var url = data.response.venue.url;
		if (image === null) {
			restaurant.image = "http://s.quickmeme.com/img/8b/8b148de96ba025add3e63494c11b0a0298f4a5b8ec7e636cee43d65f521c996c.jpg";
		} else {
			restaurant.image = image;
		}
		if (address === null) {
			restaurant.address = "no foursquare address available";
		} else {
			restaurant.address = address;
		}
		if (url === null) {
			restaurant.url = "no foursquare url available";
		} else {
			restaurant.url = url;
      	}
    }).fail(function(e) {
        restaurant.address = "Foursquare information could not load, please refresh your browser.";
    });
};

//This function loops pushes the foursquare data back into the
//initialRestaurants array to be used once a user clicks on a restaurant.
var getImages = function() {
	for (var i = 0; i < initialRestaurants.length; i++) {
	var restaurant = initialRestaurants[i];
	getImage(restaurant);
	}
};

getImages();
