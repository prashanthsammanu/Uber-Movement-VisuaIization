// update function
const update = (data) => {
  d3.select(".canvas svg").remove();
  const margin = { top: 20, right: 20, bottom: 50, left: 100 };
  const graphWidth = 560 - margin.right - margin.left;
  const graphHeight = 360 - margin.top - margin.bottom;

  const svg = d3
    .select(".canvas")
    .append("svg")
    .attr("width", graphWidth + margin.left + margin.right)
    .attr("height", graphHeight + margin.top + margin.bottom);

  const graph = svg
    .append("g")
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // scales
  const x = d3.scaleTime().range([0, graphWidth]);
  const y = d3.scaleLinear().range([graphHeight, 0]);

  // axes groups
  const xAxisGroup = graph
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + graphHeight + ")");

  const yAxisGroup = graph.append("g").attr("class", "y-axis");

  // d3 line path generator
  const line = d3
    .line()
    //.curve(d3.curveCardinal)
    .x(function (d) {
      return x(new Date(d[xCol]));
    })
    .y(function (d) {
      return y(d.Daily_Mean_Travel_Time);
    });

  // line path element
  const path = graph.append("path");

  // create dotted line group and append to graph
  const dottedLines = graph
    .append("g")
    .attr("class", "lines")
    .style("opacity", 0);

  // create x dotted line and append to dotted line group
  const xDottedLine = dottedLines
    .append("line")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", 4);

  // create y dotted line and append to dotted line group
  const yDottedLine = dottedLines
    .append("line")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", 4);
  // sort the data based on date objects
  data.sort((a, b) => new Date(a[xCol]) - new Date(b[xCol]));

  // set scale domains
  x.domain(d3.extent(data, (d) => new Date(d[xCol])));
  y.domain([0, d3.max(data, (d) => d.Daily_Mean_Travel_Time)]);

  // update path data
  path
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#00bfa5")
    .attr("stroke-width", "2")
    .attr("d", line);

  // create circles for points
  const circles = graph.selectAll("circle").data(data);

  // remove unwanted points
  circles.exit().remove();

  // update current points
  circles
    .attr("r", "4")
    .attr("cx", (d) => x(new Date(d[xCol])))
    .attr("cy", (d) => y(d.Daily_Mean_Travel_Time));

  // add new points
  circles
    .enter()
    .append("circle")
    .attr("r", "4")
    .attr("cx", (d) => x(new Date(d[xCol])))
    .attr("cy", (d) => y(d.Daily_Mean_Travel_Time))
    .attr("fill", "#ccc");

  // add event listeners to circle (and show dotted lines)
  graph
    .selectAll("circle")
    .on("mouseover", (d, i, n) => {
      d3.select(n[i])
        .transition()
        .duration(100)
        .attr("r", 8)
        .attr("fill", "#fff");

      // set x dotted line coords (x1,x2,y1,y2)
      xDottedLine
        .attr("x1", x(new Date(d[xCol])))
        .attr("x2", x(new Date(d[xCol])))
        .attr("y1", graphHeight)
        .attr("y2", y(d.Daily_Mean_Travel_Time));
      // set y dotted line coords (x1,x2,y1,y2)
      yDottedLine
        .attr("x1", 0)
        .attr("x2", x(new Date(d[xCol])))
        .attr("y1", y(d.Daily_Mean_Travel_Time))
        .attr("y2", y(d.Daily_Mean_Travel_Time));
      // show the dotted line group (opacity)
      dottedLines.style("opacity", 1);
    })
    .on("mouseleave", (d, i, n) => {
      d3.select(n[i])
        .transition()
        .duration(100)
        .attr("r", 4)
        .attr("fill", "#fff");
      // hide the dotted line group (opacity)
      dottedLines.style("opacity", 0);
    });

  // create axes
  const xAxis = d3.axisBottom(x).ticks(15).tickFormat(d3.timeFormat("%b %d"));

  const yAxis = d3
    .axisLeft(y)
    .ticks(10)
    .tickFormat((d) => d + "m");

  // call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  // rotate axis text
  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .attr("text-anchor", "end");
};

const lineChart = (filePath) => {
  d3.json(filePath).then((data) => {
    update(data);
  });
};

// // update(data);
d3.select("svg").remove();
lineChart("./../data/travel_times_daily.json");
