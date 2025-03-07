<!-- src/routes/Graficos.svelte -->
<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let currentModule = null;
  let chartData = [];
  let svgElement;

  export let moduleName;

  onMount(() => {
    currentModule = moduleName;
    fetchChartData(moduleName);
  });

  async function fetchChartData(module) {
    // Simulación de datos para la gráfica
    chartData = [
      { mes: 'Enero', valor: Math.floor(Math.random() * 100) },
      { mes: 'Febrero', valor: Math.floor(Math.random() * 100) },
      { mes: 'Marzo', valor: Math.floor(Math.random() * 100) },
      { mes: 'Abril', valor: Math.floor(Math.random() * 100) },
      { mes: 'Mayo', valor: Math.floor(Math.random() * 100) }
    ];
    createChart();
  }

  function createChart() {
    const svg = d3.select(svgElement);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Limpiar SVG existente
    svg.selectAll("*").remove();

    const x = d3.scaleBand()
      .range([margin.left, width - margin.right])
      .domain(chartData.map(d => d.mes))
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, d3.max(chartData, d => d.valor)]);

    svg.selectAll("rect")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.mes))
      .attr("y", d => y(d.valor))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d.valor))
      .attr("fill", "steelblue")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }

  function handleMouseOver(event, d) {
    d3.select(event.target)
      .transition()
      .duration(200)
      .attr("fill", "orange");
  }

  function handleMouseOut(event, d) {
    d3.select(event.target)
      .transition()
      .duration(200)
      .attr("fill", "steelblue");
  }
</script>

<div class="graphics-container">
  <h2>Gráficos de {currentModule}</h2>
  <svg bind:this={svgElement} width="600" height="400"></svg>
</div>

<style>
  .graphics-container {
    padding: 20px;
    text-align: center;
  }

  h2 {
    margin-bottom: 20px;
  }

  svg {
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
</style>
