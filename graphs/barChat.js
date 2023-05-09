// update
const update = (data) => {
  // STEP 1 update the scales
  y.domain([0, d3.max(data, (d) => d.orders)]); // input value range
  x.domain(data.map((d) => d.name));

  // STEP 2 join the updated data to rects
  const rects = graph.selectAll("rect").data(data);

  // 3. remove unwanted (if any) shapes using the exist selections
  rects.exit().remove();

  // 4. update current shape in DOM
  rects.attr("fill", "orange").attr("x", (d) => x(d.name));

  // 5. append the enter selection to the dom
  rects
    .enter()
    .append("rect")
    .attr("height", 0)
    .attr("fill", "orange")
    .attr("x", (d) => x(d.name))
    .attr("y", graphHeight)
    .merge(rects)
    .transition(t)
    .attrTween("width", withTween)
    .attr("y", (d) => y(d.orders))
    .attr("height", (d) => graphHeight - y(d.orders));

  //call the axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

const menuBarChart = (fileUrl) => {
  d3.json(fileUrl).then((data) => {
    update(data);
  });
};
