async function InitChart() {
  //width  height   position
  const width = 800,
    height = 600;
  const margin = {
    top: 50,
    left: 50,
    right: 150,
    bottom: 50,
  };

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  //  svg
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const container = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("opacity", 0);

  const data = await d3.json("./data.json");

  const xLable = Object.keys(data[0]).slice(1);

  //change Data
  const newData = [],
    stackLabels = new Set();
  xLable.forEach((xel) => {
    let item = {};
    item.category = xel;
    data.forEach((t) => {
      stackLabels.add(t["Row Labels"]);
      item[t["Row Labels"]] = t[xel];
    });
    newData.push(item);
  });

  //scale
  const stackData = d3.stack().keys([...stackLabels])(newData);

  const color = d3.scaleOrdinal().domain(stackLabels).range(d3.schemeSet2);
  const xScale = d3
    .scaleBand()
    .domain(xLable)
    .range([0, innerWidth])
    .padding(0.3);

  const max = d3.max(stackData, (d) => d3.max(d, (t) => t[1]));

  const yScale = d3.scaleLinear().domain([0, max]).range([innerHeight, 0]);

  //legend
  const legends = container
    .selectAll(".legends")
    .data([...stackLabels])
    .join("g")
    .attr("class", "legends");

  legends
    .append("text")
    .text((d) => d)
    .attr("x", innerWidth + 50)
    .attr("y", (d, i) => i * 20 + 5);

  legends
    .append("circle")
    .attr("r", 5)
    .attr("cx", innerWidth + 40)
    .attr("fill", color)
    .attr("cy", (d, i) => i * 20);

  //axis

  const xAxis = d3.axisBottom(xScale).tickFormat((d) => {
    return d.replace("Sum of ", "");
  });

  const yAxis = d3.axisLeft(yScale);

  container
    .append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(xAxis);

  container.append("g").call(yAxis);

  //bar

  container
    .append("g")
    .selectAll("g")
    .data(stackData)
    .join("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .join("rect")
    .attr("x", (d) => xScale(d.data.category))
    .attr("y", (d) => yScale(d[1]))
    .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth())
    .on("mouseover", (event, d) => {
      const itemData = newData.filter(
        (item) => item.category == d.data.category
      )[0];
      let str = "";
      stackLabels.forEach((t, i) => {
        const temp = `<span class='point' style='background:${color(
          t
        )}'></span><span>${t}:</span><span style='margin-left:10px'>${
          itemData[t]
        }</span><br>`;
        str += temp;
      });
      tooltip
        .html(
          `
        <div class='map-tip'> 
          <p>${d.data.category}</p>
          <div>
            ${str}
          </div>
        </div>
      `
        )
        .style("opacity", 1);
    })
    .on("mousemove", function (event) {
      const x = event.pageX + 30;
      const y = event.pageY - 30;
      tooltip.style("top", y + "px").style("left", x + "px");
    })
    .on("mouseout", (d) => {
      tooltip.style("opacity", 0);
    });
}

InitChart();
