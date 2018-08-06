API Project, 10/12/16
=====================

This is Josh Pearson’s submission for project nine in Udacity’s front end web development degree. This application profiles the top ten bars in Washington D.C., as determined by Josh. 

Functionality
-------------

There are ten initial restaurants in this application that can be clicked on to show more information pulled from foursquare, such as an image and website. Users can sort through the list of restaurants by clicking on their desired neighborhood. 

**Knockout**
The knockout.js framework is used to bind the list of neighborhoods and restaurants to index.html.

**Google Maps**
A google map is loaded asynchronously by calling the initMap() function. The initMap() function then creates a list of markers from the list of initials restaurants. 

**Foursquare**
Foursquare.js is loaded asynchronously and adds an image, url, and an address to the array of initial restaurants. 