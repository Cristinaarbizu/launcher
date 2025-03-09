<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import productosData from "../data/productos.json";
  import ventasData from "../data/ventas.json";
  import facturas from "../data/facturas.json";

  let currentModule = null;
  let chartData = [];
  let svgElement;
  let categoryData = [];
  let categorySvgElement;
  let svgBillingElement;
  let pieSvgElement;
  let pieChartData = [];

  function processProductData() {
    const categoryCount = {};
    productosData.productos.forEach((p) => {
      categoryCount[p.categoria] =
        (categoryCount[p.categoria] || 0) + p.cantidad;
    });

    pieChartData = Object.entries(categoryCount).map(
      ([categoria, cantidad]) => ({
        categoria,
        cantidad,
      }),
    );
  }

  export let moduleName;

  onMount(async () => {
    currentModule = moduleName;
    await fetchChartData();
    await fetchTransactionData();
    processProductData();
    createPieChart();
    createBillingChart();
  });

  async function fetchChartData() {
    const salesByMonth = {
      Enero: 0,
      Febrero: 0,
      Marzo: 0,
      Abril: 0,
      Mayo: 0,
      Junio: 0,
    };

    const monthMap = {
      "01": "Enero",
      "02": "Febrero",
      "03": "Marzo",
      "04": "Abril",
      "05": "Mayo",
      "06": "Junio",
    };

    ventasData.ventas.forEach((venta) => {
      const [year, month, day] = venta.fecha.split("-");
      const monthName = monthMap[month] || "Desconocido";

      if (salesByMonth[monthName] !== undefined) {
        salesByMonth[monthName] += venta.ingresos;
      }
    });

    chartData = Object.entries(salesByMonth).map(([mes, valor]) => ({
      mes,
      valor,
    }));
    createChart();
  }

  async function fetchTransactionData() {
    try {
      const response = await fetch("/src/data/transacciones.json");
      const data = await response.json();

      const categoryTotals = {};
      data.transacciones.forEach((t) => {
        if (!categoryTotals[t.categoria]) {
          categoryTotals[t.categoria] = { ingreso: 0, gasto: 0 };
        }
        if (t.tipo === "Ingreso") {
          categoryTotals[t.categoria].ingreso += t.importe;
        } else {
          categoryTotals[t.categoria].gasto += t.importe;
        }
      });

      categoryData = Object.entries(categoryTotals).map(
        ([categoria, valores]) => ({
          categoria,
          ingreso: valores.ingreso,
          gasto: valores.gasto,
        }),
      );

      createCategoryChart();
    } catch (error) {
      console.error("Error al cargar transacciones:", error);
    }
  }

  function createChart() {
    const svg = d3.select(svgElement);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    svg.selectAll("*").remove();

    const orderedMonths = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
    ];
    chartData.sort(
      (a, b) => orderedMonths.indexOf(a.mes) - orderedMonths.indexOf(b.mes),
    );

    const x = d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .domain(orderedMonths)
      .padding(0.1);

    const maxY = d3.max(chartData, (d) => d.valor) || 1;
    const y = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, maxY * 1.13]);

    const tooltip = d3
      .select(".graphics-container")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "5px")
      .style("border", "1px solid black")
      .style("border-radius", "5px")
      .style("visibility", "hidden");

    svg
      .selectAll("rect")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.mes))
      .attr("y", (d) => y(d.valor))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - margin.bottom - y(d.valor))
      .attr("fill", "steelblue")
      .attr("data-original-color", "steelblue") // Guardar color original
      .on("mouseover", (event, d) => {
        d3.select(event.target).attr("fill", "orange"); // Cambiar color al pasar el mouse
        tooltip.style("visibility", "visible").text(`Valor: ${d.valor}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", (event) => {
        d3.select(event.target).attr(
          "fill",
          d3.select(event.target).attr("data-original-color"),
        ); // Restaurar color original
        tooltip.style("visibility", "hidden");
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }

  function createCategoryChart() {
    const svg = d3.select(categorySvgElement);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 70, left: 60 };

    svg.selectAll("*").remove();

    const x = d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .domain(categoryData.map((d) => d.categoria))
      .padding(0.2);

    const maxYCategory =
      d3.max(categoryData, (d) => Math.max(d.ingreso, d.gasto)) || 1;
    const y = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, maxYCategory * 1.1]); // Aumenta el máximo un 10% para evitar cortes

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.5em")
      .each(function (d) {
        const text = d3.select(this);
        const words = d.split(" ");
        text.text(null);
        words.forEach((word, i) => {
          text
            .append("tspan")
            .attr("x", 0)
            .attr("dy", i ? "1.2em" : "1em")
            .text(word);
        });
      });

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const barWidth = x.bandwidth() / 2;

    const categoryTooltip = d3
      .select(".graphics-container")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "5px")
      .style("border", "1px solid black")
      .style("border-radius", "5px")
      .style("visibility", "hidden");

    svg
      .selectAll(".bar-ingreso")
      .data(categoryData)
      .enter()
      .append("rect")
      .attr("class", "bar-ingreso")
      .attr("x", (d) => x(d.categoria))
      .attr("y", (d) => y(d.ingreso))
      .attr("width", barWidth)
      .attr("height", (d) => height - margin.bottom - y(d.ingreso))
      .attr("fill", "green")
      .attr("data-original-color", "green")
      .on("mouseover", (event, d) => {
        d3.select(event.target).attr("fill", "limegreen"); // Cambio de color al pasar el mouse
        categoryTooltip
          .style("visibility", "visible")
          .text(`Ingreso: ${d.ingreso}€`);
      })
      .on("mousemove", (event) => {
        categoryTooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", (event) => {
        d3.select(event.target).attr(
          "fill",
          d3.select(event.target).attr("data-original-color"),
        ); // Restaurar color
        categoryTooltip.style("visibility", "hidden");
      });

    svg
      .selectAll(".bar-gasto")
      .data(categoryData)
      .enter()
      .append("rect")
      .attr("class", "bar-gasto")
      .attr("x", (d) => x(d.categoria) + barWidth)
      .attr("y", (d) => y(d.gasto))
      .attr("width", barWidth)
      .attr("height", (d) => height - margin.bottom - y(d.gasto))
      .attr("fill", "red")
      .attr("data-original-color", "red")
      .on("mouseover", (event, d) => {
        d3.select(event.target).attr("fill", "darkred"); // Cambio de color al pasar el mouse
        categoryTooltip
          .style("visibility", "visible")
          .text(`Gasto: ${d.gasto}€`);
      })
      .on("mousemove", (event) => {
        categoryTooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", (event) => {
        d3.select(event.target).attr(
          "fill",
          d3.select(event.target).attr("data-original-color"),
        ); // Restaurar color
        categoryTooltip.style("visibility", "hidden");
      });
  }

  function createPieChart() {
    const svg = d3.select(pieSvgElement);
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    svg.selectAll("*").remove();

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value((d) => d.cantidad);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arcs = g
      .selectAll(".arc")
      .data(pie(pieChartData))
      .enter()
      .append("g")
      .attr("class", "arc");

    const pieTooltip = d3
      .select(".graphics-container")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "5px")
      .style("border", "1px solid black")
      .style("border-radius", "5px")
      .style("visibility", "hidden");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.categoria))
      .on("mouseover", (event, d) => {
        pieTooltip
          .style("visibility", "visible")
          .text(`${d.data.categoria}: ${d.data.cantidad} productos`);
      })
      .on("mousemove", (event) => {
        pieTooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => {
        pieTooltip.style("visibility", "hidden");
      });

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .text((d) => d.data.categoria);
  }

  function aggregateBillingData() {
    const aggregatedData = {};
    facturas.facturas.forEach((factura) => {
      const month = new Date(factura.fecha).toLocaleString("default", {
        month: "long",
      });
      if (!aggregatedData[month]) {
        aggregatedData[month] = { Pagada: 0, Pendiente: 0, Vencida: 0 };
      }
      aggregatedData[month][factura.estado] += factura.ingresos;
    });
    return aggregatedData;
  }

  function createBillingChart() {
    const svgBilling = d3.select(svgBillingElement);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    svgBilling.selectAll("*").remove();

    const aggregatedData = aggregateBillingData();
    const chartData = [];
    for (const month in aggregatedData) {
      for (const estado in aggregatedData[month]) {
        chartData.push({
          mes: month,
          estado: estado,
          valor: aggregatedData[month][estado],
        });
      }
    }
    const billingTooltip = d3
      .select(".graphics-container")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "5px")
      .style("border", "1px solid black")
      .style("border-radius", "5px")
      .style("visibility", "hidden");

    const x0 = d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .domain([...new Set(chartData.map((d) => d.mes))])
      .padding(0.1);

    const x1 = d3
      .scaleBand()
      .domain(["Pagada", "Pendiente", "Vencida"])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const maxYBilling = d3.max(chartData, (d) => d.valor) || 1;
    const y = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, maxYBilling * 1.1]);

    const color = d3
      .scaleOrdinal()
      .domain(["Pagada", "Pendiente", "Vencida"])
      .range(["#1f77b4", "#6baed6", "#9ecae1"]);

    const nestedData = d3.groups(chartData, (d) => d.mes);

    const groups = svgBilling
      .selectAll("g")
      .data(nestedData)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${x0(d[0])},0)`);


    groups
      .selectAll("rect")
      .data((d) => d[1])
      .enter()
      .append("rect")
      .attr("x", (d) => x1(d.estado))
      .attr("y", (d) => y(d.valor))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => height - margin.bottom - y(d.valor))
      .attr("fill", (d) => color(d.estado))
      .attr("data-original-color", (d) => color(d.estado)) // Guardar color original
      .on("mouseover", (event, d) => {
        d3.select(event.target).attr("fill", "orange"); // Cambio de color al pasar el mouse
        billingTooltip
          .style("visibility", "visible")
          .text(`${d.estado}: ${d.valor}€`);
      })
      .on("mousemove", (event) => {
        billingTooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", (event) => {
        d3.select(event.target).attr(
          "fill",
          d3.select(event.target).attr("data-original-color"),
        ); // Restaurar color
        billingTooltip.style("visibility", "hidden");
      });

    svgBilling
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0));

    svgBilling
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }
</script>

<div class="graphics-container">
  <h2>Gráficos de {currentModule} semestrales</h2>
  <svg bind:this={svgElement} width="600" height="400"></svg>
</div>
<div class="graphics-container">
  <h2>Ingresos y Gastos por Categoría</h2>
  <svg bind:this={categorySvgElement} width="600" height="400"></svg>
</div>
<div class="graphics-container">
  <h2>Distribución de Productos por Categoría</h2>
  <svg bind:this={pieSvgElement} width="400" height="400"></svg>
</div>
<div class="graphics-container">
  <h2>Facturación</h2>
  <svg bind:this={svgBillingElement} width="600" height="400"></svg>
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
