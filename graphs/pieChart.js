const dims = { height: 300, width: 300, radius: 150 };
const center = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

const pieGraph = svg
  .append("g")
  .attr("transform", `translate(${center.x}, ${center.y})`);

const pie = d3
  .pie()
  .sort(null)
  .value((d) => d.cost);

const arcPath = d3
  .arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);

const colour = d3.scaleOrdinal(d3["schemeSet3"]);

// update function
const updatePie = (data) => {
  colour.domain(data.map((d) => d.name));

  const piePaths = pieGraph.selectAll("path").data(pie(data));

  // handle the exit selections
  piePaths
    .exit()
    .transition()
    .duration(500)
    .attrTween("d", withArchTweenExit)
    .remove();

  // hand the current DOM path updates

  piePaths.attr("d", arcPath);

  piePaths
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("fill", (d) => colour(d.data.name))
    .transition()
    .each(function (d) {
      this._current = d;
    })
    .duration(500)
    .attrTween("d", withArchTween);

  // add Events
  pieGraph
    .selectAll("path")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMOuseOut);
};

const pieChart = (fileUrl) => {
  d3.json(fileUrl).then((data) => {
    updatePie(data);
  });
};

const withArchTween = (d) => {
  var i = d3.interpolate(d.endAngle, d.startAngle);

  return function (t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

const withArchTweenExit = (d) => {
  var i = d3.interpolate(d.startAngle, d.endAngle);

  return function (t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// event handler
// const handleMouseOver = (e, d, i, n) => {
//   console.log(n);
// };
function handleMouseOver() {
  // console.log(this);
  d3.select(this).transition().duration(500).attr("fill", "#fff");
}
const handleMOuseOut = (d) => {
  // d3.select(this).transition().duration(500).attr('fill', color())
};
// pieChart("./../data/expenses.json");
