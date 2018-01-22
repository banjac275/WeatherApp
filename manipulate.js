$(document).ready(function () {
    geolocate();

});

function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var result = {lat: position.coords.latitude, lon: position.coords.longitude};

            $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?language=en&latlng="+result.lat.toString()+","+result.lon.toString()+"&key=AIzaSyA6dEp-u_gOJvEoobEVRRHYuLs5e9qRj5A",function(data){
                console.log(data.results[4].address_components[0].long_name+","+data.results[4].address_components[2].short_name);
                $("#town").empty();
                $("#town").append(data.results[4].address_components[0].long_name+","+data.results[4].address_components[2].short_name);
            });

            $.getJSON("http://api.wunderground.com/api/a23f01136c4036c3/geolookup/q/"+result.lat.toString()+","+result.lon.toString()+".json",function(dataa){
                console.log(dataa)
            });

        });
    }
}