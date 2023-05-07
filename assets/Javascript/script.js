// Initialize recentSearch and recent5daySearch arrays from localStorage
var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
var recent5daySearch =
	JSON.parse(localStorage.getItem("recent5daySearch")) || [];

// Function to fetch weather data for a given city
function fetchData(cityNameInput) {
	// Build query URL for OpenWeatherMap API
	var queryURL =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		cityNameInput +
		"&units=metric&appid=b355e40379f957cf415beffd26cd7a73";

	// Make AJAX request to API
	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function (response) {
		// Extract relevant data from API response
		var city = {
			cityName: response.name,
			cityTemp: response.main.temp,
			cityWind: response.wind.speed,
			cityHumidity: response.main.humidity,
			cityicon: response.weather[0].icon,
			cityLon: response.coord.lon,
			cityLat: response.coord.lat,
			countrycode: response.sys.country,
		};

		// Format cityNameInput after fetching data
		var cityNameInputAfter = response.name + "," + response.sys.country;
		var index = -1;
		// Check if cityNameInputAfter is already in the recentSearch array
		for (var i = 0; i < recentSearch.length; i++) {
			var cityCheck = recentSearch[i];
			var cityName = cityCheck.cityName + "," + cityCheck.countrycode;

			if (cityName == cityNameInputAfter) {
				index = i;
				// Remove the existing city from recentSearch array
				recentSearch.splice(i, 1);
				break;
			}
		}
		// Add new city data to the beginning of recentSearch array
		recentSearch.unshift(city);
		// Update localStorage with the new recentSearch array
		localStorage.setItem("recentSearch", JSON.stringify(recentSearch));

		// Get latitude and longitude of the city
		var lon = city.cityLon;
		var lat = city.cityLat;
		// Build query URL for OpenWeatherMap API to fetch 5-day forecast
		var queryURL =
			"https://api.openweathermap.org/data/2.5/forecast?lat=" +
			lat +
			"&lon=" +
			lon +
			"&units=metric&appid=7903eed390e3aa4b37da677b9f46ebf7";

		// Make AJAX request to API for 5-day forecast
		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			var city5day = response.list;

			if (index > -1) {
				// Remove existing 5-day forecast data from recent5daySearch array
				recent5daySearch.splice(index, 1);
			}
			// Add new 5-day forecast data to the beginning of recent5daySearch array
			recent5daySearch.unshift(city5day);

			// Update localStorage with the new recent5daySearch array
			localStorage.setItem(
				"recent5daySearch",
				JSON.stringify(recent5daySearch)
			);
		});
	});
}

// Function to render history buttons for recently searched cities
function renderHistoryButtons() {
	$("#history").empty();

	// If recentSearch has more than 6 items, remove the last item
	if (recentSearch.length > 6) {
		recentSearch.pop();
		localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
		recent5daySearch.pop();
		localStorage.setItem("recent5daySearch", JSON.stringify(recent5daySearch));
	}

	// Create history buttons for each city in recentSearch
	for (var i = 0; i < recentSearch.length; i++) {
		var city = recentSearch[i];
		var button = $("<button>")
			.addClass("btn history-button rounded mt-3 text-dark w-100")
			.attr("data-name", city.cityName + "," + city.countrycode)
			.text(city.cityName);

		$("#history").append(button);
	}
}

// Function to display weather data on the page
function displayData() {
	// Format current date
	var nowDate = moment().format("DD/MM/YYYY");
	var city = recentSearch[0];
	// Build icon URL
	var iconSrc =
		"https://openweathermap.org/img/wn/" + city.cityicon + "@2x.png";
	var img = $("<img>").attr("src", iconSrc);
	var kph = city.cityWind * 3.6;

	// Set border for today's weather element
	$("#today").css("border", "1px solid #343a40");

	$("<h2>")
		.text(city.cityName + " " + nowDate)
		.append(img)
		.appendTo("#today");

	$("<h5>")
		.text("Temp: " + city.cityTemp + " °C")
		.appendTo("#today");
	$("<h5>")
		.text("Wind: " + kph.toFixed(1) + " KPH")
		.appendTo("#today");
	$("<h5>")
		.addClass("mb-3")
		.text("Humidity: " + city.cityHumidity + "%")
		.appendTo("#today");

	$("<h4>").addClass("mt-4").text("5-Day Forecast").appendTo("#forecast");

	var cardContainer = $("<div>").addClass("container row card-container");

	// Display the 5-day forecast in separate cards
	for (var i = 0; i < recent5daySearch[0].length; i++) {
		var forecast = recent5daySearch[0][i];
		var dateString = forecast.dt_txt;
		var formattedDate = moment(dateString).format("D/M/YYYY");

		// Display the forecast data for 12:00 PM in each day
		if (dateString.includes("12:00:00")) {
			var forecastIconSrc =
				"https://openweathermap.org/img/wn/" +
				forecast.weather[0].icon +
				"@2x.png";
			var forecastImg = $("<img>").attr("src", forecastIconSrc).css({
				"max-height": "60px",
				"max-width": "60px",
			});

			var card = $("<div>")
				.addClass("forecast-card pt-2 pl-2 pr-5 pb-2")
				.css("background-color", "#2d3e50");

			$("<h5>").text(formattedDate).addClass("text-white").appendTo(card);
			card.append(forecastImg);
			$("<h6>")
				.addClass("text-white")
				.text("Temp: " + forecast.main.temp + " °C")
				.appendTo(card);
			$("<h6>")
				.addClass("text-white")
				.text("Wind: " + forecast.wind.speed.toFixed(1) + " KPH")
				.appendTo(card);
			$("<h6>")
				.addClass("text-white")
				.addClass("mb-3")
				.text("Humidity: " + forecast.main.humidity + "%")
				.appendTo(card);

			cardContainer.append(card);
		}
	}

	$("#forecast").append(cardContainer);
}

// When the document is ready
$(document).ready(function () {
	// Check if there is recent search data and render history buttons if present
	if (recentSearch.length > 0 && recent5daySearch.length > 0) {
		renderHistoryButtons();
	}
});

// Event listener for the search button click
$("#search-button").on("click", function (event) {
	event.preventDefault();

	// Function to capitalize the first letter of a string
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// Get the city name input value and trim any whitespace
	var cityNameInput = $("#search-input").val().trim();
	cityNameInput = capitalizeFirstLetter(cityNameInput);

	// Clear the current weather and forecast sections
	$("#today").empty();
	$("#forecast").empty();

	// Fetch weather data for the entered city name
	fetchData(cityNameInput);

	// Wait for the data to be fetched and then perform the following actions
	setTimeout(function () {
		// Render history buttons
		renderHistoryButtons();

		// Clear the search input value
		$("#search-input").val("");

		// Display the weather data on the page
		displayData();
	}, 200);
});

// Event listener for clicking on a history button
$(document).on("click", ".history-button", function (event) {
	event.preventDefault();

	// Clear the current weather and forecast sections
	$("#today").empty();
	$("#forecast").empty();

	// Get the city name from the clicked history button
	var cityNameInput = $(this).attr("data-name");

	// Set the search input value to the selected city name
	$("#search-input").val(cityNameInput);

	// Fetch weather data for the selected city
	fetchData(cityNameInput);

	// Wait for the data to be fetched and then perform the following actions
	setTimeout(function () {
		// Render history buttons
		renderHistoryButtons();

		// Clear the search input value
		$("#search-input").val("");

		// Display the weather data on the page
		displayData();
	}, 200);
});
