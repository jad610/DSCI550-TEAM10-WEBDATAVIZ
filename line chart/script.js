const data = [
    {
        "Country/Territory": "British Terr",
        "en": "90.17%",
        "bn": "6.14%",
        "it": "0.42%",
        "fr": "0.03%",
        "other": "3.24%"
    },
    {
        "Country/Territory": "UK",
        "en": "90.25%",
        "bn": "0%",
        "it": "9.65%",
        "fr": "0%",
        "other": "0.10%"
    },
    {
        "Country/Territory": "India",
        "en": "89.06%",
        "bn": "5.29%",
        "it": "0%",
        "fr": "0%",
        "other": "5.65%"
    },
    {
        "Country/Territory": "Afghanistan",
        "en": "97.89%",
        "bn": "0%",
        "it": "1.51%",
        "fr": "0.15%",
        "other": "0.45%"
    },
    {
        "Country/Territory": "US",
        "en": "89.83%",
        "bn": "1.34%",
        "it": "7.87%",
        "fr": "0%",
        "other": "0.96%"
    },
    {
        "Country/Territory": "France",
        "en": "74.53%",
        "bn": "0%",
        "it": "23.59%",
        "fr": "1.88%",
        "other": "0%"
    },
    {
        "Country/Territory": "Italy",
        "en": "19.24%",
        "bn": "0%",
        "it": "80.76%",
        "fr": "0%",
        "other": "0%"
    },
    {
        "Country/Territory": "Australia",
        "en": "94.32%",
        "bn": "0.66%",
        "it": "4.80%",
        "fr": "0.22%",
        "other": "0%"
    },
    {
        "Country/Territory": "Russia",
        "en": "84.68%",
        "bn": "2.25%",
        "it": "12.61%",
        "fr": "0.46%",
        "other": "0%"
    },
    {
        "Country/Territory": "Spain",
        "en": "79.22%",
        "bn": "0.00%",
        "it": "20.05%",
        "fr": "0.00%",
        "other": "1%"
    }
];


const margin = { top: 20, right: 20, bottom: 60, left: 50 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const x = d3.scalePoint()
    .domain(data.map(d => d["Country/Territory"]))
    .range([0, width])
    .padding(0.5);

const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

const line = d3.line()
    .x(d => x(d["Country/Territory"]))
    .y(d => y(parseFloat(d.value.replace("%", ""))));

const svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const xAxis = d3.axisBottom(x)
    .tickSizeOuter(0);

const yAxis = d3.axisLeft(y).tickFormat(d => d + "%");

svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

svg.append("g")
    .call(yAxis);

const languages = ["en", "bn", "it", "fr", "other"];

languages.forEach(language => {
    const languageData = data.map(d => ({ "Country/Territory": d["Country/Territory"], value: d[language] }));
    svg.append("path")
        .datum(languageData)
        .attr("fill", "none")
        .attr("stroke", d3.schemeCategory10[languages.indexOf(language)])
        .attr("stroke-width", 1.5)
        .attr("d", line);

    const circles = svg.selectAll(`.dot-${language}`)
        .data(languageData)
        .enter()
        .append("g");

    circles.append("circle")
        .attr("class", `dot dot-${language}`)
        .attr("cx", d => x(d["Country/Territory"]))
        .attr("cy", d => y(parseFloat(d.value.replace("%", ""))))
        .attr("r", 3)
        .style("fill", d3.schemeCategory10[languages.indexOf(language)]);

    if (language === "en" || language === "it") {
        circles.append("text")
            .attr("x", d => x(d["Country/Territory"]) + 3)
            .attr("y", d => y(parseFloat(d.value.replace("%", ""))) - 5)
            .text(d => d.value)
            .style("font-size", "10px");
    }
});

const legend = svg.selectAll(".legend")
    .data(languages)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

legend.append("rect")
    .attr("x", width - -13)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d, i) => d3.schemeCategory10[i]);

legend.append("text")
    .attr("x", width - -10)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(d => d);
