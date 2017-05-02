// Declare the global variables
var w = $("#page1").width();
var h = $("#page1").height();
var projection = d3.geo.mercator().scale(155000).center([-122.4, 37.76]); // Center the map over SFC
var path = d3.geo.path().projection(projection);
var t = projection.translate(); // the projection's default translation
var s = projection.scale(); // the projection's default scale
var sanFran, map, sanFranMapData;

// timestampApis, timestampPriceChange, timestampPriceCheck

//Load in GeoJSON data
function loadGeoJSONData() {
    d3.json("/data/geodata.geojson", function (error, data) {
        if (error) {
            return console.error(error);
        }  
        sanFranMapData = data;
        console.log(data);
        initGeoVisualization(data);
        loadFireStationsData();
    });
}

function loadFireStationsData() {
    d3.csv("/data/sffd_fire_stations.csv", function (error, data) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(data);
            drawFireStations(data);
        }
    });
}

// Initialize the map of SFC
function initGeoVisualization(data) {
    map = d3.select("#page1").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .call(d3.behavior.zoom().on("zoom", redraw));

    sanFran = map.append("svg:g").attr("id", "sanfran");

    sanFran.selectAll("path")
        .data(data.features)
        .enter()
        .append("svg:path")
        .attr("d", path)
        .on('mouseover', function(){
            $.fn.fullpage.setAllowScrolling(false);
        })
        .on('mouseout', function(){
            $.fn.fullpage.setAllowScrolling(true);
    });
}

function redraw() {
      // d3.event.translate (an array) stores the current translation from the parent SVG element
      // t (an array) stores the projection's default translation
      // we add the x and y vales in each array to determine the projection's new translation
      var tx = t[0] * d3.event.scale + d3.event.translate[0];
      var ty = t[1] * d3.event.scale + d3.event.translate[1];
      projection.translate([tx, ty]);

      // now we determine the projection's new scale, but there's a problem:
      // the map doesn't 'zoom onto the mouse point'
      projection.scale(s * d3.event.scale);

      // redraw the map
      sanFran.selectAll("path").attr("d", path);
      sanFran.selectAll("circle")
            .attr("cx", function (d) {
                return projection([d.longitude, d.latitude])[0];
            }).attr("cy", function (d) {
                return projection([d.longitude, d.latitude])[1];
            }).attr("r", 3);
}

// Initialize the K data (the small dots)
function drawFireStations(data) {
    
    tip = d3.tip().attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d){
            return "<strong>" + "Address" + ": " + "</strong> <span style='color:red'>" + d.address + "</span>"+ "<br>" +
                    "<strong>" + "Battalion" + ": " + "</strong> <span style='color:red'>" + d.battalion + "</span>"+ "<br>" +
                    "<strong>" + "Station" + ": " + "</strong> <span style='color:red'>" + d.station + "</span>"+ "<br>";
    });
    
    sanFran.call(tip);
    sanFran.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "firestations")
        .attr("cx", function (d) {
            return projection([d.longitude, d.latitude])[0];
        })
        .attr("cy", function (d) {
            return projection([d.longitude, d.latitude])[1];
        })
        .attr("r", 3)
        .attr("fill", function(d) {
            return colorStations((+d.battalion-1));    
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);;
}

// Colors for the k data
function colorStations(color) {
    var colores_g = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f","#bcbd22", "#17becf"];
    return colores_g[color];
}