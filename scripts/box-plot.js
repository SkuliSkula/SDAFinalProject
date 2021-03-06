var marginMr = {top: 10, right: 50, bottom: 20, left: 50},
    widthMr = $("#page7").width() - marginMr.left - marginMr.right,
    heightMr = 400 - marginMr.top - marginMr.bottom;

var marginDt = {top: 10, right: 50, bottom: 20, left: 50},
    widthDt = $("#page7").width() - marginDt.left - marginDt.right,
    heightDt = 400 - marginDt.top - marginDt.bottom;

var minDt = Infinity,
    maxDt = - Infinity;
var minMr = Infinity,
    maxMr = -Infinity;

var chartMr = d3.box()
    .whiskers(iqr(1.5))
    .width(widthMr)
    .height(heightMr)
    .showLabels(labels);

var chartDt = d3.box()
    .whiskers(iqr(1.5))
    .width(widthDt)
    .height(heightDt)
    .showLabels(labels);

var regressionData = [];
var decisionTreeData = [];
var mrSvg, dtSvg;
var labels = true;

function loadRegressionData() {
    var counter = 0;
    d3.csv("https://gist.githubusercontent.com/SkuliSkula/dbea0e7641b1258025ff4c5d134716bd/raw/98456dba8edf508af5e711214d100a730a0734bb/multiple_regression_performance.csv", function(error, csv) {
        if (error) throw error;

        regressionData[0] = [];
        regressionData[1] = [];

        regressionData[0][0] = "multiple_regression";
        regressionData[1][0] = "mean_value";

        regressionData[0][1] = [];
        regressionData[1][1] = [];    
        
        csv.forEach(function(x) {
            var mr = +x.multiple_regression,
                mv = +x.mean_value;
            
            var rowMax = Math.max(mr,mv);
            var rowMin = Math.min(mr,mv);
            
            regressionData[0][1].push(mr);
		    regressionData[1][1].push(mv);

            if (rowMax > maxMr) maxMr = rowMax;
		    if (rowMin < minMr) minMr = rowMin;	
        });

        chartMr.domain([minMr, maxMr]);
        initRegressionBoxPlot();
    });
}

function loadDecisionTreeData() {
    d3.csv("https://gist.githubusercontent.com/SkuliSkula/dbea0e7641b1258025ff4c5d134716bd/raw/fffc52a5abe47c76490ccc11f3129031d6ec9fd9/decision_tree_performance.csv", function(error, csv) {
        if (error) throw error;

        decisionTreeData[0] = [];
        decisionTreeData[1] = [];

        decisionTreeData[0][0] = "decision_tree";
        decisionTreeData[1][0] = "largest_class";

        decisionTreeData[0][1] = [];
        decisionTreeData[1][1] = [];    
        
        csv.forEach(function(x) {
            var dt = +x.decision_tree,
                lc = +x.largest_class;
            
            var rowMaxDt = Math.max(dt, lc);
            var rowMinDt = Math.min(dt, lc);
            
            decisionTreeData[0][1].push(dt);
		    decisionTreeData[1][1].push(lc);

            if (rowMaxDt > maxDt) maxDt = rowMaxDt;
		    if (rowMinDt < minDt) minDt = rowMinDt;	
        });

        chartDt.domain([minDt, maxDt]);
        initDecisionTreeBoxPlot();
    });
}

function initRegressionBoxPlot() {

    mrSvg = d3.select("#page7").append("svg")
        .attr("class", "box")
        .attr("width", widthMr + marginMr.left + marginMr.right)
        .attr("height", heightMr + marginMr.bottom + marginMr.top)
        .append("g")
        .attr("transform", "translate(" + marginMr.left + "," + marginMr.top + ")");
    
    // create x-Axis
	var xMr = d3.scale.ordinal()	   
		.domain( regressionData.map(function(d) { return d[0] }))	 
		.rangeRoundBands([0 , widthMr], 0.7, 0.3);
    
	var xAxisMr = d3.svg.axis()
		.scale(xMr)
		.orient("bottom");
	// the y-axis
	var yMr = d3.scale.linear()
		.domain([minMr, maxMr])
		.range([heightMr + marginMr.top, 0 + marginMr.top]);
	
	var yAxisMr = d3.svg.axis()
    .scale(yMr)
    .orient("left");
    
	// draw the boxplots	
	mrSvg.selectAll(".box")	   
      .data(regressionData)
	  .enter().append("g")
		.attr("transform", function(d) { return "translate(" +  xMr(d[0])  + "," + marginMr.top + ")"; } )
      .call(chartMr.width(xMr.rangeBand()));

    // add a title
	mrSvg.append("text")
        .attr("x", (widthMr / 2))             
        .attr("y", 0 + (marginMr.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        //.style("text-decoration", "underline")  
        .text("Multiple regression vs. the mean response time");
    
	 // draw y axis
	mrSvg.append("g")
        .attr("class", "y axis")
        .call(yAxisMr)
		.append("text") // and text1
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .style("font-size", "16px") 
		  .text("Error rate in seconds");	 
}

function initDecisionTreeBoxPlot() {
    dtSvg = d3.select("#page8").append("svg")
        .attr("class", "box")
        .attr("width", widthDt + marginDt.left + marginDt.right)
        .attr("height", heightDt + marginDt.bottom + marginDt.top)
        .append("g")
        .attr("transform", "translate(" + marginDt.left + "," + marginDt.top + ")");
    
    var xDt = d3.scale.ordinal()	   
    .domain( decisionTreeData.map(function(d) { return d[0] }))	 
    .rangeRoundBands([0 , widthDt], 0.7, 0.3);
    
	var xAxisDt = d3.svg.axis()
		.scale(xDt)
		.orient("bottom");
	// the y-axis
	var yDt = d3.scale.linear()
		.domain([minDt, maxDt])
		.range([heightDt + marginDt.top, 0 + marginDt.top]);
	
	var yAxisDt = d3.svg.axis()
    .scale(yDt)
    .orient("left");
    
	// draw the boxplots	
	dtSvg.selectAll(".box")	   
      .data(decisionTreeData)
	  .enter().append("g")
		.attr("transform", function(d) { return "translate(" +  xDt(d[0])  + "," + marginDt.top + ")"; } )
      .call(chartDt.width(xDt.rangeBand()));

    // add a title
	dtSvg.append("text")
        .attr("x", (widthDt / 2))             
        .attr("y", 0 + (marginDt.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        //.style("text-decoration", "underline")  
        .text("Decision tree vs. the largest class");
    
	 // draw y axis
	dtSvg.append("g")
        .attr("class", "y axis")
        .call(yAxisDt)
		.append("text") // and text1
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .style("font-size", "16px") 
		  .text("misclassification error rate [%]");	 
}

// Returns a function to compute the interquartile range.
function iqr(k) {
    return function(d, i) {
        var q1 = d.quartiles[0],
            q3 = d.quartiles[2],
            iqr = (q3 - q1) * k,
            i = -1,
            j = d.length;
        while (d[++i] < q1 - iqr);
        while (d[--j] > q3 + iqr);
        return [i, j];
    };
}