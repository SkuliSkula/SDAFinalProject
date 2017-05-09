//var width = $("#barchart").width()- margin.left - margin.right;
//var height = $("#barchart").height() - 200- margin.top - margin.bottom;
var mmBattalions, mmFireStations, mmHours, mmMonths, mmWeekDays, mmYears;
var marginMm = {top: 10, right: 10, bottom: 35, left: 45},
    widthMm = $("#page6").width() - marginMm.left - marginMm.right,
    heightMm = 595 - marginMm.top - marginMm.bottom;
var svgMm, yScaleMm, xScaleMm, xMm, yMm, xAxisMm, yAxisMm;


function loadBarChartDataMm() {
    // Load Battalions
    d3.csv("https://gist.githubusercontent.com/SkuliSkula/b161d2c8d1da235a5fa7238189dff0dd/raw/48bc3bfc78d62ad12aefcf47cf8b6fb961e5b41f/mean_m_per_s_battalion.csv", function(error, data){
        if(error) {
            return console.error(error)
        }
        mmBattalions = data
        initMmBarChart();
        // Load Firestations
        d3.csv("https://gist.githubusercontent.com/SkuliSkula/b161d2c8d1da235a5fa7238189dff0dd/raw/48bc3bfc78d62ad12aefcf47cf8b6fb961e5b41f/mean_m_per_s_fire_station.csv", function(error, data){
            if(error) {
                return console.error(error)
            }
            mmFireStations = data

                // Load Days
                d3.csv("https://gist.githubusercontent.com/SkuliSkula/b161d2c8d1da235a5fa7238189dff0dd/raw/48bc3bfc78d62ad12aefcf47cf8b6fb961e5b41f/mean_m_per_s_weekday.csv", function(error, data){
                    if(error) {
                        return console.error(error)
                    }
                    mmWeekDays = data

                        // Load Hours
                        d3.csv("https://gist.githubusercontent.com/SkuliSkula/b161d2c8d1da235a5fa7238189dff0dd/raw/48bc3bfc78d62ad12aefcf47cf8b6fb961e5b41f/mean_m_per_s_hour.csv", function(error, data){
                            if(error) {
                                return console.error(error)
                            }
                            mmHours = data

                            // Load Months
                            d3.csv("https://gist.githubusercontent.com/SkuliSkula/b161d2c8d1da235a5fa7238189dff0dd/raw/48bc3bfc78d62ad12aefcf47cf8b6fb961e5b41f/mean_m_per_s_month.csv", function(error, data) {
                                if(error) {
                                    return console.error(error);
                                }
                                mmMonths = data;
                                
                                
                                // Load Years
                                d3.csv("https://gist.githubusercontent.com/SkuliSkula/b161d2c8d1da235a5fa7238189dff0dd/raw/48bc3bfc78d62ad12aefcf47cf8b6fb961e5b41f/mean_m_per_s_year.csv", function(error, data) {
                                    if(error) {
                                        return console.error(error);
                                    }
                                    mmYears = data;
                                    switchBarChartDataMm('battalion');
                                   
                                })
                            });
                        
                        });
                });
        });
    });
}

function initMmBarChart() {
    xMm = d3.scale.ordinal().rangeRoundBands([0, widthMm], .4);
    yMm = d3.scale.linear().range([heightMm-100, 0]);

    xAxisMm = d3.svg.axis()
        .scale(xMm)
        .orient("bottom");
    
    yAxisMm = d3.svg.axis()
        .scale(yMm)
        .orient("left");

    svgMm = d3.select("#page6").append("svg:svg")
        .attr("width", widthMm + marginMm.left + marginMm.right)
        .attr("height", heightMm + marginMm.top + marginMm.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + marginMm.left + "," + marginMm.top + ")");
    
    svgMm.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (heightMm-100) + ")");
    /*.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" ); */
    
    svgMm.append("g")
      .attr("class", "y axis")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("M/S");
}

function replayMm(data) {
    if(!data) {
        return;
    }
    var slices = [];
    for (var i = 0; i < data.length; i++) {
        slices.push(data.slice(0, i+1));
    }
    
    slices.forEach(function(slice, index){
        setTimeout(function(){
            drawMm(slice);
        }, index * 100);
    });
}

function getNumForScalingMm(data) {
    return data.map(function(d){
        return +d.mean_m_per_s;
    });
}

function drawMm(data) {
    console.log(data);
    xMm.domain(data.map(function(d) {
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
    yMm.domain([0, d3.max(getNumForScalingMm(data), function(d) {
      return d; })]);

    svgMm.select('.x.axis').transition().duration(100).call(xAxisMm);

    // same for yAxis but with more transform and a title
    svgMm.select(".y.axis").transition().duration(100).call(yAxisMm)

    tipBarMm = d3.tip().attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d){
        return "<strong>" + "Mean m/s" + ": " + "</strong> <span style='color:red'>" + d.mean_m_per_s + "</span>";
    });
    
    svgMm.call(tipBarMm);

    
    var barsMm = svgMm.selectAll(".bar").data(data, function(d) {
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
    }).on('mouseover', tipBarMm.show)
      .on('mouseout', tipBarMm.hide);

    barsMm.exit()
    .transition()
    .duration(300)
    .attr("y", yMm(0))
    .attr("height", heightMm-100 - yMm(0))
    .style('fill-opacity', 1e-6)
    .remove();

    
    barsMm.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", yMm(0))
    .attr("height", heightMm -100 - yMm(0));

    // the "UPDATE" set:
    barsMm.transition()
      .duration(300)
      .attr("x", function(d) {
        console.log(d.year)
        if(d.year)
            return xMm(d.year);
      else if(d.month)
          return xMm(d.month);
      else if(d.weekday)
          return xMm(d.weekday);
      else if(d.hour)
          return xMm(d.hour);
      else if(d.fire_station)
          return xMm(d.fire_station);
      else if(d.battalion)
          return xMm(d.battalion);
    })
      .attr("width", xMm.rangeBand()) 
      .attr("y", function(d) {
        return yMm(+d.mean_m_per_s); 
    })
      .attr("height", function(d) { 
        return heightMm - 100 - yMm(+d.mean_m_per_s); 
    });     

}

function switchBarChartDataMm(val) {
    switch(val) {
        case 'battalion':
            replayMm(mmBattalions);
            break;
        case 'month':
            replayMm(mmMonths);
            break;
        case 'weekday':
            replayMm(mmWeekDays);
            break;
        case 'hour':
            replayMm(mmHours);
            break;
        case 'firestation':
            replayMm(mmFireStations);
            break;
        case 'year':
            replayMm(mmYears);
            break;
    }
}
