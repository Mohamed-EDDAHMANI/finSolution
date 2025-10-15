let pieChartInstance = null;
let lineChartInstance = null;

async function initCharts() {
  try {
    const res = await fetch("/api/charts/data");
    
    if (!res.ok) {
      throw new Error('Failed to fetch chart data');
    }
    
    const { categoriesData, monthlyData } = await res.json();

    // --- Pie Chart: Dépenses par catégorie ---
    const pieCanvas = document.getElementById('pieChart');
    const pieEmpty = document.getElementById('pieChartEmpty');
    
    if (categoriesData && categoriesData.length > 0) {
      const pieLabels = categoriesData.map(c => c.Category?.name || "Sans catégorie");
      const pieValues = categoriesData.map(c => parseFloat(c.total));

      if (pieChartInstance) pieChartInstance.destroy();
      
      pieCanvas.style.display = 'block';
      if (pieEmpty) pieEmpty.classList.add('hidden');
      
      pieChartInstance = new Chart(pieCanvas, {
        type: 'doughnut',
        data: {
          labels: pieLabels,
          datasets: [{
            data: pieValues,
            backgroundColor: [
              '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
              '#3b82f6', '#ef4444', '#06b6d4', '#f97316'
            ],
            borderWidth: 0,
            hoverOffset: 15
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                font: { size: 12, family: 'Inter, sans-serif' },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              cornerRadius: 8,
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 13 },
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value.toFixed(2)} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    } else {
      pieCanvas.style.display = 'none';
      if (pieEmpty) pieEmpty.classList.remove('hidden');
    }

    // --- Line Chart: Dépenses vs Revenus par mois ---
    const lineCanvas = document.getElementById('lineChart');
    const lineEmpty = document.getElementById('lineChartEmpty');
    
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const expenses = Array(12).fill(0);
    const revenues = Array(12).fill(0);

    if (monthlyData && monthlyData.length > 0) {
      monthlyData.forEach(d => {
        const monthIndex = parseInt(d.month) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          if (d.type === 'expense') expenses[monthIndex] = Math.abs(parseFloat(d.total));
          else if (d.type === 'income') revenues[monthIndex] = parseFloat(d.total);
        }
      });

      if (lineChartInstance) lineChartInstance.destroy();
      
      lineCanvas.style.display = 'block';
      if (lineEmpty) lineEmpty.classList.add('hidden');
      
      lineChartInstance = new Chart(lineCanvas, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Revenus',
              data: revenues,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: '#10b981',
              pointBorderColor: '#fff',
              pointBorderWidth: 2
            },
            {
              label: 'Dépenses',
              data: expenses,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: '#ef4444',
              pointBorderColor: '#fff',
              pointBorderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                font: { size: 12, family: 'Inter, sans-serif' },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              cornerRadius: 8,
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 13 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              },
              ticks: {
                font: { size: 11 },
                callback: function(value) {
                  return value.toFixed(0);
                }
              }
            },
            x: {
              grid: {
                display: false,
                drawBorder: false
              },
              ticks: {
                font: { size: 11 }
              }
            }
          }
        }
      });
    } else {
      lineCanvas.style.display = 'none';
      if (lineEmpty) lineEmpty.classList.remove('hidden');
    }

  } catch (err) {
    console.error("Erreur initCharts:", err);
    
    // Hide canvases and show error messages
    const pieCanvas = document.getElementById('pieChart');
    const lineCanvas = document.getElementById('lineChart');
    const pieEmpty = document.getElementById('pieChartEmpty');
    const lineEmpty = document.getElementById('lineChartEmpty');
    
    if (pieCanvas) pieCanvas.style.display = 'none';
    if (lineCanvas) lineCanvas.style.display = 'none';
    if (pieEmpty) pieEmpty.classList.remove('hidden');
    if (lineEmpty) lineEmpty.classList.remove('hidden');
  }
}

window.initCharts = initCharts;
