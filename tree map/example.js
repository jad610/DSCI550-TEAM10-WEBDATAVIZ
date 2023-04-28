// load json
d3.json("top20_overall_all.json").then(function (data) {

  // dimensions
  var width = 1200;
  var height = 700;

  // d3 hierarchy and value accessor
  var hierarchy = d3.hierarchy(data);
  hierarchy.sum(function (d) { return d.size; });

  // create the layout for the tree map and implement onto layout
  var treemap = d3.treemap()
    .size([width, height])
    .padding(0); // adjust this value to make the tiles larger or smaller
  treemap(hierarchy);

  // svg container for treemap
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height+200);

  // create treemap tiles
  var tiles = svg.selectAll(".tile")
    .data(hierarchy.leaves())
    .enter()
    .append("g")
    .attr("class", "tile");

  // map out the categories to colors
  var colorScale = d3.scaleOrdinal()
    .domain(["Society", "Health & Wellness", "Culture", "Sports", "Student", "India", "Science & Technology"])
    .range(["#69b3a2", "#ffc107", "#ff6b6b", "#0077b6", "#fca311", "#d62828", "#6d6875"]);

  // assign the categories & colors to the instances
  var color = function (d) {
    if (["politics", "environment", "climate change", "inequality", "economy", "history", "the conversation", "news"].includes(d.data.name)) {
      return colorScale("Society");
    } else if (["health", "food"].includes(d.data.name)) {
      return colorScale("Health & Wellness");
    } else if (d.data.name === "entertainment") {
      return colorScale("Culture");
    } else if (["sports", "football", "calcio"].includes(d.data.name)) {
      return colorScale("Sports");
    } else if (["education", "college life"].includes(d.data.name)) {
      return colorScale("Student");
    } else if (["india", "bollywood"].includes(d.data.name)) {
      return colorScale("India");
    } else if (["science", "technology"].includes(d.data.name)) {
      return colorScale("Science & Technology");
    }
  };

  // adds the rectangles and dimensions
  tiles.append("rect")
    .attr("x", function (d) { return d.x0; })
    .attr("y", function (d) { return d.y0; })
    .attr("width", function (d) { return d.x1 - d.x0; })
    .attr("height", function (d) { return d.y1 - d.y0; })
    .style("fill", function (d) {
      return color(d);
    })
    .style("stroke", "black")
    .style("stroke-width", "1px");

  // add text element for topics
  tiles.append("text")
    .attr("x", function (d) { return d.x0 + 5; })
    .attr("y", function (d) { return d.y0 + 15; })
    .style("font-size", function (d) {
      var maxSize = 17;
      var sizeScale = d3.scaleSqrt() // scale the size of the words logarithmically
        .domain([1, d3.max(hierarchy.leaves(), function (d) { return d.value; })])
        .range([9, maxSize]);
      return sizeScale(d.value) + "px";
    })

    // text for the # of occurrences of topic
    .style("font-family", "Open Sans, sans-serif")
    .style("font-weight", "bold")
    .text(function (d) { return d.data.name; })
    .append("tspan")
    .attr("x", function (d) { return d.x0 + 5; })
    .attr("y", function (d) { return d.y0 + 30; })
    .style("font-size", function (d) {
      var maxSize = 16;
      var sizeScale = d3.scaleLog()
        .domain([1, d3.max(hierarchy.leaves(), function (d) { return d.value; })])
        .range([3, maxSize]);
      return sizeScale(d.value) + "px";
    })
    .style("font-family", "Open Sans, sans-serif")
    .style("font-weight", "bold")
    .text(function (d) { return "(" + d.value + ")"; });

// create legend
var legend = svg.append("g")
.attr("class", "legend")
.attr("transform", "translate(" + (width - 1000) + ", 750)");

// legend title
legend.append("text")
  .attr("x", 0)
  .attr("y", -10)
  .attr("font-family", "Arial")
  .attr("font-weight", "bold")
  .text("Legend:");

// legend items
var legendItems = legend.selectAll("g")
  .data(colorScale.domain())
  .enter().append("g")
  .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

// legend rectangles
legendItems.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 10)
  .attr("height", 10)
  .style("fill", colorScale);

// legend text
legendItems.append("text")
  .attr("x", 15)
  .attr("y", 5)
  .attr("dy", ".35em")
  .attr("font-family", "Arial")
  .text(function (d) { return d; });
});

