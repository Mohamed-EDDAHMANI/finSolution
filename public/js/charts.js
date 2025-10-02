function initCharts() {
  const pieData = {
    labels: ['Alimentation', 'Transport', 'Loisirs', 'Autres'],
    datasets: [{
      data: [150, 200, 100, 50],
      backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24'],
    }]
  };
  new Chart(document.getElementById('pieChart'), { type: 'pie', data: pieData });

  const lineData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
    datasets: [
      { label: 'Dépenses', data: [1200, 900, 1400, 1100, 1300, 1000, 900], borderColor: '#f87171', fill: false },
      { label: 'Revenus', data: [3000, 3500, 3200, 4000, 3700, 3800, 3900], borderColor: '#34d399', fill: false }
    ]
  };
  new Chart(document.getElementById('lineChart'), { type: 'line', data: lineData });
}

window.initCharts = initCharts;
