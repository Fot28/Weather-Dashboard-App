var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
var recent5daySearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
console.log(recentSearch);
var cityName = "";

function fetchData() {
	// event.preventDefault();

	console.log("function working");
	var cityName = $("#search-input").val().trim();
	console.log(cityName);
	// var cityName = "london";

	var queryURL =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		cityName +
		"units=metric&appid=b355e40379f957cf415beffd26cd7a73";

	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function (response) {
		console.log(response);
		console.log(response.name);
		console.log(response.main.temp);
		console.log(response.wind.speed);
		console.log(response.main.humidity);

		var city = {
			cityName: response.name,
			cityTemp: response.main.temp,
			citySpeed: response.wind.speed,
			cityHumidity: response.main.humidity,
			cityLon: response.coord.lon,
			cityLat: response.coord.lat,
		};
		recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];

		recentSearch.unshift(city);
		console.log(city);

		localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
		console.log(recentSearch);
	});
	fetch5dayData();
}

function fetch5dayData() {
	var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
	console.log(recentSearch);
	var lon = recentSearch[0].cityLon;
	var lat = recentSearch[0].cityLat;
	console.log(lon);
	console.log(lat);
	// var cityName = ;
	var queryURL =
		"https://api.openweathermap.org/data/2.5/forecast?lat=" +
		lat +
		"&lon=" +
		lon +
		"&appid=7903eed390e3aa4b37da677b9f46ebf7";

	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function (response) {
		console.log(queryURL);
		console.log(response);
		console.log(response.name);
		console.log(response.main.temp);
		console.log(response.wind.speed);
		console.log(response.main.humidity);

		var city5day = {
			cityName: response.name,
			cityTemp: response.main.temp,
			citySpeed: response.wind.speed,
			cityHumidity: response.main.humidity,
			cityLon: response.coord.lon,
			citylat: response.coord.lat,
		};
		recent5daySearch = JSON.parse(localStorage.getItem("recentSearch")) || [];

		recent5daySearch.unshift(city5day);
		console.log(city5day);

		localStorage.setItem("recent5daySearch", JSON.stringify(recent5daySearch));
		console.log(recent5daySearch);
	});
}

function renderButtons() {
	var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
	console.log(recentSearch);
	// Deleting the movie buttons prior to adding new movie buttons
	// (this is necessary otherwise we will have repeat buttons)
	$("#history").empty();

	if (recentSearch.length > 2) {
		recentSearch.pop();
		localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
	}

	// Looping through the array of movies
	for (var i = 0; i < recentSearch.length; i++) {
		// Then dynamicaly generating buttons for each movie in the array.
		// This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
		var a = $("<button>");
		// Adding a class
		a.addClass("btn history-button bg-secondary rounded mt-3 text-white w-100");
		// Adding a data-attribute with a value of the movie at index i
		a.attr("data-name", recentSearch[i].cityName);

		a.attr("id", "historyBtn");
		// Providing the button's text with a value of the movie at index i
		a.text(recentSearch[i].cityName);
		// Adding the button to the HTML
		$("#history").append(a);
	}
}

$(document).ready(function () {
	renderButtons();

	// console.log(recentSearch);
});

// $(document).on("click", "#search-button", fetchData);
$("#search-button").on("click", function (event) {
	event.preventDefault();
	fetchData();
	renderButtons();
	// add more functions here as needed
});

$(document).on("click", "#historyBtn", function () {
	// event.preventDefault();
	console.log("history working");
	// var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
	console.log(cityName);
	fetchData();
	renderButtons();
	// add more functions here as needed
});
