const data = {
    name: "root",
    children: [
        { name: "AMZN", value: 3341.00 },
        { name: "GOOGL", value: 2825.75 },
        { name: "TSLA", value: 685.00 },
        { name: "NVDA", value: 484.00 },
        { name: "NFLX", value: 433.00 },
        { name: "MSFT", value: 296.25 },
        { name: "META", value: 237.00 },
        { name: "BA", value: 212.00 },
        { name: "AAPL", value: 175.35 },
        { name: "DIS", value: 102.00 },
        { name: "IBM", value: 144.00 },
        { name: "CSCO", value: 59.00 },
        { name: "INTC", value: 36.00 },
    ]
};

const colorScale = d3.scaleSequential(d3.interpolateGreens)
    .domain([0, data.children.length - 1]);

const svg = d3.select('#treemap').append('svg');
const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background-color', '#fff')
    .style('border', '1px solid #ddd')
    .style('padding', '5px')
    .style('border-radius', '3px')
    .style('pointer-events', 'none')
    .style('opacity', 0);

const updateTreemap = () => {
    const width = document.getElementById('treemap').offsetWidth;
    const height = document.getElementById('treemap').offsetHeight;

    svg.attr('width', width)
        .attr('height', height);

    const treemap = d3.treemap()
        .size([width, height])
        .padding(1);

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    treemap(root);

    svg.selectAll('*').remove();

    const rects = svg.selectAll('rect')
        .data(root.leaves())
      .enter().append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .style('fill', d => colorScale(data.children.findIndex(child => child.name === d.data.name)))
        .style('stroke', '#fff')
        .style('stroke-width', '1px')
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`<strong>${d.data.name}</strong><br>Value: $${d.data.value.toFixed(2)}`)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mousemove', function(event) {
            tooltip.style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            tooltip.transition().duration(500).style('opacity', 0);
        })
        .on('click', function(event, d) {
            rects.style('stroke', '#fff')
                .style('stroke-width', '1px')
                .style('fill', d => colorScale(data.children.findIndex(child => child.name === d.data.name)));

            d3.select(this)
                .style('stroke', '#000')
                .style('stroke-width', '2px')
                .style('fill', d3.color(colorScale(data.children.findIndex(child => child.name === d.data.name))).darker(1));

            console.log(`Clicado: ${d.data.name} - Value: $${d.data.value.toFixed(2)}`);
        });

    svg.selectAll('text')
        .data(root.leaves())
      .enter().append('text')
        .attr('x', d => d.x0 + 5)
        .attr('y', d => d.y0 + 20)
        .attr('font-size', '12px')
        .attr('fill', '#000')
        .text(d => d.data.name);

    svg.style('border', '1px solid #ccc');
};

updateTreemap();

window.addEventListener('resize', updateTreemap);
