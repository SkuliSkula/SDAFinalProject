//var width = $("#barchart").width()- margin.left - margin.right;
//var height = $("#barchart").height() - 200- margin.top - margin.bottom;
var years, months, days, hours;
var margin = {top: 10, right: 10, bottom: 35, left: 45},
    width = $("#page3").width() - margin.left - margin.right,
    height = 595 - margin.top - margin.bottom;
var svg, yScale, xScale, x, y, xAxis, yAxis;


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
                        d3.csv("https://gist.githubusercontent.com/SkuliSkula/41b1c03b69a6a7abdd5785a3acfa6545/raw/6f22d722b4e55a381b39c440b0cf75fbb0b59ba2/sffd_hour_count.csv", function(error, data){
                            if(error) {
                                return console.error(error)
                            }
                            hours = data

                            switchBarChartData('year');
                            console.log(years,months,days,hours);
                        });
                });
        });
    });
}

function initBarChart() {
    x = d3.scale.ordinal().rangeRoundBands([0, width], .4);
    y = d3.scale.linear().range([height-100, 0]);

    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    svg = d3.select("#page3").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
    
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height-100) + ")");
    /*.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" ); */
    
    svg.append("g")
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
        }, index * 300);
    });
}

function getIncidentsNumForScaling(data) {
    return data.map(function(d){
        return +d.incidents_num;
    });
}

function clearCurrentBarChart() {
    if(svg.selectAll("g")) {
        svg.selectAll("g").remove();
        svg.selectAll("rect").remove();       
    }

}

function draw(data) {

    x.domain(data.map(function(d) {
      if(d.year)
          return d.year;
      else if(d.month)
          return d.month;
      else if(d.weekday)
          return d.weekday;
      else if(d.hour)
          return d.hour; 
    }));
    y.domain([0, d3.max(getIncidentsNumForScaling(data), function(d) {
      return d; })]);

    svg.select('.x.axis').transition().duration(300).call(xAxis);

    // same for yAxis but with more transform and a title
    svg.select(".y.axis").transition().duration(300).call(yAxis)

    tipBar = d3.tip().attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d){
        return "<strong>" + "Number of incidents" + ": " + "</strong> <span style='color:red'>" + d.incidents_num + "</span>";
    });
    
    svg.call(tipBar);

    // THIS IS THE ACTUAL WORK!
    var bars = svg.selectAll(".bar").data(data, function(d) {
      if(d.year)
          return d.year;
      else if(d.month)
          return d.month;
      else if(d.weekday)
          return d.weekday;
      else if(d.hour)
          return d.hour; 
    }).on('mouseover', tipBar.show)
      .on('mouseout', tipBar.hide);

    bars.exit()
    .transition()
    .duration(300)
    .attr("y", y(0))
    .attr("height", height-100 - y(0))
    .style('fill-opacity', 1e-6)
    .remove();

    // data that needs DOM = enter() (a set/selection, not an event!)
    bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", y(0))
    .attr("height", height -100 - y(0));

    // the "UPDATE" set:
    bars.transition()
      .duration(300)
      .attr("x", function(d) {
        if(d.year)
            return x(d.year);
      else if(d.month)
          return x(d.month);
      else if(d.weekday)
          return x(d.weekday);
      else if(d.hour)
          return x(d.hour); 
    })
      .attr("width", x.rangeBand()) 
      .attr("y", function(d) {
        return y(+d.incidents_num); 
    })
      .attr("height", function(d) { 
        return height - 100 - y(+d.incidents_num); 
    });     

}

function switchBarChartData(val) {
    var data = undefined;
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
