<template>
    <div>
        <h1 class="text-2xl font-extrabold mb-5">Konsumsi Daya</h1>
        <div class="card card-side bg-base-100 shadow-xl border border-base-200 max-w-md">
            <div class="card-body">
                <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider">Saat Ini</h3>
                <div class="space-y-1">
                    <p class="text-lg font-medium text-base-content/70">
                        Power: <span class="text-base-content font-bold">24 Watt</span>
                    </p>
                    <p class="text-lg font-medium text-base-content/70">
                        Beban: <span class="text-base-content font-bold">80 Volt</span>
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
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="card card-side bg-base-100 shadow-xl border border-base-200 max-w-md mt-3">
            <div class="card-body">
                <Line :data="chartData" :options="chartOptions" />
            </div>
        </div>
        <div class="card bg-base-100 shadow-xl border border-base-200 max-w-md mt-3 mb-[100px]">
            <div class="card-body">
                <h2 class="card-title text-xl font-bold mb-2">Perkiraan Kebutuhan Daya</h2>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-base-content/60 text-sm">Estimasi 1 jam lagi</span>
                        <span class="font-mono font-bold text-primary">3.5 KW</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-base-content/60 text-sm">Estimasi 24 jam lagi</span>
                        <span class="font-mono font-bold text-primary">3.8 KW</span>
                    </div>
                    <div class="divider my-1"></div>
                    <div class="flex justify-between items-center bg-base-200 p-3 rounded-lg">
                        <span class="font-semibold text-sm">Estimasi biaya</span>
                        <span class="font-bold text-lg text-success">Rp 1.000.000</span>
                    </div>
                </div>
                <div class="card-actions justify-end mt-2">
                    <p class="text-[10px] text-base-content/40 italic">
                        *Berdasarkan tarif listrik rata-rata saat ini
                    </p>
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
                title: { display: true, text: 'Daya' },
                suggestedMin: 20,
                suggestedMax: 30
            },
            yKelembapan: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Beban' },
                suggestedMin: 60,
                suggestedMax: 100
            }
        }
    }
</script>