var recentSearch = [];

console.log(recentSearch);

function fetchData() {
	// event.preventDefault();

	console.log("function working");
	var cityName = $("#search-input").val().trim();

	// var cityName = "london";

	var queryURL =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		cityName +
		"&appid=b355e40379f957cf415beffd26cd7a73";

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
		};

		console.log(city);
		recentSearch.unshift(city);
		localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
		console.log(recentSearch);
		console.log(recentSearch[0]);
	});
}

function renderButtons() {
	recentSearch = JSON.parse(localStorage.getItem("recentSearch"));

	// Deleting the movie buttons prior to adding new movie buttons
	// (this is necessary otherwise we will have repeat buttons)
	$("#history").empty();

	// Looping through the array of movies
	for (var i = 0; i < recentSearch.length; i++) {
		// Then dynamicaly generating buttons for each movie in the array.
		// This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
		var a = $("<button>");
		// Adding a class
		a.addClass("btn history-button bg-secondary rounded mt-3 text-white w-100");
		// Adding a data-attribute with a value of the movie at index i
		a.attr("data-name", recentSearch[i].cityName);
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
	renderButtons(recentSearch);
	// add more functions here as needed
});
