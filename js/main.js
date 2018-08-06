/* ======= Model ======= */

//All restaurant objects
var initialRestaurants = [
	{
		name: 'Atlas Arcade',
		neighborhood: 'H Street Corridor',
		position: {lat: 38.9004133, lng: -76.9889757},
		foursquare: '4ffc67b9e4b03399861ab1f6'
	},
	{
		name: 'Atlas Brew Works',
		neighborhood: 'Ivy City',
		position: {lat: 38.914857, lng: -76.9836237},
		foursquare: '50c74401e0e2c0da8a4cb7dc'
	},
	{
		name: 'Bluejacket',
		neighborhood: 'Navy Yard',
		position: {lat: 38.8750685, lng: -77.0029237},
		foursquare: '5207aa8111d28afd3b21cf3f'
	},
	{
		name: 'Board Room',
		neighborhood: 'Dupont Circle',
		position: {lat: 38.913669, lng: -77.045323},
		foursquare: '504f505564a47064ed1948b1'
	},
	{
		name: 'Brick & Mortar',
		neighborhood: 'Penn Quarter',
		position: {lat: 38.8927221, lng: -77.0398472},
		foursquare: '5529b1f3498e7f538585d472'
	},
	{
		name: 'Jackpot',
		neighborhood: 'Chinatown',
		position: {lat: 38.9009229, lng: -77.0154317},
		foursquare: '52c62720498eced049e38f0d'
	},
	{
		name: 'Right Proper Brewing',
		neighborhood: 'Shaw',
		position: {lat: 38.915437, lng: -77.0235565},
		foursquare: '51b0c426498e4f0309f9898f'
	},
	{
		name: "Solly's",
		neighborhood: 'U Street Corridor',
		position: {lat: 38.9168523, lng: -77.0295051},
		foursquare: '49baa2e8f964a5208e531fe3'
	},
	{
		name: "Ten 01",
		neighborhood: 'H Street Corridor',
		position: {lat: 38.899977, lng: -76.9935623},
		foursquare: '563773cc498e6c1e19fe2c84'
	},
	{
		name: 'The Big Hunt',
		neighborhood: 'Dupont Circle',
		position: {lat: 38.9084595, lng: -77.0446295},
		foursquare: '40b13b00f964a52045f71ee3'
	}
];

/* ======= Google Maps API ======= */
//Sets the map variable and creates arrays to store the markers and windows
var map;
var markers = [];
var popups = [];

//Loads the google map
window.initMap = function() {
	map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.9072, lng: -77.0369}, //Centered on Washington DC
      zoom: 13,
      mapTypeControl: true,
      zoomControl: true,
    });
	//Loops through the list of initial restaurants creating markers
    for (var i = 0; i < initialRestaurants.length; i++) {
      var restaurant = initialRestaurants[i];
      var position = restaurant.position;
      var name = restaurant.name;
      var neighborhood = restaurant.neighborhood;
      var marker = new google.maps.Marker({
      	map: map,
        position: position,
        name: name,
        neighborhood: neighborhood,
        animation: google.maps.Animation.DROP,
      });
      markers.push(marker);
    }

    ko.applyBindings(new ViewModel());
};

//Alerts the user if the google map does not load
var errorMap = function () {
	alert("Google maps failed to load. Please check your connection or try refreshing your browser.");
};

/* ======= ViewModel ======= */
var ViewModel = function() {
	var self = this;

	//Observable array of visible restaurant binded to the list of restaurants
	this.restaurants = ko.observableArray([]);

	//Observable array of selected restaurant binded to the selected
	//restaurants div
	this.selectedRestaurant = ko.observableArray([]);

	//Creates a unique, alphabetically sorted list of neighborhoods
	//from the list of initial restaurants, binded to the dropdown list.
	var initialNeighborhoods = ["All"];
	for (var i = 0; i < initialRestaurants.length; i++) {
		var neighborhood = initialRestaurants[i].neighborhood;
		initialNeighborhoods.push(neighborhood);
	}
	this.uniqueNeighborhoods = initialNeighborhoods.filter(function(elem, pos) {
	  return initialNeighborhoods.indexOf(elem) == pos;
	}).sort();

	//Observable array of the current selected neighborhood
	this.selectedNeighborhood = ko.observableArray(['All']);

	/* ======= Google Maps Functions Begin ======= */
	//Adds an event listener to every marker to open the window on
	//click and call the clickedMarker function
	this.addListeners = function() {
		for (var i = 0; i < markers.length; i++) {
			var marker = markers[i];
	     	marker.addListener('click', function() {
	     		self.openPopup(this);
	       		self.clickedMarker(this);
	      	});
		}
	};

	//Opens the google map winow and populates the info
	this.openPopup = function(marker) {
		self.closePopups();
		var popup = new google.maps.InfoWindow();
		popup.setContent('<strong>' + marker.name +
		'</strong><br>' + marker.neighborhood);
		popup.open(map, marker);
		self.bounce(marker);
	    popup.addListener('closeclick', function() {
	    	popup.marker = null;
	  	});
	  	popups.push(popup);
	};

	//Closes and clears all popup windows
	this.closePopups = function () {
		for (var i = 0; i < popups.length; i++) {
			var popup = popups[i];
			popup.close();
		}
		popups.length = 0;
	};

	//Bounces the google map icon twice
	this.bounce = function(marker) {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		window.setTimeout(
	    function(){
	      marker.setAnimation(null);
	    }, 1400);
	};

	//Calls the clicked restaurant function when the corresponding
	//marker is clicked
	this.clickedMarker = function(marker) {
		for (var i = 0; i < initialRestaurants.length; i++) {
				var data = initialRestaurants[i];
				if (marker.name == data.name) {
					self.clickedRestaurant(data);
					map.panTo(marker.getPosition());
				}
		}
	};
	/* ======= Google Maps Functions End ======= */

	//Loads all restaurants initially on load
	for (var i = 0; i < initialRestaurants.length; i++) {
		var data = initialRestaurants[i];
		self.restaurants.push(data);
	}

	//Loops through all of the initial restaurants and pushes them
	//into the visible restaurants based on the selected neighborhood
	this.setAllRestaurants = ko.computed(function() {
		self.restaurants.removeAll();
		self.selectedRestaurant.removeAll();
		self.closePopups();
		var selected = self.selectedNeighborhood();
		if (selected == 'All') {
			for (var i = 0; i < initialRestaurants.length; i++) {
				var data = initialRestaurants[i];
				self.restaurants.push(data);
			}
			for (var k = 0; k < markers.length; k++) {
				var marker = markers[k];
				marker.setVisible(true);
			}
		} else {
			for (var i = 0; i < initialRestaurants.length; i++) {
				var data = initialRestaurants[i];
				if (selected == data.neighborhood) {
					self.restaurants.push(data);
				}
			}
			for (var k = 0; k < markers.length; k++) {
				var marker = markers[k];
				if (selected == marker.neighborhood) {
					marker.setVisible(true);
				} else {
					marker.setVisible(false);
				}
			}
		}
	}, this);

	//When a restaurant is clicked the visible list is cleared, its marker is
	//opened, and that restaurant is pushed into the selected restaurant array
	this.clickedRestaurant = function(restaurant){
		self.restaurants.removeAll();
		var name = restaurant.name;
		for (var i = 0; i < initialRestaurants.length; i++) {
				var data = initialRestaurants[i];
				if (name == data.name) {
					self.selectedRestaurant.removeAll();
					self.selectedRestaurant.push(data);
				}
		}
		for (var k = 0; k < markers.length; k++) {
			var marker = markers[k];
			if (name == marker.name) {
				self.openPopup(marker);
				map.panTo(marker.getPosition());
			} else {
				marker.setVisible(false);
			}
		}
	};

	this.setAllRestaurants();
	this.addListeners();
};