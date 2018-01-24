$(document).ready(function () {
    geolocate();

    $(document).on("click","#typeDegree",function(e){
        e.preventDefault();
        if(document.getElementById("typeDegree").innerHTML === "°C"){
            var recvTemp = localStorage.getItem("temperaturesVal");
            $("#temperature").empty();
            var tempCalc = Number(recvTemp)+32;
            $("#temperature").append(tempCalc+"<button type='button' id='typeDegree'></button>");
            $("#typeDegree").empty();
            $("#typeDegree").append("°F");
            localStorage.setItem("temperatures","°F");
            localStorage.setItem("temperaturesVal",tempCalc);
        } else {
            var recvTemp = localStorage.getItem("temperaturesVal");
            $("#temperature").empty();
            var tempCalc = Number(recvTemp) - 32;
            $("#temperature").append(tempCalc+"<button type='button' id='typeDegree'></button>");
            $("#typeDegree").empty();
            $("#typeDegree").append("°C");
            localStorage.setItem("temperatures","°C");
            localStorage.setItem("temperaturesVal",tempCalc);
        }
    });

    $("#aut").on("click",function (e) {
        e.preventDefault();
        window.open("https://banjiportfolio.herokuapp.com/");
    });
});

function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var result = {lat: position.coords.latitude, lon: position.coords.longitude};

            $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?language=en&latlng="+result.lat.toString()+","+result.lon.toString()+"&key=AIzaSyA6dEp-u_gOJvEoobEVRRHYuLs5e9qRj5A",function(data){
                console.log(data.results[4].address_components[0].long_name+","+data.results[4].address_components[2].short_name);
                var temp = data.results[4].address_components[0].long_name+","+data.results[4].address_components[2].short_name;

                $("#town").empty();
                $("#town").append(temp);

                var rapid = new RapidAPI("default-application_5a5e78efe4b0f2c967d9cc37", "eb1d23ce-9b5b-4fda-bed2-892e33a79805");

                rapid.call('YahooWeatherAPI', 'getWeatherForecast', {
                    'location': temp

                }).on('success', function (payload) {
                    console.log(payload);
                    console.log(localStorage.getItem("temperatures"));
                    var weatherString = payload.query.results.channel.item.condition.text.toString();
                    if(localStorage.getItem("temperatures") === null || localStorage.getItem("temperatures") === "°C"){
                        $("#temperature").empty();
                        var recvTemp = payload.query.results.channel.item.condition.temp;
                        var tempCalc = Math.floor((Number(recvTemp) - 32)*(5/9));
                        $("#temperature").append(tempCalc+"<button type='button' id='typeDegree'></button>");
                        $("#typeDegree").empty();
                        $("#typeDegree").append("°C");
                        localStorage.setItem("temperatures","°C");
                        localStorage.setItem("temperaturesVal",tempCalc);
                    } else {
                        $("#temperature").empty();
                        var recvTemp = payload.query.results.channel.item.condition.temp;
                        //var tempCalc = Math.floor((Number(recvTemp)*(9/5))+32);
                        $("#temperature").append(recvTemp+"<button type='button' id='typeDegree'></button>");
                        $("#typeDegree").empty();
                        $("#typeDegree").append("°F");
                        localStorage.setItem("temperatures","°F");
                        localStorage.setItem("temperaturesVal",recvTemp);
                    }
                    $("#weatherInfo").empty();
                    $("#weatherInfo").append(weatherString);
                    switch (weatherString){
                        case "Mostly Sunny":
                            $("#weatherIllustrated").empty();
                            $("#weatherIllustrated").append('<div class="icon sun-shower"><div class="cloud"></div><div class="sun">' +
                                '<div class="rays"></div></div></div>');
                            break;
                        case "Cloudy":
                            $("#weatherIllustrated").empty();
                            $("#weatherIllustrated").append('<div class="icon cloudy"><div class="cloud"></div>' +
                                '<div class="cloud"></div></div>');
                            break;
                        case "Thunderstorm":
                            $("#weatherIllustrated").empty();
                            $("#weatherIllustrated").append('<div class="icon thunder-storm"><div class="cloud"></div>' +
                                '<div class="lightning"><div class="bolt"></div><div class="bolt"></div></div></div>');
                            break;
                        case "Sunny":
                            $("#weatherIllustrated").empty();
                            $("#weatherIllustrated").append('<div class="icon sunny"><div class="sun"><div class="rays"></div>' +
                                '</div></div>');
                            break;
                        case "Rain":
                            $("#weatherIllustrated").empty();
                            $("#weatherIllustrated").append('<div class="icon rainy"><div class="cloud"></div>' +
                                '<div class="rain"></div></div>');
                            break;
                        case "Snow":
                            $("#weatherIllustrated").empty();
                            $("#weatherIllustrated").append('<div class="icon flurries"><div class="cloud"></div>' +
                                '<div class="snow"><div class="flake"></div><div class="flake"></div></div></div>');
                            break;
                    }
                }).on('error', function (payload) {
                    console.log(payload);
                });
            });


        });
    }
}