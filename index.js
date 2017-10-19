// Original scatterplot: https://bl.ocks.org/d3noob/6f082f0e3b820b6bf68b78f2f7786084
// Original pie chart: https://bl.ocks.org/santi698/f3685ca8a1a7f5be1967f39f367437c0
// Simple tooltips in v4: https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73 

// Set the dimensions and margins of the graph.
// Set the width, height and take off the margins.
let margin = {
        top: 20,
        right: 20,
        bottom: 50,
        left: 20,
    },
    scatterChartWidth = 960 - margin.left - margin.right,
    scatterChartHeight = 75 - margin.top - margin.bottom;

// Set range of colors for the scatter chart.
// Categorial colors: http://bl.ocks.org/aaizemberg/78bd3dade9593896a59d
let scatterChartcolor = d3.scaleOrdinal()
    .range([
        "#3366cc",
        "#dc3912",
        "#ff9900",
        "#109618",
        "#990099",
        "#0099c6",
        "#dd4477",
        "#66aa00",
        "#b82e2e",
        "#316395",
        "#994499",
        "#22aa99",
        "#aaaa11",
        "#6633cc",
        "#e67300",
        "#8b0707",
        "#651067",
        "#329262",
        "#5574a6",
        "#3b3eac"
    ]);


// Set the ranges for the chart.
let x = d3.scaleLinear().range([0, scatterChartWidth]);

let div = d3.select("body").append("circle")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Append the svg obgect to the div of the svg where it's being placed on the page.
// Appends a 'group' element to 'svg'.
// Moves the 'group' element to the top left margin.
let scatterChart = d3.select("#first-scatter-chart").append("svg")
    .attr("width", scatterChartWidth + margin.left + margin.right)
    .attr("height", scatterChartHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the data text file.
// Give a onload with it.
d3.text("index.txt")
    .get(onload)

// Make a onload function for the data.
function onload(err, data) {
    if (err) throw err;

    // Variable doc that is the data.
    let doc = data;
    // Select header to slice. Slice the index of header.
    let header = data.indexOf("airline");
    // Select all header to slice. Add trim to remove white-space.
    let headerEnd = data.indexOf('\n', header);
    doc = doc.slice(headerEnd).trim();
    // Remove the asterisk.
    doc = doc.replace(/\*/g, '');

    // Add a variable for parsing the data to an .csv file.
    let csv = d3.csvParseRows(doc, map)

    // Create a map function and declare the data and sort them too.
    function map(d) {
        return {
            airlineName: (d[0]),
            incidentsOld: Number(d[2]) + Number(d[3]),
            incidents: Number(d[2]),
            fatalIncidents: Number(d[3]),
            fatalities: Number(d[4])
        }
    }

    var pieChartData = [
        Number(doc[2]),
        Number(doc[3]),
        Number(doc[4])
    ]

    // Data param is the csv.
    data = csv;

    // Scale the range of the data.
    x.domain(d3.extent(data, function (d) {
        return d.incidentsOld;
    }));

    // Add the X Axis.
    scatterChart.append("g")
        .attr("transform", "translate(0," + scatterChartHeight + ")")
        .call(d3.axisBottom(x));

    // Text label for the x axis
    // Axis labels in v4: https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    scatterChart.append("text")
        .attr("transform",
            "translate(" + (scatterChartWidth / 2) + " ," +
            (scatterChartHeight + 40) + ")")
        .style("text-anchor", "middle")
        .text("1985 - 1999");

    // Add the scatterplot.
    // Set the dots onto the data.
    // Give the dots a raduis of 8 and a position (cy) of 450 so it sits on the x-axis.
    scatterChart.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 8)
        .attr("cy", 5)
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
        // Mouseout event to remove the tooltip with a opacity of 0.
        .on("mouseout", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        })
        // Click event where the pie chart is being shown when you click on a dot.
        // Has also a transition with a delay of 0.2 seconds.
        // Show/ hide elements on mouse click: http://bl.ocks.org/d3noob/5d621a60e2d1d02086bf
        .on("click", function (e) {
            // Hide or show the elements.
            //this.airline, meegeven aan creatpie
            createPieChart(e.airlineName);
        })
        // Source: https://stackoverflow.com/questions/27950920/add-a-transition-to-a-d3j-scatter-plot
        .style("opacity", 0)
        .transition()
        .delay(function (d, i) {
            return i * 100
        })
        .style("opacity", 1)
        .style("fill", function (d) {
            return scatterChartcolor(d.incidentsOld)
        })
        .attr("cx", function (d) {
            return x(d.incidentsOld)
        });

    // Add the pie chart.
    function createPieChart(airline) {

        // Give width, height and a radius to the pie chart.
        let pieChartwidth = 300,
            pieChartheight = 300,
            radius = Math.min(pieChartwidth, pieChartheight) / 2;

        let pieChartcolor = d3.scaleOrdinal()
            .range([
                "#98abc5",
                "#8a89a6",
            ]);

        // Append the svg obgect to the div of the svg where it's being placed on the page.
        // Appends a 'group' element to 'svg'.
        // Moves the 'group' element to the top left margin.
        let pieChart = d3.select("#first-pie-chart")
            .append("svg")
            .attr("width", pieChartwidth)
            .attr("height", pieChartheight)
            .append("g")
            .attr("transform", "translate(" + pieChartwidth / 2 + "," + pieChartheight / 2 + ")");

        let pie = d3.pie()
            .sort(null)
            .value(function (d) {
                return d.pieChartData;
            });

        let g = pieChart.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        let arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        let labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        g.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return pieChartcolor(d.pieChartData);
            });

        g.append("text")
            .attr("transform", function (d) {
                return "translate(" + labelArc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .text(function (d) {
                return d.pieChartData;
            });

        // Create a filter fucntion to sort the data that we want into the pie chart.
        var pieChartSelection = data.filter(function (d) {
            return d.airlineName == airline
        })
        console.log(pieChartSelection)
    }
}