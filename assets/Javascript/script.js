var recentSearch = [];

console.log(recentSearch);

function fetchData(event) {
	event.preventDefault();

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

$(document).ready(function () {
	recentSearch = JSON.parse(localStorage.getItem("recentSearch"));

	console.log(recentSearch);
});

$(document).on("click", "#search-button", fetchData);
