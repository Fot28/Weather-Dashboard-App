var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
var recent5daySearch =
	JSON.parse(localStorage.getItem("recent5daySearch")) || [];

function fetchData(cityNameInput) {
	var queryURL =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		cityNameInput +
		"&units=metric&appid=b355e40379f957cf415beffd26cd7a73";

	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function (response) {
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

		var cityNameInputAfter = response.name + "," + response.sys.country;
		var index = -1;
		for (var i = 0; i < recentSearch.length; i++) {
			var cityCheck = recentSearch[i];
			var cityName = cityCheck.cityName + "," + cityCheck.countrycode;

			if (cityName == cityNameInputAfter) {
				index = i;
				recentSearch.splice(i, 1);
				console.log(recentSearch);
				break;
			}
		}
		recentSearch.unshift(city);
		localStorage.setItem("recentSearch", JSON.stringify(recentSearch));

		var lon = city.cityLon;
		var lat = city.cityLat;
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
			var city5day = response.list;

			if (index > -1) {
				recent5daySearch.splice(index, 1);
			}
			recent5daySearch.unshift(city5day);

			localStorage.setItem(
				"recent5daySearch",
				JSON.stringify(recent5daySearch)
			);
		});
	});
}

function renderHistoryButtons() {
	$("#history").empty();

	if (recentSearch.length > 6) {
		recentSearch.pop();
		localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
		recent5daySearch.pop();
		localStorage.setItem("recent5daySearch", JSON.stringify(recent5daySearch));
	}

	for (var i = 0; i < recentSearch.length; i++) {
		var city = recentSearch[i];
		var button = $("<button>")
			.addClass("btn history-button rounded mt-3 text-dark w-100")
			.attr("data-name", city.cityName + "," + city.countrycode)
			.text(city.cityName);

		$("#history").append(button);
	}
}

function displayData() {
	var nowDate = moment().format("DD/MM/YYYY");
	var city = recentSearch[0];
	var iconSrc =
		"https://openweathermap.org/img/wn/" + city.cityicon + "@2x.png";
	var img = $("<img>").attr("src", iconSrc);
	var kph = city.cityWind * 3.6;

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

	for (var i = 0; i < recent5daySearch[0].length; i++) {
		var forecast = recent5daySearch[0][i];
		var dateString = forecast.dt_txt;
		var formattedDate = moment(dateString).format("D/M/YYYY");

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

$(document).ready(function () {
	if (recentSearch.length > 0 && recent5daySearch.length > 0) {
		renderHistoryButtons();
	}
});

$("#search-button").on("click", function (event) {
	event.preventDefault();
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	var cityNameInput = $("#search-input").val().trim();
	cityNameInput = capitalizeFirstLetter(cityNameInput);
	$("#today").empty();
	$("#forecast").empty();
	fetchData(cityNameInput);
	setTimeout(function () {
		renderHistoryButtons();
		$("#search-input").val("");
		displayData();
	}, 200);
});

$(document).on("click", ".history-button", function (event) {
	event.preventDefault();
	$("#today").empty();
	$("#forecast").empty();
	var cityNameInput = $(this).attr("data-name");
	$("#search-input").val(cityNameInput);
	fetchData(cityNameInput);
	setTimeout(function () {
		renderHistoryButtons();
		$("#search-input").val("");
		displayData();
	}, 200);
});
