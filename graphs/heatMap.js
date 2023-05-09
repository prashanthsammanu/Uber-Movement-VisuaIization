// Load the Bangalore map data

function showHeatMap() {
  d3.json("./../data/bangalore_wards.json")
    .then(function (map) {
      // Draw the map
      var svg = d3
        .select("#heat-map")
        .append("svg")
        .attr("width", 800)
        .attr("height", 600);

      var g = svg.append("g");
      var projection = d3
        .geoMercator()
        .fitSize([600, 800])
        .scale(50000)
        .center([77.6, 12.9])
        .translate([400, 300]);

      var path = d3.geoPath().projection(projection);

      g.selectAll(".map")
        .data(map.features)
        .enter()
        .append("path")
        .attr("class", "map")
        .attr("d", path)
        .attr("width", 400)
        .attr("height", 400);

      // Add interactivity to the map
      // Add interactivity to the map
      var tooltip1 = d3.select("#tooltip1");
      var tooltip2 = d3.select("#tooltip2");
      var selectedLocations = [];
      g.selectAll(".ward")
        .data(map.features)
        .enter()
        .append("path")
        .attr("class", "ward")
        .attr("d", path)
        .on("mouseover", (d, e) => {
          console.log(d);
          tooltip1.transition().duration(200).style("opacity", 0.9);
          tooltip1
            .html(d.properties.WARD_NAME)
            .style("left", e.pageX + 10 + "px")
            .style("top", e.pageY - 28 + "px");
        })
        .on("mouseout", function (e, d) {
          tooltip1.transition().duration(500).style("opacity", 0);
        })
        .on("click", function (d) {
          var locationName = d.properties.WARD_NAME;
          selectedLocations.push({
            name: locationName,
            coords: path.centroid(d),
          });
          updateTooltips();
          if (selectedLocations.length == 2) {
            var route = [];
            route = drawRoute();
            route = [];
            selectedLocations = [];
            tooltip1.style("visibility", "hidden");
            click(d);
          }
        });

      // Update the tooltips
      function updateTooltips() {
        tooltip1.style(
          "display",
          selectedLocations.length > 0 ? "block" : "none"
        );
        tooltip2.style(
          "display",
          selectedLocations.length > 1 ? "block" : "none"
        );
        if (selectedLocations.length > 0) {
          tooltip1
            .html(selectedLocations[0].name)
            .style("left", selectedLocations[0].coords[0] + "px")
            .style("top", selectedLocations[0].coords[1] + "px");
        }
        if (selectedLocations.length > 1) {
          tooltip2
            .html(selectedLocations[1].name)
            .style("left", selectedLocations[1].coords[0] + "px")
            .style("top", selectedLocations[1].coords[1] + "px");

          // Draw location markers for the selected locations
          g.selectAll(".marker")
            .data(selectedLocations)
            .enter()
            .append("text")
            .attr("class", "marker")
            .attr("x", function (d) {
              return d.coords[0] + 10;
            })
            .attr("y", function (d) {
              return d.coords[1];
            })
            .text(function (d) {
              return d.name;
            });
        }
      }
      function drawRoute() {
        if (selectedLocations.length === 2) {
          var coords1 = selectedLocations[0].coords;
          var coords2 = selectedLocations[1].coords;

          // Draw a circle at each selected location
          g.append("circle")
            .attr("cx", coords1[0])
            .attr("cy", coords1[1])
            .attr("r", 4)
            .attr("fill", "red");
          g.append("circle")
            .attr("cx", coords2[0])
            .attr("cy", coords2[1])
            .attr("r", 4)
            .attr("fill", "red");

          // Draw a line between the two selected locations
          g.append("line")
            .attr("class", "route")
            .attr("x1", coords1[0])
            .attr("y1", coords1[1])
            .attr("x2", coords2[0])
            .attr("y2", coords2[1])
            .style("stroke-dasharray", "3, 3")
            .attr("stroke-width", 2);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

showHeatMap();
