const createTreemap = (data) => {
    const width = document.getElementById('treemap').offsetWidth;
    const height = document.getElementById('treemap').offsetHeight;

    d3.select('#treemap').select('svg').remove();

    const svg = d3.select('#treemap').append('svg')
        .attr('width', width)
        .attr('height', height);

    const colorScale = d3.scaleSequential(d3.interpolateGreens)
        .domain([0, data.children.length - 1]);

    const treemap = d3.treemap()
        .size([width, height])
        .padding(1);

    const root = d3.hierarchy(data)
        .sum(d => d.value || 0) 
        .sort((a, b) => b.value - a.value);

    treemap(root);

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')  // Garantir que a posição seja absoluta
        .style('pointer-events', 'none'); // Evitar que a tooltip afete o mouse

    svg.selectAll('rect')
        .data(root.leaves())
        .enter().append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .style('fill', d => colorScale(root.children.indexOf(root.children.find(child => child.data.name === d.data.name))))
        .style('stroke', '#fff')
        .style('stroke-width', '1px')
        .on('mouseover', (event, d) => {
            const value = parseFloat(d.data.value) || 0;  
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`<strong>${d.data.name}</strong><br>Value: $${value.toFixed(2)}`);

            // Calcular a posição do tooltip
            let tooltipWidth = tooltip.node().offsetWidth;
            let tooltipHeight = tooltip.node().offsetHeight;
            let x = event.pageX + 5;
            let y = event.pageY - 28;

            // Ajustar a posição para não sair da tela
            if (x + tooltipWidth > window.innerWidth) {
                x = window.innerWidth - tooltipWidth - 10;
            }
            if (y < 0) {
                y = 10;
            }
            if (y + tooltipHeight > window.innerHeight) {
                y = window.innerHeight - tooltipHeight - 10;
            }

            tooltip.style('left', x + 'px')
                   .style('top', y + 'px');
        })
        .on('mousemove', (event) => {
            let tooltipWidth = tooltip.node().offsetWidth;
            let tooltipHeight = tooltip.node().offsetHeight;
            let x = event.pageX + 5;
            let y = event.pageY - 28;

            // Ajustar a posição para não sair da tela
            if (x + tooltipWidth > window.innerWidth) {
                x = window.innerWidth - tooltipWidth - 10;
            }
            if (y < 0) {
                y = 10;
            }
            if (y + tooltipHeight > window.innerHeight) {
                y = window.innerHeight - tooltipHeight - 10;
            }

            tooltip.style('left', x + 'px')
                   .style('top', y + 'px');
        })
        .on('mouseout', () => {
            tooltip.transition().duration(500).style('opacity', 0);
        });

    svg.selectAll('text')
        .data(root.leaves())
        .enter().append('text')
        .attr('x', d => d.x0 + 5)
        .attr('y', d => d.y0 + 20)
        .attr('font-size', '12px')
        .attr('fill', '#000')
        .text(d => d.data.name);

    svg.style('border', '1px solid #ddd');
};

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('add-company-form');
    const itemsList = document.getElementById('items-list');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const formData = new FormData(form);

        fetch('add_company.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); 
            form.reset();
            loadItems(); 
        })
        .catch(error => console.error('Erro:', error));
    });

    function loadItems() {
        fetch('get_items.php')
            .then(response => response.json())
            .then(data => {
                itemsList.innerHTML = ''; 
                data.children.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${item.name} - ${item.value}`;
                    
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Excluir';
                    deleteButton.onclick = function() {
                        deleteItem(item.name); 
                    };
                    
                    listItem.appendChild(deleteButton);
                    itemsList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Erro:', error));
    }

    function deleteItem(name) {
        if (confirm(`Tem certeza que deseja excluir ${name}?`)) {
            fetch('delete_item.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ name: name })
            })
            .then(response => response.text())
            .then(data => {
                console.log(data); 
                loadItems(); 
            })
            .catch(error => console.error('Erro:', error));
        }
    }

    loadItems();
});

fetch('data.php?order=desc') 
    .then(response => response.json())
    .then(data => {
        createTreemap(data);
    })
    .catch(error => console.error('Error:', error));
