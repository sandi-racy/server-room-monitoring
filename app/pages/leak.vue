<template>
    <div>
        <h1 class="text-2xl font-extrabold mb-5 mt-3">Kebocoran Air</h1>
        <div class="card card-side bg-base-100 shadow-xl border border-base-200 max-w-md">
            <div class="card-body">
                <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider">Saat Ini</h3>
                <div class="space-y-1">
                    <p class="text-lg font-medium text-base-content/70">
                        Suhu: <span class="text-base-content font-bold">24°C</span>
                    </p>
                    <p class="text-lg font-medium text-base-content/70">
                        Kelembapan: <span class="text-base-content font-bold">80%</span>
                    </p>
                </div>
            </div>
            <div class="flex items-center pr-8">
                <div class="w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center bg-blue-50/50">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        class="w-8 h-8 text-blue-500" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2.5" 
                        stroke-linecap="round" 
                        stroke-linejoin="round">
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                        <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        <path d="M16 19.5c0 1.93-1.57 3.5-3.5 3.5S9 21.43 9 19.5c0-2.5 3.5-6.5 3.5-6.5s3.5 4 3.5 6.5z" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="card bg-base-100 shadow-xl border border-base-200 max-w-2xl mx-auto mt-3 sm:mb-[100px]">
            <div class="card-body">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="card-title text-xl font-bold">Logs</h2>
                </div>
                <div class="overflow-x-auto rounded-lg border border-base-200">
                    <table class="table table-zebra w-full">
                        <thead class="bg-base-200">
                            <tr>
                                <th>Waktu</th>
                                <th>Mode</th>
                                <th>Suhu</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-sm">10:45</td>
                                <td><div class="badge badge-ghost badge-sm">Cool</div></td>
                                <td class="font-mono">22°C</td>
                            </tr>
                            <tr>
                                <td class="text-sm">09:30</td>
                                <td><div class="badge badge-ghost badge-sm">Dry</div></td>
                                <td class="font-mono">24°C</td>
                            </tr>
                            <tr>
                                <td class="text-sm">08:15</td>
                                <td><div class="badge badge-ghost badge-sm">Fan</div></td>
                                <td class="font-mono">25°C</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { Line } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
    ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
    const chartData = {
        labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
        datasets: [{
            label: 'Suhu (°C)',
            data: [22, 23, 24, 26, 25, 24],
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f6',
            yAxisID: 'ySuhu',
            tension: 0.4,
            pointRadius: 4
        }, {
            label: 'Kelembapan (%)',
            data: [75, 78, 80, 82, 80, 79],
            borderColor: '#93c5fd',
            backgroundColor: '#93c5fd',
            yAxisID: 'yKelembapan',
            tension: 0.4,
            pointRadius: 4
        }]
    }
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            ySuhu: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Suhu (°C)' },
                suggestedMin: 20,
                suggestedMax: 30
            },
            yKelembapan: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Kelembapan (%)' },
                suggestedMin: 60,
                suggestedMax: 100
            }
        }
    }
</script>