var categories_all, categories_fire, days, hours;
var margin = {top: 10, right: 10, bottom: 35, left: 55},
    widthCat = $("#page2").width() - margin.left - margin.right,
    heightCat = 595 - margin.top - margin.bottom;
var svgCat, xCat, yCat, xAxisCat, yAxisCat;

function loadBarChartDataCat() {
    // Load all categories
    d3.csv("https://gist.githubusercontent.com/SkuliSkula/27a5dee0b162e949fd758110109b191f/raw/ab5562f00e490751dad29e69055df010ed4c6d71/categories_top30.csv", function(error, data){
        if(error) {
            return console.error(error)
        }
        categories_all = data
        initBarChartCat();
        // Load fire gategories
        d3.csv("https://gist.githubusercontent.com/SkuliSkula/27a5dee0b162e949fd758110109b191f/raw/d21d8c98564e75697b97aab3b6d6e92e13795273/fire_gategories_top10.csv", function(error, data){
            if(error) {
                return console.error(error)
            }
            categories_fire = data
            switchBarChartDataCat('fire');

        });
    });
}

function initBarChartCat() {
    xCat = d3.scale.ordinal().rangeRoundBands([0, widthCat], .4);
    yCat = d3.scale.linear().range([heightCat-100, 0]);

    xAxisCat = d3.svg.axis()
        .scale(xCat)
        .orient("bottom");
    
    yAxisCat = d3.svg.axis()
        .scale(yCat)
        .orient("left");

    svgCat = d3.select("#page2").append("svg")
        .attr("width", widthCat + margin.left + margin.right)
        .attr("height", heightCat + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
    
    svgCat.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (heightCat-100) + ")");
    
    svgCat.append("g")
      .attr("class", "y axis")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of incidents");
}

function replayCat(data) {

    if(!data) {
        return;
    }
    var slices = [];
    for (var i = 0; i < data.length; i++) {
        slices.push(data.slice(0, i+1));
    }
    
    slices.forEach(function(slice, index){
        setTimeout(function(){
            drawCat(slice);
        }, index * 100);
    });
}

function getIncidentsNumForScalingCat(data) {
    return data.map(function(d){
        return +d.number_of_incidents;
    });
}

function drawCat(data) {

    xCat.domain(data.map(function(d) {
        return d.category 
    }));
    yCat.domain([0, d3.max(getIncidentsNumForScalingCat(data), function(d) {
      return d; })]);

    svgCat.select('.x.axis').transition().duration(100).call(xAxisCat);

    // same for yAxis but with more transform and a title
    svgCat.select(".y.axis").transition().duration(100).call(yAxisCat)

    tipBarBs = d3.tip().attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d){
        return "<strong>" + "Number of incidents" + ": " + "</strong> <span style='color:red'>" + d.number_of_incidents + "</span>";
    });
    
    svgCat.call(tipBarBs);

    var bars = svgCat.selectAll(".bar").data(data, function(d) {
        return d.category;
    }).on('mouseover', tipBarBs.show)
      .on('mouseout', tipBarBs.hide);

    bars.exit()
    .transition()
    .duration(300)
    .attr("y", yCat(0))
    .attr("height", heightCat-100 - yCat(0))
    .style('fill-opacity', 1e-6)
    .remove();

    
    bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", yCat(0))
    .attr("height", (heightCat -100) - yCat(0));

    // the "UPDATE" set:
    bars.transition()
      .duration(300)
      .attr("x", function(d) {
        return xCat(d.category);
    })
      .attr("width", xCat.rangeBand()) 
      .attr("y", function(d) {
        return yCat(+d.number_of_incidents); 
    })
      .attr("height", function(d) { 
        return heightCat - 100 - yCat(+d.number_of_incidents); 
    });     

}

function switchBarChartDataCat(val) {
    switch(val) {
        case 'all':
            replayCat(categories_all);
            break;
        case 'fire':
            replayCat(categories_fire);
            break;
    }
}