var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
var recent5daySearch =
	JSON.parse(localStorage.getItem("recent5daySearch")) || [];
console.log(recentSearch);
var cityName = "";

function fetchData() {
	var nowDate = moment().format("(DD/MM/YYYY)");
	var nowDay = parseInt(moment().format("DD"));
	console.log(nowDate);
	console.log(nowDay);

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
			cityWind: response.wind.speed,
			cityHumidity: response.main.humidity,
			cityicon: response.weather[0].icon,
			cityLon: response.coord.lon,
			cityLat: response.coord.lat,
			countrycode: response.sys.country,
		};
		recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];

		recentSearch.unshift(city);
		console.log(city);

		localStorage.setItem("recentSearch", JSON.stringify(recentSearch));

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
			console.log("HERE" + response.list[1].dt_txt);
			// for (){

			// }
			var city5day = response.list;

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

	if (recentSearch.length > 6) {
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
		a.attr(
			"data-name",
			recentSearch[i].cityName + "," + recentSearch[i].countrycode
		);
		// Providing the button's text with a value of the cityName at index i
		a.text(recentSearch[i].cityName);
		// Adding the button to the HTML
		$("#history").append(a);
	}
}

function displayData() {
	var nowDate = moment().format("(DD/MM/YYYY)");
	var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];
	console.log(recentSearch[0].cityicon);
	var recent5daySearch =
		JSON.parse(localStorage.getItem("recent5daySearch")) || [];
	console.log(recent5daySearch[0]);

	var iconSrc =
		"https://openweathermap.org/img/wn/" + recentSearch[0].cityicon + "@2x.png";

	var img = $("<img>").attr("src", iconSrc);
	console.log(img);

	function convertMpsToKph(mps) {
		return mps * 3.6;
	}

	var mps = recentSearch[0].cityWind;
	console.log(mps);
	var kph = convertMpsToKph(mps);
	$("#today").css("border", "1px solid #343a40");
	var a = $("<h2>");
	a.text(recentSearch[0].cityName + " " + nowDate + "");
	a.append(img); // Append the img element to the h1 element
	$("#today").append(a);
	var b = $("<h5>");
	b.text("Temp: " + recentSearch[0].cityTemp + " °C");
	$("#today").append(b);
	var c = $("<h5>");
	c.text("Wind: " + kph.toFixed(1) + " KPH");
	$("#today").append(c);
	var d = $("<h5>");
	d.addClass("mb-3");
	d.text("Humidity: " + recentSearch[0].cityHumidity + "%");
	$("#today").append(d);

	// 5-Day Forecast append info
	var d = $("<h4>");
	d.text("5-Day Forecast");
	$("#forecast").append(d);

	var cardContainer = $("<div>").addClass("container row card-container");

	for (var i = 0; i < recent5daySearch[0].length; i++) {
		var noon = recent5daySearch[0][i].dt_txt;
		// console.log(recent5daySearch[0][i].dt_txt);
		var substring = "12:00:00";

		if (noon.includes(substring)) {
			console.log(recent5daySearch[0][i].dt_txt);

			var mps = recent5daySearch[0][i].wind.speed;
			console.log(mps);
			var kph = convertMpsToKph(mps);

			var dateString = recent5daySearch[0][i].dt_txt;
			var formattedDate = moment(dateString).format("D/M/YYYY");

			var forecastIconSrc =
				"https://openweathermap.org/img/wn/" +
				recent5daySearch[0][i].weather[0].icon +
				"@2x.png";

			var forecastImg = $("<img>")
				.attr("src", forecastIconSrc)
				.css("max-height", "60px")
				.css("max-width", "60px");
			console.log(img);

			var card = $("<div>")
				.addClass("forecast-card pt-2 pl-2 pr-5 pb-2")
				.css("background-color", "#343a40");

			var e = $("<h5>").text(formattedDate).addClass("text-white");
			card.append(e);
			card.append(forecastImg);

			var f = $("<h6>").addClass("text-white");
			f.text("Temp: " + recent5daySearch[0][i].main.temp + " °C");
			card.append(f);
			var g = $("<h6>").addClass("text-white");
			g.text("Wind: " + kph.toFixed(1) + " KPH");
			card.append(g);
			var h = $("<h6>").addClass("text-white");
			h.addClass("mb-3");
			h.text("Humidity: " + recent5daySearch[0][i].main.humidity + "%");
			card.append(h);

			cardContainer.append(card);

			console.log(formattedDate);
		}
	}
	$("#forecast").append(cardContainer);
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
	$("#today").empty();
	$("#forecast").empty();
	fetchData();
	setTimeout(function () {
		renderButtons();
		$("#search-input").val("");
		displayData();
	}, 200);
});

$(document).on("click", ".history-button", function (event) {
	event.preventDefault();
	$("#today").empty();
	$("#forecast").empty();
	var historyname = $(this).attr("data-name"); // Get the data-name value from the clicked button
	console.log(historyname);
	$("#search-input").val(historyname); // Set the value of the search input field to the cityName
	console.log("history working");
	fetchData();
	setTimeout(function () {
		renderButtons();
		$("#search-input").val("");
		displayData();
	}, 200);
});
