// Initialize chart
document.addEventListener('DOMContentLoaded', async function() {
    const chartData = await getApiData('sessions/weekly-durations');

    const ctx = document.getElementById('meuGrafico').getContext('2d');
    const meuGrafico = new Chart(ctx, {
        type: 'bar', // Tipo do gráfico
        data: {
        labels: chartData.labels, // Eixo X
        datasets: [
            {
                label: 'Semana passada', // Nome do gráfico
                data: chartData.lastWeek.totalDuration, // Eixo Y
                borderColor: '#ff0546',
                backgroundColor: '#ff0546',
                fill: true,
            },
            {
                label: 'Essa semana', // Nome do gráfico
                data: chartData.thisWeek.totalDuration, // Eixo Y
                borderColor: '#0098db',
                backgroundColor: '#0098db',
                fill: true,
            }
        ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#b6afaf',
                        font: {
                            family: 'Montserrat'
                        }
                    },
                    position: 'bottom'
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false,
                        drawTicks: false,
                        color: 'transparent' // tira a grade do eixo X
                    },
                    ticks: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false,
                        drawBorder: false,
                        drawTicks: false,
                        color: 'transparent'
                    },
                    ticks: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });

    const weeklyStatsEl = document.getElementById('weekly-stats');
    weeklyStatsEl.innerHTML = `
        <div class=" text-md font-extrabold text-[#b6afaf]"> Minutos focados
            <br>
            <strong class="text-7xl text-[var(--color-items-primary)]">${chartData.focusStats.totalThisWeek}</strong>
            <br>
            <small>
                ${
                    chartData.focusStats.isIncrease
                    ? `<i class="text-[--color-accent] fa-solid fa-caret-up"></i> ${chartData.focusStats.diffPercent}% a mais que semana passada`
                    : `<i class="text-[--color-items-primary] fa-solid fa-caret-down"></i> ${chartData.focusStats.diffPercent}% a menos que semana passada`
                }
            </small>
        </div>
    `
});