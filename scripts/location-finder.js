function getLatLong() {
    var geocoder = new google.maps.Geocoder();
    var location = {lat: "", long: ""};
    var address = $("#address-search").val();
    
    geocoder.geocode( { 'address': address}, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK && address != "") {
            var lat = results[0].geometry.location.lat();
            var long = results[0].geometry.location.lng();
            var addr = results[0].formatted_address;
            console.log(results);
            $("#showAddress").text("Address: " + addr);
            $("#showLat").text("Latitude: " + lat);
            $("#showLong").text("Longitude: " + long);
          } 
            else {
                alert(address + " not found");
            }
        });   
}
