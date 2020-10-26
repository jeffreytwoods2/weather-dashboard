// Main DOM Vars
var btn = $("button");
var searchTerms;
var searchHist = [];
// MapQuest API vars
var lat;
var long;
var city;
var cityEl = $("#city-el");
// OpenWeather API vars
var date;
var dateEl = $("#date-el");
var temp;
var hum;
var wind;
var uv;
var tempEl = $("#temp-el");
var humEl = $("#hum-el");
var windEl = $("#wind-el");
var uvColorEl = $("#color-code");

btn.on('click', function (event) {
    event.preventDefault();

    searchTerms = $("input").val();
    searchHist.push(searchTerms);

    for (i = 0; i < searchHist.length; i++) {
        var newCard = $("<div>");
        newCard.addClass("card");
        newCard.attr({
            style: "padding: 10px;",
            onclick: "populateData()"
        });
        newCard.text(searchTerms);
        $("#recents").append(newCard)
    };
    
    populateData();

});

function populateData () {
    var urlSearch = searchTerms.trim();

    tempEl.empty();
    humEl.empty();
    windEl.empty();
    uvColorEl.empty();

    $.ajax({
        url: "http://www.mapquestapi.com/geocoding/v1/address?key=jHLf4uATR4fijVkLOmrimhIJE79Xp0kx&location=" + urlSearch,
        method: "GET"
    }).then(function (response) {
        lat = response.results[0].locations[0].latLng.lat;
        long = response.results[0].locations[0].latLng.lng;
        city = response.results[0].locations[0].adminArea5;
        cityEl.text(city);
        
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=38620143f0feedbee7c963b8f6742cad",
            method: "GET"
        }).then(function (response) {
            console.log(response);
            tempEl.append(" " + response.current.temp.toFixed(0));
            humEl.append(" " + response.current.humidity + "%");
            windEl.append(" " + response.current.wind_speed.toFixed(1) + " mph");
            uvColorEl.append(response.current.uvi.toFixed(1));
            
            if (response.current.uvi.toFixed(1) < 6) {
                uvColorEl.attr("style", "background-color: yellow;")
            } else if (response.current.uvi.toFixed(1) < 8) {
                uvColorEl.attr("style", "background-color: orange;")
            } else {
                uvColorEl.attr("style", "background-color: red;")
            };
            
        });
    });
};

// // MapQuest API
// $.ajax({
//     url: "http://www.mapquestapi.com/geocoding/v1/address?key=jHLf4uATR4fijVkLOmrimhIJE79Xp0kx&location=" + searchTerms,
//     method: "GET"
// }).then(function (response) {
//     console.log(response);
// });

// // OpenWeather API
// $.ajax({
//     url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=fc081ad068a0564d02828ff534f06c9",
//     method: "GET"
// }).then(function (response) {
//     console.log(response);
// });