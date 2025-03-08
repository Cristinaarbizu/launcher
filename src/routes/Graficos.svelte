<!-- src/routes/Graficos.svelte -->
<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let currentModule = null;
  let chartData = [];
  let svgElement;
  let categoryData = [];
  let categorySvgElement;

  export let moduleName;

  onMount(async () => {
    currentModule = moduleName;
    await fetchChartData(moduleName);
    await fetchTransactionData();
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

  async function fetchTransactionData() {
    try {
      const response = await fetch('/src/data/transacciones.json');
      const data = await response.json();

      const categoryTotals = {};
      data.transacciones.forEach(t => {
        if (!categoryTotals[t.categoria]) {
          categoryTotals[t.categoria] = { ingreso: 0, gasto: 0 };
        }
        if (t.tipo === 'Ingreso') {
          categoryTotals[t.categoria].ingreso += t.importe;
        } else {
          categoryTotals[t.categoria].gasto += t.importe;
        }
      });

      categoryData = Object.entries(categoryTotals).map(([categoria, valores]) => ({
        categoria,
        ingreso: valores.ingreso,
        gasto: valores.gasto
      }));

      createCategoryChart();
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    }
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

  // Grafica de transacciones por categoria, ventas y gastos
  function createCategoryChart() {
    const svg = d3.select(categorySvgElement);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 70, left: 60 };

    svg.selectAll("*").remove();

    const x = d3.scaleBand()
      .range([margin.left, width - margin.right])
      .domain(categoryData.map(d => d.categoria))
      .padding(0.2);

    const y = d3.scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, d3.max(categoryData, d => Math.max(d.ingreso, d.gasto))]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("text-anchor", "middle") // Asegurar que el texto quede centrado
      .attr("dy", "0.5em") // Mover un poco hacia abajo
      .each(function(d) {
        const text = d3.select(this);
        const words = d.split(" ");
        text.text(null); // Vaciar el texto original
        words.forEach((word, i) => {
          text.append("tspan")
            .attr("x", 0)
            .attr("dy", i ? "1.2em" : "1em")
            .text(word);
        });
      });

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const barWidth = x.bandwidth() / 2;

    svg.selectAll(".bar-ingreso")
      .data(categoryData)
      .enter()
      .append("rect")
      .attr("class", "bar-ingreso")
      .attr("x", d => x(d.categoria))
      .attr("y", d => y(d.ingreso))
      .attr("width", barWidth)
      .attr("height", d => height - margin.bottom - y(d.ingreso))
      .attr("fill", "green");

    svg.selectAll(".bar-gasto")
      .data(categoryData)
      .enter()
      .append("rect")
      .attr("class", "bar-gasto")
      .attr("x", d => x(d.categoria) + barWidth)
      .attr("y", d => y(d.gasto))
      .attr("width", barWidth)
      .attr("height", d => height - margin.bottom - y(d.gasto))
      .attr("fill", "red");
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

<div class="graphics-container">
  <h2>Ingresos y Gastos por Categoría</h2>
  <svg bind:this={categorySvgElement} width="600" height="400"></svg>
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
