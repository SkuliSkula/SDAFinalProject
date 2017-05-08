// Declare the global variables
var svgGEO = undefined;
var w = $("#page4").width();
var h = $("#page4").height();
var kData = [];
var kMeansData = {};
var active = d3.select(null);
//Define map projection
var projection = d3.geo.mercator().scale(160000)
    .center([-122.4, 37.76]); // Center the Map in San Francisco
    //.translate([w / 2, h / 2]);

var path = d3.geo.path()
    .projection(projection);
                
var map, g
//Load in GeoJSON data
function loadKMeansMap() {
    d3.json("https://gist.githubusercontent.com/SkuliSkula/06cb1f3ca0dc71189c413c5669412ae1/raw/fe4eea101db056946e0b851750f4508ae51ca96d/sanfran.geojson", function (error, data) {
        if (error) {
            console.log(error);
        }
        else {
            initKMap(data);
            loadKData();
        }
    });
}

function initKMap(data) {
    map = d3.select("#page4").append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    map.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", resetK);
    
    svgGEO = map.append("g")
    .style("stroke-width", "1.5px");
    
    svgGEO.selectAll("path")
        .data(data.features)
        .enter().append("path")
          .attr("d", path)
          .attr("id", "sanfran")
          .on("click", clickedK);
}
// Load the data lat and lon for k
function loadKData() {
    d3.csv("https://gist.githubusercontent.com/SkuliSkula/dbea0e7641b1258025ff4c5d134716bd/raw/fffc52a5abe47c76490ccc11f3129031d6ec9fd9/k_means_building_fires_cluster_labels.csv", function (error, data) {
        if (error) {
            console.log(error);
        }
        else {
            kData = data;
            initKData(kData);
            loadKMeansData();
        }
    });
}
// Load the data for the k means circles
function loadKMeansData() {
    d3.json("https://gist.githubusercontent.com/SkuliSkula/dbea0e7641b1258025ff4c5d134716bd/raw/fffc52a5abe47c76490ccc11f3129031d6ec9fd9/k_means_building_fires_cluster_centers.json", function (error, data) {
        if (error) console.log("LoadKMeans error: ", error);
        else kMeansData = data;
        initGeoKMeansCircles();
    });
}
// Initialize the K data (the small dots)
function initKData(data) {
    svgGEO.selectAll(".in")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "kCircle")
        .attr("cx", function (d) {
            return projection([d.lon, d.lat])[0];
        }).attr("cy", function (d) {
            return projection([d.lon, d.lat])[1];
        }).attr("r", 1.5).attr("fill", function (d, i) {
            if (+d.k2 == 0) return colorKCircle(0);
            else if (d.k2 == 1) return colorKCircle(1);
    });
}
// Remove the Kmeans circles
function removeCircles() {
    svgGEO.selectAll(".geokmeans").remove();
}
// Initialize the KMeans circles
function initGeoKMeansCircles(k) {
    var dataK = [];
    if (!k) {
        dataK = jsonToArray("k2");
    }
    else {
        removeCircles();
        dataK = jsonToArray(k);
    }
    svgGEO.selectAll(".out")
        .data(dataK[0])
        .enter()
        .append("circle")
        .attr("class", "geokmeans")
        .attr("cx", function (d) {
            return projection([d.lon, d.lat])[0];
        }).attr("cy", function (d) {
            return projection([d.lon, d.lat])[1];
        }).attr("r", 9);
}
// Switch data between different values of k (k=2,3,4,5,6)
function showKData(k) {
    initGeoKMeansCircles(k);
    svgGEO.selectAll("circle")
        .data(kData)
        .attr("cx", function (d) {
            return projection([d.lon, d.lat])[0];
        }).attr("cy", function (d) {
            return projection([d.lon, d.lat])[1];
        }).attr("r", 1.5).attr("fill", function (d, i) {
            if (k == "k2") {
                if (+d.k2 === 0) return colorKCircle(0);
                else if (+d.k2 === 1) return colorKCircle(1);
        }
            else if (k == "k3") {
                if (+d.k3 === 0) return colorKCircle(0);
                else if (+d.k3 === 1) return colorKCircle(1);
                else if (+d.k3 === 2) return colorKCircle(2);
            }
            else if (k == "k4") {
                if (+d.k4 === 0) return colorKCircle(0);
                else if (+d.k4 === 1) return colorKCircle(1);
                else if (+d.k4 === 2) return colorKCircle(2);
                else if (+d.k4 === 3) return colorKCircle(3);
            }
            else if (k == "k5") {
                if (+d.k5 === 0) return colorKCircle(0);
                else if (+d.k5 === 1) return colorKCircle(1);
                else if (+d.k5 === 2) return colorKCircle(2);
                else if (+d.k5 === 3) return colorKCircle(3);
                else if (+d.k5 === 4) return colorKCircle(4);
            }
            else {
                if (+d.k6 === 0) return colorKCircle(0);
                else if (+d.k6 === 1) return colorKCircle(1);
                else if (+d.k6 === 2) return colorKCircle(2);
                else if (+d.k6 === 3) return colorKCircle(3);
                else if (+d.k6 === 4) return colorKCircle(4);
                else if (+d.k6 === 5) return colorKCircle(5);
            }
    });
}
// Colors for the k data
function colorKCircle(color) {
    var colores_g = ["#22aa99", "#dc3912", "#ff9900", "#990099", "#aaaa11", "#A9A9A9"];
    return colores_g[color];
}
// Change the json object with the kMeansdata to an array so we can give it as a dataset
function jsonToArray(k) {
    var temp = [];
    for (var i in kMeansData) {
        if (i == k) temp.push(kMeansData[i]);
    }
    return temp;
}

function clickedK(d) {
  if (active.node() === this) return resetK();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .5 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svgGEO.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

function resetK() {
  active.classed("active", false);
  active = d3.select(null);

  svgGEO.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform", "");
}
