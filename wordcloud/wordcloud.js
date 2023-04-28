// set dimensions and margins
var margin = {top: 5, right: 300, bottom: 5, left: 5},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// create svg object
var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// create wordcloud
var layout = d3.layout.cloud()
  .size([width, height])
  .words([])
  .padding(5)        
  //space between words
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .fontSize(function(d) { return d.size; })      // font size according to # of occurrences
  .on("end", draw);

// load json file 
d3.json("top_200_words_100_max_2.json", function(error, data) {
  if (error) throw error;
  layout.words(data.map(function(d) { return {text: d.word, size:d.size}; }))
  layout.start();
});

// transposes loaded json onto the layour
function draw(words) {
  svg.append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .attr("font-size", function(d) { return d.size; })
        .attr("fill", function(d, i) { 
            // make top 10 most frequently occuring words usc cardinal
            if (i < 10) {
                return "#990000"; 
            } else {
                return "#FFCC00"; // others use usc gold
            }
        })
        .attr("text-anchor", "middle")
        .attr("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}

// create legend
var legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(" + (width + 200) + "," + (height + 30) + ")");

legend.append("text")
  .text("Legend:")
  .attr("font-family", "Arial")
  .attr("font-size", "18px")
  .attr("font-weight", "bold")
  .attr("transform", "translate(0, 1em)")

legend.append("rect")
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "#990000")
  .attr("transform", "translate(0, 25)");

legend.append("text")
  .text("Top 10 Most Frequent Words")
  .attr("font-family", "Arial")
  .attr("font-size", "15px")
  .attr("transform", "translate(30, 40)");

  legend.append("rect")
  .attr("width", 20)
  .attr("height", 20)
  .style("fill", "#FFCC00")
  .attr("transform", "translate(0, 60)");

legend.append("text")
  .text("Other Frequent Words")
  .attr("font-family", "Arial")
  .attr("font-size", "15px")
  .attr("transform", "translate(30, 75)");
