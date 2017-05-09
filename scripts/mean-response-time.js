//var width = $("#barchart").width()- margin.left - margin.right;
//var height = $("#barchart").height() - 200- margin.top - margin.bottom;
var mrtBattalions, mrtFirestations, mrtHours, mrtMonths, mrtWeekDays, mrtYears;
var marginMrt = {top: 10, right: 10, bottom: 35, left: 45},
    widthMrt = $("#page5").width() - marginMrt.left - marginMrt.right,
    heightMrt = 595 - marginMrt.top - marginMrt.bottom;
var svgMrt, yScaleMrt, xScaleMrt, xMrt, yMrt, xAxisMrt, yAxisMrt;


function loadBarChartDataMrt() {
    // Load Battalions
    d3.csv("https://gist.githubusercontent.com/SkuliSkula/925cf03b269c5c67bce9429b86e1f8a7/raw/8c6bb2bd6abf87b95cd8a9a9583acf7f95cd297f/mean_response_time_battalion.csv", function(error, data){
        if(error) {
            return console.error(error)
        }
        mrtBattalions = data
        initMrtBarChart();
        // Load Firestations
        d3.csv("https://gist.githubusercontent.com/SkuliSkula/925cf03b269c5c67bce9429b86e1f8a7/raw/8c6bb2bd6abf87b95cd8a9a9583acf7f95cd297f/mean_response_time_fire_station.csv", function(error, data){
            if(error) {
                return console.error(error)
            }
            mrtFirestations = data

                // Load Days
                d3.csv("https://gist.githubusercontent.com/SkuliSkula/925cf03b269c5c67bce9429b86e1f8a7/raw/8c6bb2bd6abf87b95cd8a9a9583acf7f95cd297f/mean_response_time_weekday.csv", function(error, data){
                    if(error) {
                        return console.error(error)
                    }
                    mrtWeekDays = data

                        // Load Hours
                        d3.csv("https://gist.githubusercontent.com/SkuliSkula/925cf03b269c5c67bce9429b86e1f8a7/raw/8c6bb2bd6abf87b95cd8a9a9583acf7f95cd297f/mean_response_time_hour.csv", function(error, data){
                            if(error) {
                                return console.error(error)
                            }
                            mrtHours = data

                            // Load Months
                            d3.csv("https://gist.githubusercontent.com/SkuliSkula/925cf03b269c5c67bce9429b86e1f8a7/raw/8c6bb2bd6abf87b95cd8a9a9583acf7f95cd297f/mean_response_time_month.csv", function(error, data) {
                                if(error) {
                                    return console.error(error);
                                }
                                mrtMonths = data;
                                
                                
                                // Load Years
                                d3.csv("https://gist.githubusercontent.com/SkuliSkula/925cf03b269c5c67bce9429b86e1f8a7/raw/8c6bb2bd6abf87b95cd8a9a9583acf7f95cd297f/mean_response_time_year.csv", function(error, data) {
                                    if(error) {
                                        return console.error(error);
                                    }
                                    mrtYears = data;
                                    switchBarChartDataMrt('battalion');
                                })
                            });
                        
                        });
                });
        });
    });
}

function initMrtBarChart() {
    xMrt = d3.scale.ordinal().rangeRoundBands([0, widthMrt], .4);
    yMrt = d3.scale.linear().range([heightMrt-100, 0]);

    xAxisMrt = d3.svg.axis()
        .scale(xMrt)
        .orient("bottom");
    
    yAxisMrt = d3.svg.axis()
        .scale(yMrt)
        .orient("left");

    svgMrt = d3.select("#page5").append("svg:svg")
        .attr("width", widthMrt + marginMrt.left + marginMrt.right)
        .attr("height", heightMrt + marginMrt.top + marginMrt.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + marginMrt.left + "," + marginMrt.top + ")");
    
    svgMrt.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (heightMrt-100) + ")");
    /*.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" ); */
    
    svgMrt.append("g")
      .attr("class", "y axis")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Mean response time");
}

function replayMrt(data) {
    console.log(data);
    if(!data) {
        return;
    }
    var slices = [];
    for (var i = 0; i < data.length; i++) {
        slices.push(data.slice(0, i+1));
    }
    
    slices.forEach(function(slice, index){
        setTimeout(function(){
            drawMrt(slice);
        }, index * 100);
    });
}

function getIncidentsNumForScalingMr(data) {
    return data.map(function(d){
        return +d.mean_response_time;
    });
}

function drawMrt(data) {

    xMrt.domain(data.map(function(d) {
      if(d.year)
          return d.year;
      else if(d.month)
          return d.month;
      else if(d.weekday)
          return d.weekday;
      else if(d.hour)
          return d.hour;
      else if(d.fire_station)
          return d.fire_station;
      else if(d.battalion)
          return d.battalion;
    }));
    yMrt.domain([0, d3.max(getIncidentsNumForScalingMr(data), function(d) {
      return d; })]);

    svgMrt.select('.x.axis').transition().duration(100).call(xAxisMrt);

    // same for yAxis but with more transform and a title
    svgMrt.select(".y.axis").transition().duration(100).call(yAxisMrt)

    tipBarMrt = d3.tip().attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d){
        return "<strong>" + "Mean response time" + ": " + "</strong> <span style='color:red'>" + d.mean_response_time + "</span>";
    });
    
    svgMrt.call(tipBarMrt);

    
    var barsMrt = svgMrt.selectAll(".bar").data(data, function(d) {
      if(d.battalion)
          return d.battalion;
      else if(d.month)
          return d.month;
      else if(d.weekday)
          return d.weekday;
      else if(d.hour)
          return d.hour; 
      else if(d.fire_station)
          return d.fire_station;
      else if(d.year)
          return d.year;
    }).on('mouseover', tipBarMrt.show)
      .on('mouseout', tipBarMrt.hide);

    barsMrt.exit()
    .transition()
    .duration(300)
    .attr("y", yMrt(0))
    .attr("height", heightMrt-100 - yMrt(0))
    .style('fill-opacity', 1e-6)
    .remove();

    
    barsMrt.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", yMrt(0))
    .attr("height", heightMrt -100 - yMrt(0));

    // the "UPDATE" set:
    barsMrt.transition()
      .duration(300)
      .attr("x", function(d) {
        if(d.year)
            return xMrt(d.year);
      else if(d.month)
          return xMrt(d.month);
      else if(d.weekday)
          return xMrt(d.weekday);
      else if(d.hour)
          return xMrt(d.hour);
      else if(d.fire_station)
          return xMrt(d.fire_station);
      else if(d.battalion)
          return xMrt(d.battalion);
    })
      .attr("width", xMrt.rangeBand()) 
      .attr("y", function(d) {
        return yMrt(+d.mean_response_time); 
    })
      .attr("height", function(d) { 
        return heightMrt - 100 - yMrt(+d.mean_response_time); 
    });     

}

function switchBarChartDataMrt(val) {
    switch(val) {
        case 'battalion':
            replayMrt(mrtBattalions);
            break;
        case 'month':
            replayMrt(mrtMonths);
            break;
        case 'weekday':
            replayMrt(mrtWeekDays);
            break;
        case 'hour':
            replayMrt(mrtHours);
            break;
        case 'firestation':
            replayMrt(mrtFirestations);
            break;
        case 'year':
            replayMrt(mrtYears);
            break;
    }
}
