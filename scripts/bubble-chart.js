
function loadBubbleChartData() {
    d3.csv("https://gist.githubusercontent.com/SkuliSkula/41b1c03b69a6a7abdd5785a3acfa6545/raw/6f22d722b4e55a381b39c440b0cf75fbb0b59ba2/sffd_battalions_count.csv", function(error, data) {
        if(error) {
            return console.error(error);
        }
        initBubbleChart(data);
    });
}

function initBubbleChart(data) {
    var h = $("#page3").width();
    var bubbleChart = new d3.svg.BubbleChart({
        supportResponsive: true,
        //container: => use @default
        size: h,
        viewBoxSize: 1024,
        innerRadius: h / 3.5,
        //outerRadius: => use @default
        radiusMin: 50,
        //radiusMax: use @default
        //intersectDelta: use @default
        //intersectInc: use @default
        //circleColor: use @default
        data: {
          items: data
          ,
          eval: function (item) {return +item.incidents_num;},
          classed: function (item) {return "battalion";}
        },
        plugins: [
            {
                name: "lines",
                options: {
                  format: [
                    {// Line #0
                      textField: "battalion",
                      classed: {battalion: true},
                      style: {
                        "font-size": "12px",
                        "font-family": "Source Sans Pro, sans-serif",
                        "text-anchor": "middle",
                        fill: "white"
                      },
                      attr: {
                        dy: "5px",
                        x: function (d) {return d.cx;},
                        y: function (d) {return d.cy;}
                  }
                },
                {// Line #1
                  textField: "incidents_num",
                  classed: {battalion: true},
                  style: {
                    "font-size": "14px",
                    "font-family": "Source Sans Pro, sans-serif",
                    "text-anchor": "middle",
                    fill: "white",
                    display: "none"
                  },
                  attr: {
                    dy: "20px",
                    dx: "-55px",
                    x: function (d) {return d.cx;},
                    y: function (d) {return d.cy;}
                  }
                },
                  {// Line #2
                      textField: "response_time",
                      classed: {battalion: true},
                      style: {
                        "font-size": "14px",
                        "font-family": "Source Sans Pro, sans-serif",
                        "text-anchor": "middle",
                        fill: "white",
                        display: "none"
                      },
                      attr: {
                        dy: "30px",
                        x: function (d) {return d.cx;},
                        y: function (d) {return d.cy;}
                      }
                  },
                  {
                    textField: "incident_txt",
                    classed: {battalion: false},
                    style: {
                        "font-size": "14px",
                        "font-family": "Source Sans Pro, sans-serif",
                        "text-anchor": "middle",
                        fill: "red",
                        display: "none"
                      },
                      attr: {
                        dy: "30px",
                        dx: "55px",
                        x: function (d) {return d.cx;},
                        y: function (d) {return d.cy;}
                      } 
                  }
              ],
              centralFormat: [
                {// Line #0
                    style: {"font-size": "50px"},
                    attr: {}
                },
                {// Line #1
                  style: {"font-size": "30px", display: "inline"},
                  attr: {dy: "40px"}
                },
                {// Line #2
                  style: {"font-size": "20px", display: "inline"},
                  attr: {dy: "80px"}  
                },
                {// Line #3
                  style: {"font-size": "30px", display: "inline"},
                  attr: {dy: "40px"}  
                }
              ]
            }
          }]
      });
}