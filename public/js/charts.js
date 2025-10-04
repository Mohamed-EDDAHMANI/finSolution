let pieChartInstance = null;
let lineChartInstance = null;

async function initCharts() {
  try {
    const res = await fetch("/api/charts/data");
    const { categoriesData, monthlyData } = await res.json();

    // --- Pie Chart: Dépenses par catégorie ---
    const pieLabels = categoriesData.map(c => c.Category?.name || "Sans catégorie");
    const pieValues = categoriesData.map(c => parseFloat(c.total));

    if (pieChartInstance) pieChartInstance.destroy();
    pieChartInstance = new Chart(document.getElementById('pieChart'), {
      type: 'pie',
      data: {
        labels: pieLabels,
        datasets: [{
          data: pieValues,
          backgroundColor: [
            '#f87171', '#60a5fa', '#34d399', '#fbbf24',
            '#a78bfa', '#f472b6', '#38bdf8', '#facc15'
          ],
        }]
      }
    });

    // --- Line Chart: Dépenses vs Revenus par mois ---
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const expenses = Array(12).fill(0);
    const revenues = Array(12).fill(0);

    monthlyData.forEach(d => {
      const monthIndex = parseInt(d.month) - 1;
      if (d.type === 'expense') expenses[monthIndex] = parseFloat(d.total);
      else if (d.type === 'income') revenues[monthIndex] = parseFloat(d.total);
    });

    if (lineChartInstance) lineChartInstance.destroy();
    lineChartInstance = new Chart(document.getElementById('lineChart'), {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          { label: 'Dépenses', data: expenses, borderColor: '#f87171', fill: false },
          { label: 'Revenus', data: revenues, borderColor: '#34d399', fill: false }
        ]
      }
    });

  } catch (err) {
    console.error("Erreur initCharts:", err);
  }
}

window.initCharts = initCharts;
