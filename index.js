// Original scatterplot: https://bl.ocks.org/d3noob/6f082f0e3b820b6bf68b78f2f7786084
// Original pie chart: https://bl.ocks.org/santi698/f3685ca8a1a7f5be1967f39f367437c0

// Set the dimensions and margins of the graph.
// Set the width, height and take off the margins.
var marginFirstCharts = {
        top: 20,
        right: 15,
        bottom: 100,
        left: 15,
    },
    scatterChartWidth = window.innerWidth - marginFirstCharts.left - marginFirstCharts.right,
    scatterChartHeight = 120 - marginFirstCharts.top - marginFirstCharts.bottom,
    lineWidth = window.innerWidth;

// Give width, height and a radius to the pie chart.
var pieChartwidth = 800,
    pieChartheight = 390,
    radius = Math.min(pieChartwidth, pieChartheight) / 2;

var pieChartSelection = []

// Set range of colors for the scatter chart.
var scatterChartcolor = d3.scaleOrdinal()
    .range(["#E0E4CC", "#D6DAC2", "#7BB0A6", "#7BB0A6", "#92F22A", "#64DDBB", "#7CEECE", "#8F6F40", "#6F532A", "#523D1F", "#A0B58D", "#A19C69", "#FD5B03", "#63393E", "#F29B34", "#54573A", "#3D8EB9", "#FEC606", "#EBBD63", "#E6DCDB", "#25373D", "#E3000E", "#282830", "#83D6DE", "#EB9532", "#FDD09F", "#8870FF", "#897FBA", "#F1654C", "#7E3661", "#EE543A", "#B0DACC", "#42729B", "#249991", "#92F22A", "#E6DCDB", "#C82647", "#EE543A", "#953163", "#EDD834", "#5659C9", "#0F3057", "#FF8B55", "#44BBFF", "#2980B9", "#47C9AF", "#462446", "#A42A15", "#8BCBDE", "#F7BC05", "#1ABC9C", "#11156D", "#BBA900", "#91CED7", "#E3EEFF", "#82B9AD", "#3DA4AB"]);

// Set the ranges for the chart and use the width of the scatterplot.
var x = d3.scaleLinear().range([0, scatterChartWidth]);

// Select the body and append a circle to it.
// Give the circle a class attribute.
// Set the opacity to 0.
var div = d3.select("body")
    .append("circle")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Append the svg obgect to the div of the svg where it's being placed on the page.
// Appends a 'group' element to 'svg'.
// Moves the 'group' element to the top left margin.
var scatterChart = d3.select("#first-scatter-chart")
    .append("svg")
    .attr("width", scatterChartWidth + marginFirstCharts.left + marginFirstCharts.right)
    .attr("height", scatterChartHeight + marginFirstCharts.top + marginFirstCharts.bottom)
    .append("g")
    .attr("transform", "translate(" + marginFirstCharts.left + "," + marginFirstCharts.top + ")");

// Append the svg obgect to the div of the svg where it's being placed on the page.
// Appends a 'group' element to 'svg'.
// Moves the 'group' element to the top left margin.
var pieChart = d3.select("#first-pie-chart")
    .append("svg")
    .attr("width", pieChartwidth)
    .attr("height", pieChartheight)
    .append("g")
    .attr("transform", "translate(" + pieChartwidth / 2 + "," + pieChartheight / 2 + ")");

// Get the data text file.
// Give a onload with it.
d3.text("index.txt")
    .get(onload)

// Make a onload function for the data.
function onload(err, data) {
    if (err) throw err;

    // Variable doc that is the data.
    var doc = data;
    // Select header to slice. Slice the index of header.
    var header = data.indexOf("airline");
    // Select all header to slice. Add trim to remove white-space.
    var headerEnd = data.indexOf('\n', header);
    doc = doc.slice(headerEnd).trim();
    // Remove the asterisk.
    doc = doc.replace(/\*/g, '');

    // Add a variable for parsing the data to an .csv file.
    var csv = d3.csvParseRows(doc, map)

    // Create a map function and declare the data and sort them too.
    function map(d) {
        return {
            airlineName: (d[0]),
            incidentsOld: Number(d[2]) + Number(d[3]),
            incidents: Number(d[2]),
            incidentsFatal: Number(d[3]),
            fatalities: Number(d[4])
        }
    }

    // Data param is the csv.
    data = csv;

    // Scale the range of the data.
    x.domain(d3.extent(data, function (d) {
        return d.incidentsOld;
    }));

    // Add the X Axis.
    scatterChart.append("g")
        .attr("transform", "translate(0," + scatterChartHeight + ")")
        .call(d3.axisBottom(x))

    // Change the y2-position of the lines (the ticks).
    d3.selectAll("line")
        .attr("y2", 15);

    // Change the y-position of the text of the ticks.
    d3.selectAll("text")
        .attr("y", 20);

    // Animation for the domain (axis line).
    // Select the .domain and add a styling.
    // Give transition and after that set stroke to 0.
    // Add a duration to set how long the animation runs.
    d3.select(".domain")
        .style("stroke-dasharray", lineWidth)
        .style("stroke-dashoffset", lineWidth)
        .transition()
        .duration(2000)
        .ease(d3.easeBounceOut)
        .style("stroke-dashoffset", 0);

    d3.selectAll(".tick")
        .style("opacity", 0)
        .transition()
        .duration(5000)
        .style("opacity", 1);

    // Text label for the x axis
    // Axis labels in v4: https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    scatterChart.append("text")
        .attr("transform", "translate(" + (scatterChartWidth / 2) + " ," + (scatterChartHeight + 80) + ")")
        .attr("class", "year")
        .style("text-anchor", "middle")
        .text("1985 - 1999")
        .style("opacity", 0)
        .transition()
        .duration(5000)
        .style("opacity", 1);

    // Add the scatterplot.
    // Set the dots onto the data.
    // Give the dots a raduis of 8 and a position (cy) of 450 so it sits on the x-axis.
    scatterChart.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 8)
        .attr("cy", 0)

        // Simple tooltips in v4: https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73 
        // Mouseover event where the tooltip is being added to the dots.
        // It has a transition on 0.2 seconds before it is being shown.
        // Set in the tooltip the data of the airline name and the amount of incidents.
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div.html(d.airlineName + ": " + d.incidentsOld + " incidents")
                .style("left", (d3.event.pageX - 100) + "px")
                .style("top", (d3.event.pageY + 25) + "px");
        })
        // Mouseout event to remove the tooltip scatterChartWidth a opacity of 0.
        .on("mouseout", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        })

        // Click event where the pie chart is being shown when you click on a dot.
        // Has also a transition with a delay of 0.2 seconds.
        // Show/ hide elements on mouse click: http://bl.ocks.org/d3noob/5d621a60e2d1d02086bf
        // Remove the legend rectangle and text when clicking.
        .on("click", function (e) {
            d3.selectAll('.legend text').remove();
            d3.selectAll('.legend rect').remove();
            d3.selectAll("circle")
                .attr("r", 8)
                .style("stroke-width", "0px")
                .style("opacity", 0.5)
            // Set selected dot and add style when selected.
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "#ECF0F1")
                .style("stroke-width", "2px")
                .attr("r", 10)
            createPieChart(e.airlineName);
        })
        // Add a transition to a d3js scatterplot: https://stackoverflow.com/questions/27950920/add-a-transition-to-a-d3j-scatter-plot
        .style("opacity", 0)
        .transition()
        .delay(function (d, i) {
            return i * 30
        })
        .style("opacity", 0.5)
        .style("fill", function (d) {
            return scatterChartcolor(d.incidentsOld)
        })
        .attr("cx", function (d) {
            return x(d.incidentsOld)
        });

    // Add the pie chart.
    function createPieChart(airline) {

        // Create a filter function to sort the data that we want into the pie chart.
        pieChartSelection = data.filter(function (d) {
            return d.airlineName == airline
        })

        // Create a object for the data we want to use in the pie chart.
        // The object contains a name which I hardcoded and the number contains the data of the incidents.
        var incidents = [{
                "name": "Incidents",
                "number": pieChartSelection[0].incidents,
            },
            {
                "name": "Fatal incidents",
                "number": pieChartSelection[0].incidentsFatal
            },
            {
                "name": "Fatalities",
                "number": pieChartSelection[0].fatalities
            }
        ]

        // Make variabele for the colors that are being shown in the pie chart.
        var pieChartcolor = d3.scaleOrdinal()
            .range(["#E67E22", "#E74C3C", "#C0392B"]);

        // Value returns the number we described in the object.
        var pie = d3.pie()
            .value(function (d) {
                return d.number;
            });

        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        var g = pieChart.selectAll(".arc")
            .data(pie(incidents))
            .attr("d", arc);

        g.enter()
            .append("path")
            .attr("class", "arc")
            .attr("d", arc)
            .style("fill", "none")
            .style("opacity", 0)
            .transition()
            .style("opacity", 1)
            .style("fill", function (d) {
                return pieChartcolor(d.data.number)
            });

        // How to add a nice legend to a d3 pie chart: https://stackoverflow.com/questions/32298837/how-to-add-a-nice-legend-to-a-d3-pie-chart
        // Here we create a legend for the pie chart and load the data we are using in the pie chart also.
        var legend = pieChart.selectAll(".legend")
            .data(incidents);

        g.enter()
            .append("g")
            .attr("transform", function (d, i) {
                return "translate(" + (pieChartwidth - 600) + "," + (i * 30 + 0) + ")";
            })
            .attr("class", "legend");

        legend
            .append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", function (d, i) {
                return pieChartcolor(i);
            })
            .attr("y", -20)

        legend.append("text")
            .text(function (d) {
                return d.name + ": " + "" + d.number;
            })
            .style("font-size", 18)
            .attr("x", 35)
            .attr("y", -2);
    }
}
