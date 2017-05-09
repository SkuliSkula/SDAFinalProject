var widthSfMap = $("#page1").width();
var heightSfMap = $("#page1").height();
var active = d3.select(null);

var projectionSfMap = d3.geo.mercator()
    .scale(160000)
    .center([-122.4, 37.76]);

var pathSfMap = d3.geo.path()
    .projection(projectionSfMap);

var map, g;

function loadMap() {
    d3.json("https://gist.githubusercontent.com/SkuliSkula/06cb1f3ca0dc71189c413c5669412ae1/raw/fe4eea101db056946e0b851750f4508ae51ca96d/sanfran.geojson", function(error, data) {
        if (error) {
           return console.error(error); 
        }
        initMap(data);
        loadFireStationsData();
    });
}

function loadFireStationsData() {
    d3.csv("https://gist.githubusercontent.com/SkuliSkula/e35b0e3a08a045ceba4e7a3462e546c6/raw/a3f221448c9bb32a422b758c2b3415531b01d093/sffd_fire_stations.csv", function (error, data) {
        if (error) {
            console.log(error);
        }
        else {
            drawFireStations(data);
        }
    });
}

function initMap(data) {
    map = d3.select("#page1").append("svg:svg")
        .attr("width", widthSfMap)
        .attr("height", heightSfMap);

    map.append("rect")
        .attr("class", "background")
        .attr("width", widthSfMap)
        .attr("height", heightSfMap)
        .on("click", reset);
    
    sanFran = map.append("g")
    .style("stroke-width", "1.5px");
    
    sanFran.selectAll("path")
        .data(data.features)
        .enter().append("path")
          .attr("d", pathSfMap)
          .attr("id", "sanfran")
          .on("click", clicked);
}
    
function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = pathSfMap.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .5 / Math.max(dx / widthSfMap, dy / heightSfMap),
      translate = [widthSfMap / 2 - scale * x, heightSfMap / 2 - scale * y];

  sanFran.transition()
      .duration(750)
      .style("stroke-widthSfMap", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  sanFran.transition()
      .duration(750)
      .style("stroke-widthSfMap", "1.5px")
      .attr("transform", "");
}

// Initialize the K data (the small dots)
function drawFireStations(data) {
    
    tip = d3.tip().attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d){
            return "<strong>" + "Address" + ": " + "</strong> <span style='color:red'>" + d.address + "</span>"+ "<br>" +
                    "<strong>" + "Battalion" + ": " + "</strong> <span style='color:red'>" + d.battalion + "</span>"+ "<br>" +
                    "<strong>" + "Station" + ": " + "</strong> <span style='color:red'>" + d.fire_station + "</span>"+ "<br>";
    });
    
    sanFran.call(tip);
    sanFran.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "firestations")
        .attr("cx", function (d) {
            return projectionSfMap([d.longitude, d.latitude])[0];
        })
        .attr("cy", function (d) {
            return projectionSfMap([d.longitude, d.latitude])[1];
        })
        .attr("r", 3)
        .attr("fill", function(d) {
            return colorStations((+(d.battalion.slice(1)-1)));    
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);;
}

// Colors for the k data
function colorStations(color) {
    var colores_g = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f","#bcbd22", "#17becf"];
    return colores_g[color];
}