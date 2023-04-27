const data = [
    {
        "Country": "British Terr",
        "Male": "51.69%",
        "Female": "20.62%",
        "Others": "27.69%"
    },
    {
        "Country": "UK",
        "Male": "92.20%",
        "Female": "5.29%",
        "Others": "2.51%"
    },
    {
        "Country": "Afghanistan",
        "Male": "14.03%",
        "Female": "69.03%",
        "Others": "16.94%"
    },
    {
        "Country": "India",
        "Male": "54.48%",
        "Female": "13.62%",
        "Others": "31.90%"
    },
    {
        "Country": "France",
        "Male": "58.70%",
        "Female": "14.75%",
        "Others": "26.55%"
    },
    {
        "Country": "Italy",
        "Male": "95.32%",
        "Female": "2.34%",
        "Others": "2.34%"
    },
    {
        "Country": "US",
        "Male": "62.59%",
        "Female": "22.11%",
        "Others": "15.30%"
    },
    {
        "Country": "Spain",
        "Male": "86.93%",
        "Female": "4.95%",
        "Others": "8.12%"
    },
    {
        "Country": "Russia",
        "Male": "74.82%",
        "Female": "19.60%",
        "Others": "5.67%"
    },
    {
        "Country": "Pakistan",
        "Male": "62.30%",
        "Female": "14.29%",
        "Others": "23.41%"
    }
];

const svg = d3.select("#chart");
const margin = {top: 20, right: 20, bottom: 60, left: 60};
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;
const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
const y = d3.scaleLinear().rangeRound([height, 0]);

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

data.forEach(d => {
    d.Male = parseFloat(d.Male) / 100;
    d.Female = parseFloat(d.Female) / 100;
    d.Others = parseFloat(d.Others) / 100;
});

x.domain(data.map(d => d.Country));
y.domain([0, 1]);

g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")


const categories = ["Male", "Female", "Others"];
const color = d3.scaleOrdinal().domain(categories).range(["steelblue", "tomato", "lightgreen"]);

categories.forEach((category, i) => {
    g.selectAll(`.bar-${category}`)
        .data(data)
        .join("rect")
        .attr("class", `bar bar-${category}`)
        .attr("x", d => x(d.Country))
        .attr("y", d => {
            let sum = 0;
            for (let j = 0; j < i; j++) {
                sum += d[categories[j]];
            }
            return y(sum + d[category]);
        })
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[category]))
        .attr("fill", color(category));
});

const legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(categories.slice())
    .join("g")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

legend.append("rect")
    .attr("x", width - -10)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", color);

legend.append("text")
    .attr("x", width - -5)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(d => d);
