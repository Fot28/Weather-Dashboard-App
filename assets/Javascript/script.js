var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
var recent5daySearch =
	JSON.parse(localStorage.getItem("recent5daySearch")) || [];
console.log(recentSearch);
var cityName = "";

function fetchData() {
	var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
	var recent5daySearch =
		JSON.parse(localStorage.getItem("recent5daySearch")) || [];
	console.log("function working");
	var cityName = $("#search-input").val().trim();
	console.log(cityName);
	// var cityName = "london";

	var queryURL =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		cityName +
		"&units=metric&appid=b355e40379f957cf415beffd26cd7a73";

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

		var lon = recentSearch[0].cityLon;
		var lat = recentSearch[0].cityLat;

		var queryURL =
			"https://api.openweathermap.org/data/2.5/forecast?lat=" +
			lat +
			"&lon=" +
			lon +
			"&units=metric&appid=7903eed390e3aa4b37da677b9f46ebf7";

		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			console.log(queryURL);
			console.log(response);
			console.log(response.city.id);

			var city5day = {
				cityId: response.city.id,
			};
			console.log(city5day);

			recent5daySearch =
				JSON.parse(localStorage.getItem("recent5daySearch")) || [];

			recent5daySearch.unshift(city5day);

			localStorage.setItem(
				"recent5daySearch",
				JSON.stringify(recent5daySearch)
			);
			console.log(recent5daySearch);
		});
	});
}

function renderButtons() {
	var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
	var recent5daySearch =
		JSON.parse(localStorage.getItem("recent5daySearch")) || [];
	console.log(recent5daySearch);
	console.log();
	// Deleting the movie buttons prior to adding new movie buttons
	// (this is necessary otherwise we will have repeat buttons)
	$("#history").empty();

	if (recentSearch.length > 5) {
		recentSearch.pop();
		localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
		recent5daySearch.pop();
		localStorage.setItem("recent5daySearch", JSON.stringify(recent5daySearch));
	}

	// Looping through the array of recentSearch
	for (var i = 0; i < recentSearch.length; i++) {
		// Then dynamicaly generating buttons for each recentSearch in the array.
		// This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
		var a = $("<button>");
		// Adding a class
		a.addClass("btn history-button bg-secondary rounded mt-3 text-white w-100");
		// Adding a data-attribute with a value of the movie at index i
		a.attr("data-name", recentSearch[i].cityName);
		// Providing the button's text with a value of the cityName at index i
		a.text(recentSearch[i].cityName);
		// Adding the button to the HTML
		$("#history").append(a);
	}
}

$(document).ready(function () {
	var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
	var recent5daySearch =
		JSON.parse(localStorage.getItem("recent5daySearch")) || [];

	if (recentSearch.length === 0 && recent5daySearch.length === 0) {
		return;
	} else {
		renderButtons();
	}
});

$("#search-button").on("click", function (event) {
	event.preventDefault();
	fetchData();
	setTimeout(function () {
		renderButtons();
		$("#search-input").val("");
	}, 200);
});

$(document).on("click", ".history-button", function (event) {
	event.preventDefault();
	var cityName = $(this).attr("data-name"); // Get the data-name value from the clicked button
	$("#search-input").val(cityName); // Set the value of the search input field to the cityName
	console.log("history working");
	fetchData();
	setTimeout(function () {
		renderButtons();
		$("#search-input").val("");
	}, 200);
});
