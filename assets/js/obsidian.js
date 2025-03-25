document.addEventListener('DOMContentLoaded', function() {
  // Theme Toggle
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '🌙';
  document.body.appendChild(themeToggle);

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Internal Links
  document.querySelectorAll('a[data-href]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });
  });

  // Callouts
  document.querySelectorAll('.callout').forEach(callout => {
    const type = callout.getAttribute('data-callout');
    if (type) {
      callout.classList.add(type);
    }
  });

  // Task Lists
  document.querySelectorAll('.task-list-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const state = this.checked ? 'x' : ' ';
      const line = this.closest('.task-list-item').querySelector('.task-list-item-checkbox');
      if (line) {
        line.textContent = `[${state}]`;
      }
    });
  });

  // Math Blocks
  document.querySelectorAll('.math-block').forEach(math => {
    // MathJax or KaTeX rendering logic here
    if (window.MathJax) {
      MathJax.typeset([math]);
    }
  });

  // Tags
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function() {
      const tagName = this.textContent.trim();
      // Implement tag filtering logic here
      console.log(`Filtering by tag: ${tagName}`);
    });
  });

  // Graph View
  if (document.querySelector('.graph-view')) {
    initGraphView();
  }
});

// Graph View Implementation
function initGraphView() {
  const graphContainer = document.querySelector('.graph-view');
  const width = graphContainer.clientWidth;
  const height = graphContainer.clientHeight;

  // Create SVG container
  const svg = d3.select('.graph-view')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Fetch graph data
  fetch('/notes_graph.json')
    .then(response => response.json())
    .then(data => {
      // Create force simulation
      const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2));

      // Create links
      const link = svg.append('g')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('class', 'link');

      // Create nodes
      const node = svg.append('g')
        .selectAll('g')
        .data(data.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      // Add circles to nodes
      node.append('circle')
        .attr('r', 5)
        .style('fill', '#448aff');

      // Add labels to nodes
      node.append('text')
        .attr('class', 'node-label')
        .attr('dx', 12)
        .attr('dy', '.35em')
        .text(d => d.title);

      // Update positions on each tick
      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('transform', d => `translate(${d.x},${d.y})`);
      });

      // Drag functions
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
    })
    .catch(error => console.error('Error loading graph data:', error));
} 