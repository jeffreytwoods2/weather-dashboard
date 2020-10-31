// Main DOM/Vars
var btn = $("button");
var searchTerms;
var searchHist = [];
var recents = $("#recents");
var inputField = $("#input-field");
var d = new Date();
var today = d.getDate();
// MapQuest DOM and API vars
var lat;
var long;
var city;
var cityEl = $("#city-el");
// OpenWeather DOM and API vars
var date;
var dateEl = $("#date-el");
var iconEl = $("#icon-el");
var forecastDates = $("#forecast-dates");
var iconRow = $("#icon-row");
var tempRow = $("#temp-row");
var humRow = $("#hum-row");
var temp;
var hum;
var wind;
var uv;
var tempEl = $("#temp-el");
var humEl = $("#hum-el");
var windEl = $("#wind-el");
var uvColorEl = $("#color-code");
var lastSearch = localStorage.getItem("history");

btn.on('click', function (event) {
    event.preventDefault();

    // Whatever was typed is saved in array for search history
    searchTerms = $("input").val();
    searchHist.push(searchTerms);
    recents.empty();

    for (i = 0; i < searchHist.length; i++) {

        var newCard = $("<div>");
        newCard.addClass("card");
        newCard.attr({
            style: "padding: 10px; background-color: rgba(0,0,0,.03); margin-top: 5px;",
            // Each of these search history cards will call the normal weather function
            onclick: "histSearch(event)"
        });
        newCard.text(searchHist[i]);
        recents.prepend(newCard)
    };
    
    populateData();

});

// Same main function used to populate all fields; this function is used repeatedly on different buttons/elements
function populateData () {
    var urlSearch = searchTerms.trim();
    inputField.val("");

    tempEl.empty();
    humEl.empty();
    windEl.empty();
    uvColorEl.empty();
    forecastDates.empty();
    iconRow.empty();
    tempRow.empty();
    humRow.empty();

    $.ajax({
        url: "https://www.mapquestapi.com/geocoding/v1/address?key=jHLf4uATR4fijVkLOmrimhIJE79Xp0kx&location=" + urlSearch,
        method: "GET"
    }).then(function (response) {
        lat = response.results[0].locations[0].latLng.lat;
        long = response.results[0].locations[0].latLng.lng;
        city = response.results[0].locations[0].adminArea5;
        cityEl.text(city);
        dateEl.text((d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear())
        
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=38620143f0feedbee7c963b8f6742cad",
            method: "GET"
        }).then(function (response) {
            tempEl.append(" " + response.current.temp.toFixed(0) + "° F");
            humEl.append(" " + response.current.humidity + "%");
            windEl.append(" " + response.current.wind_speed.toFixed(1) + " mph");
            uvColorEl.append(response.current.uvi.toFixed(1));
            // The @2x at the end here is optional, uses bigger icon, very useful for higher-res icons
            iconEl.attr("src", "https://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png")
            
            // This sets the color of the UV index based on intensity
            if (response.current.uvi.toFixed(1) < 6) {
                uvColorEl.attr("style", "background-color: yellow;")
            } else if (response.current.uvi.toFixed(1) < 8) {
                uvColorEl.attr("style", "background-color: orange;")
            } else {
                uvColorEl.attr("style", "background-color: red;")
            };

            for (i = 1; i < 6; i++) {
                // This method of setting the date makes sure that all dates and months are updated automatically,
                // eg. it makes sure that there is no February 30th ever,
                // that Dec 31st + 1 = Jan 1st, etc.
                d.setDate(d.getDate() + 1);
                var newHead = $("<th>");
                var icon = $("<img>");
                var iconTD = $("<td>");
                var tempTD = $("<td>");
                var humTD = $("<td>");
                newHead.text((d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear());
                forecastDates.append(newHead);
                icon.attr("src", "https://openweathermap.org/img/wn/" + response.daily[i - 1].weather[0].icon + ".png");
                iconTD.html(icon);
                iconRow.append(iconTD);
                tempTD.html(response.daily[i - 1].temp.day.toFixed(0) + "° F");
                tempRow.append(tempTD);
                humTD.html("Humidity: " + response.daily[i - 1].humidity + "%");
                humRow.append(humTD);
            };

            // The last search is stored locally, used at loadLastSearch
            localStorage.setItem("history", urlSearch);
            
        });
    });
};


function histSearch (event) {
    searchTerms = event.target.innerHTML.trim();

    populateData();
};


function loadLastSearch () {
    if (lastSearch !== null) {
        // lastSearch pulls up city/state that is currently stored locally
        searchTerms = lastSearch;

        populateData();
    }
};

loadLastSearch();