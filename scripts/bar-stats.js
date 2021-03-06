var years, months, days, hours;
var margin = {top: 10, right: 10, bottom: 35, left: 45},
    width = $("#page4").width() - margin.left - margin.right,
    height = 595 - margin.top - margin.bottom;
var svgBs, yScaleBs, xScaleBs, xBs, yBs, xAxisBs, yAxisBs;

function loadBarChartData() {
    // Load Years
    d3.csv("https://gist.githubusercontent.com/SkuliSkula/41b1c03b69a6a7abdd5785a3acfa6545/raw/6f22d722b4e55a381b39c440b0cf75fbb0b59ba2/sffd_year_count.csv", function(error, data){
        if(error) {
            return console.error(error)
        }
        years = data
        initBarChart();
        // Load Months
        d3.csv("https://gist.githubusercontent.com/SkuliSkula/41b1c03b69a6a7abdd5785a3acfa6545/raw/6f22d722b4e55a381b39c440b0cf75fbb0b59ba2/sffd_months_count.csv", function(error, data){
            if(error) {
                return console.error(error)
            }
            months = data

                // Load Days
                d3.csv("https://gist.githubusercontent.com/SkuliSkula/41b1c03b69a6a7abdd5785a3acfa6545/raw/6f22d722b4e55a381b39c440b0cf75fbb0b59ba2/sffd_weekdays_count.csv", function(error, data){
                    if(error) {
                        return console.error(error)
                    }
                    days = data

                        // Load Hours
                        d3.csv("https://gist.githubusercontent.com/SkuliSkula/41b1c03b69a6a7abdd5785a3acfa6545/raw/e0e7438fb292388dc7693e4a70818eefe3350e0a/sffd_hour_count.csv", function(error, data){
                            if(error) {
                                return console.error(error)
                            }
                            hours = data

                            switchBarChartData('year');
                        });
                });
        });
    });
}

function initBarChart() {
    xBs = d3.scale.ordinal().rangeRoundBands([0, width], .4);
    yBs = d3.scale.linear().range([height-100, 0]);

    xAxisBs = d3.svg.axis()
        .scale(xBs)
        .orient("bottom");
    
    yAxisBs = d3.svg.axis()
        .scale(yBs)
        .orient("left");

    svgBs = d3.select("#page4").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
    
    svgBs.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height-100) + ")");
    /*.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" ); */
    
    svgBs.append("g")
      .attr("class", "y axis")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of incidents");
}

function replay(data) {

    if(!data) {
        return;
    }
    var slices = [];
    for (var i = 0; i < data.length; i++) {
        slices.push(data.slice(0, i+1));
    }
    
    slices.forEach(function(slice, index){
        setTimeout(function(){
            draw(slice);
        }, index * 100);
    });
}

function getIncidentsNumForScalingBs(data) {
    return data.map(function(d){
        return +d.incidents_num;
    });
}

function draw(data) {

    xBs.domain(data.map(function(d) {
      if(d.year)
          return d.year;
      else if(d.month)
          return d.month;
      else if(d.weekday)
          return d.weekday;
      else if(d.hour)
          return d.hour; 
    }));
    yBs.domain([0, d3.max(getIncidentsNumForScalingBs(data), function(d) {
      return d; })]);

    svgBs.select('.x.axis').transition().duration(100).call(xAxisBs);

    // same for yAxis but with more transform and a title
    svgBs.select(".y.axis").transition().duration(100).call(yAxisBs)

    tipBarBs = d3.tip().attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d){
        return "<strong>" + "Number of incidents" + ": " + "</strong> <span style='color:red'>" + d.incidents_num + "</span>";
    });
    
    svgBs.call(tipBarBs);

    
    var bars = svgBs.selectAll(".bar").data(data, function(d) {
      if(d.year)
          return d.year;
      else if(d.month)
          return d.month;
      else if(d.weekday)
          return d.weekday;
      else if(d.hour)
          return d.hour; 
    }).on('mouseover', tipBarBs.show)
      .on('mouseout', tipBarBs.hide);

    bars.exit()
    .transition()
    .duration(300)
    .attr("y", yBs(0))
    .attr("height", height-100 - yBs(0))
    .style('fill-opacity', 1e-6)
    .remove();

    
    bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", yBs(0))
    .attr("height", (height -100) - yBs(0));

    // the "UPDATE" set:
    bars.transition()
      .duration(300)
      .attr("x", function(d) {
        if(d.year)
            return xBs(d.year);
      else if(d.month)
          return xBs(d.month);
      else if(d.weekday)
          return xBs(d.weekday);
      else if(d.hour)
          return xBs(d.hour); 
    })
      .attr("width", xBs.rangeBand()) 
      .attr("y", function(d) {
        return yBs(+d.incidents_num); 
    })
      .attr("height", function(d) { 
        return height - 100 - yBs(+d.incidents_num); 
    });     

}

function switchBarChartData(val) {
    switch(val) {
        case 'year':
            replay(years);
            break;
        case 'month':
            replay(months);
            break;
        case 'weekday':
            replay(days);
            break;
        case 'hour':
            replay(hours);
            break;
    }
}